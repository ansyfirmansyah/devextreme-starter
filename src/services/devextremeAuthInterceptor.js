import { getCookie, eraseCookie, setCookieAccessToken, setCookieRefreshToken } from "./cookieService";
import { refreshToken as refreshAuthToken } from "./authService";
import { API_ENDPOINTS } from "../config/apiConfig";

let isRefreshing = false;
let failedRequests = [];

const processFailedRequests = (error, token = null) => {
  failedRequests.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });
  failedRequests = [];
};

// Setup global XMLHttpRequest interceptor untuk DevExtreme
export const setupDevExtremeAuthInterceptor = () => {
  // Backup original XMLHttpRequest methods
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  // Override XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function(method, url, async = true, user, password) {
    // Store request info untuk retry nanti
    this._requestMethod = method;
    this._requestUrl = url;
    this._requestAsync = async;
    this._requestUser = user;
    this._requestPassword = password;
    this._requestHeaders = {};
    
    return originalXHROpen.call(this, method, url, async, user, password);
  };

  // Override XMLHttpRequest.prototype.setRequestHeader
  XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    // Store headers untuk retry
    this._requestHeaders = this._requestHeaders || {};
    this._requestHeaders[header] = value;
    
    return originalXHRSetRequestHeader.call(this, header, value);
  };

  // Override XMLHttpRequest.prototype.send
  XMLHttpRequest.prototype.send = function(data) {
    const xhr = this;
    const token = getCookie("accessToken");
    
    // Store request data untuk retry
    this._requestData = data;

    // Add Authorization header jika ada token dan belum di-set
    if (token && !this._requestHeaders?.Authorization) {
      this.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    // Backup original event handlers
    const originalOnReadyStateChange = this.onreadystatechange;
    const originalOnLoad = this.onload;
    const originalOnError = this.onerror;

    // Flag untuk menahan response sampai retry selesai
    this._isRetrying = false;
    this._shouldBlockResponse = false;

    // Custom ready state change handler
    this.onreadystatechange = function() {
      if (this.readyState === 4) {
        // Jika ini 401 dan bukan refresh endpoint, block response dulu
        if (this.status === 401 && !this._requestUrl.includes(API_ENDPOINTS.auth.refresh)) {
          this._shouldBlockResponse = true;
          handleResponse.call(this);
          return; // Jangan panggil original handler dulu
        }
        
        // Jika tidak perlu di-block atau bukan 401, lanjut normal
        if (!this._shouldBlockResponse) {
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.call(this);
          }
        }
      } else {
        // Untuk readyState selain 4, panggil normal
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.call(this);
        }
      }
    };

    // Handle response untuk 401 unauthorized
    const handleResponse = async function() {
      if (this.status === 401 && !this._requestUrl.includes(API_ENDPOINTS.auth.refresh)) {
        this._isRetrying = true;
        
        // Jika sedang refresh, queue request ini
        if (isRefreshing) {
          try {
            const newToken = await new Promise((resolve, reject) => {
              failedRequests.push({ resolve, reject });
            });
            
            // Retry request dengan token baru
            await retryRequest(newToken);
          } catch (error) {
            console.error('Token refresh failed:', error);
            // Unblock response untuk show error
            this._shouldBlockResponse = false;
            handleLogout();
            // Trigger original handler untuk show error
            if (originalOnReadyStateChange) {
              originalOnReadyStateChange.call(this);
            }
          }
          return;
        }

        // Mulai proses refresh token
        const refreshTokenValue = getCookie("refreshToken");
        const expiredAccessToken = getCookie("accessToken");

        if (refreshTokenValue && expiredAccessToken) {
          isRefreshing = true;
          
          try {
            const res = await refreshAuthToken(expiredAccessToken, refreshTokenValue);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res;
            
            // Update tokens
            setCookieAccessToken(newAccessToken);
            setCookieRefreshToken(newRefreshToken);
            
            // Process queued requests
            processFailedRequests(null, newAccessToken);
            
            // Retry current request
            await retryRequest(newAccessToken);
            
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            processFailedRequests(refreshError, null);
            // Unblock response untuk show error
            this._shouldBlockResponse = false;
            handleLogout();
            // Trigger original handler untuk show error
            if (originalOnReadyStateChange) {
              originalOnReadyStateChange.call(this);
            }
          } finally {
            isRefreshing = false;
          }
        } else {
          console.warn('No valid refresh token found');
          // Unblock response untuk show error
          this._shouldBlockResponse = false;
          handleLogout();
          // Trigger original handler untuk show error
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.call(this);
          }
        }
      }
    };

    // Function untuk retry request dengan token baru
    const retryRequest = (newToken) => {
      return new Promise((resolve, reject) => {
        const newXHR = new XMLHttpRequest();
        
        // Setup new request dengan parameter yang sama
        newXHR.open(
          xhr._requestMethod,
          xhr._requestUrl,
          xhr._requestAsync,
          xhr._requestUser,
          xhr._requestPassword
        );

        // Set all original headers
        Object.keys(xhr._requestHeaders || {}).forEach(headerName => {
          if (headerName !== 'Authorization') {
            newXHR.setRequestHeader(headerName, xhr._requestHeaders[headerName]);
          }
        });

        // Set new Authorization header
        newXHR.setRequestHeader("Authorization", `Bearer ${newToken}`);

        // Setup event handlers untuk new request
        newXHR.onreadystatechange = function() {
          if (this.readyState === 4) {
            // Copy response properties ke original xhr
            try {
              Object.defineProperty(xhr, 'status', { 
                value: this.status, 
                configurable: true,
                writable: false 
              });
              Object.defineProperty(xhr, 'statusText', { 
                value: this.statusText, 
                configurable: true,
                writable: false 
              });
              Object.defineProperty(xhr, 'responseText', { 
                value: this.responseText, 
                configurable: true,
                writable: false 
              });
              Object.defineProperty(xhr, 'response', { 
                value: this.response, 
                configurable: true,
                writable: false 
              });
              Object.defineProperty(xhr, 'responseXML', { 
                value: this.responseXML, 
                configurable: true,
                writable: false 
              });
              Object.defineProperty(xhr, 'readyState', { 
                value: this.readyState, 
                configurable: true,
                writable: false 
              });

              // Copy response headers
              xhr.getAllResponseHeaders = () => this.getAllResponseHeaders();
              xhr.getResponseHeader = (header) => this.getResponseHeader(header);

              // Mark retry sebagai selesai dan unblock response
              xhr._isRetrying = false;
              xhr._shouldBlockResponse = false;

              // Sekarang trigger original handler dengan data yang sudah di-update
              if (originalOnReadyStateChange) {
                originalOnReadyStateChange.call(xhr);
              }

              resolve();
            } catch (error) {
              console.error('Error copying response properties:', error);
              xhr._shouldBlockResponse = false;
              reject(error);
            }
          }
        };

        newXHR.onerror = function(error) {
          console.error('Retry request failed:', error);
          xhr._shouldBlockResponse = false;
          reject(error);
        };

        newXHR.ontimeout = function() {
          console.error('Retry request timeout');
          xhr._shouldBlockResponse = false;
          reject(new Error('Request timeout'));
        };

        // Send retry request
        newXHR.send(xhr._requestData);
      });
    };

    const handleLogout = () => {
      eraseCookie("accessToken");
      eraseCookie("refreshToken");
      localStorage.removeItem("userData");
      
      // Redirect ke login page
      if (window.location.pathname !== '/login') {
        window.location.href = "/login";
      }
    };

    // Call original send method
    console.log("cek send", this._requestUrl, this._requestMethod, this._requestHeaders);
    return originalXHRSend.call(this, data);
  };

  console.info('DevExtreme Auth Interceptor initialized');
};
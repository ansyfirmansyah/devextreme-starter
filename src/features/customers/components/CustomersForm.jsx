import React, { useRef, useState, useCallback, useEffect } from "react";
import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
  EmailRule,
  PatternRule,
} from "devextreme-react/form";
import "devextreme-react/text-area";
import "devextreme-react/select-box";
import "devextreme-react/date-box";

import { provinces, cities } from "../../../data/mockData";
import FormActions from "../../../components/ui/FormActions";

const phonePattern = /^[0-9\s\-\+\(\)]+$/;
const websitePattern =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const CustomerForm = ({
  initialData,
  onSave,
  onCancel,
  readOnly = false,
  onBack,
}) => {
  const formRef = useRef(null);
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (initialData?.province?.id) {
      const filteredCities = cities.filter(
        (city) => city.provinceId === initialData.province.id
      );
      setAvailableCities(filteredCities);
    } else {
      setAvailableCities([]);
    }
  }, [initialData]);

  const handleProvinceChange = useCallback((e) => {
    const selectedProvince = e.value;
    const formInstance = formRef.current.instance();

    if (selectedProvince) {
      const filteredCities = cities.filter(
        (city) => city.provinceId === selectedProvince.id
      );
      setAvailableCities(filteredCities);
      formInstance.getEditor("city").option("value", null);
    } else {
      setAvailableCities([]);
      formInstance.getEditor("city").option("value", null);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return;
    const formInstance = formRef.current.instance();
    const validationResult = formInstance.validate();
    if (validationResult.isValid) {
      const finalFormData = formInstance.option("formData");
      onSave(finalFormData);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <Form
          ref={formRef}
          formData={initialData}
          colCount={2}
          labelLocation="top"
          showColonAfterLabel={true}
          readOnly={readOnly}
        >
          <GroupItem caption="Customer Details">
            <SimpleItem dataField="companyName" caption="Company Name">
              <RequiredRule />
            </SimpleItem>
            <SimpleItem dataField="phone" helpText="e.g., +62 21 1234567">
              <RequiredRule />
              <PatternRule pattern={phonePattern} />
            </SimpleItem>
            <SimpleItem
              dataField="province"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: provinces,
                valueExpr: "this",
                displayExpr: "name", // INI KUNCINYA!
                placeholder: "Pilih provinsi",
                onValueChanged: handleProvinceChange,
                searchEnabled: true,
              }}
            >
              <RequiredRule />
            </SimpleItem>
            <SimpleItem
              dataField="city"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: availableCities,
                valueExpr: "this",
                displayExpr: "name", // INI JUGA KUNCINYA!
                placeholder: "Pilih kota",
                disabled: readOnly || availableCities.length === 0,
                searchEnabled: true,
              }}
            >
              <RequiredRule />
            </SimpleItem>
          </GroupItem>
          <GroupItem caption="Contact & Info" colCount={2}>
            <SimpleItem dataField="email">
              <RequiredRule />
              <EmailRule />
            </SimpleItem>
            <SimpleItem dataField="website">
              <RequiredRule />
              <PatternRule pattern={websitePattern} />
            </SimpleItem>
            <SimpleItem
              dataField="registrationDate"
              caption="Registration Date"
              editorType="dxDateBox"
              editorOptions={{ displayFormat: "dd-MMM-yyyy", width: "100%" }}
            >
              <RequiredRule />
            </SimpleItem>
          </GroupItem>
        </Form>
        <FormActions readOnly={readOnly} onCancel={onCancel} onBack={onBack} />
      </form>
    </div>
  );
};

export default CustomerForm;

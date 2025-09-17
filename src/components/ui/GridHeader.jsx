import React from 'react';
import { 
    Toolbar, Item
} from 'devextreme-react/data-grid';

const GridHeader = ({ title, buttonText, onButtonClick }) => {
  return (
    <Toolbar>
      <Item location="before">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      </Item>
      <Item location="after">
        <button 
          className="px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2" 
          onClick={onButtonClick}
        >
          <i className="dx-icon dx-icon-add"></i>
          <span>{buttonText}</span>
        </button>
      </Item>
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

export const GridHeaderWithAddInMenu = ({ title }) => {
  return (
    <Toolbar>
      <Item location="before">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      </Item>
      <Item name="addRowButton" showText="inMenu" />
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

export default GridHeader;
import React from 'react';
import { 
    Toolbar, Item
} from 'devextreme-react/data-grid';

const GridHeader = ({ title, buttonText, onButtonClick }) => {
  return (
    <Toolbar>
      <Item location="before">
        <h2 className="text-xl font-semibold text-bi-slate-800">{title}</h2>
      </Item>
      <Item
        widget="dxButton"
        location="after"
        options={{
          text: buttonText,
          icon: "add",
          stylingMode: "contained", // Membuatnya terlihat seperti tombol solid
          // Ubah 'default' menjadi 'normal' agar style DevExtreme tidak menimpa Tailwind
          type: "normal",
          elementAttr: { 
            class: "grid-add-button" 
          },
          onClick: onButtonClick,
        }}
      />
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

export const GridHeaderWithAddInMenu = ({ title }) => {
  return (
    <Toolbar>
      <Item location="before">
        <h2 className="text-xl font-semibold text-bi-slate-800">{title}</h2>
      </Item>
      <Item name="addRowButton" showText="inMenu" />
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

export default GridHeader;
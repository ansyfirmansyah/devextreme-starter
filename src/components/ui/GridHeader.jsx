import React from 'react';
import { 
    Toolbar, Item
} from 'devextreme-react/data-grid';
import styles from './Global.module.css';

const GridHeader = ({ title, buttonText, onButtonClick }) => {
  return (
    <Toolbar>
      <Item location="before">
        <h2 className={styles.gridHeader}>{title}</h2>
      </Item>
      <Item location="after">
        <button className={styles.addButton} onClick={onButtonClick}>
          <i className="dx-icon dx-icon-add"></i>{buttonText}
        </button>
      </Item>
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

export const GridHeaderWithoutText = ({ title }) => {
  return (
    <Toolbar>
      <Item location="before">
        <h2 className={styles.gridHeader}>{title}</h2>
      </Item>
      <Item location="after" name="searchPanel" />
    </Toolbar>
  );
};

export default GridHeader;

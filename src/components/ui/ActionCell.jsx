import React from "react";
import { Button } from "devextreme-react";
import styles from './Global.module.css';

const ActionCell = ({onView, onEdit, onDelete}) => {
  return (
    <div className={styles.actionCell}>
      <Button
        icon="eyeopen"
        hint="View Details"
        onClick={onView}
        stylingMode="text"
      />
      <Button
        icon="edit"
        hint="Edit Data"
        onClick={onEdit}
        stylingMode="text"
      />
      <Button
        icon="trash"
        hint="Delete Data"
        onClick={onDelete}
        stylingMode="text"
        type="danger"
      />
    </div>
  );
};

export default ActionCell;

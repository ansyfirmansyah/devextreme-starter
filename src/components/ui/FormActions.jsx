import React from "react";
import { Button } from "devextreme-react";
import styles from './Global.module.css';

const FormActions = ({ readOnly, onCancel, onBack }) => {
  return (
    <div className={styles.buttonsContainer}>
      {readOnly ? (
        <Button
          text="Back"
          type="normal"
          icon="back"
          onClick={onBack}
          stylingMode="contained"
        />
      ) : (
        <>
          <Button
            text="Cancel"
            type="default"
            icon="close"
            onClick={onCancel}
            stylingMode="contained"
          />
          <Button
            text="Save"
            type="success"
            icon="save"
            useSubmitBehavior={true}
            stylingMode="contained"
          />
        </>
      )}
    </div>
  );
};

export default FormActions;

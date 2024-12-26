import { Flex, FormControl, FormLabel, HStack, Spacer } from "@chakra-ui/react";
import { Field } from "formik";
import React from "react";
import styles from "./FormField.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const toolbarOptions = [
  //   [{ font: [] }],
  [{ size: ["small", "medium", "large", "huge"] }],
  //   [{ header: "1" }, { header: "2" }, { font: [] }],
  [{ align: [] }],
  ["bold", "italic", "underline"],
  ["blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  [{ color: [] }, { background: [] }], // Add color and background color options
  //   ["image"],
];

export interface FieldType {
  required: boolean;
  name: string;
  fieldName: string;
  filedValue?: string;
  disabled?: boolean;
  error?: string | undefined;
}

const FormEditor: React.FC<FieldType> = (props) => {
  return (
    <>
      <FormControl isRequired={props.required}>
        <Flex width="100%">
          <HStack>
            <FormLabel>{props.name}</FormLabel>
            <Spacer></Spacer>
            <p className={styles.error}>{props.error}</p>
          </HStack>
        </Flex>
        <Field
          name={props.fieldName}
          className={props.error ? styles.errorField : styles.field}
        >
          {/* @ts-ignore */}
          {({ field, meta: { touched }, form }) => {
            return (
              <ReactQuill
                readOnly={!!props.disabled}
                value={field.value}
                onChange={field.onChange(field.name)}
                modules={{
                  toolbar: toolbarOptions,
                }}
                theme="snow"
              />
            );
          }}
        </Field>
      </FormControl>
    </>
  );
};

export default FormEditor;

import {
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "formik";
import React from "react";
import styles from "./FormField.module.css";

export interface FieldType {
  required: boolean;
  name: string;
  fieldName: string;
  type: string;
  disabled?: boolean;
  placeholder:string;
  error: string | undefined;
}

export const FormFieldTextArea: React.FC<FieldType> = (props) => {
  return (
    <>
      <FormControl isRequired={props.required}>
        <Flex width="100%">
          <HStack>
            z<FormLabel>{props.name}</FormLabel>
            <Spacer></Spacer>
            <p className={styles.error}>{props.error}</p>
          </HStack>
        </Flex>
        <Field
          name={props.fieldName}
          type={props.type}
          className={props.error ? styles.errorField : styles.field}
        >
          {/* @ts-ignore */}
          {({ field, meta: { touched } }) => {
            return (
              <Textarea
                className={
                  touched && props.error ? styles.errorField : styles.field
                }
                disabled={!!props.disabled}
                placeholder={props.placeholder}
                {...field}
                errorBorderColor={"red"}
              />
            );
          }}
        </Field>
      </FormControl>
    </>
  );
};

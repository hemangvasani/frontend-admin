import {
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Spacer,
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
  error: string | undefined;
  placeholder?: string;
}

export const FormField: React.FC<FieldType> = (props) => {
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
          type={props.type}
          className={props.error ? styles.errorField : styles.field}
        >
          {/* @ts-ignore */}
          {({ field, meta: { touched } }) => {
            return (
              <Input
                className={
                  touched && props.error ? styles.errorField : styles.field
                }
                type={props.type}
                placeholder={props.placeholder}
                disabled={!!props.disabled}
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

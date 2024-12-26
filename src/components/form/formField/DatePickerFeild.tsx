import React, { useMemo, useState } from "react";
import styles from "./Calender.module.css";
import "react-calendar/dist/Calendar.css";
import { Box, useToast } from "@chakra-ui/react";
import { Flex, FormControl, FormLabel, HStack, Spacer } from "@chakra-ui/react";
import { Field } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export interface FieldType {
  required: boolean;
  name: string;
  value: any;
  fieldName: string;
  disabled?: boolean;
  error: string | undefined;
  placeholder?: string;
}

export const DatePickerFeild: React.FC<FieldType> = (props) => {
  const [startDate, setStartDate] = useState<any>(new Date());

  return (
    <FormControl isRequired={props.required}>
      <Flex width="100%">
        <HStack>
          <FormLabel>{props.name}</FormLabel>
          <Spacer></Spacer>
          <p style={{ color: "red" }}>{props.error}</p>
        </HStack>
      </Flex>
      <Field
        name={props.fieldName}
        className={props.error ? styles.errorField : styles.field}
      >
        {/* @ts-ignore */}
        {({ field, meta: { touched }, form }) => {
          return (
            <Box mt={1} className={styles.innerPopupDiv}>
              <DatePicker
                selected={
                  field.value ? moment(field.value).toDate() : startDate
                }
                className="customDatePicker"
                showMonthDropdown
                showYearDropdown
                onChange={(date: any) => {
                  setStartDate(date);
                  form.setFieldValue(props.fieldName, date);
                }}
                // showTimeSelect
                disabled={props.disabled}
                // timeFormat="HH:mm"
                placeholderText={props.placeholder}
                // injectTimes={[
                //   setHours(setMinutes(new Date(), 1), 0),
                //   setHours(setMinutes(new Date(), 5), 12),
                //   setHours(setMinutes(new Date(), 59), 23),
                // ]}
                // dateFormat="MMMM d, yyyy HH:mm"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                isClearable={true}
              />
            </Box>
          );
        }}
      </Field>
    </FormControl>
  );
};

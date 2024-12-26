import React, { useMemo, useState } from "react";
import styles from "./Calender.module.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Box, useToast } from "@chakra-ui/react";
import {
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Spacer,
} from "@chakra-ui/react";
import { Field } from "formik";
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


export const FormFieldCalender: React.FC<FieldType> = (props) => {
    const currentDate = useMemo(() => new Date(), []);
    const toast = useToast();
    const [colorDate,setColorDate] = useState(new Date(Date.parse(props.value)))

    return (
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
                        <Box mt={5} className={styles.innerPopupDiv}>   
                            <Calendar
                                onChange={(v: any) => {
                                        form.setFieldValue(props.fieldName, moment(v).startOf("day").format('YYYY-MM-DD HH:mm:ss'));
                                        setColorDate(v)
                                }}
                                // {...field}
                                className={styles.cal}
                                maxDate={moment(currentDate).add(5, 'years').toDate()}
                                // tileDisabled={true}
                                value={props.value ? colorDate : currentDate}
                                // errorBorderColor={"red"}
                                minDate={currentDate}
                            />
                        </Box>
                    );
                }}
            </Field>
        </FormControl>
    );
};
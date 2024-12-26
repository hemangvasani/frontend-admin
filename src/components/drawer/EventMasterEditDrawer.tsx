import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Drawer,
  DrawerBody,
  IconButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Spacer,
  useToast,
  HStack,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import Select from "react-select";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  REQUEST_CREATE_MASTER_EVENT,
  REQUEST_UPDATE_MASTER_EVENT,
  SET_MESSAGE_MASTER_EVENT,
} from "../../store/event/eventActionTypes";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MdModeEditOutline } from "react-icons/md";
import { get } from "lodash";
import { FormField } from "../form/formField/FormField";
import { useEventMaster } from "../../store/event/reducer";
import { FormFieldCalender } from "../form/formField/FormFieldCalender";
import moment from "moment";
import MultipleImage from "../ImageFormField/MultipleImage";
import SingleImageUpload from "../ImageFormField/SingleImageUpload";
import TimePicker from "react-time-picker";
import { FormFieldTextArea } from "../form/formField/FormFieldTextArea";
import { DatePickerFeild } from "../form/formField/DatePickerFeild";
import { useCategoriesMaster } from "../../store/category/reducer";

interface Props {
  event?: any;
  isOpen: any;
  onClose: any;
}

const addSchema = Yup.object({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  eventAdd: Yup.string().required("Required"),
  google_directionLink: Yup.string().required("Required"),
  apple_directionLink: Yup.string().required("Required"),
  time: Yup.string().required("Required"),
  mobileNo: Yup.number().required("Required"),
  date: Yup.date().required("Required"),
  eventCategoryId: Yup.object().required("Required"),
});

const EventMasterEditDrawer: React.FC<Props> = ({ event, isOpen, onClose }) => {
  const { masterEvent, busy, message } = useEventMaster();
  const { masterCategory } = useCategoriesMaster();
  const [isDisabled, setDisabled] = useState(!!(event && event._id));
  const dispatch = useDispatch();

  const categoryOption = useMemo(
    () =>
      masterCategory.map((lc: Record<string, any>) => {
        return {
          label: lc.title,
          value: lc._id,
        };
      }),
    [masterCategory]
  );

  const toast = useToast();

  const initialValue = useMemo(() => {
    if (event) {
      //   console.log(event.eventCategoryId);
      return {
        title: event.title,
        mobileNo: event.mobileNo,
        description: event.description,
        time: event.time,
        date: event.date ? event.date : "",
        eventAdd: event.eventAdd,
        google_directionLink: event.google_directionLink,
        apple_directionLink: event.apple_directionLink,
        eventCategoryId: categoryOption.find(
          (to: any) => to.label === event.eventCategoryId.title
        ),
      };
    }
    return {
      title: "",
      description: "",
      mobileNo: "",
      time: "",
      eventAdd: "",
      date: "",
      google_directionLink: "",
      apple_directionLink: "",
      eventCategoryId: "",
    };
  }, [event, categoryOption]);
  // console.log(initialValue);

  const onSubmit = (values: Record<string, any>) => {
    // console.log(values);

    if (event) {
      let payload: Record<string, any> = {
        title: values.title,
        description: values.description,
        mobileNo: values.mobileNo.toString(),
        eventAdd: values.eventAdd,
        google_directionLink: values.google_directionLink,
        apple_directionLink: values.apple_directionLink,
        date: values.date,
        time: values.time,
        eventCategoryId: values.eventCategoryId.value,
      };

      const data = { payload, _id: event._id };
      dispatch({ type: REQUEST_UPDATE_MASTER_EVENT, data });
    } else {
      let payload: Record<string, any> = {
        title: values.title,
        description: values.description,
        mobileNo: values.mobileNo.toString(),
        eventAdd: values.eventAdd,
        google_directionLink: values.google_directionLink,
        apple_directionLink: values.apple_directionLink,
        date: values.date,
        time: values.time,
        eventCategoryId: values.eventCategoryId.value,
      };
      // console.log(payload);
      dispatch({ type: REQUEST_CREATE_MASTER_EVENT, payload });
    }
  };

  const events = useMemo(() => {
    return masterEvent;
  }, []);

  useEffect(() => {
    if (event) {
      const eventFromStore = masterEvent.find(
        (ml: any) => ml._id === event._id
      );
      // console.log(eventFromStore , event);
      if (eventFromStore !== event) {
        toast({
          title: "Success.",
          description: "Event is updated.",
          status: "success",
          isClosable: true,
          position: "top-right",
        });
        onClose();
      }
    } else if (events.length !== masterEvent.length) {
      toast({
        title: "Success.",
        description: "Event is created.",
        status: "success",
        isClosable: true,
        position: "top-right",
      });
      onClose();
    }
  }, [events, masterEvent, onClose, event, toast]);

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={addSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, errors, touched, submitForm }) => (
        <Form>
          <Drawer
            isOpen={isOpen}
            placement="right"
            size={"md"}
            onClose={() => {
              onClose();
              dispatch({ type: SET_MESSAGE_MASTER_EVENT });
            }}
            closeOnOverlayClick={busy}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader backgroundColor={"gray.100"} alignItems={"stretch"}>
                <Flex>
                  {get(event, "title") || "Add Event"}
                  <Spacer></Spacer>
                  {/* {event && event._id && (
                    <IconButton
                      aria-label="update event"
                      key={"updateEventButton"}
                      alignSelf={"end"}
                      onClick={() => {
                        setDisabled(!isDisabled);
                      }}
                      icon={<MdModeEditOutline />}
                    ></IconButton>
                  )} */}
                </Flex>

                {message && (
                  <Alert status="error">
                    <AlertTitle>{message}</AlertTitle>
                  </Alert>
                )}
              </DrawerHeader>
              <DrawerBody>
                <FormField
                  required={true}
                  //   disabled={isDisabled}
                  placeholder="Enter Title"
                  name="Title :"
                  fieldName="title"
                  type="text"
                  error={touched.title ? (errors.title as string) : undefined}
                />

                <FormFieldTextArea
                  required={true}
                  //   disabled={isDisabled}
                  placeholder="Enter Description"
                  name="Description :"
                  fieldName="description"
                  type="textarea"
                  error={
                    touched.description
                      ? (errors.description as string)
                      : undefined
                  }
                />

                <FormField
                  required={true}
                  //   disabled={isDisabled}
                  placeholder="Enter Mobile No."
                  name="Mobile No. :"
                  fieldName="mobileNo"
                  type="number"
                  error={
                    touched.mobileNo ? (errors.mobileNo as string) : undefined
                  }
                />
                <FormControl isRequired>
                  <Flex width="100%">
                    <HStack>
                      <FormLabel>Category : </FormLabel>
                      <Spacer></Spacer>
                      <Text color={"red"}>
                        {errors.eventCategoryId as string}
                      </Text>
                    </HStack>
                  </Flex>
                  <Select
                    // isMulti={true}
                    // isDisabled={isDisabled}
                    value={values["eventCategoryId"]}
                    name="eventCategoryId"
                    onChange={(event) => {
                      setFieldValue("eventCategoryId", event);
                    }}
                    options={categoryOption}
                    placeholder="Select a Category"
                  />
                </FormControl>

                <FormFieldTextArea
                  required={true}
                  //   disabled={isDisabled}
                  placeholder="Enter Event Address"
                  name="Event Address :"
                  fieldName="eventAdd"
                  type="textarea"
                  error={
                    touched.eventAdd ? (errors.eventAdd as string) : undefined
                  }
                />
                <FormField
                  required={true}
                  //   disabled={isDisabled}
                  placeholder="Enter Google map link"
                  name="Google Map Link :"
                  fieldName="google_directionLink"
                  type="text"
                  error={
                    touched.google_directionLink
                      ? (errors.google_directionLink as string)
                      : undefined
                  }
                />

                <FormField
                  required={true}
                  //   disabled={isDisabled}
                  placeholder="Enter Apple map link"
                  name="Apple Map Link :"
                  fieldName="apple_directionLink"
                  type="text"
                  error={
                    touched.apple_directionLink
                      ? (errors.apple_directionLink as string)
                      : undefined
                  }
                />

                <DatePickerFeild
                  required={true}
                  name={"Event Date : "}
                  fieldName={"date"}
                  value={values["date"]}
                  //   disabled={isDisabled}
                  placeholder={`📆 Select Start Date`}
                  error={touched.date ? (errors.date as string) : undefined}
                />

                <Box my={5}>
                  <Flex width="100%" alignItems="center">
                    <HStack>
                      <FormLabel>Time :</FormLabel>
                      <Text color={"red"}>{errors.time as string}</Text>
                    </HStack>
                  </Flex>
                  <TimePicker
                    onChange={(value) => {
                      // if(values.startTime > value){
                      //   console.log("not ok")
                      //   value="00:00"
                      // }else{
                      //   console.log("ok")
                      setFieldValue("time", value);
                      // }
                    }}
                    value={values["time"]}
                    hourPlaceholder="HH"
                    minutePlaceholder="MM"
                    locale="sv-sv"
                    // disabled={event && event._id ? isDisabled : isDisabled}
                    className="date1"
                    disableClock
                  />
                </Box>
              </DrawerBody>

              <DrawerFooter backgroundColor={"gray.100"}>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={() => {
                    onClose();
                    dispatch({ type: SET_MESSAGE_MASTER_EVENT });
                  }}
                  disabled={busy}
                >
                  Close
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={submitForm}
                  //   disabled={busy || isDisabled}
                >
                  {event && event._id ? "Update" : "Save"}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};

export default EventMasterEditDrawer;

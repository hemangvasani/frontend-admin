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
  Spacer,
  useToast,
  HStack,
  FormLabel,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { get } from "lodash";
import { FormField } from "../form/formField/FormField";
import MultipleImage from "../ImageFormField/MultipleImage";
import SingleImageUpload from "../ImageFormField/SingleImageUpload";
import { FormFieldTextArea } from "../form/formField/FormFieldTextArea";
import { useCategoriesMaster } from "../../store/category/reducer";
import {
  REQUEST_CREATE_MASTER_NEWS,
  REQUEST_UPDATE_MASTER_NEWS,
  SET_MESSAGE_MASTER_NEWS,
} from "../../store/news/newsActionTypes";
import { useNewsMaster } from "../../store/news/reducer";

interface Props {
  news?: any;
  isOpen: any;
  onClose: any;
}

const addSchema = Yup.object({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const NewsEditDrawer: React.FC<Props> = ({ news, isOpen, onClose }) => {
  const { masterNews, busy, message } = useNewsMaster();
  const [isDisabled, setDisabled] = useState(!!(news && news._id));
  const dispatch = useDispatch();

  const toast = useToast();

  const initialValue = useMemo(() => {
    if (news) {
      //   console.log(news.eventCategoryId);
      return {
        title: news.title ? news.title : "",
        description: news.description ? news.description : "",
        imageId: news.imageId ? news.imageId : "",
      };
    }
    return {
      title: "",
      description: "",
      imageId: "",
    };
  }, [news]);

  const onSubmit = (values: Record<string, any>) => {
    // console.log(values);

    if (news) {
      let payload: Record<string, any> = {
        title: values.title,
        description: values.description,
        imageId: values.imageId ? values.imageId : null,
      };

      const data = { payload, _id: news._id };
      dispatch({ type: REQUEST_UPDATE_MASTER_NEWS, data });
    } else {
      let payload: Record<string, any> = {
        title: values.title,
        description: values.description,
        imageId: values.imageId ? values.imageId : null,
      };
      // console.log(payload);
      dispatch({ type: REQUEST_CREATE_MASTER_NEWS, payload });
    }
  };

  const events = useMemo(() => {
    return masterNews;
  }, []);

  useEffect(() => {
    if (news) {
      const eventFromStore = masterNews.find((ml: any) => ml._id === news._id);
      // console.log(eventFromStore , news);
      if (eventFromStore !== news) {
        toast({
          title: "Success.",
          description: "News is updated.",
          status: "success",
          isClosable: true,
          position: "top-right",
        });
        onClose();
      }
    } else if (events.length !== masterNews.length) {
      toast({
        title: "Success.",
        description: "News is created.",
        status: "success",
        isClosable: true,
        position: "top-right",
      });
      onClose();
    }
  }, [events, masterNews, onClose, news, toast]);

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
              dispatch({ type: SET_MESSAGE_MASTER_NEWS });
            }}
            closeOnOverlayClick={busy}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader backgroundColor={"gray.100"} alignItems={"stretch"}>
                <Flex>
                  {get(news, "title") || "Add Event"}
                  <Spacer></Spacer>
                  {/* {news && news._id && (
                      <IconButton
                        aria-label="update news"
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
                <Flex width="100%">
                  <HStack>
                    <FormLabel>Image : </FormLabel>
                    <Spacer></Spacer>
                    <text style={{ color: "red" }}>
                      {errors.imageId as string}
                    </text>
                  </HStack>
                </Flex>
                <SingleImageUpload
                  disabled={isDisabled}
                  image={values["imageId"]}
                  onSuccess={(fileList: any) => {
                    setFieldValue("imageId", fileList);
                  }}
                ></SingleImageUpload>
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
              </DrawerBody>

              <DrawerFooter backgroundColor={"gray.100"}>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={() => {
                    onClose();
                    dispatch({ type: SET_MESSAGE_MASTER_NEWS });
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
                  {news && news._id ? "Update" : "Save"}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};

export default NewsEditDrawer;

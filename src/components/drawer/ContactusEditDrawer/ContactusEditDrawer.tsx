import { useEffect, useMemo, useState } from "react";
import {
  Tag,
  TagLabel,
  TagCloseButton,
  VStack,
  HStack,
} from "@chakra-ui/react";

import {
  Alert,
  AlertTitle,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Spacer,
  useToast,
  Text,
  Input,
  Box,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Field, Form, Formik } from "formik";
import { FormField } from "../../form/formField/FormField";
import {
  REQUEST_UPDATE_MASTER_CONTACTUS,
  SET_MESSAGE_MASTER_CONTACTUS,
} from "../../../store/contactus/contactusActionTypes";
import { useContactMaster } from "../../../store/contactus/reducer";

function jsonToFormData(json: any) {
  const formData = new FormData();

  function appendData(key: any, value: any) {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        appendData(`${key}[${index}]`, item);
      });
    } else if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((subKey) => {
        const v = value[subKey];
        if (subKey == "title") {
          subKey = "heading";
        } else if (subKey == "keydesc") {
          subKey = "paragraph";
        } else {
          subKey = subKey;
        }
        appendData(`${key}[${subKey}]`, v);
      });
    } else {
      formData.append(key, value);
    }
  }

  Object.keys(json).forEach((key) => {
    appendData(key, json[key]);
  });

  return formData;
}

interface Props {
  category?: any;
  isOpen: any;
  onClose: any;
  isViewMode?: boolean;
}

const ContactusEditDrawer: React.FC<Props> = ({
  category,
  isOpen,
  onClose,
  isViewMode = false,
}) => {
  const dispatch = useDispatch();

  const { masterContact, conbusy, message } = useContactMaster();

  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  console.log(previewUrl, "previewwwwwwwwwwww");

  const initialValue = useMemo(() => {
    if (category) {
      if (category?.file) {
        setPreviewUrl(category?.file);
      }

      return {
        name: category?.name || "",
        email: category?.email || "",
        phone: category?.phone || "",
        company: category?.company || "",
        message: category?.message || "",
        file: category?.file || "",
      };
    }
    return {
      name: "",
      email: "",
      phone: "",
      conmpany: "",
      message: "",
      file: "",
    };
  }, [category]);

  const onSubmit = (values: Record<string, any>) => {
    const tags = values.tags
      ? values.tags.split(/\s+/).filter((tag: string) => tag.trim() !== "")
      : [];

    let payload: Record<string, any> = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      message: values.message,
    };

    const formData = jsonToFormData(payload);

    if (category) {
      const data = { payload: formData, _id: category._id };
      dispatch({
        type: REQUEST_UPDATE_MASTER_CONTACTUS,
        data,
        onSuccess: () => {
          toast({
            title: "Product Saved",
            status: "success",
            duration: 3000,
            onCloseComplete: () => {
              // onClose();
            },
          });
          onClose();
        },
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();

      const url1 = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url1;
      a.download = url; // Specify the file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Image download failed:", error);
    }
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <Formik
            // validationSchema={homeMasterValidationSchema}
            initialValues={initialValue}
            onSubmit={onSubmit}
          >
            {({
              values,
              setFieldValue,
              errors,
              touched,
              submitForm,
              handleChange,
              handleBlur,
            }) => (
              <Form>
                <Drawer
                  isOpen={isOpen}
                  placement="right"
                  size={"md"}
                  onClose={() => {
                    onClose();
                    dispatch({ type: SET_MESSAGE_MASTER_CONTACTUS });
                  }}
                  closeOnOverlayClick={!conbusy}
                >
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerHeader
                      backgroundColor="#E8D7EE"
                      alignItems={"stretch"}
                      borderBottom="1px solid #E0E0E0"
                    >
                      <Flex>
                        {isViewMode ? "View Contact" : "Edit Contact"}
                        <Spacer />
                      </Flex>

                      {message && (
                        <Alert status="error">
                          <AlertTitle>{message}</AlertTitle>
                        </Alert>
                      )}
                    </DrawerHeader>
                    <DrawerBody>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="First name"
                          fieldName="name"
                          placeholder="Enter First name"
                          type="text"
                          error={undefined}
                          disabled={isViewMode}
                        />
                        {touched.name && errors.name && (
                          <Text color="red.500" fontSize="sm">
                            {/* {errors.name} */}
                          </Text>
                        )}
                      </FormControl>

                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        gap="14px"
                      >
                        {/* Name Field */}
                        <FormControl pb={3}>
                          <FormField
                            required={true}
                            name="Email"
                            fieldName="email"
                            placeholder="Enter Email"
                            type="email"
                            error={undefined}
                            disabled={isViewMode}
                          />
                          {touched.name && errors.name && (
                            <Text color="red.500" fontSize="sm">
                              {/* {errors.name} */}
                            </Text>
                          )}
                        </FormControl>

                        {/* Description Field */}
                        <FormControl pb={3}>
                          <FormField
                            required={true}
                            name="Phone Number"
                            fieldName="phone"
                            placeholder="Enter number"
                            type="tel"
                            error={undefined}
                            disabled={isViewMode}
                          />
                        </FormControl>
                      </Flex>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Company"
                          fieldName="company"
                          placeholder="Enter Company"
                          type="text"
                          error={undefined}
                          disabled={isViewMode}
                        />
                        {touched.name && errors.name && (
                          <Text color="red.500" fontSize="sm">
                            {/* {errors.name} */}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="How can we help you?"
                          fieldName="message"
                          placeholder="Enter Message"
                          type="text"
                          error={undefined}
                          disabled={isViewMode}
                        />
                        {touched.name && errors.name && (
                          <Text color="red.500" fontSize="sm">
                            {/* {errors.name} */}
                          </Text>
                        )}
                      </FormControl>

                      {previewUrl && isViewMode && (
                        <Box
                          mt={2}
                          cursor="pointer"
                          onClick={() => handleDownload(previewUrl)}
                        >
                          <img
                            src={previewUrl}
                            alt={!previewUrl ? "Image" : "No image"}
                            style={{ maxWidth: "300px", maxHeight: "300px" }}
                          />
                        </Box>
                      )}
                    </DrawerBody>
                    <DrawerFooter boxShadow="0px -1.76px 27.68px 0px #b0b0b033">
                      <Button
                        variant="outline"
                        mr={3}
                        border="1px solid #EEE"
                        borderRadius="6px"
                        onClick={() => {
                          onClose();
                          dispatch({ type: SET_MESSAGE_MASTER_CONTACTUS });
                        }}
                        disabled={conbusy}
                        color="#424242"
                        fontSize={"sm"}
                      >
                        Cancel
                      </Button>

                      <Button
                        fontSize={"sm"}
                        color="#fff"
                        onClick={submitForm}
                        background="#cd30ff"
                        type="submit"
                        disabled={isViewMode}
                      >
                        Update
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </Form>
            )}
          </Formik>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ContactusEditDrawer;

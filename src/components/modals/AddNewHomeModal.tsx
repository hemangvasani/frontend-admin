import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AlertTitle,
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
  HStack,
  Spacer,
  useToast,
  Text,
  Box,
  Input,
  Textarea,
  VStack,
  Select,
  useDisclosure,
  Modal,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import { get } from "lodash";
import { MdModeEditOutline } from "react-icons/md";
import { FormField } from "../form/formField/FormField";
import { FiPlus, FiUpload } from "react-icons/fi";
import { useHomeMaster } from "../../store/home/reducer";
import {
  REQUEST_CREATE_MASTER_HOME,
  SET_MASTER_HOME,
  REQUEST_UPDATE_MASTER_HOME,
} from "../../store/home/homeActionTypes";

import {
  REQUEST_CREATE_MASTER_CATEGORIES,
  SET_MASTER_CATEGORIES,
} from "../../store/category/categoryActionTypes";

interface Props {
  servicemain?: any;
  isOpen: boolean;
  onClose: () => void;
}

const AddNewSubServiceModal: React.FC<Props> = ({
  servicemain,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const initialValues = {
    name: "",
  };

  // Form validation schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Service Name is required"),
  });

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    const formData = new FormData();
    formData.append("name", values.name);

    dispatch({
      type: REQUEST_CREATE_MASTER_CATEGORIES,
      payload: formData,
      onSuccess: () => {
        dispatch({ type: SET_MASTER_CATEGORIES });
        toast({
          title: "Service Saved",
          status: "success",
          duration: 3000,
        });
        onClose();
      },
      onError: () => {
        toast({
          title: "Failed to save service",
          status: "error",
          duration: 3000,
        });
      },
    });
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <DrawerContent>
                <DrawerHeader
                  backgroundColor="#E8D7EE"
                  alignItems={"stretch"}
                  borderBottom="1px solid #E0E0E0"
                >
                  {servicemain ? "Edit Category" : "Add Category"}
                </DrawerHeader>
                <DrawerBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={!!(errors.name && touched.name)}>
                      <FormLabel>Category Name</FormLabel>
                      <Input
                        color="#08021B"
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.name && touched.name && (
                        <></>
                        // <Text color="red.500">{errors.name}</Text>
                      )}
                    </FormControl>
                  </VStack>
                </DrawerBody>
                <DrawerFooter>
                  <HStack spacing={4}>
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      color="#424242"
                      fontSize={"sm"}
                      border="1px solid #EEE"
                      borderRadius="6px"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      // colorScheme="teal"
                      // disabled={isDisabled}
                      isLoading={false}
                      fontSize={"sm"}
                      color="#fff"
                      background="#cd30ff"
                      _hover={{ background: "#cd30ff" }}
                    >
                      Save
                      {/* {servicemain ? "Update" : "Save"} */}
                    </Button>
                  </HStack>
                </DrawerFooter>
              </DrawerContent>
            </Form>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};

export default AddNewSubServiceModal;

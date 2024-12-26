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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { get } from "lodash";
import { FormField } from "../form/formField/FormField";
import { FormFieldTextArea } from "../form/formField/FormFieldTextArea";
import axios from "axios";
import FormEditor from "../form/formField/FormEditor";

interface Props {
  about?: any;
  isOpen: any;
  onClose: any;
  getData: any;
}

const addSchema = Yup.object({
  aboutus: Yup.string().required("Required"),
  address: Yup.string().required("Required").min(12, "Minimum 12 characters"),
  phone: Yup.string().required("Required"),
});

const AboutUsEditDrawer: React.FC<Props> = ({
  about,
  isOpen,
  onClose,
  getData,
}) => {
  const toast = useToast();

  const initialValue = useMemo(() => {
    if (about) {
      return {
        aboutus: about.aboutus,
        address: about.address,
        phone: about.phone,
      };
    }
    return {
      aboutus: "",
      address: "",
      phone: "",
    };
  }, [about]);

  const onSubmit = (values: Record<string, any>) => {
    if (about) {
      let payload: Record<string, any> = {
        phone: values.phone,
        aboutus: values.aboutus,
        address: values.address,
      };

      axios({
        url: `${process.env.REACT_APP_BASE_URL}/about-us/${about._id}`,
        method: "patch",
        data: payload,
      })
        .then((res) => {
          // console.log("resss", res);
          toast({
            description: "Successfully updated",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
          getData();
        })
        .catch((error) => {
          console.log("errrrr", error);
          toast({
            description: "Something went wrong",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

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
            }}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader
                backgroundColor="#E8D7EE"
                alignItems={"stretch"}
                borderBottom="1px solid #E0E0E0"
              >
                <Flex>
                  Edit About Us
                  <Spacer></Spacer>
                </Flex>
              </DrawerHeader>
              <DrawerBody>
                {/* <FormField
                  required={true}
                  name="Address : "
                  fieldName="address"
                  type="text"
                  error={
                    touched.address && errors.address
                      ? (errors.address as string)
                      : undefined
                  }
                /> */}
                <FormEditor
                  required={true}
                  name="Address : "
                  fieldName="address"
                  filedValue={values.address}
                />
                <FormField
                  required={false}
                  name="Phone : "
                  fieldName="phone"
                  type="text"
                  error={
                    touched.phone && errors.phone
                      ? (errors.phone as string)
                      : undefined
                  }
                />
                {/* <FormFieldTextArea
                  required={true}
                  name="About Us : "
                  placeholder="Enter About Us"
                  fieldName="aboutus"
                  type="text"
                  error={
                    touched.aboutus && errors.aboutus
                      ? (errors.aboutus as string)
                      : undefined
                  }
                /> */}
                <FormEditor
                  required={true}
                  name="Description : "
                  fieldName="aboutus"
                  filedValue={values.aboutus}
                />
              </DrawerBody>
              <DrawerFooter boxShadow="0px -1.76px 27.68px 0px #b0b0b033">
                <Button
                  variant="outline"
                  border="1px solid #EEE"
                  borderRadius="6px"
                  mr={3}
                  onClick={() => {
                    onClose();
                  }}
                  color="#424242"
                  fontSize={"sm"}
                  //   disabled={busy}
                >
                  Close
                </Button>
                <Button
                  fontSize={"sm"}
                  color="#fff"
                  background="#cd30ff"
                  onClick={submitForm}
                  //   disabled={busy || isDisabled}
                >
                  {about && about._id ? "Update" : "Save"}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};

export default AboutUsEditDrawer;

import {
  Alert,
  AlertIcon,
  Button,
  CloseButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  AlertTitle,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useFaqsMaster } from "../../store/faq/reducer";
import { FormField } from "../form/formField/FormField";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

interface Props {
  setAddCat: any;
  isOpen: any;
  onClose: any;
}

const addSchema = Yup.object({
  category: Yup.string().required("Required"),
});
const FaqAddCategoryModal: React.FC<Props> = ({
  setAddCat,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { busy, masterFaqs, message } = useFaqsMaster();

  const initialValue = useMemo(() => {
    return {
      category: "",
    };
  }, []);
  const onSubmit = (values: Record<string, any>) => {
    let payload: Record<string, any> = {
      category: values.category,
    };
    setAddCat(values.category);
    onClose();
    // axios({
    //   url: `${process.env.REACT_APP_BASE_URL}/admin/user/searchBySpaceQuery`,
    //   method: "POST",
    //   data: {
    //     data: payload,
    //   },
    // })
    //   .then((res) => {
    //     // console.log("resss", res);
    //   })
    //   .catch((error) => {
    //     console.log("errrrr", error);
    //   });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Faqs Category</ModalHeader>
        <ModalCloseButton disabled={busy} />
        <Formik
          initialValues={initialValue}
          validationSchema={addSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, errors, touched, submitForm }) => (
            <Form>
              <ModalBody>
                <FormField
                  required={true}
                  //   disabled={isDisabled}
                  name="Faq Category : "
                  fieldName="category"
                  placeholder="Enter Faq Category"
                  type="text"
                  error={
                    touched.category ? (errors.category as string) : undefined
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={onClose}
                  disabled={busy}
                >
                  Close
                </Button>
                <Button colorScheme="blue" onClick={submitForm} disabled={busy}>
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>

        {message && (
          <ModalFooter>
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{message}</AlertTitle>
              <CloseButton position="absolute" right="8px" top="8px" />
            </Alert>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FaqAddCategoryModal;

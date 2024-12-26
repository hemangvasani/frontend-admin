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
  useDisclosure,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import { get } from "lodash";
import Select from "react-select";
import { MdModeEditOutline } from "react-icons/md";
import { FormField } from "../form/formField/FormField";
import { useFaqsMaster } from "../../store/faq/reducer";
import {
  REQUEST_CREATE_MASTER_FAQS,
  REQUEST_MASTER_FAQS,
  REQUEST_UPDATE_MASTER_FAQS,
  SET_MESSAGE_MASTER_FAQS,
} from "../../store/faq/faqActionTypes";
import { FormFieldTextArea } from "../form/formField/FormFieldTextArea";
import FaqAddCategoryModal from "../modals/FaqAddCategoryModal";
import FormEditor from "../form/formField/FormEditor";

interface Props {
  faqs?: any;
  isOpen: any;
  onClose: any;
}

const addSchema = Yup.object({
  // originalSizeImage: Yup.mixed().required("A file is required"),
  question: Yup.string().required("Required"),
  answer: Yup.string().required("Required"),
  category: Yup.object().required("Required"),
});

const FaqsEditDrawer: React.FC<Props> = ({ faqs, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const { masterFaqsCat, busy, masterFaqs } = useFaqsMaster();
  const [addCat, setAddCat] = useState("");
  console.log([...masterFaqsCat, addCat]);
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const categoryOption = useMemo(
    () =>
      [...masterFaqsCat, addCat].map((lc: Record<string, any>) => {
        return {
          label: lc,
          value: lc,
        };
      }),
    [masterFaqsCat, addCat]
  );
  // console.log(masterTags);

  const toast = useToast();
  const [isDisabled, setDisabled] = useState(!!(faqs && faqs._id));

  const initialValue = useMemo(() => {
    if (faqs) {
      return {
        question: faqs.question,
        answer: faqs.answer,
        category: categoryOption.find((to: any) => to.value === faqs.category),
      };
    }
    return {
      question: "",
      answer: "",
      category: "",
    };
  }, [faqs]);

  const onSubmit = (values: Record<string, any>) => {
    let payload: Record<string, any> = {
      question: values.question,
      answer: values.answer,
      category: values.category.value,
    };
    if (faqs) {
      const data = { payload, _id: faqs._id };
      dispatch({
        type: REQUEST_UPDATE_MASTER_FAQS,
        data,
      });
    } else {
      dispatch({
        type: REQUEST_CREATE_MASTER_FAQS,
        payload,
        onSuccess: () => {
          dispatch({ type: REQUEST_MASTER_FAQS });
          onClose();
        },
      });
    }
  };

  const categories = useMemo(() => {
    return masterFaqs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (faqs) {
      const categoryFromStore = masterFaqs.find(
        (ml: any) => ml._id === faqs._id
      );
      if (categoryFromStore !== faqs) {
        toast({
          title: "Success.",
          description: "Faqs is updated.",
          status: "success",
          isClosable: true,
          position: "top-right",
        });
        onClose();
      }
    } else if (categories.length !== masterFaqs.length) {
      toast({
        title: "Success.",
        description: "Faq is created.",
        status: "success",
        isClosable: true,
        position: "top-right",
      });
      onClose();
    }
  }, [categories, masterFaqs, faqs, onClose, toast]);

  return (
    <>
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
                dispatch({ type: SET_MESSAGE_MASTER_FAQS });
              }}
              closeOnOverlayClick={busy}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerHeader
                  backgroundColor="#E8D7EE"
                  alignItems={"stretch"}
                  borderBottom="1px solid #E0E0E0"
                >
                  <Flex>
                    {get(faqs, "Edit Faqs") || "Add Faqs"}
                    <Spacer></Spacer>
                    {/* {faqs && faqs._id && (
                    <IconButton
                      aria-label="update Category"
                      key={"updateCategory"}
                      alignSelf={"end"}
                      onClick={() => {
                        setDisabled(!isDisabled);
                      }}
                      icon={<MdModeEditOutline />}
                    ></IconButton>
                  )} */}
                  </Flex>

                  {/* {message && (
                  <Alert status="error">
                    <AlertTitle>{message}</AlertTitle>
                  </Alert>
                )} */}
                </DrawerHeader>
                <DrawerBody>
                  <Text
                    color={"#cb30ff"}
                    textAlign="end"
                    cursor={"pointer"}
                    onClick={() => {
                      onViewOpen();
                    }}
                  >
                    Add Faq Category
                  </Text>
                  <FormControl isRequired>
                    <Flex width="100%">
                      <HStack>
                        <FormLabel>Faq Category : </FormLabel>
                        <Spacer></Spacer>
                        <Text color={"red"}>
                          {touched.category
                            ? (errors.category as string)
                            : undefined}
                        </Text>
                      </HStack>
                    </Flex>
                    <Select
                      // isDisabled={isDisabled}
                      value={values["category"]}
                      name="category"
                      onChange={(event) => {
                        setFieldValue("category", event);
                      }}
                      options={categoryOption}
                      placeholder="Select a Faq Category"
                    />
                  </FormControl>

                  <FormField
                    required={true}
                    //   disabled={isDisabled}
                    name="Question : "
                    fieldName="question"
                    placeholder="Enter Question"
                    type="text"
                    error={
                      touched.question ? (errors.question as string) : undefined
                    }
                  />

                  {/* <FormFieldTextArea
                    required={true}
                    // disabled={isDisabled}
                    name="Answer : "
                    fieldName="answer"
                    placeholder="Enter Answer"
                    type="text"
                    error={
                      touched.answer ? (errors.answer as string) : undefined
                    }
                  /> */}
                  <FormEditor
                    required={true}
                    name="Answer : "
                    fieldName="answer"
                    filedValue={values.answer}
                  />
                </DrawerBody>
                <DrawerFooter boxShadow="0px -1.76px 27.68px 0px #b0b0b033">
                  <Button
                    variant="outline"
                    mr={3}
                    onClick={() => {
                      onClose();
                      dispatch({ type: SET_MESSAGE_MASTER_FAQS });
                    }}
                    disabled={busy}
                    color="#424242"
                    fontSize={"sm"}
                    border="1px solid #EEE"
                    borderRadius="6px"
                  >
                    Close
                  </Button>
                  <Button
                    fontSize={"sm"}
                    color="#fff"
                    background="#cd30ff"
                    onClick={submitForm}
                    disabled={busy}
                  >
                    {faqs && faqs._id ? "Update" : "Save"}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Form>
        )}
      </Formik>
      {isViewOpen && (
        <FaqAddCategoryModal
          isOpen={isViewOpen}
          onClose={onViewClose}
          setAddCat={setAddCat}
        />
      )}
    </>
  );
};

export default FaqsEditDrawer;

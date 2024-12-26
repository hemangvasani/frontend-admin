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
import AddNewSubServiceModal from "../modals/AddNewSubServiceModal";
// import Select from "react-select";
import { MdModeEditOutline } from "react-icons/md";
import { FormField } from "../form/formField/FormField";
// import { useCategoriesMaster } from "../../store/servicemain/reducer";
import { FiPlus, FiUpload } from "react-icons/fi";
import { useOurServicesMaster } from "../../store/ourservices/reducer";
import { REQUEST_MASTER_OUR_SERVICES } from "../../store/ourservices/ourservicesActionTypes";
import {
  REQUEST_CREATE_MASTER_SUB_SERVICES,
  REQUEST_UPDATE_MASTER_SUB_SERVICES,
  SET_MASTER_SUB_SERVICES,
  SET_MESSAGE_MASTER_SUB_SERVICES,
} from "../../store/subservices/subservicesActionTypes";
import { useSubServicesMaster } from "../../store/subservices/reducer";
interface Props {
  servicemain?: any;
  isOpen: any;
  onClose: any;
}

const addSchema = Yup.object({
  service: Yup.mixed().required("Service is required"),
  name: Yup.string().required("Required"),
  description: Yup.string().required("Description is required"),
  // tagId: Yup.array()
  //   .required("Required")
  //   .of(
  //     Yup.object().shape({
  //       value: Yup.string().required(),
  //     })
  //   )
  //   .min(1, "Select at least one Category"),
});

const AddNewClientDrawer: React.FC<Props> = ({
  servicemain,
  isOpen,
  onClose,
}) => {
  console.log("Drawer servicemain:", servicemain);
  console.log("MASTER SERVICES:", useOurServicesMaster);
  const dispatch = useDispatch();
  const { masterSubServices, busy, message, success } = useSubServicesMaster();
  const { masterOurServices, busy: ourservicebusy } = useOurServicesMaster();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const toast = useToast();
  const [isDisabled, setDisabled] = useState(
    !!(servicemain && servicemain._id)
  );
  console.log("uhdewodhoei", servicemain);

  const serviceOptions = useMemo(
    () =>
      Array.isArray(masterOurServices.data)
        ? masterOurServices.data.map((service: any) => ({
            value: service._id,
            label: service.name,
          }))
        : [],
    [masterOurServices.data]
  );
  // const initialValue = useMemo(() => {
  //   if (servicemain) {
  //     return {
  //       service: servicemain?.service || "",
  //       name: servicemain?.title || "",
  //       description: servicemain.description ? servicemain.description : "",
  //       file: null,
  //     };
  //   }
  //   return {
  //     service: "",
  //     name: "",
  //     description: "",
  //     file: null,
  //   };
  // }, [servicemain]);

  const initialValue = useMemo(() => {
    if (servicemain) {
      if (servicemain.url) {
        setPreviewUrl(servicemain.url);
      }
      return {
        service: servicemain?.service?._id || servicemain.service || "",
        name: servicemain.title || servicemain.name || "",
        description: servicemain.description || "",
        file: null,
      };
    }
    const defaultService =
      serviceOptions.length > 0 ? serviceOptions[0].value : "";
    return {
      service: defaultService,
      // service: "",
      name: "",
      description: "",
      file: null,
    };
  }, [servicemain, serviceOptions]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 20 MB",
          status: "error",
          duration: 3000,
        });
        return;
      }

      setSelectedImage(file);
      setFieldValue("image", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (values: Record<string, any>) => {
    const formData = new FormData();
    formData.append("service", values.service);
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (values.image) {
      formData.append("file", values.image);
    }

    const payload = formData;
    console.log("payload", payload);
    if (servicemain) {
      const data = { payload, _id: servicemain._id };
      dispatch({
        type: REQUEST_UPDATE_MASTER_SUB_SERVICES,
        data,
        onSuccess: () => {
          dispatch({ type: SET_MASTER_SUB_SERVICES });
          toast({
            title: "Service Saved",
            status: "success",
            duration: 3000,
          });
          onClose();
          // setSubmitting(false);
        },
      });
    } else {
      dispatch({
        type: REQUEST_CREATE_MASTER_SUB_SERVICES,
        payload,
        onSuccess: () => {
          toast({
            title: "Service Saved",
            status: "success",
            duration: 3000,
          });
          onClose();
          // setSubmitting(false);
        },
      });
    }
  };

  const subservicess = useMemo(() => {
    return masterSubServices;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log("uiuhiu", subservicess);

  const {
    isOpen: isNewSubServiceOpen,
    onOpen: onDeleteOpen,
    onClose: onNewSubServiceClose,
  } = useDisclosure();

  const deletes = (value: any) => {
    // setTargetData(value);
    onDeleteOpen();
    // console.log(eventMaster);
  };

  useEffect(() => {
    if (!ourservicebusy && !(masterOurServices || []).length) {
      dispatch({ type: REQUEST_MASTER_OUR_SERVICES });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (servicemain) {
      const subServiceFromStore = masterSubServices?.data.find(
        (ml: any) => ml._id === servicemain._id
      );
      // if (subServiceFromStore !== servicemain) {
      //   toast({
      //     title: "Success.",
      //     description: "Category is updated.",
      //     status: "success",
      //     isClosable: true,
      //     position: "top-right",
      //   });
      //   onClose();
      // }
      if (
        subServiceFromStore &&
        (subServiceFromStore.name !== servicemain.name ||
          subServiceFromStore.description !== servicemain.description ||
          // subServiceFromStore.image !== servicemain.image ||
          subServiceFromStore.service._id !== servicemain.service._id)
      ) {
        toast({
          title: "Success.",
          description: "Sub Service is updated.",
          status: "success",
          isClosable: true,
          position: "top-right",
        });
        onClose();
      }
    } else if (subservicess?.data.length !== masterSubServices?.data.length) {
      // dispatch({ type: SET_MASTER_SUB_SERVICES });
      toast({
        title: "Success.",
        description: "Sub Service is created.",
        status: "success",
        isClosable: true,
        position: "top-right",
      });
      onClose();
    }
  }, [
    subservicess,
    masterSubServices,
    servicemain,
    onClose,
    toast,
    busy,
    success,
  ]);

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          {/* <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}> */}
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
                    dispatch({ type: SET_MESSAGE_MASTER_SUB_SERVICES });
                  }}
                  closeOnOverlayClick={!busy}
                >
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerHeader
                      backgroundColor="#E8D7EE"
                      alignItems={"stretch"}
                      borderBottom="1px solid #E0E0E0"
                    >
                      <Flex>
                        {get(servicemain, "title") || "Add Sub Services"}
                        <Spacer></Spacer>
                        {/* {servicemain && servicemain._id && (
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

                      {message && (
                        <Alert status="error">
                          <AlertTitle>{message}</AlertTitle>
                        </Alert>
                      )}
                    </DrawerHeader>
                    <DrawerBody>
                      <Flex
                        direction="column"
                        alignItems={"flex-start"}
                        justifyContent="flex-start"
                      >
                        <Button
                          variant="ghost"
                          color="#cb30ff"
                          leftIcon={
                            <Text>
                              <FiUpload />
                            </Text>
                          }
                          // onClick={() =>
                          //   document.getElementById("file-upload").click()
                          // }
                          border="1px dashed #CB30FF"
                          p={4}
                          borderRadius="md"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                        >
                          {previewUrl ? "Change Icon" : "Upload Icon"}
                        </Button>
                        <Input
                          id="file-upload"
                          type="file"
                          display="none"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls"
                          onChange={(e) => handleImageUpload(e, setFieldValue)}
                        />
                        {previewUrl && (
                          <Box mt={2}>
                            <img
                              src={previewUrl}
                              alt="Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}
                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types are .png, .jpg, .jpeg, .doc,
                          .docx, pdf, .xlsx, .xls Max file size supported is 20
                          MB
                        </Text>
                      </Flex>
                      {/* </DrawerBody>
              <DrawerBody> */}
                      <FormControl isRequired pb={3}>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          py={2}
                        >
                          <FormLabel>Main Services</FormLabel>
                          <Box
                            ml={2}
                            display="flex"
                            alignItems="center"
                            color="#cd30ff"
                            // variant="ghost"
                            onClick={() => {
                              deletes(values);
                            }}
                          >
                            <FiPlus style={{ marginRight: "10px" }} /> Add Main
                            Service
                          </Box>
                        </Flex>
                        <Select
                          name="service"
                          // value={values.servicemain}
                          // onChange={handleChange}
                          // onBlur={handleBlur}
                          // placeholder="Select main services"
                          flex={1}
                          value={values.service}
                          onChange={(e) => {
                            setFieldValue("service", e.target.value);
                          }}
                        >
                          {serviceOptions.map((option: any) => (
                            <option
                              value={option.value}
                              key={option.value}
                              color="#08021B"
                            >
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        {touched.service && errors.service && (
                          <Text color="red.500" fontSize="sm">
                            {errors.service as string}
                          </Text>
                        )}
                      </FormControl>
                      {/* </DrawerBody>
              <DrawerBody> */}
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          // disabled={isDisabled}
                          name="Title : "
                          fieldName="name"
                          placeholder="Enter Title"
                          type="text"
                          error={
                            touched.name ? (errors.name as string) : undefined
                          }
                        />
                      </FormControl>

                      {/* </DrawerBody>
              <DrawerBody> */}
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          // disabled={isDisabled}
                          name="Description : "
                          fieldName="description"
                          placeholder="Enter Description"
                          type="text"
                          error={
                            touched.description
                              ? (errors.description as string)
                              : undefined
                          }
                        />
                      </FormControl>
                    </DrawerBody>
                    <DrawerFooter
                      // backgroundColor={"gray.100"}
                      boxShadow="0px -1.76px 27.68px 0px #b0b0b033"
                    >
                      <Button
                        variant="outline"
                        mr={3}
                        border="1px solid #EEE"
                        borderRadius="6px"
                        onClick={() => {
                          onClose();
                          dispatch({ type: SET_MESSAGE_MASTER_SUB_SERVICES });
                        }}
                        disabled={busy}
                        color="#424242"
                        fontSize={"sm"}
                      >
                        Cancel
                      </Button>
                      <Button
                        fontSize={"sm"}
                        color="#fff"
                        // colorScheme="blue"
                        onClick={submitForm}
                        disabled={busy}
                        background="#cd30ff"
                        type="submit"
                      >
                        {servicemain && servicemain._id ? "Update" : "Save"}
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </Form>
            )}
          </Formik>
        </DrawerContent>
      </Drawer>
      {/* </Modal> */}
      {isNewSubServiceOpen && (
        <AddNewSubServiceModal
          setFieldValue={""}
          values={""}
          setForceRender={""}
          isOpen={isNewSubServiceOpen}
          onClose={onNewSubServiceClose}
        />
      )}
    </>
  );
};

export default AddNewClientDrawer;

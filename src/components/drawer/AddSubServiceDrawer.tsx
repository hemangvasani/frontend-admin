import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
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
  Input,
  Select,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import AddNewSubServiceModal from "../modals/AddNewSubServiceModal";
import { FormField } from "../form/formField/FormField";
import { FiPlus, FiUpload } from "react-icons/fi";
import { REQUEST_MASTER_OUR_SERVICES } from "../../store/ourservices/ourservicesActionTypes";
import { useOurServicesMaster } from "../../store/ourservices/reducer";
import { useSubServicesMaster } from "../../store/subservices/reducer";
import {
  REQUEST_CREATE_MASTER_SUB_SERVICES,
  REQUEST_MASTER_SUB_SERVICES,
  REQUEST_UPDATE_MASTER_SUB_SERVICES,
  SET_MESSAGE_MASTER_SUB_SERVICES,
} from "../../store/subservices/subservicesActionTypes";
import FormEditor from "../form/formField/FormEditor";
interface Props {
  servicemain?: any;
  isOpen: any;
  onClose: any;
}

const addSchema = Yup.object({
  service: Yup.mixed().required("Service is required"),
  // service: Yup.mixed().required("Service is required").nullable(),
  name: Yup.string().required("Required"),
  description: Yup.string().required("Description is required"),
});

const AddSubServiceDrawer: React.FC<Props> = ({
  servicemain,
  isOpen,
  onClose,
}) => {
  console.log("Drawer servicemain:", servicemain);
  const dispatch = useDispatch();
  const { masterSubServices, busy, message, success } = useSubServicesMaster();
  const { masterOurServices, busy: ourservicebusy } = useOurServicesMaster();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedIconImage, setSelectedIconImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUrlIcon, setPreviewUrlIcon] = useState<string | null>(null);
  const toast = useToast();
  const [isDisabled, setDisabled] = useState(
    !!(servicemain && servicemain._id)
  );

  const [forceRender, setForceRender] = useState(false);

  const serviceOptions = useMemo(
    () =>
      Array.isArray(masterOurServices.data)
        ? masterOurServices.data.map((service: any) => ({
            value: service._id,
            label: service.name,
          }))
        : [],
    [masterOurServices]
  );

  const initialValue = useMemo(() => {
    if (servicemain) {
      if (servicemain.url) {
        setPreviewUrl(servicemain.url);
      }
      if (servicemain.iconImage) {
        setPreviewUrlIcon(servicemain.iconImage);
      }
      return {
        service: servicemain?.service?._id || servicemain.service || "",
        name: servicemain.title || servicemain.name || "",
        description: servicemain.description || "",
        file: null,
      };
    }
    console.log(
      "masterOurServices.dataaaaaaaaaaaaaa===========>",
      masterOurServices
    );

    const defaultService =
      masterOurServices?.data?.length > 0 ? masterOurServices.data[0]._id : "";
    console.log("defaultService========================>", defaultService);

    // const defaultService = masterOurServices?.data?.[0]?._id || "";
    return {
      service: defaultService,
      name: "",
      description: "",
      file: null,
      icon_image: null,
    };
  }, [servicemain, serviceOptions, masterOurServices, forceRender]);

  // const handleImageUpload = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   setFieldValue: (field: string, value: any) => void,
  //   type: "image" | "icon_image"
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     if (file.size > 20 * 1024 * 1024) {
  //       toast({
  //         title: "File too large",
  //         description: "Maximum file size is 20 MB",
  //         status: "error",
  //         duration: 3000,
  //       });
  //       return;
  //     }

  //     if (type === "image") {
  //       setSelectedImage(file);
  //       setFieldValue("image", file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setPreviewUrl(reader.result as string);
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       setSelectedIconImage(file);
  //       setFieldValue("icon_image", file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setPreviewUrlIcon(reader.result as string);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    type: "image" | "icon_image"
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

      if (type === "image") {
        setSelectedImage(file);
        setFieldValue("image", file);
        setFieldValue("existingUrl", null); // Clear existing image
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedIconImage(file);
        setFieldValue("icon_image", file);
        setFieldValue("existingIconImage", null); // Clear existing icon
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrlIcon(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
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
    if (values.icon_image) {
      formData.append("icon_image", values.icon_image);
    }

    const payload = formData;
    console.log("payload", values);
    if (servicemain) {
      const data = { payload, _id: servicemain._id };
      dispatch({
        type: REQUEST_UPDATE_MASTER_SUB_SERVICES,
        data,
        onSuccess: () => {
          dispatch({ type: REQUEST_MASTER_SUB_SERVICES });
          toast({
            title: "Service Saved",
            status: "success",
            duration: 3000,
          });
        },
      });

      onClose();
    } else {
      dispatch({
        type: REQUEST_CREATE_MASTER_SUB_SERVICES,
        payload,
        onSuccess: () => {
          dispatch({ type: REQUEST_MASTER_SUB_SERVICES });
          toast({
            title: "Service Saved",
            status: "success",
            duration: 3000,
          });
          onClose();
        },
      });
    }
  };

  const subservicess = useMemo(() => {
    return masterSubServices;
  }, []);

  const {
    isOpen: isNewSubServiceOpen,
    onOpen: onDeleteOpen,
    onClose: onNewSubServiceClose,
  } = useDisclosure();

  const deletes = (value: any) => {
    onDeleteOpen();
  };

  useEffect(() => {
    if (!ourservicebusy && !(masterOurServices || []).length) {
      dispatch({ type: REQUEST_MASTER_OUR_SERVICES });
    }
  }, [forceRender]);

  useEffect(() => {
    if (servicemain) {
      const subServiceFromStore = masterSubServices?.data.find(
        (ml: any) => ml._id === servicemain._id
      );

      if (
        subServiceFromStore &&
        (subServiceFromStore.name !== servicemain.name ||
          subServiceFromStore.description !== servicemain.description ||
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
    // masterOurServices,
  ]);

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <Formik
            initialValues={initialValue}
            validationSchema={addSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              setFieldValue,
              errors,
              touched,
              submitForm,
              setValues,
            }) => {
              console.log("values ----------- ansha", values);
              return (
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
                          {servicemain ? "Edit service " : "Add Services"}
                          <Spacer></Spacer>
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
                            border="1px dashed #CB30FF"
                            p={4}
                            borderRadius="md"
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                          >
                            {previewUrl
                              ? "Change Title Image"
                              : "Upload Title Image"}
                          </Button>
                          <Input
                            id="file-upload"
                            type="file"
                            display="none"
                            accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls"
                            onChange={(e) =>
                              handleImageUpload(e, setFieldValue, "image")
                            }
                          />
                          {previewUrl && (
                            <Box mt={2}>
                              <img
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                  maxWidth: "200px",
                                  maxHeight: "200px",
                                }}
                              />
                            </Box>
                          )}
                          {/* {(previewUrl || values.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={previewUrl || values.existingUrl}
                              alt="Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )} */}
                          <Text fontSize="sm" color="gray.500" mt={2}>
                            Supported file types are .png, .jpg, .jpeg, .doc,
                            .docx, pdf, .xlsx, .xls Max file size supported is
                            20 MB
                          </Text>
                        </Flex>
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
                            border="1px dashed #CB30FF"
                            p={4}
                            borderRadius="md"
                            onClick={() =>
                              document.getElementById("icon-upload")?.click()
                            }
                          >
                            {previewUrlIcon ? "Change Icon" : "Upload Icon"}
                          </Button>
                          <Input
                            id="icon-upload"
                            type="file"
                            display="none"
                            accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls"
                            onChange={(e) =>
                              handleImageUpload(e, setFieldValue, "icon_image")
                            }
                          />
                          {previewUrlIcon && (
                            <Box mt={2}>
                              <img
                                src={previewUrlIcon}
                                alt="Preview"
                                style={{
                                  maxWidth: "200px",
                                  maxHeight: "200px",
                                }}
                              />
                            </Box>
                          )}
                          {/* {(previewUrlIcon || values.existingIconImage) && (
                          <Box mt={2}>
                            <img
                              src={previewUrlIcon || values.existingIconImage}
                              alt="Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )} */}
                          <Text fontSize="sm" color="gray.500" mt={2}>
                            Supported file types are .png, .jpg, .jpeg, .doc,
                            .docx, pdf, .xlsx, .xls Max file size supported is
                            20 MB
                          </Text>
                        </Flex>

                        <FormControl isRequired pb={3}>
                          <Flex
                            alignItems="center"
                            justifyContent="space-between"
                            py={2}
                          >
                            <FormLabel>Main Service</FormLabel>
                            <Box
                              ml={2}
                              display="flex"
                              alignItems="center"
                              color="#cd30ff"
                              onClick={() => {
                                deletes(values);
                              }}
                            >
                              <FiPlus style={{ marginRight: "10px" }} /> Add
                              Main Service
                            </Box>
                          </Flex>
                          <Select
                            name="service"
                            flex={1}
                            value={values.service}
                            // onChange={(e) => {
                            //   setFieldValue("service", e.target.value);
                            // }}
                            onChange={(e) => {
                              setFieldValue("service", e.target.value);
                            }}
                          >
                            {/* <option value="">Select a service</option> */}
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

                        <FormControl pb={3}>
                          <FormField
                            required={true}
                            name="Title : "
                            fieldName="name"
                            placeholder="Enter Title"
                            type="text"
                            error={
                              touched.name ? (errors.name as string) : undefined
                            }
                          />
                        </FormControl>

                        <FormEditor
                          required={true}
                          name="Description : "
                          fieldName="description"
                          filedValue={values.description}
                        />
                      </DrawerBody>
                      <DrawerFooter boxShadow="0px -1.76px 27.68px 0px #b0b0b033">
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
                  {isNewSubServiceOpen && (
                    <AddNewSubServiceModal
                      setFieldValue={setValues}
                      values={values}
                      setForceRender={setForceRender}
                      isOpen={isNewSubServiceOpen}
                      onClose={onNewSubServiceClose}
                    />
                  )}
                </Form>
              );
            }}
          </Formik>
        </DrawerContent>
      </Drawer>

      {/* {isNewSubServiceOpen && (
        <AddNewSubServiceModal
          setForceRender={setForceRender}
          isOpen={isNewSubServiceOpen}
          onClose={onNewSubServiceClose}
        />
      )} */}
    </>
  );
};

export default AddSubServiceDrawer;

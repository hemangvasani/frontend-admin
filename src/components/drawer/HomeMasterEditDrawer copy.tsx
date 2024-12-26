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
import { get } from "lodash";
import { FormField } from "../form/formField/FormField";
import {
  REQUEST_CREATE_MASTER_HOME,
  REQUEST_UPDATE_MASTER_HOME,
  SET_MESSAGE_MASTER_HOME,
} from "../../store/home/homeActionTypes";
import { useHomeMaster } from "../../store/home/reducer";
import { FiPlus, FiUpload } from "react-icons/fi";
import AddNewHomeModal from "../modals/AddNewHomeModal";
import { useCategoriesMaster } from "../../store/category/reducer";
import { REQUEST_MASTER_CATEGORIES } from "../../store/category/categoryActionTypes";
import { Descriptions } from "antd";

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

const homeMasterValidationSchema = Yup.object().shape({
  image: Yup.mixed()
    .test("fileSize", "File too large", (value) => {
      if (!value) return true;
      return value instanceof File && value.size <= 20 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value) return true;
      const supportedTypes = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      return value instanceof File && supportedTypes.includes(value.type);
    }),

  service: Yup.string().required("Please select a category"),

  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),

  tags: Yup.string()
    .required("Tags are required")
    .test("multiple-tags", "Invalid tags", function (value) {
      if (!value) return true;

      const tags = value.split(/\s+/).filter((tag) => tag.trim() !== "");

      return tags.every((tag) => tag.length >= 2 && tag.length <= 20);
    }),

  description2: Yup.string()
    .trim()
    .required("Description is required")
    .max(500, "Additional description cannot exceed 500 characters"),

  title: Yup.string()
    .trim()
    .required("Key feature title is required")
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),

  keydesc: Yup.string()
    .trim()
    .required("Key feature description is required")
    .min(2, "description must be at least 2 characters")
    .max(100, "description cannot exceed 100 characters"),
});

interface Props {
  category?: any;
  isOpen: any;
  onClose: any;
}

const HomeMasterEditDrawer: React.FC<Props> = ({
  category,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [keyFeatures, setKeyFeatures] = useState<any[]>(() => {
    if (category?.keyFeatures) {
      return category.keyFeatures?.map((feature: any) => ({
        title: feature.title,
        keydesc: feature.keydesc,
      }));
    } else {
      return [];
    }
  });

  const handleAddKeyFeature = (values: any, setFieldValue: any) => {
    if (values.title && values.keydesc) {
      const newFeature = {
        heading: values.title,
        paragraph: values.keydesc,
      };

      const exists = keyFeatures.some(
        (feature) =>
          feature.heading === newFeature.heading &&
          feature.paragraph === newFeature.paragraph
      );

      if (!exists) {
        setKeyFeatures((prevFeatures) => [...prevFeatures, newFeature]);
      }

      setFieldValue("title", "");
      setFieldValue("keydesc", "");
    } else {
      toast({
        title: "Error",
        description: "Please fill in both title and description",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const { masterHome, busy, message } = useHomeMaster();
  const { masterCategory, busy: catbusy } = useCategoriesMaster();
  console.log("category", category);

  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const serviceOptions = useMemo(
    () =>
      Array.isArray(masterCategory.data)
        ? masterCategory.data.map((service: any) => ({
            value: service._id,
            label: service.name,
            selected: service._id === (category?.category?._id || ""),
          }))
        : [],
    [masterCategory.data, category]
  );

  console.log("masterrrrrrrrrrrrrrrrrrrrr", masterCategory);

  console.log(previewUrl, "huiiiiiiiiiiiiiiiiiiiiii");

  const initialValue = useMemo(() => {
    if (category) {
      if (category?.url) {
        setPreviewUrl(category?.url);
      }

      return {
        name: category?.name || "",
        service: category?.category?._id || category?.category || "",
        description: category?.description || "",
        description2: category?.description2 || "",
        tstatement: category?.tstatement || "",
        tags: category.tags?.split(" ").join(" ") || "",
        keyFeatures: keyFeatures,
      };
    }
    const defaultService =
      serviceOptions.length > 0 ? serviceOptions[0].value : "";
    return {
      image: null,

      service: defaultService,
      name: "",
      description: "",
      tags: "",
      description2: "",
      tstatement: "",
      title: "",
      keydesc: "",
    };
  }, [category, serviceOptions]);

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

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: Record<string, any>) => {
    const tags = values.tags
      ? values.tags.split(/\s+/).filter((tag: string) => tag.trim() !== "")
      : [];

    let payload: Record<string, any> = {
      category: values.service,
      product_name: values.name,
      heading_sub: values.description,
      transformation_statement: values.tstatement,
      tags: tags,
      heading_main: values.description2,

      key_features: keyFeatures,
      file: values.image,
    };

    const formData = jsonToFormData(payload);

    console.log("payloaddddddddddd", payload);

    if (category) {
      const data = { payload: formData, _id: category._id };
      dispatch({
        type: REQUEST_UPDATE_MASTER_HOME,
        data,
        onSuccess: () => {
          toast({
            title: "Product Saved",
            status: "success",
            duration: 3000,
            onCloseComplete: () => {},
          });
          onClose();
        },
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      dispatch({
        type: REQUEST_CREATE_MASTER_HOME,
        payload: formData,
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };
  const categoriess = useMemo(() => {
    return masterCategory;
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
    if (!catbusy && !(masterCategory || []).length) {
      dispatch({ type: REQUEST_MASTER_CATEGORIES });
    }
  }, []);

  useEffect(() => {
    if (category) {
      const categoryFromStore = masterHome.find(
        (ml: any) => ml._id === category._id
      );

      console.log("category from store ", categoryFromStore);
      if (
        categoryFromStore &&
        // categoryFromStore.name !== category.name ||
        (categoryFromStore.heading_sub !== category.description ||
          // categoryFromStore.image !== category.image ||
          categoryFromStore.category._id !== category.category._id)
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
    } else if (categoriess?.length !== masterCategory?.length) {
      toast({
        title: "Success.",
        description: "Category is updated.",
        status: "success",
        isClosable: true,
        position: "top-right",
      });
      onClose();
    }
  }, [masterHome, category, onClose, toast, categoriess, busy]);

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <Formik initialValues={initialValue} onSubmit={onSubmit}>
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
                    dispatch({ type: SET_MESSAGE_MASTER_HOME });
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
                        Add Products
                        <Spacer />
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
                          leftIcon={<FiUpload />}
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
                              style={{ maxWidth: "30px", maxHeight: "30px" }}
                            />
                          </Box>
                        )}
                        {touched.image && errors.image && (
                          <Text color="red.500" fontSize="sm">
                            {errors.image as string}
                          </Text>
                        )}
                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types are .png, .jpg, .jpeg, .doc,
                          .docx, pdf, .xlsx, .xls Max file size supported is 20
                          MB
                        </Text>
                      </Flex>

                      <FormControl isRequired pb={3} mt={3}>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          py={2}
                        >
                          <FormLabel>Category</FormLabel>
                          <Box
                            ml={2}
                            display="flex"
                            alignItems="center"
                            color="#cd30ff"
                            onClick={() => {
                              deletes(values);
                            }}
                          >
                            <FiPlus style={{ marginRight: "10px" }} /> Add New
                            Category
                          </Box>
                        </Flex>

                        <Select
                          name="service"
                          placeholder="Select category"
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

                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        gap="14px"
                      >
                        <FormControl pb={3}>
                          <FormField
                            required={true}
                            name="Name"
                            fieldName="name"
                            placeholder="Enter name"
                            type="text"
                            error={undefined}
                          />
                          {touched.name && errors.name && (
                            <Text color="red.500" fontSize="sm"></Text>
                          )}
                        </FormControl>

                        <FormControl pb={3}>
                          <FormField
                            required={true}
                            name="Heading sub"
                            fieldName="description"
                            placeholder="Enter description"
                            type="text"
                            error={undefined}
                          />
                          {touched.description && errors.description && (
                            <Text color="red.500" fontSize="sm"></Text>
                          )}
                        </FormControl>
                      </Flex>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Tags"
                          fieldName="tags"
                          placeholder="Enter tags"
                          type="text"
                          error={undefined}
                        />
                      </FormControl>

                      <FormControl pb={3}>
                        <FormField
                          name="Heading main"
                          fieldName="description2"
                          placeholder="Enter additional description"
                          type="text"
                          error={undefined}
                          required={false}
                        />
                        {/* {touched.description2 && errors.description2 && (
                          <Text color="red.500" fontSize="sm">
                            {errors.description2}
                          </Text>
                        )} */}
                      </FormControl>

                      <FormControl pb={3}>
                        <FormField
                          name="Statement"
                          fieldName="tstatement"
                          placeholder="Enter statement"
                          type="text"
                          error={undefined}
                          required={false}
                        />
                        {/* {touched.description2 && errors.description2 && (
                          <Text color="red.500" fontSize="sm">
                            {errors.description2}
                          </Text>
                        )} */}
                      </FormControl>

                      <FormLabel>Key Features</FormLabel>

                      <FormControl pb={3}>
                        <FormLabel htmlFor="title">Title</FormLabel>
                        <Field
                          as={Input}
                          id="title"
                          name="title"
                          value={values.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter title"
                        />
                      </FormControl>

                      <FormControl pb={3}>
                        <FormLabel htmlFor="keydesc">Description</FormLabel>
                        <Field
                          as={Input}
                          id="keydesc"
                          name="keydesc"
                          value={values.keydesc}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter Description"
                        />
                      </FormControl>

                      <Box
                        ml={2}
                        mb={4}
                        display="flex"
                        alignItems="center"
                        color="#cd30ff"
                        cursor="pointer"
                        onClick={() => {
                          handleAddKeyFeature(values, setFieldValue);
                        }}
                      >
                        <FiPlus style={{ marginRight: "10px" }} /> Add Key
                        Features
                      </Box>

                      <HStack
                        wrap="wrap"
                        spacing="10px"
                        alignItems="flex-start"
                      >
                        {keyFeatures.map((feature, index) => (
                          <Box
                            width="fit-content"
                            key={index}
                            p={4}
                            border="1px solid #ddd"
                            borderRadius="md"
                            display="flex"
                            gap="2px"
                            mb={4}
                          >
                            <Text fontWeight="bold">
                              {feature.heading || feature.title} :
                            </Text>
                            <Text>{feature.paragraph || feature.keydesc}</Text>
                          </Box>
                        ))}
                      </HStack>
                    </DrawerBody>
                    <DrawerFooter boxShadow="0px -1.76px 27.68px 0px #b0b0b033">
                      <Button
                        variant="outline"
                        mr={3}
                        border="1px solid #EEE"
                        borderRadius="6px"
                        onClick={() => {
                          onClose();
                          dispatch({ type: SET_MESSAGE_MASTER_HOME });
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
                        {category && category._id ? "Update" : "Save"}
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </Form>
            )}
          </Formik>
        </DrawerContent>
      </Drawer>

      {isNewSubServiceOpen && (
        <AddNewHomeModal
          isOpen={isNewSubServiceOpen}
          onClose={onNewSubServiceClose}
        />
      )}
    </>
  );
};

export default HomeMasterEditDrawer;

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Spin } from "antd";
import axios from "axios";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useRef, useState } from "react";
import { FiPlus, FiUpload } from "react-icons/fi";
interface FormValues {
  heroHeading: string;
  heroDescription: string;
  msgHeading: string;
  msgDescription: string;
  otherMainHeading: string;
  otherSubHeading: string;
  bgImage: string;
}
interface SolutionFeature {
  mainHeading: string;
  subHeading: string;
}
interface ImagePreview {
  file: File | null;
  preview: string;
}

const validationSchema = Yup.object().shape({
  heroHeading: Yup.string()
    .required("Hero heading is required")
    .min(5, "Heading must be at least 5 characters")
    .max(100, "Heading must not exceed 100 characters"),

  heroDescription: Yup.string()
    .required("Hero description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  msgHeading: Yup.string()
    .required("Message heading is required")
    .min(5, "Heading must be at least 5 characters")
    .max(100, "Heading must not exceed 100 characters"),

  msgDescription: Yup.string()
    .required("Message description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  bgImage: Yup.string().required("Background image is required"),

  otherMainHeading: Yup.string()
    .min(5, "Main heading must be at least 5 characters")
    .max(100, "Main heading must not exceed 100 characters"),

  otherSubHeading: Yup.string()
    .min(5, "Sub heading must be at least 5 characters")
    .max(200, "Sub heading must not exceed 200 characters"),
});

const HomeMasterFormTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedImageId, setUploadedImageId] = useState("");
  const [imagePreview, setImagePreview] = useState<ImagePreview>({
    file: null,
    preview: "",
  });
  const [addSolutionOthers, setAddSolutionOthers] = useState<SolutionFeature[]>(
    []
  );
  const [editState, setEditState] = useState<{
    section: string | null;
    index: number | null;
  }>({
    section: null,
    index: null,
  });
  const toast = useToast();
  const formikRef = useRef<any>(null);
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should not exceed 20MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview({
      file,
      preview: previewUrl,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/upload`,
        formData
      );
      const imageId = response.data.data._id;
      setUploadedImageId(imageId);
      setFieldValue("bgImage", imageId);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    // const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        name: "home_page_2",
        components: [
          {
            name: "hero_section",
            mainHeading: values.heroHeading,
            subHeading: values.heroDescription,
            CTA_text: "Get Started",
            order: 0,
          },
          {
            name: "msg_section",
            bgImage: uploadedImageId,
            mainHeading: values.msgHeading,
            subHeading: values.msgDescription,
            CTA_text: "Check Our Products",
            order: 1,
            others: addSolutionOthers,
          },
        ],
      };

      await axios.post(`${process.env.REACT_APP_BASE_URL}/pages`, payload);

      toast({
        title: "Success",
        description: "Page updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetForm();
      setImagePreview({ file: null, preview: "" });
      setUploadedImageId("");
      setAddSolutionOthers([]);
      setEditState({ section: null, index: null });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to update page",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (
    index: number,
    values: any,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const item = addSolutionOthers[index];
    setFieldValue("otherMainHeading", item.mainHeading);
    setFieldValue("otherSubHeading", item.subHeading);
    setEditState({ section: "solution", index });
  };
  const handleAddOthers = (
    values: any,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (values.otherMainHeading && values.otherSubHeading) {
      const newOther = {
        mainHeading: values.otherMainHeading,
        subHeading: values.otherSubHeading,
      };

      if (editState.section === "solution" && editState.index !== null) {
        const updatedOthers = [...addSolutionOthers];
        updatedOthers[editState.index] = newOther;
        setAddSolutionOthers(updatedOthers);
        setEditState({ section: null, index: null });
      } else if (addSolutionOthers.length < 2) {
        setAddSolutionOthers((prev) => [...prev, newOther]);
      } else {
        toast({
          title: "Maximum limit reached",
          description: "You can only add up to 2 solution features",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setFieldValue("otherMainHeading", "");
      setFieldValue("otherSubHeading", "");
    } else {
      toast({
        title: "Required fields",
        description: "Both heading and title are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div
      style={{
        width: "92vw",
        maxWidth: "92vw",
        height: "86vh",
        top: "6vh",
        left: "4vw",
        position: "relative",
      }}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <Formik
          initialValues={{
            heroHeading: "",
            heroDescription: "",
            msgHeading: "",
            msgDescription: "",
            otherMainHeading: "",
            otherSubHeading: "",
            bgImage: "",
          }}
          innerRef={formikRef}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box width="100%" overflowY="auto" flex="1">
                {/* Hero Section */}
                <Box mb={5}>
                  <Heading size="md" mb={4}>
                    Hero Section
                  </Heading>
                  <Flex flexDir="column">
                    <Button
                      variant="ghost"
                      color="#cb30ff"
                      leftIcon={<FiUpload />}
                      border="1px dashed #CB30FF"
                      p={4}
                      mb={4}
                      onClick={() =>
                        document.getElementById("bgImage-upload")?.click()
                      }
                      width="fit-content"
                    >
                      {imagePreview.preview
                        ? "Change Background Image"
                        : "Upload Background Image"}
                    </Button>
                    <Input
                      id="bgImage-upload"
                      type="file"
                      display="none"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setFieldValue)}
                    />
                    {imagePreview.preview && (
                      <Box mt={2} mb={4}>
                        <img
                          src={imagePreview.preview}
                          alt="Background Preview"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    )}

                    <FormControl>
                      <FormLabel>Heading</FormLabel>
                      <Field
                        as={Input}
                        name="heroHeading"
                        placeholder="We don't just write code, we create solutions"
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Description</FormLabel>
                      <Field
                        as={Textarea}
                        name="heroDescription"
                        resize="none"
                        placeholder="Unlock the Power of Data to Drive Your Local Business Forward"
                      />
                    </FormControl>
                  </Flex>
                </Box>

                {/* Message Section */}
                <Box mb={5}>
                  <Heading size="md" mb={4}>
                    Section 2
                  </Heading>
                  <Flex flexDir="column">
                    <FormControl>
                      <FormLabel>Heading</FormLabel>
                      <Field
                        as={Input}
                        name="msgHeading"
                        placeholder="Simplify, Create, Innovate"
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Description</FormLabel>
                      <Field
                        as={Textarea}
                        name="msgDescription"
                        resize="none"
                      />
                    </FormControl>
                  </Flex>
                </Box>

                {/* Solution Features */}
                <Box mb={5}>
                  <Heading size="md" mb={4}>
                    Section 3
                  </Heading>
                  <Flex flexDir="column" width="50%">
                    <FormControl>
                      <FormLabel>Main Heading</FormLabel>
                      <Field
                        as={Input}
                        name="otherMainHeading"
                        placeholder="Enter main heading"
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Sub Heading</FormLabel>
                      <Field
                        as={Input}
                        name="otherSubHeading"
                        placeholder="Enter sub heading"
                      />
                    </FormControl>
                    <Button
                      leftIcon={<FiPlus />}
                      color="#cb30ff"
                      bgColor="transparent"
                      _hover={{ bgColor: "transparent" }}
                      mt={4}
                      onClick={() => handleAddOthers(values, setFieldValue)}
                      isDisabled={
                        addSolutionOthers.length >= 2 && !editState.section
                      }
                      width="fit-content"
                    >
                      {editState.section === "solution" &&
                      editState.index !== null
                        ? "Update"
                        : "Add"}{" "}
                      New Category
                    </Button>

                    <Flex wrap="wrap" gap="10px" width="100%" mt={4}>
                      {addSolutionOthers.map((other, index) => (
                        <Box
                          key={index}
                          p={4}
                          border="1px solid #ddd"
                          borderRadius="md"
                          mb={4}
                          cursor="pointer"
                          onClick={() =>
                            handleEdit(index, values, setFieldValue)
                          }
                          position="relative"
                        >
                          <Text fontWeight="bold">{other.mainHeading}:</Text>
                          <Text>{other.subHeading}</Text>
                          {editState.section === "solution" &&
                            editState.index === index && (
                              <Box
                                position="absolute"
                                top="-8px"
                                right="-8px"
                                bg="purple.500"
                                color="white"
                                borderRadius="full"
                                p="1"
                                fontSize="xs"
                              >
                                Editing
                              </Box>
                            )}
                        </Box>
                      ))}
                    </Flex>
                  </Flex>
                </Box>

                {/* Submit Buttons */}
                <Box>
                  <Button
                    variant="outline"
                    mr={3}
                    border="1px solid #EEE"
                    color="#424242"
                  >
                    Cancel
                  </Button>
                  <Button color="#fff" background="#cd30ff" type="submit">
                    Save
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default HomeMasterFormTable;

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Grid,
  Heading,
  Text,
  Flex,
  DrawerBody,
  useToast,
} from "@chakra-ui/react";
import { Spin, Table } from "antd";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiUpload } from "react-icons/fi";

interface SolutionFeature {
  heading: string;
  title: string;
}
const HomeMasterFormTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
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
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.size > 20 * 1024 * 1024) return;
    // setImages((prev) => ({
    //   ...prev,
    //   [imageType]: {
    //     file,
    //     preview: URL.createObjectURL(file),
    //   },
    // }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/upload`,
        formData
      );
      // setUploadedImages((prev: any) => ({
      //   ...prev,
      //   [imageType]: response.data.data._id,
      // }));
      console.log("uploadedImages:", response.data.data._id);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleAddOthers = (
    section: string,
    values: any,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (values[`${section}OtherHeading`] && values[`${section}OtherTitle`]) {
      const newOther = {
        heading: values[`${section}OtherHeading`],
        title: values[`${section}OtherTitle`],
      };

      if (editState.section === section && editState.index !== null) {
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

      // Clear form fields
      setFieldValue(`${section}OtherHeading`, "");
      setFieldValue(`${section}OtherTitle`, "");
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
  const handleEdit = (
    index: number,
    section: string,
    values: any,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const item = addSolutionOthers[index];
    setFieldValue(`${section}OtherHeading`, item.heading);
    setFieldValue(`${section}OtherTitle`, item.title);
    setEditState({ section, index });
  };
  return (
    <div
      style={{
        width: "92vw",
        maxWidth: "92vw",
        height: "86vh",
        top: "6vh ",
        left: "4vw",
        position: "relative",
      }}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <Formik
          initialValues={{ heading: "", description: "" }}
          validationSchema={null}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue, errors, touched, submitForm }) => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box
                width={"100%"}
                overflowY="auto"
                flex="1"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "4px",
                    display: "none",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    display: "none",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "2px",
                    display: "none",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                    display: "none",
                  },
                }}
              >
                <Box mb={5}>
                  <Heading size="md" mb={4}>
                    Hero Section
                  </Heading>
                  <Flex flexDir={"column"}>
                    <Flex
                      direction="column"
                      alignItems="flex-start"
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
                          document.getElementById("main-icon-upload")?.click()
                        }
                      >
                        Upload Img
                        {/* {images.mainIcon.preview ||
                          images.mainIcon.existingUrl
                            ? "Change Client Image"
                            : "Upload Client Image"} */}
                      </Button>

                      <Input
                        id="main-icon-upload"
                        type="file"
                        display="none"
                        accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                        onChange={(e) =>
                          handleImageUpload(e, "mainIcon", setFieldValue)
                        }
                      />

                      {/* {(images.mainIcon.preview ||
                          images.mainIcon.existingUrl) && ( */}
                      {/* <Box mt={2}>
                          <img
                            src="https:
                            
                            
                            
                            alt="Main Preview"
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                          />
                        </Box> */}
                      {/* )} */}

                      <Text fontSize="sm" color="gray.500" mt={2}>
                        Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                        .pdf, .xlsx, .xls Max file size: 20 MB
                      </Text>
                    </Flex>
                    <FormControl>
                      <FormLabel>Heading</FormLabel>
                      <Input placeholder="We don't just write code, we create solutions" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        resize={"none"}
                        placeholder="Unlock the Power of Data to Drive Your Local Business Forward"
                      />
                    </FormControl>
                  </Flex>
                </Box>

                {/* Section 2 */}
                <Box mb={5}>
                  <Heading size="md" mb={2}>
                    Section 2
                  </Heading>
                  <Flex flexDir={"column"}>
                    <FormControl>
                      <FormLabel>Heading</FormLabel>
                      <Input placeholder="Simplify, Create, Innovate" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        resize={"none"}
                        placeholder="Unlock Next-Level Video Editing with Our Revolutionary Tools, Transform your creative workflow with our cross-platform solutions."
                      />
                    </FormControl>
                  </Flex>
                </Box>

                <Box>
                  <Heading size="md" mb={4}>
                    Section 3
                  </Heading>
                  <Flex
                    flexDir={"column"}
                    // templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    // gap={6}
                    // mb={2}
                    width="50%"
                  >
                    <FormControl pb={3}>
                      <FormLabel htmlFor="addSolutionOtherHeading">
                        Title
                      </FormLabel>
                      <Field
                        as={Input}
                        id="addSolutionOtherHeading"
                        name="addSolutionOtherHeading"
                        placeholder="Enter heading"
                        isDisabled={
                          addSolutionOthers.length >= 2 && !editState.section
                        }
                      />
                    </FormControl>

                    <FormControl pb={3}>
                      <FormLabel htmlFor="addSolutionOtherTitle">
                        Description
                      </FormLabel>
                      <Field
                        as={Input}
                        id="addSolutionOtherTitle"
                        name="addSolutionOtherTitle"
                        placeholder="Enter title"
                        isDisabled={
                          addSolutionOthers.length >= 2 && !editState.section
                        }
                      />
                    </FormControl>

                    <Button
                      leftIcon={<FiPlus />}
                      // colorScheme="purple"
                      // variant="outline"
                      color="#cb30ff"
                      bgColor="transparent"
                      _hover={{ bgColor: "transparent" }}
                      onClick={() =>
                        handleAddOthers("addSolution", values, setFieldValue)
                      }
                      isDisabled={
                        addSolutionOthers.length >= 2 && !editState.section
                      }
                      width="fit-content"
                    >
                      {editState.section === "addSolution" &&
                      editState.index !== null
                        ? "Update"
                        : "Add"}{" "}
                      Solution Features
                      {addSolutionOthers.length >= 2 &&
                        editState.section !== "addSolution" && (
                          <Text fontSize="sm" color="red.500" ml={2}>
                            (Limit reached)
                          </Text>
                        )}
                    </Button>

                    <Flex wrap="wrap" gap="10px" width="100%">
                      {addSolutionOthers.map((other, index) => (
                        <Box
                          key={index}
                          p={4}
                          border="1px solid #ddd"
                          borderRadius="md"
                          display="flex"
                          gap="2px"
                          mb={4}
                          cursor="pointer"
                          onClick={() =>
                            handleEdit(
                              index,
                              "addSolution",
                              values,
                              setFieldValue
                            )
                          }
                          position="relative"
                        >
                          <Text fontWeight="bold">{other.heading}: </Text>
                          <Text>{other.title}</Text>
                          {editState.section === "addSolution" &&
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
                    <Box>
                      <Button
                        variant="outline"
                        mr={3}
                        border="1px solid #EEE"
                        borderRadius="6px"
                        color="#424242"
                        fontSize="md"
                      >
                        Cancel
                      </Button>

                      <Button
                        fontSize="md"
                        color="#fff"
                        onClick={submitForm}
                        // disabled={busy}
                        background="#cd30ff"
                        type="submit"
                      >
                        Add
                      </Button>
                    </Box>
                  </Flex>
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

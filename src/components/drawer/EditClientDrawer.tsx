import {
  Box,
  Button,
  Divider,
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
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiUpload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { get } from "lodash";
import {
  REQUEST_CREATE_MASTER_OUR_CLIENTS,
  REQUEST_CREATE_MASTER_OUR_CLIENTS_STORY,
  REQUEST_MASTER_OUR_CLIENTS,
  REQUEST_UPDATE_MASTER_OUR_CLIENTS,
  SET_MESSAGE_MASTER_OUR_CLIENTS,
} from "../../store/ourclients/ourclientssActionTypes";
import { useOurClientsMaster } from "../../store/ourclients/reducer";
import { FormField } from "../form/formField/FormField";

interface Props {
  clientmain?: any;
  isOpen: boolean;
  onClose: () => void;
}
interface EditState {
  section: string | null;
  index: number | null;
}
interface ImageState {
  file: File | null;
  preview: string | null;
  existingUrl?: string;
}

const addClientSchema = Yup.object({
  client: Yup.string().required("Client name is required"),
  industry: Yup.string().required("Industry is required"),
  projecttitle: Yup.string().required("Project title is required"),
  tags: Yup.string().required("Tags are required"),
});
const addClientStorySchema = Yup.object({
  // Hero Section
  herosubheading: Yup.string().required("Hero tag is required"),
  heroheading: Yup.string().required("Hero heading is required"),
  heroctatext: Yup.string().required("Hero CTA text is required"),

  // About Section
  aboutheading: Yup.string().required("About heading is required"),
  aboutdescription: Yup.string().required("About description is required"),

  // Problem Statement
  problemheading: Yup.string().required("Problem heading is required"),
  problemdescription: Yup.string().required("Problem description is required"),

  // Our Solution
  title: Yup.string(),
  keydesc: Yup.string(),
  solutionheading: Yup.string().required("our solution heading is required"),
  solutiondescription: Yup.string().required(
    "our solution description is required"
  ),

  // Implementation Process
  processheading: Yup.string().required("Process heading is required"),
  processdescription: Yup.string().required("Process description is required"),

  // Outcome & Impact
  outcomeheading: Yup.string().required("Outcome heading is required"),
  outcomedescription: Yup.string().required("Outcome description is required"),

  // Call to Action
  callheading: Yup.string().required("Call heading is required"),
  calldescription: Yup.string().required("Call description is required"),
  callctatext: Yup.string().required("Call CTA text is required"),
});

const validationSchema = Yup.object().shape({
  ...addClientSchema.fields,
  ...addClientStorySchema.fields,
});

const EditClientDrawer: React.FC<Props> = ({ clientmain, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { masterOurClients, busy, success } = useOurClientsMaster();
  // console.log("clientmain", clientmain);
  const [editState, setEditState] = useState<EditState>({
    section: null,
    index: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ourSolutionOthers, setOurSolutionOthers] = useState<
    Array<{ heading: string; title: string }>
  >([]);
  const [addSolutionOthers, setAddSolutionOthers] = useState<
    Array<{ heading: string; title: string }>
  >([]);
  const [processOthers, setProcessOthers] = useState<
    Array<{ heading: string; title: string }>
  >([]);
  const [uploadedImages, setUploadedImages] = useState<{
    mainIcon?: string;
    heroBgImage?: string;
    aboutImage?: string;
    problemImage?: string;
    problemBgImage?: string;
    solutionImage?: string;
    solutionBgImage?: string;
    processImage?: string;
    outcomeImage?: string;
    callImage?: string;
  }>({});
  const story = clientmain?.clientstory;
  const heroSection = story?.components.find(
    (c: any) => c.name === "hero_section"
  );
  const projectGoals = story?.components.find(
    (c: any) => c.name === "project_goals"
  );
  const problemStatement = story?.components.find(
    (c: any) => c.name === "problem_statement"
  );

  const ourSolution = story?.components.find(
    (c: any) => c.name === "our_solution"
  );
  const implementationProcess = story?.components.find(
    (c: any) => c.name === "implementation_process"
  );
  const addsolution = story?.components.find(
    (c: any) => c.name === "custom_tech_used"
  );
  const outcomeAndImpact = story?.components.find(
    (c: any) => c.name === "outcome_and_impact"
  );
  const callToAction = story?.components.find(
    (c: any) => c.name === "call_to_action"
  );
  const [images, setImages] = useState<Record<string, ImageState>>({
    mainIcon: {
      file: null,
      preview: null,
      existingUrl: clientmain?.url || "",
    },
    heroBgImage: {
      file: null,
      preview: null,
      existingUrl: heroSection?.bgImage?.url || "",
    },
    aboutImage: {
      file: null,
      preview: null,
      existingUrl: projectGoals?.image?.url || "",
    },
    problemImage: {
      file: null,
      preview: null,
      existingUrl: problemStatement?.image?.url || "",
    },
    problemBgImage: {
      file: null,
      preview: null,
      existingUrl: problemStatement?.bgImage?.url || "",
    },
    solutionImage: {
      file: null,
      preview: null,
      existingUrl: addsolution?.image?.url || "",
    },
    solutionBgImage: {
      file: null,
      preview: null,
      existingUrl: addsolution?.bgImage?.url || "",
    },
    processImage: {
      file: null,
      preview: null,
      existingUrl: implementationProcess?.image?.url || "",
    },
    outcomeImage: {
      file: null,
      preview: null,
      existingUrl: outcomeAndImpact?.bgImage?.url || "",
    },
    callImage: {
      file: null,
      preview: null,
      existingUrl: callToAction?.image?.url || "",
    },
  });

  const getImageUrl = (imageInfo: any) => {
    // Construct full URL for existing images
    return imageInfo?.url
      ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${imageInfo.url}`
      : "/logo512.png";
  };
  const toast = useToast();
  const [keyFeatures, setKeyFeatures] = useState<any[]>(() => {
    if (clientmain?.keyFeatures) {
      return clientmain.keyFeatures.map((feature: any) => ({
        title: feature.title,
        keydesc: feature.keydesc,
      }));
    }
    return [];
  });
  const handleAddKeyFeature = (values: any, setFieldValue: any) => {
    if (values.title && values.keydesc) {
      const newFeature = {
        title: values.title,
        keydesc: values.keydesc,
      };

      const exists = keyFeatures.some(
        (feature) =>
          feature.title === newFeature.title &&
          feature.keydesc === newFeature.keydesc
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

  const initialValue = useMemo(() => {
    console.log("clientmain", clientmain);

    if (clientmain) {
      if (clientmain.url) {
        setPreviewUrl(clientmain.url);
      }
      // if (ourSolution?.others) {
      //   setOurSolutionOthers(ourSolution.others);
      // }
      if (implementationProcess?.others) {
        setProcessOthers(implementationProcess.others);
      }
      if (addsolution?.others) {
        setAddSolutionOthers(addsolution.others);
      }
      // console.log("heroSection", projectGoals.image._id);

      return {
        client: clientmain.client || "",
        projecttitle: clientmain.projecttitle || "",
        industry: clientmain.industry || "",
        tags: clientmain.tags ? clientmain.tags.join(", ") : "",
        title: "",
        keydesc: "",
        image: null,
        heroheading: heroSection?.mainHeading || "",
        herosubheading: heroSection?.subHeading || "",
        heroctatext: heroSection?.CTA_text || "",
        heroBgImage: heroSection?.bgImage?._id || "",

        aboutheading: projectGoals?.mainHeading || "",
        aboutdescription: projectGoals?.subHeading || "",
        aboutImage: projectGoals?.image?._id || "",

        problemheading: problemStatement?.mainHeading || "",
        problemdescription: problemStatement?.subHeading || "",
        problemImage: problemStatement?.image?._id || "",
        problemBgImage: problemStatement?.bgImage?._id || "",

        solutionheading: ourSolution?.mainHeading || "",
        solutiondescription: ourSolution?.subHeading || "",
        solutionImage: addsolution?.image?._id || "",
        solutionBgImage: addsolution?.bgImage?._id || "",

        processheading: implementationProcess?.mainHeading || "",
        processdescription: implementationProcess?.subHeading || "",
        processImage: implementationProcess?.image?._id || "",

        outcomeheading: outcomeAndImpact?.mainHeading || "",
        outcomedescription: outcomeAndImpact?.subHeading || "",
        outcomeImage: outcomeAndImpact?.bgImage?._id || "",

        callheading: callToAction?.mainHeading || "",
        calldescription: callToAction?.subHeading || "",
        callctatext: callToAction?.CTA_text || "",
        callImage: callToAction?.image?._id || "",
      };
    }
    return {
      client: "",
      industry: "",
      projecttitle: "",
      tags: "",
      title: "",
      keydesc: "",
      image: null,
      heroheading: "",
      herosubheading: "",
      heroctatext: "",
      heroBgImage: "",
      aboutheading: "",
      aboutdescription: "",
      aboutImage: "",
      problemheading: "",
      problemdescription: "",
      problemImage: "",
      problemBgImage: "",
      solutionheading: "",
      solutiondescription: "",
      solutionImage: "",
      solutionBgImage: "",
      processheading: "",
      processdescription: "",
      processImage: "",
      outcomeheading: "",
      outcomedescription: "",
      outcomeImage: "",
      callheading: "",
      calldescription: "",
      callctatext: "",
      callImage: "",
    };
  }, [clientmain]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.size > 20 * 1024 * 1024) return;
    // const localPreviewUrl = URL.createObjectURL(file);
    // if (imageType === "mainIcon") {
    //   setFieldValue("image", file);
    //   return;
    // }
    setImages((prev) => ({
      ...prev,
      [imageType]: {
        file,
        preview: URL.createObjectURL(file),
        existingUrl: undefined,
      },
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/upload`,
        formData
      );
      setUploadedImages((prev: any) => ({
        ...prev,
        [imageType]: response.data.data._id,
      }));
      console.log("uploadedImages:", response.data.data._id);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleAddOthers = (
    section: string,
    values: any,
    setFieldValue: any
  ) => {
    if (values[`${section}OtherHeading`] && values[`${section}OtherTitle`]) {
      const newOther = {
        heading: values[`${section}OtherHeading`],
        title: values[`${section}OtherTitle`],
      };

      switch (section) {
        case "ourSolution":
          if (editState.section === "ourSolution" && editState.index !== null) {
            const updatedOthers = [...ourSolutionOthers];
            updatedOthers[editState.index] = newOther;
            setOurSolutionOthers(updatedOthers);
            setEditState({ section: null, index: null });
          } else if (ourSolutionOthers.length < 2) {
            setOurSolutionOthers((prev) => [...prev, newOther]);
          } else {
            toast({
              title: "Maximum limit reached",
              description: "You can only add up to 2 entries",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          break;
        case "addSolution":
          // if (addSolutionOthers.length >= 2) {
          if (editState.section === "addSolution" && editState.index !== null) {
            // Update existing entry
            const updatedOthers = [...addSolutionOthers];
            updatedOthers[editState.index] = newOther;
            setAddSolutionOthers(updatedOthers);
            setEditState({ section: null, index: null });
          } else if (addSolutionOthers.length < 2) {
            setAddSolutionOthers((prev) => [...prev, newOther]);
          } else {
            toast({
              title: "Maximum limit reached",
              description: "You can only add up to 2 entries",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          break;
        case "process":
          if (editState.section === "process" && editState.index !== null) {
            // Update existing entry
            const updatedOthers = [...processOthers];
            updatedOthers[editState.index] = newOther;
            setProcessOthers(updatedOthers);
            setEditState({ section: null, index: null });
          } else if (processOthers.length < 4) {
            setProcessOthers((prev) => [...prev, newOther]);
          } else {
            toast({
              title: "Maximum limit reached",
              description: "You can only add up to 4 entries",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          break;
      }
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
    setFieldValue: any
  ) => {
    const othersArray =
      section === "ourSolution"
        ? ourSolutionOthers
        : section === "addSolution"
        ? addSolutionOthers
        : processOthers;
    const itemToEdit = othersArray[index];

    setEditState({ section, index });
    setFieldValue(`${section}OtherHeading`, itemToEdit.heading);
    setFieldValue(`${section}OtherTitle`, itemToEdit.title);
  };
  const onSubmit = async (values: Record<string, any>) => {
    // First create/update client with FormData
    const clientFormData = new FormData();
    clientFormData.append("clientname", values.client);
    clientFormData.append("projectTitle", values.projecttitle);
    clientFormData.append("industry", values.industry);
    const tagsString = values.tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)
      .join(",");
    clientFormData.append("tags", tagsString);
    // if (values.image) {
    //   clientFormData.append("file", values.image);
    // }
    if (images.mainIcon.file) {
      clientFormData.append("file", images.mainIcon.file);
    } else if (uploadedImages.mainIcon) {
      clientFormData.append("icon_image", uploadedImages.mainIcon);
    }
    keyFeatures.forEach((feature, index) => {
      clientFormData.append(`keyFeatures[${index}][title]`, feature.title);
      clientFormData.append(`keyFeatures[${index}][keydesc]`, feature.keydesc);
    });
    console.log("values", values);

    const components = [
      {
        name: "hero_section",
        bgImage: uploadedImages?.heroBgImage || values.heroBgImage || "",
        mainHeading: values.heroheading,
        subHeading: values.herosubheading,
        CTA_text: values.heroctatext,
        order: 0,
      },
      {
        name: "project_goals",
        mainHeading: values.aboutheading,
        subHeading: values.aboutdescription,
        image: uploadedImages?.aboutImage || values.aboutImage || "",
        order: 1,
      },
      {
        name: "problem_statement",
        mainHeading: values.problemheading,
        subHeading: values.problemdescription,
        image: uploadedImages?.problemImage || values.problemImage || "",
        bgImage: uploadedImages?.problemBgImage || values.problemBgImage || "",
        order: 2,
      },
      {
        name: "our_solution",
        mainHeading: values.solutionheading,
        subHeading: values.solutiondescription,
        others: ourSolutionOthers,
        order: 3,
      },
      {
        name: "custom_tech_used",
        bgImage:
          uploadedImages?.solutionBgImage || values.solutionBgImage || "",
        image: uploadedImages?.solutionImage || values.solutionImage || "",
        others: addSolutionOthers,
        mainHeading: "hiii",
        order: 4,
      },
      {
        name: "implementation_process",
        mainHeading: values.processheading,
        subHeading: values.processdescription,
        image: uploadedImages?.processImage || values.processImage || "",
        others: processOthers,
        order: 5,
      },
      {
        name: "outcome_and_impact",
        mainHeading: values.outcomeheading,
        subHeading: values.outcomedescription,
        bgImage: uploadedImages?.outcomeImage || values.outcomeImage || "",
        order: 6,
      },
      {
        name: "call_to_action",
        mainHeading: values.callheading,
        subHeading: values.calldescription,
        image: uploadedImages?.callImage || values.callImage || "",
        order: 7,
      },
    ];

    if (clientmain?._id) {
      // Update existing client
      const clientData = { payload: clientFormData, _id: clientmain._id };
      dispatch({
        type: REQUEST_UPDATE_MASTER_OUR_CLIENTS,
        data: clientData,
        onSuccess: (response: any) => {
          console.log("response", response);

          // After client update, update client story
          const clientStoryData = {
            client: clientmain._id,
            icon_image: clientmain?.icon_image || "",
            components,
          };
          console.log("clientStoryData", clientStoryData);

          axios({
            method: "patch",
            url: `${process.env.REACT_APP_BASE_URL}/client-story/${clientmain.clientstory._id}`,
            data: clientStoryData,
            withCredentials: true,
          })
            .then((storyResponse) => {
              console.log("Story update response:", storyResponse);
              // If both updates are successful, refresh the client list and close
              dispatch({ type: REQUEST_MASTER_OUR_CLIENTS });
              onClose();
            })
            .catch((error) => {
              console.error("API Error:", error);
            });
          console.log("clientStoryDataupdateeeeeeeee", clientStoryData);
          // dispatch({
          //   type: REQUEST_UPDATE_MASTER_OUR_CLIENTS_STORY,
          //   payload: clientStoryData,
          //   onSuccess: () => {
          //     dispatch({ type: REQUEST_MASTER_OUR_CLIENTS });
          //     onClose();
          //   },
          // });
        },
      });
    } else {
      // Create new client
      dispatch({
        type: REQUEST_CREATE_MASTER_OUR_CLIENTS,
        payload: clientFormData,
        onSuccess: (response: any) => {
          console.log("response", response);
          // try {
          //   // After client creation, create client story
          const clientStoryData = {
            client: response.data.data._id,
            icon_image: response.data.data.image._id || "",
            components,
          };
          console.log("clientStoryData", clientStoryData);
          //   axios({
          //     method: "post",
          //     url: `${process.env.REACT_APP_BASE_URL}/client-story`,
          //     data: clientStoryData,
          //     withCredentials: true,
          //   })
          //     .then((clientDetailResponse) => {
          //       console.log("client details response:", clientDetailResponse);
          //       // If both create are successful, refresh the product list and close
          //       dispatch({ type: REQUEST_MASTER_OUR_CLIENTS });
          //       onClose();
          //     })
          //     .catch((error) => {
          //       console.error("API Error:", error);
          //     });
          //   onClose();
          dispatch({
            type: REQUEST_CREATE_MASTER_OUR_CLIENTS_STORY,
            payload: clientStoryData,
            onSuccess: () => {
              dispatch({ type: REQUEST_MASTER_OUR_CLIENTS });
              onClose();
            },
          });
          // } catch (error) {
          //   console.error("Error creating product details:", error);
          //   toast({
          //     title: "Error creating product details",
          //     status: "error",
          //     duration: 3000,
          //   });
          // }
        },
      });
    }
  };
  useEffect(() => {
    if (clientmain && masterOurClients?.data) {
      const ourClientsFromStore = masterOurClients.data.find(
        (ml: any) => ml._id === clientmain._id
      );
      console.log("ourClientsFromStore", ourClientsFromStore);

      if (
        ourClientsFromStore &&
        (ourClientsFromStore.clientname !== clientmain.client ||
          ourClientsFromStore.projectTitle !== clientmain.projecttitle ||
          ourClientsFromStore.industry !== clientmain.industry ||
          ourClientsFromStore.tags !== clientmain.tags)
      ) {
        toast({
          title: "Success",
          description: "Client details updated successfully",
          status: "success",
          isClosable: true,
          position: "top-right",
        });
        onClose();
      }
    }
  }, [masterOurClients?.data, clientmain, onClose, toast, busy, success]);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, errors, touched, submitForm }) => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <DrawerHeader
                backgroundColor="#E8D7EE"
                borderBottom="1px solid #E0E0E0"
              >
                <Flex>
                  {" "}
                  {clientmain ? "Edit Client Details" : "Add Client Details"}
                </Flex>
              </DrawerHeader>

              <DrawerBody
                overflowY="auto"
                flex="1"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "2px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
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
                    {images.mainIcon.preview || images.mainIcon.existingUrl
                      ? "Change Client Image"
                      : "Upload Client Image"}
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

                  {(images.mainIcon.preview || images.mainIcon.existingUrl) && (
                    <Box mt={2}>
                      <img
                        src={images.mainIcon.preview || getImageUrl(clientmain)}
                        alt="Main Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )}

                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Supported file types: .png, .jpg, .jpeg, .doc, .docx, .pdf,
                    .xlsx, .xls Max file size: 20 MB
                  </Text>
                </Flex>

                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Client Name : "
                    fieldName="client"
                    placeholder="Enter Client Name"
                    type="text"
                    error={
                      touched.client ? (errors.client as string) : undefined
                    }
                  />
                </FormControl>

                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Project Title : "
                    fieldName="projecttitle"
                    placeholder="Enter Project Title"
                    type="text"
                    error={
                      touched.projecttitle
                        ? (errors.projecttitle as string)
                        : undefined
                    }
                  />
                </FormControl>

                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Client/ Industry Field : "
                    fieldName="industry"
                    placeholder="Enter Industry"
                    type="text"
                    error={
                      touched.industry ? (errors.industry as string) : undefined
                    }
                  />
                </FormControl>

                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Tags : "
                    fieldName="tags"
                    placeholder="Enter tags (comma separated)"
                    type="text"
                    error={touched.tags ? (errors.tags as string) : undefined}
                  />
                </FormControl>
                <Divider
                  borderRadius={"8px"}
                  opacity={"1"}
                  mb={5}
                  mt={2}
                  color={"#EFEFEF"}
                />
                {/* ---------description ------------*/}
                <Text fontWeight={"700"} fontSize="22px" color="#000">
                  Description
                </Text>
                {/* hero section ------------------*/}
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                >
                  <FormLabel>Hero Section</FormLabel>
                  <Button
                    variant="ghost"
                    color="#cb30ff"
                    leftIcon={<FiUpload />}
                    border="1px dashed #CB30FF"
                    p={4}
                    borderRadius="md"
                    onClick={() =>
                      document.getElementById("hero-bg-upload")?.click()
                    }
                  >
                    {images.heroBgImage.preview ||
                    images.heroBgImage.existingUrl
                      ? "Change Background Image"
                      : "Upload Background Image"}
                  </Button>

                  <Input
                    id="hero-bg-upload"
                    type="file"
                    display="none"
                    name="herobgImage"
                    accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                    onChange={(e) =>
                      handleImageUpload(e, "heroBgImage", setFieldValue)
                    }
                  />

                  {/* {images.heroBgImage.preview && ( */}
                  {(images.heroBgImage.preview ||
                    images.heroBgImage.existingUrl) && (
                    <Box mt={2}>
                      <img
                        // src={images.heroBgImage.preview}
                        src={
                          images.heroBgImage.preview ||
                          getImageUrl(heroSection?.bgImage)
                        }
                        alt="Hero Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )}

                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Supported file types: .png, .jpg, .jpeg, .doc, .docx, .pdf,
                    .xlsx, .xls Max file size: 20 MB
                  </Text>
                </Flex>
                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Heading : "
                    fieldName="heroheading"
                    placeholder="Enter Heading"
                    type="text"
                    error={
                      touched.heroheading
                        ? (errors.heroheading as string)
                        : undefined
                    }
                  />
                </FormControl>
                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Sub Heading : "
                    fieldName="herosubheading"
                    placeholder="Enter Sub Headng"
                    type="text"
                    error={touched.tags ? (errors.tags as string) : undefined}
                  />
                </FormControl>
                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="CTA text : "
                    fieldName="heroctatext"
                    placeholder="Enter CTA Text:"
                    type="text"
                    error={
                      touched.heroctatext
                        ? (errors.heroctatext as string)
                        : undefined
                    }
                  />
                </FormControl>
                <Divider
                  borderRadius={"8px"}
                  opacity={"1"}
                  mb={5}
                  mt={2}
                  color={"#EFEFEF"}
                  size="xl"
                />
                {/* about us ------------------*/}
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                >
                  <FormLabel>About Us(Project goals)</FormLabel>
                  <Button
                    variant="ghost"
                    color="#cb30ff"
                    leftIcon={<FiUpload />}
                    border="1px dashed #CB30FF"
                    p={4}
                    borderRadius="md"
                    onClick={() =>
                      document.getElementById("about-upload")?.click()
                    }
                  >
                    {images.aboutImage.preview || images.aboutImage.existingUrl
                      ? "Change Title Image"
                      : "Upload Title Image"}
                  </Button>

                  <Input
                    id="about-upload"
                    type="file"
                    display="none"
                    name="aboutimage"
                    accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                    onChange={(e) =>
                      handleImageUpload(e, "aboutImage", setFieldValue)
                    }
                  />

                  {/* // {images.aboutImage.preview && ( */}
                  {(images.aboutImage.preview ||
                    images.aboutImage.existingUrl) && (
                    <Box mt={2}>
                      <img
                        src={
                          images.aboutImage.preview ||
                          getImageUrl(
                            clientmain?.clientstory?.components?.find(
                              (c: any) => c.name === "project_goals"
                            )?.image
                          )
                        }
                        alt="about Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )}
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Supported file types: .png, .jpg, .jpeg, .doc, .docx, .pdf,
                    .xlsx, .xls Max file size: 20 MB
                  </Text>
                </Flex>
                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Heading : "
                    fieldName="aboutheading"
                    placeholder="Enter Heading"
                    type="text"
                    error={
                      touched.aboutheading
                        ? (errors.aboutheading as string)
                        : undefined
                    }
                  />
                </FormControl>

                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Description : "
                    fieldName="aboutdescription"
                    placeholder="Enter Description"
                    type="text"
                    error={
                      touched.aboutdescription
                        ? (errors.aboutdescription as string)
                        : undefined
                    }
                  />
                </FormControl>
                <Divider
                  borderRadius={"8px"}
                  opacity={"1"}
                  mb={5}
                  mt={2}
                  color={"#EFEFEF"}
                  size="xl"
                />
                {/* Problem Statement ------------------*/}
                <FormLabel>Problem Statement</FormLabel>
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
                      document.getElementById("problem-upload")?.click()
                    }
                  >
                    {images.problemImage.preview ||
                    images.problemImage.existingUrl
                      ? "Change Title Image"
                      : "Upload Title Image"}
                  </Button>

                  <Input
                    id="problem-upload"
                    type="file"
                    display="none"
                    name="problemimage"
                    accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                    onChange={(e) =>
                      handleImageUpload(e, "problemImage", setFieldValue)
                    }
                  />
                  {/* {images.problemImage.preview && ( */}
                  {(images.problemImage.preview ||
                    images.problemImage.existingUrl) && (
                    <Box mt={2}>
                      <img
                        src={
                          images.problemImage.preview ||
                          getImageUrl(
                            clientmain?.clientstory?.components?.find(
                              (c: any) => c.name === "problem_statement"
                            )?.image
                          )
                        }
                        alt="problem Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )}

                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Supported file types: .png, .jpg, .jpeg, .doc, .docx, .pdf,
                    .xlsx, .xls Max file size: 20 MB
                  </Text>
                </Flex>
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
                      document.getElementById("problem-bg-upload")?.click()
                    }
                  >
                    {images.problemBgImage.preview ||
                    images.problemBgImage.existingUrl
                      ? "Change Background Image"
                      : "Upload Background Image"}
                  </Button>

                  <Input
                    id="problem-bg-upload"
                    type="file"
                    display="none"
                    name="problembgimage"
                    accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                    onChange={(e) =>
                      handleImageUpload(e, "problemBgImage", setFieldValue)
                    }
                  />
                  {/* {images.problemBgImage.preview && ( */}
                  {(images.problemBgImage.preview ||
                    images.problemBgImage.existingUrl) && (
                    <Box mt={2}>
                      <img
                        src={
                          images.problemBgImage.preview ||
                          getImageUrl(
                            clientmain?.clientstory?.components?.find(
                              (c: any) => c.name === "problem_statement"
                            )?.bgImage
                          )
                        }
                        alt="problem bg Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )}

                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Supported file types: .png, .jpg, .jpeg, .doc, .docx, .pdf,
                    .xlsx, .xls Max file size: 20 MB
                  </Text>
                </Flex>
                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Heading : "
                    fieldName="problemheading"
                    placeholder="Enter Heading"
                    type="text"
                    error={
                      touched.problemheading
                        ? (errors.problemheading as string)
                        : undefined
                    }
                  />
                </FormControl>

                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Description : "
                    fieldName="problemdescription"
                    placeholder="Enter Description"
                    type="text"
                    error={
                      touched.problemdescription
                        ? (errors.problemdescription as string)
                        : undefined
                    }
                  />
                </FormControl>
                <Divider
                  opacity={"1"}
                  mb={5}
                  mt={2}
                  color={"#EFEFEF"}
                  size="xl"
                  borderRadius={"8px"}
                />
                {/* our solution ------------------*/}
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                >
                  <FormLabel>Our Solution</FormLabel>
                  <FormControl pb={3}>
                    <FormField
                      required={true}
                      name="Heading : "
                      fieldName="solutionheading"
                      placeholder="Enter Solution Heading"
                      type="text"
                      error={
                        touched.solutionheading
                          ? (errors.solutionheading as string)
                          : undefined
                      }
                    />
                  </FormControl>

                  <FormControl pb={3}>
                    <FormField
                      required={true}
                      name="Description : "
                      fieldName="solutiondescription"
                      placeholder="Enter Solution Description"
                      type="text"
                      error={
                        touched.solutiondescription
                          ? (errors.solutiondescription as string)
                          : undefined
                      }
                    />
                  </FormControl>
                  {/* <FormControl pb={3}>
                    <FormLabel htmlFor="ourSolutionOtherHeading">
                      Title
                    </FormLabel>
                    <Field
                      as={Input}
                      id="ourSolutionOtherHeading"
                      name="ourSolutionOtherHeading"
                      placeholder="Enter heading"
                      // isDisabled={ourSolutionOthers.length >= 2}
                      // value={values.title}
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                    />
                  </FormControl>

                  <FormControl pb={3}>
                    <FormLabel htmlFor="ourSolutionOtherTitle">
                      Description
                    </FormLabel>
                    <Field
                      as={Input}
                      id="ourSolutionOtherTitle"
                      name="ourSolutionOtherTitle"
                      placeholder="Enter title"
                      // isDisabled={ourSolutionOthers.length >= 2}
                      // value={values.keydesc}
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                    />
                  </FormControl>

                  <Box
                    ml={2}
                    mb={4}
                    display="flex"
                    alignItems="center"
                    color="#cd30ff"
                    cursor="pointer"
                    onClick={() =>
                      handleAddOthers("ourSolution", values, setFieldValue)
                    }
                    // onClick={() => {
                    //   if (ourSolutionOthers.length < 2) {
                    //     handleAddOthers("ourSolution", values, setFieldValue);
                    //   } else {
                    //     toast({
                    //       title: "Maximum limit reached",
                    //       description:
                    //         "You can only add up to 2 solution features",
                    //       status: "error",
                    //       duration: 3000,
                    //       isClosable: true,
                    //     });
                    //   }
                    // }}
                  >
                    <FiPlus style={{ marginRight: "10px" }} />{" "}
                    {editState.section === "ourSolution" &&
                    editState.index !== null
                      ? "Update"
                      : "Add"}{" "}
                    Our Solution Features
                    {ourSolutionOthers.length >= 2 &&
                      editState.section !== "ourSolution" && (
                        <Text fontSize="sm" color="red.500" ml={2}>
                          (Limit reached)
                        </Text>
                      )}
                  </Box>

                  <Flex wrap="wrap" gap="10px">
                    {ourSolutionOthers.map((other, index) => (
                      <Box
                        key={index}
                        p={4}
                        border="1px solid #ddd"
                        borderRadius="md"
                        display="flex"
                        gap="2px"
                        mb={4}
                        onClick={() =>
                          handleEdit(
                            index,
                            "ourSolution",
                            values,
                            setFieldValue
                          )
                        }
                        position="relative"
                      >
                        <Text fontWeight="bold">{other.heading}: </Text>
                        <Text>{other.title}</Text>
                        {editState.section === "ourSolution" &&
                          editState.index === index && (
                            <Box
                              position="absolute"
                              top="-8px"
                              right="-8px"
                              bg="#cd30ff"
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
                  </Flex> */}
                </Flex>
                <Divider
                  opacity={"1"}
                  mb={5}
                  mt={2}
                  color={"#EFEFEF"}
                  borderRadius={"8px"}
                  size="xl"
                />
                {/*tech custom solution------------------*/}
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                >
                  <FormLabel>Add Solutions</FormLabel>
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
                        document.getElementById("solution-upload")?.click()
                      }
                    >
                      {images.solutionImage.preview ||
                      images.solutionImage.existingUrl
                        ? "Change Title Image"
                        : "Upload Title Image"}
                    </Button>

                    <Input
                      id="solution-upload"
                      type="file"
                      display="none"
                      name="solutionimage"
                      accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                      onChange={(e) =>
                        handleImageUpload(e, "solutionImage", setFieldValue)
                      }
                    />

                    {/* {previewUrl && (
                    <Box mt={2}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )} */}
                    {(images.solutionImage.preview ||
                      images.solutionImage.existingUrl) && (
                      <Box mt={2}>
                        <img
                          src={
                            images.solutionImage.preview ||
                            getImageUrl(
                              clientmain?.clientstory?.components?.find(
                                (c: any) => c.name === "custom_tech_used"
                              )?.image
                            )
                          }
                          alt="solution Preview"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                      </Box>
                    )}

                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                      .pdf, .xlsx, .xls Max file size: 20 MB
                    </Text>
                  </Flex>
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
                        document.getElementById("solution-bg-upload")?.click()
                      }
                    >
                      {images.solutionBgImage.preview ||
                      images.solutionBgImage.existingUrl
                        ? "Change Background Image"
                        : "Upload Background Image"}
                    </Button>

                    <Input
                      id="solution-bg-upload"
                      type="file"
                      display="none"
                      name="solutionbgimage"
                      accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                      onChange={(e) =>
                        handleImageUpload(e, "solutionBgImage", setFieldValue)
                      }
                    />

                    {/* {previewUrl && (
                    <Box mt={2}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )} */}
                    {/* {images.solutionBgImage.preview && ( */}
                    {(images.solutionBgImage.preview ||
                      images.solutionBgImage.existingUrl) && (
                      <Box mt={2}>
                        <img
                          // src={images.solutionBgImage.preview}
                          src={
                            images.solutionBgImage.preview ||
                            getImageUrl(
                              clientmain?.clientstory?.components?.find(
                                (c: any) => c.name === "our_solution"
                              )?.image
                            )
                          }
                          alt="solution bg Preview"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                      </Box>
                    )}

                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                      .pdf, .xlsx, .xls Max file size: 20 MB
                    </Text>
                  </Flex>
                  <FormControl pb={3}>
                    <FormLabel htmlFor="addSolutionOtherHeading">
                      Title
                    </FormLabel>
                    <Field
                      as={Input}
                      id="addSolutionOtherHeading"
                      name="addSolutionOtherHeading"
                      placeholder="Enter heading"
                      // isDisabled={addSolutionOthers.length >= 2}
                      // value={values.title}
                      // onChange={handleChange}
                      // onBlur={handleBlur}
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
                      // isDisabled={addSolutionOthers.length >= 2}
                      // value={values.keydesc}
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                    />
                  </FormControl>

                  <Box
                    ml={2}
                    mb={4}
                    display="flex"
                    alignItems="center"
                    color="#cd30ff"
                    cursor="pointer"
                    onClick={() =>
                      handleAddOthers("addSolution", values, setFieldValue)
                    }
                    // onClick={() => {
                    //   if (addSolutionOthers.length < 2) {
                    //     handleAddOthers("addSolution", values, setFieldValue);
                    //   } else {
                    //     toast({
                    //       title: "Maximum limit reached",
                    //       description:
                    //         "You can only add up to 2 solution features",
                    //       status: "error",
                    //       duration: 3000,
                    //       isClosable: true,
                    //     });
                    //   }
                    // }}
                  >
                    <FiPlus style={{ marginRight: "10px" }} />{" "}
                    {editState.section === "addSolution" &&
                    // addSolutionOthers.length < 2 &&
                    editState.index !== null
                      ? "Update"
                      : "Add"}{" "}
                    Solution Features{" "}
                    {addSolutionOthers.length >= 2 &&
                      editState.section !== "addSolution" && (
                        <Text fontSize="sm" color="red.500" ml={2}>
                          (Limit reached)
                        </Text>
                      )}
                    {/* <Text fontSize="sm" color="gray.500" mt={1}>
                      {section === "ourSolution"
                        ? `${2 - ourSolutionOthers.length} slots remaining`
                        : `${2 - addSolutionOthers.length} slots remaining`}
                    </Text> */}
                  </Box>

                  <Flex wrap="wrap" gap="10px">
                    {addSolutionOthers.map((other, index) => (
                      <Box
                        key={index}
                        p={4}
                        border="1px solid #ddd"
                        borderRadius="md"
                        display="flex"
                        gap="2px"
                        mb={4}
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
                              bg="#cd30ff"
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
                <Divider
                  opacity={"1"}
                  mb={5}
                  mt={2}
                  color={"#EFEFEF"}
                  borderRadius={"8px"}
                  size="xl"
                />
                {/* implementation process ------------------*/}
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                >
                  <FormLabel>Implementation Process</FormLabel>
                  <Button
                    variant="ghost"
                    color="#cb30ff"
                    leftIcon={<FiUpload />}
                    border="1px dashed #CB30FF"
                    p={4}
                    borderRadius="md"
                    onClick={() =>
                      document.getElementById("process-upload")?.click()
                    }
                  >
                    {/* {images.processImage.preview */}
                    {images.processImage.preview ||
                    images.processImage.existingUrl
                      ? "Change Title Image"
                      : "Upload Title Image"}
                  </Button>

                  <Input
                    id="process-upload"
                    type="file"
                    display="none"
                    name="processimage"
                    accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                    onChange={(e) =>
                      handleImageUpload(e, "processImage", setFieldValue)
                    }
                  />

                  {(images.processImage.preview ||
                    images.processImage.existingUrl) && (
                    <Box mt={2}>
                      <img
                        src={
                          images.processImage.preview ||
                          getImageUrl(
                            clientmain?.clientstory?.components?.find(
                              (c: any) => c.name === "implementation_process"
                            )?.image
                          )
                        }
                        alt="process Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )}

                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Supported file types: .png, .jpg, .jpeg, .doc, .docx, .pdf,
                    .xlsx, .xls Max file size: 20 MB
                  </Text>

                  <FormControl pb={3}>
                    <FormField
                      required={true}
                      name="Heading : "
                      fieldName="processheading"
                      placeholder="Enter Process Heading"
                      type="text"
                      error={
                        touched.processheading
                          ? (errors.processheading as string)
                          : undefined
                      }
                    />
                  </FormControl>

                  <FormControl pb={3}>
                    <FormField
                      required={true}
                      name="Description : "
                      fieldName="processdescription"
                      placeholder="Enter Process Description"
                      type="text"
                      error={
                        touched.processdescription
                          ? (errors.processdescription as string)
                          : undefined
                      }
                    />
                  </FormControl>

                  <FormControl pb={3}>
                    <FormLabel htmlFor="processOtherHeading">Title</FormLabel>
                    <Field
                      as={Input}
                      id="processOtherHeading"
                      name="processOtherHeading"
                      placeholder="Enter heading"
                      // value={values.title}
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                    />
                  </FormControl>

                  <FormControl pb={3}>
                    <FormLabel htmlFor="processOtherTitle">
                      Description
                    </FormLabel>
                    <Field
                      as={Input}
                      id="processOtherTitle"
                      name="processOtherTitle"
                      placeholder="Enter title"
                      // value={values.keydesc}
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                    />
                  </FormControl>

                  <Box
                    ml={2}
                    mb={4}
                    display="flex"
                    alignItems="center"
                    color="#cd30ff"
                    cursor="pointer"
                    onClick={() =>
                      handleAddOthers("process", values, setFieldValue)
                    }
                    // onClick={() => {
                    //   if (processOthers.length < 4) {
                    //     handleAddOthers("process", values, setFieldValue);
                    //   } else {
                    //     toast({
                    //       title: "Maximum limit reached",
                    //       description:
                    //         "You can only add up to 2 solution features",
                    //       status: "error",
                    //       duration: 3000,
                    //       isClosable: true,
                    //     });
                    //   }
                    // }}
                  >
                    <FiPlus style={{ marginRight: "10px" }} />{" "}
                    {editState.section === "process" && editState.index !== null
                      ? "Update"
                      : "Add"}{" "}
                    Process Steps
                    {processOthers.length >= 4 &&
                      editState.section !== "process" && (
                        <Text fontSize="sm" color="red.500" ml={2}>
                          (Limit reached)
                        </Text>
                      )}
                  </Box>

                  <Flex wrap="wrap" gap="10px">
                    {processOthers.map((other, index) => (
                      <Box
                        key={index}
                        p={4}
                        border="1px solid #ddd"
                        borderRadius="md"
                        display="flex"
                        gap="2px"
                        mb={4}
                        onClick={() =>
                          handleEdit(index, "process", values, setFieldValue)
                        }
                        position="relative"
                      >
                        <Text fontWeight="bold">{other.heading}:</Text>
                        <Text>{other.title}</Text>
                        {editState.section === "process" &&
                          editState.index === index && (
                            <Box
                              position="absolute"
                              top="-8px"
                              right="-8px"
                              bg="#cd30ff"
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
                <Divider
                  opacity={"1"}
                  mb={5}
                  mt={2}
                  color={"#EFEFEF"}
                  size="xl"
                  borderRadius={"8px"}
                />
                {/* <Divider color={"#EFEFEF"} size="xl" /> */}
                {/* Outcome & Impact ------------------*/}
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                >
                  <FormLabel>Outcome & Impact</FormLabel>
                  <Button
                    variant="ghost"
                    color="#cb30ff"
                    leftIcon={<FiUpload />}
                    border="1px dashed #CB30FF"
                    p={4}
                    borderRadius="md"
                    onClick={() =>
                      document.getElementById("outcome-bg-upload")?.click()
                    }
                  >
                    {images.outcomeImage.preview ||
                    images.outcomeImage.existingUrl
                      ? "Change Background Image"
                      : "Upload Background Image"}
                  </Button>

                  <Input
                    id="outcome-bg-upload"
                    type="file"
                    display="none"
                    name="outcomebgimage"
                    accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                    onChange={(e) =>
                      handleImageUpload(e, "outcomeImage", setFieldValue)
                    }
                  />

                  {(images.outcomeImage.preview ||
                    images.outcomeImage.existingUrl) && (
                    <Box mt={2}>
                      <img
                        src={
                          images.outcomeImage.preview ||
                          getImageUrl(
                            clientmain?.clientstory?.components?.find(
                              (c: any) => c.name === "outcome_impact"
                            )?.image
                          )
                        }
                        alt="outcome bg Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )}
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Supported file types: .png, .jpg, .jpeg, .doc, .docx, .pdf,
                    .xlsx, .xls Max file size: 20 MB
                  </Text>
                </Flex>
                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Heading : "
                    fieldName="outcomeheading"
                    placeholder="Enter Heading"
                    type="text"
                    error={
                      touched.outcomeheading
                        ? (errors.outcomeheading as string)
                        : undefined
                    }
                  />
                </FormControl>

                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Description : "
                    fieldName="outcomedescription"
                    placeholder="Enter Description"
                    type="text"
                    error={
                      touched.outcomedescription
                        ? (errors.outcomedescription as string)
                        : undefined
                    }
                  />
                </FormControl>

                <Divider
                  opacity={"1"}
                  mb={5}
                  mt={2}
                  color={"#EFEFEF"}
                  size="xl"
                  borderRadius={"8px"}
                />
                {/* Call to Action ------------------*/}
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                >
                  <FormLabel>Call to Action</FormLabel>
                  <Button
                    variant="ghost"
                    color="#cb30ff"
                    leftIcon={<FiUpload />}
                    border="1px dashed #CB30FF"
                    p={4}
                    borderRadius="md"
                    onClick={() =>
                      document.getElementById("call-upload")?.click()
                    }
                  >
                    {images.callImage.preview || images.callImage.existingUrl
                      ? "Change Title Image"
                      : "Upload Title Image"}
                  </Button>

                  <Input
                    id="call-upload"
                    type="file"
                    display="none"
                    name="callimage"
                    accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                    onChange={(e) =>
                      handleImageUpload(e, "callImage", setFieldValue)
                    }
                  />

                  {(images.callImage.preview ||
                    images.callImage.existingUrl) && (
                    <Box mt={2}>
                      <img
                        src={
                          images.callImage.preview ||
                          getImageUrl(
                            clientmain?.clientstory?.components?.find(
                              (c: any) => c.name === "our_solution"
                            )?.image
                          )
                        }
                        alt="call Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </Box>
                  )}

                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Supported file types: .png, .jpg, .jpeg, .doc, .docx, .pdf,
                    .xlsx, .xls Max file size: 20 MB
                  </Text>
                </Flex>
                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Heading : "
                    fieldName="callheading"
                    placeholder="Enter Heading"
                    type="text"
                    error={
                      touched.callheading
                        ? (errors.callheading as string)
                        : undefined
                    }
                  />
                </FormControl>
                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="Description : "
                    fieldName="calldescription"
                    placeholder="Enter Description"
                    type="text"
                    error={
                      touched.calldescription
                        ? (errors.calldescription as string)
                        : undefined
                    }
                  />
                </FormControl>
                <FormControl pb={3}>
                  <FormField
                    required={true}
                    name="CTA text : "
                    fieldName="callctatext"
                    placeholder="Enter CTA Text:"
                    type="text"
                    error={
                      touched.callctatext
                        ? (errors.callctatext as string)
                        : undefined
                    }
                  />
                </FormControl>
              </DrawerBody>

              <DrawerFooter boxShadow="0px -1.76px 27.68px 0px #b0b0b033">
                <Button
                  variant="outline"
                  mr={3}
                  border="1px solid #EEE"
                  borderRadius="6px"
                  onClick={() => {
                    onClose();
                    dispatch({ type: SET_MESSAGE_MASTER_OUR_CLIENTS });
                  }}
                  disabled={busy}
                  color="#424242"
                  fontSize="sm"
                >
                  Cancel
                </Button>

                <Button
                  fontSize="sm"
                  color="#fff"
                  onClick={submitForm}
                  disabled={busy}
                  background="#cd30ff"
                  type="submit"
                >
                  {clientmain && clientmain._id ? "Update" : "Save"}
                </Button>
              </DrawerFooter>
            </Form>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};

export default EditClientDrawer;

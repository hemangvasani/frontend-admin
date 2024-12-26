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
  Divider,
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
  REQUEST_MASTER_HOME,
  REQUEST_UPDATE_MASTER_HOME,
  SET_MESSAGE_MASTER_HOME,
} from "../../store/home/homeActionTypes";
import { useHomeMaster } from "../../store/home/reducer";
import { FiPlus, FiUpload } from "react-icons/fi";
import AddNewHomeModal from "../modals/AddNewHomeModal";
import { useCategoriesMaster } from "../../store/category/reducer";
import { REQUEST_MASTER_CATEGORIES } from "../../store/category/categoryActionTypes";
import axios from "axios";
import { REQUEST_MASTER_OUR_CLIENTS } from "../../store/ourclients/ourclientssActionTypes";
import FormEditor from "../form/formField/FormEditor";

interface EditState {
  section: string | null;
  index: number | null;
}
interface ImageState {
  file: File | null;
  preview: string | null;
  existingUrl?: string;
}
// function jsonToFormData(json: any) {
//   const formData = new FormData();

//   function appendData(key: any, value: any) {
//     if (value instanceof File) {
//       formData.append(key, value);
//     } else if (Array.isArray(value)) {
//       value.forEach((item, index) => {
//         appendData(`${key}[${index}]`, item);
//       });
//     } else if (typeof value === "object" && value !== null) {
//       Object.keys(value).forEach((subKey) => {
//         const v = value[subKey];
//         if (subKey == "title") {
//           subKey = "heading";
//         } else if (subKey == "keydesc") {
//           subKey = "paragraph";
//         } else {
//           subKey = subKey;
//         }
//         appendData(`${key}[${subKey}]`, v);
//       });
//     } else {
//       formData.append(key, value);
//     }
//   }

//   Object.keys(json).forEach((key) => {
//     appendData(key, json[key]);
//   });

//   return formData;
// }

// function jsonToFormData(json: any) {
//   const formData = new FormData();

//   function appendData(key: any, value: any) {
//     if (value instanceof File) {
//       formData.append(key, value);
//     } else if (Array.isArray(value)) {
//       value.forEach((item, index) => {
//         appendData(`${key}[${index}]`, item);
//       });
//     } else if (typeof value === "object" && value !== null) {
//       Object.keys(value).forEach((subKey) => {
//         const v = value[subKey];
//         if (subKey == "title") {
//           subKey = "heading";
//         } else if (subKey == "keydesc") {
//           subKey = "paragraph";
//         } else {
//           subKey = subKey;
//         }
//         appendData(`${key}[${subKey}]`, v);
//       });
//     } else {
//       formData.append(key, value);
//     }
//   }

//   Object.keys(json).forEach((key) => {
//     appendData(key, json[key]);
//   });

//   return formData;
// }
function jsonToFormData(json: any) {
  const formData = new FormData();

  function appendData(key: any, value: any) {
    // Handle File objects
    if (value instanceof File) {
      formData.append(key, value);
    }
    // Handle Arrays
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        appendData(`${key}[${index}]`, item);
      });
    }
    // Handle Objects (but not Files)
    else if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((subKey) => {
        let adjustedSubKey = subKey;
        const v = value[subKey];

        // Adjust key names if needed
        if (subKey === "title") {
          adjustedSubKey = "heading";
        } else if (subKey === "keydesc") {
          adjustedSubKey = "paragraph";
        }

        appendData(`${key}[${adjustedSubKey}]`, v);
      });
    }
    // Handle primitive values
    else {
      formData.append(key, value);
    }
  }

  // Process each field in the JSON
  Object.keys(json).forEach((key) => {
    const value = json[key];
    // Special handling for file fields
    if (key === "file" || key === "icon_image") {
      if (value instanceof File) {
        formData.append(key, value);
      }
    } else {
      appendData(key, value);
    }
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

  // title: Yup.string()
  //   .trim()
  //   .required("Key feature title is required")
  //   .min(2, "Title must be at least 2 characters")
  //   .max(100, "Title cannot exceed 100 characters"),

  // keydesc: Yup.string()
  //   .trim()
  //   .required("Key feature description is required")
  //   .min(2, "description must be at least 2 characters")
  //   .max(100, "description cannot exceed 100 characters"),
});

const addProductDetails = Yup.object({
  // Hero Section
  heroMainHeading: Yup.string().required("Hero heading is required"),
  heroSubHeading: Yup.string().required("Hero subheading is required"),
  heroCTAText: Yup.string().required("Hero CTA text is required"),
  // heroBgImage: Yup.string().required("Hero background image is required"),

  // Product Overview
  productOverviewMainHeading: Yup.string().required(
    "Product overview heading is required"
  ),
  productOverviewSubHeading: Yup.string().required(
    "Product overview subheading is required"
  ),
  // productOverviewImage: Yup.string().required(
  //   "Product overview image is required"
  // ),

  // Key Features
  keyFeaturesMainHeading: Yup.string().required(
    "Key features heading is required"
  ),
  keyFeaturesSubHeading: Yup.string().required(
    "Key features sub heading is required"
  ),
  // keyFeatureDetailsImage: Yup.string().required(
  //   "Key features image is required"
  // ),
  // keyFeaturesOthers: Yup.array().of(Yup.string()),

  // Developer Interface
  developerInterfaceMainHeading: Yup.string().required(
    "Developer interface heading is required"
  ),
  developerInterfaceSubHeading: Yup.string().required(
    "Developer interface subheading is required"
  ),
  // developerInterfaceImage: Yup.string().required(
  //   "Developer interface image is required"
  // ),

  // Feature Sections
  modularKernelMainHeading: Yup.string().required(
    "Modular kernel heading is required"
  ),
  modularKernelSubHeading: Yup.string().required(
    "Modular kernel subheading is required"
  ),
  // modularKernelImage: Yup.string().required("Modular kernel image is required"),

  unifiedPluginMainHeading: Yup.string().required(
    "Unified plugin heading is required"
  ),
  unifiedPluginSubHeading: Yup.string().required(
    "Unified plugin subheading is required"
  ),
  // unifiedPluginImage: Yup.string().required("Unified plugin image is required"),

  preBuiltEffectMainHeading: Yup.string().required(
    "Pre-built effect heading is required"
  ),
  preBuiltEffectSubHeading: Yup.string().required(
    "Pre-built effect subheading is required"
  ),
  // preBuiltEffectImage: Yup.string().required(
  //   "Pre-built effect image is required"
  // ),

  optimizedPerformanceMainHeading: Yup.string().required(
    "Optimized performance heading is required"
  ),
  optimizedPerformanceSubHeading: Yup.string().required(
    "Optimized performance subheading is required"
  ),
  // optimizedPerformanceImage: Yup.string().required(
  //   "Optimized performance image is required"
  // ),

  // Continuous Updates
  continuousUpdatesMainHeading: Yup.string().required(
    "Continuous updates heading is required"
  ),
  continuousUpdatesSubHeading: Yup.string().required(
    "Continuous updates subheading is required"
  ),
  // continuousUpdatesImage: Yup.string().required(
  //   "Continuous updates image is required"
  // ),

  // How It Works
  howItWorksMainHeading: Yup.string().required(
    "How it works heading is required"
  ),
  // howItWorksSteps: Yup.array().of(Yup.string()),

  // Contact Us
  contactUsMainHeading: Yup.string().required("Contact us heading is required"),
  contactUsSubHeading: Yup.string().required(
    "Contact us subheading is required"
  ),
  contactUsCTAText: Yup.string().required("Contact us CTA text is required"),
  // contactUsImage: Yup.string().required("Contact us image is required"),
});
// const validationSchema = Yup.object().shape({
//   ...homeMasterValidationSchema.fields,
//   ...addProductDetails.fields,
// });
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
  const { masterHome, busy, message } = useHomeMaster();
  const { masterCategory, busy: catbusy } = useCategoriesMaster();
  console.log("category", category);

  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUrlIcon, setPreviewUrlIcon] = useState<string | null>(null);
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
  const [editState, setEditState] = useState<EditState>({
    section: null,
    index: null,
  });
  const [ourSolutionOthers, setOurSolutionOthers] = useState<
    Array<{ heading: string; title: string }>
  >([]);
  const [addDevEdit1Others, setAddDevEdit1Others] = useState<
    Array<{ heading: string; title: string }>
  >([]);
  const [addDevEdit2Others, setAddDevEdit2Others] = useState<
    Array<{ heading: string; title: string }>
  >([]);

  const [howItWorksOthers, setHowItWorksOthers] = useState<
    Array<{ heading: string; title: string }>
  >([]);
  const [keyFeatDetailStepsOthers, setKeyFeatDetailStepsOthers] = useState<
    Array<{ heading: string; title: string }>
  >([]);
  const [uploadedImages, setUploadedImages] = useState<{
    mainIcon?: string;
    logoIcons?: string;
    heroBgImage?: string;
    productOverviewImage?: string;
    keyFeatureDetailsImage?: string;
    developerInterfaceImage?: string;
    modularKernelImage?: string;
    unifiedPluginImage?: string;
    preBuiltEffectImage?: string;
    optimizedPerformanceImage?: string;
    continuousUpdatesImage?: string;
    contactUsImage?: string;
  }>({});
  const detail = category?.productDetails;
  const heroSection = detail?.components?.find(
    (c: any) => c.name === "hero_section"
  );
  const productOverview = detail?.components?.find(
    (c: any) => c.name === "product_overview"
  );
  const keyFeaturesDetails = detail?.components?.find(
    (c: any) => c.name === "key_features"
  );
  const developerInterface = detail?.components?.find(
    (c: any) => c.name === "developer_interface"
  );
  const featureSection1 = detail?.components?.find(
    (c: any) => c.name === "feature_section_1"
  );
  const featureSection2 = detail?.components?.find(
    (c: any) => c.name === "feature_section_2"
  );
  const featureSection3 = detail?.components?.find(
    (c: any) => c.name === "feature_section_3"
  );
  const featureSection4 = detail?.components?.find(
    (c: any) => c.name === "feature_section_4"
  );
  const continuousUpdates = detail?.components?.find(
    (c: any) => c.name === "continuous_updates"
  );
  const howItWorks = detail?.components?.find(
    (c: any) => c.name === "how_it_works"
  );
  const contactUs = detail?.components?.find(
    (c: any) => c.name === "contact_us"
  );
  const [images, setImages] = useState<Record<string, ImageState>>({
    mainIcon: {
      file: null,
      preview: null,
      existingUrl: category?.url || "",
    },
    logoIcons: {
      file: null,
      preview: null,
      existingUrl: category?.icon_image || "",
    },
    heroBgImage: {
      file: null,
      preview: null,
      existingUrl: heroSection?.bgImage?.url || "",
    },
    productOverviewImage: {
      file: null,
      preview: null,
      existingUrl: productOverview?.image?.url || "",
    },
    keyFeatureDetailsImage: {
      file: null,
      preview: null,
      existingUrl: keyFeaturesDetails?.image?.url || "",
    },
    developerInterfaceImage: {
      file: null,
      preview: null,
      existingUrl: developerInterface?.image?.url || "",
    },
    modularKernelImage: {
      file: null,
      preview: null,
      existingUrl: featureSection1?.image?.url || "",
    },
    unifiedPluginImage: {
      file: null,
      preview: null,
      existingUrl: featureSection2?.image?.url || "",
    },
    preBuiltEffectImage: {
      file: null,
      preview: null,
      existingUrl: featureSection3?.image?.url || "",
    },
    optimizedPerformanceImage: {
      file: null,
      preview: null,
      existingUrl: featureSection4?.image?.url || "",
    },
    continuousUpdatesImage: {
      file: null,
      preview: null,
      existingUrl: continuousUpdates?.image?.url || "",
    },
    contactUsImage: {
      file: null,
      preview: null,
      existingUrl: contactUs?.image?.url || "",
    },
  });

  const getImageUrl = (imageInfo: any) => {
    // Construct full URL for existing images
    return imageInfo?.url
      ? `https://rabbitvpn.sgp1.digitaloceanspaces.com/${imageInfo.url}`
      : "/logo512.png";
  };
  const getIconImageUrl = (data: any) => {
    if (!data) return "";
    return data?.icon_image || "";
  };

  const initialValue = useMemo(() => {
    if (category) {
      if (category?.url) {
        setPreviewUrl(category?.url);
      }
      if (category?.icon_image) {
        setPreviewUrlIcon(category?.icon_image);
      }
      if (keyFeaturesDetails?.others) {
        setKeyFeatDetailStepsOthers(keyFeaturesDetails.others);
      }
      if (featureSection1?.others) {
        setAddDevEdit1Others(featureSection1.others);
      }
      if (featureSection2?.others) {
        setAddDevEdit2Others(featureSection2.others);
      }
      if (howItWorks?.others) {
        setHowItWorksOthers(howItWorks.others);
      }
      return {
        name: category?.name || "",
        service: category?.category?._id || category?.category || "",
        description: category?.description || "",
        description2: category?.description2 || "",
        tstatement: category?.tstatement || "",
        tags: category.tags?.split(" ").join(" ") || "",
        keyFeatures: keyFeatures,

        heroMainHeading: heroSection?.mainHeading || "",
        heroSubHeading: heroSection?.subHeading || "",
        heroCTAText: heroSection?.CTA_text || "",
        heroBgImage: heroSection?.bgImage?._id || "",

        // Product Overview
        productOverviewMainHeading: productOverview?.mainHeading || "",
        productOverviewSubHeading: productOverview?.subHeading || "",
        productOverviewImage: productOverview?.image?._id || "",

        // Key Features
        keyFeaturesMainHeading: keyFeaturesDetails?.mainHeading || "",
        keyFeaturesSubHeading: keyFeaturesDetails?.subHeading || "",
        keyFeatureDetailsImage: keyFeaturesDetails?.image?._id || "",
        keyFeaturesOthers: keyFeaturesDetails?.others || [],

        // Developer Interface
        developerInterfaceMainHeading: developerInterface?.mainHeading || "",
        developerInterfaceSubHeading: developerInterface?.subHeading || "",
        developerInterfaceImage: developerInterface?.image?._id || "",

        // Feature Section 1 (Modular Kernel)
        modularKernelImage: featureSection1?.image?._id || "",
        modularKernelMainHeading: featureSection1?.mainHeading || "",
        modularKernelSubHeading: featureSection1?.subHeading || "",
        keyFeaturesOther: featureSection1?.others || [],

        // Feature Section 2 (Unified Plugin)
        unifiedPluginImage: featureSection2?.image?._id || "",
        unifiedPluginMainHeading: featureSection2?.mainHeading || "",
        unifiedPluginSubHeading: featureSection2?.subHeading || "",

        // Feature Section 3 (Pre-Built Effect)
        preBuiltEffectImage: featureSection3?.image?._id || "",
        preBuiltEffectMainHeading: featureSection3?.mainHeading || "",
        preBuiltEffectSubHeading: featureSection3?.subHeading || "",

        // Feature Section 4 (Optimized Performance)
        optimizedPerformanceImage: featureSection4?.image?._id || "",
        optimizedPerformanceMainHeading: featureSection4?.mainHeading || "",
        optimizedPerformanceSubHeading: featureSection4?.subHeading || "",

        // Continuous Updates
        continuousUpdatesImage: continuousUpdates?.image?._id || "",
        continuousUpdatesMainHeading: continuousUpdates?.mainHeading || "",
        continuousUpdatesSubHeading: continuousUpdates?.subHeading || "",

        // How It Works
        howItWorksMainHeading: howItWorks?.mainHeading || "",
        howItWorksSteps: howItWorks?.others || [],

        // Contact Us
        contactUsImage: contactUs?.image?._id || "",
        contactUsMainHeading: contactUs?.mainHeading || "",
        contactUsSubHeading: contactUs?.subHeading || "",
        contactUsCTAText: contactUs?.CTA_text || "",
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

      heroMainHeading: "",
      heroSubHeading: "",
      heroCTAText: "",
      heroBgImage: "",

      // Product Overview
      productOverviewMainHeading: "",
      productOverviewSubHeading: "",
      productOverviewImage: "",

      // Key Features
      keyFeaturesMainHeading: "",
      keyFeaturesSubHeading: "",
      keyFeatureDetailsImage: "",
      keyFeaturesOthers: [],

      // Developer Interface
      developerInterfaceMainHeading: "",
      developerInterfaceSubHeading: "",
      developerInterfaceImage: "",

      // Feature Section 1 (Modular Kernel)
      modularKernelImage: "",
      modularKernelMainHeading: "",
      modularKernelSubHeading: "",
      keyFeaturesOther: [],

      // Feature Section 2 (Unified Plugin)
      unifiedPluginImage: "",
      unifiedPluginMainHeading: "",
      unifiedPluginSubHeading: "",

      // Feature Section 3 (Pre-Built Effect)
      preBuiltEffectImage: "",
      preBuiltEffectMainHeading: "",
      preBuiltEffectSubHeading: "",

      // Feature Section 4 (Optimized Performance)
      optimizedPerformanceImage: "",
      optimizedPerformanceMainHeading: "",
      optimizedPerformanceSubHeading: "",

      // Continuous Updates
      continuousUpdatesImage: "",
      continuousUpdatesMainHeading: "",
      continuousUpdatesSubHeading: "",

      // How It Works
      howItWorksMainHeading: "",
      howItWorksSteps: [],

      // Contact Us
      contactUsImage: "",
      contactUsMainHeading: "",
      contactUsSubHeading: "",
      contactUsCTAText: "",
    };
  }, [category, serviceOptions]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.size > 20 * 1024 * 1024) return;
    // const localPreviewUrl = URL.createObjectURL(file);
    setImages((prev) => ({
      ...prev,
      [imageType]: {
        file,
        preview: URL.createObjectURL(file),
        existingUrl: undefined,
      },
    }));

    // try {
    //   const formData = new FormData();
    //   formData.append("file", file);
    //   const response = await axios.post(
    //     `${process.env.REACT_APP_BASE_URL}/upload`,
    //     formData
    //   );
    //   setUploadedImages((prev: any) => ({
    //     ...prev,
    //     [imageType]: response.data.data._id,
    //   }));
    //   console.log("uploadedImages:", response.data.data._id);
    // } catch (error) {
    //   console.error("Error uploading image:", error);
    // }

    if (imageType === "mainIcon") {
      setFieldValue("image", file);
    } else if (imageType === "logoIcons") {
      setFieldValue("icon_image", file);
    } else {
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
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  const handleAddOthers = (
    section: string,
    values: any,
    setFieldValue: any
  ) => {
    if (values[`${section}OtherHeading`] || values[`${section}OtherTitle`]) {
      const newOther = {
        heading: values[`${section}OtherHeading`] || "",
        title: values[`${section}OtherTitle`] || "",
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
        case "addDevEdit1":
          // if (addDevEdit1Others.length >= 2) {
          if (editState.section === "addDevEdit1" && editState.index !== null) {
            // Update existing entry
            const updatedOthers = [...addDevEdit1Others];
            updatedOthers[editState.index] = newOther;
            setAddDevEdit1Others(updatedOthers);
            setEditState({ section: null, index: null });
          } else if (addDevEdit1Others.length < 1) {
            setAddDevEdit1Others((prev) => [...prev, newOther]);
          } else {
            toast({
              title: "Maximum limit reached",
              description: "You can only add up to 1 entries",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          break;

        case "howItWorks":
          // if (howItWorksOthers.length >= 2) {
          if (editState.section === "howItWorks" && editState.index !== null) {
            // Update existing entry
            const updatedOthers = [...howItWorksOthers];
            updatedOthers[editState.index] = newOther;
            setHowItWorksOthers(updatedOthers);
            setEditState({ section: null, index: null });
          } else if (howItWorksOthers.length < 4) {
            setHowItWorksOthers((prev) => [...prev, newOther]);
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

        case "addDevEdit2":
          // if (addDevEdit2Others.length >= 2) {
          if (editState.section === "addDevEdit2" && editState.index !== null) {
            // Update existing entry
            const updatedOthers = [...addDevEdit2Others];
            updatedOthers[editState.index] = newOther;
            setAddDevEdit2Others(updatedOthers);
            setEditState({ section: null, index: null });
          } else if (addDevEdit2Others.length < 1) {
            setAddDevEdit2Others((prev) => [...prev, newOther]);
          } else {
            toast({
              title: "Maximum limit reached",
              description: "You can only add up to 1 entries",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          break;

        case "keyFeatureProcess":
          if (
            editState.section === "keyFeatureProcess" &&
            editState.index !== null
          ) {
            // Update existing entry
            const updatedOthers = [...keyFeatDetailStepsOthers];
            updatedOthers[editState.index] = newOther;
            setKeyFeatDetailStepsOthers(updatedOthers);
            setEditState({ section: null, index: null });
          } else if (keyFeatDetailStepsOthers.length < 4) {
            setKeyFeatDetailStepsOthers((prev) => [...prev, newOther]);
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
        title: "Required field",
        description: "Please enter either a heading or a title",
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
        : section === "addDevEdit1"
        ? addDevEdit1Others
        : section === "howItWorks"
        ? howItWorksOthers
        : section === "addDevEdit2"
        ? addDevEdit2Others
        : keyFeatDetailStepsOthers;
    const itemToEdit = othersArray[index];

    setEditState({ section, index });
    setFieldValue(`${section}OtherHeading`, itemToEdit.heading);
    setFieldValue(`${section}OtherTitle`, itemToEdit.title);
  };
  const onSubmit = async (values: Record<string, any>) => {
    if (keyFeatures.length < 2) {
      toast({
        title: "Validation Error",
        description: "Please add at least 2 key features",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return; // Prevent submission
    }
    try {
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
        // file:
        //   values.image instanceof File
        //     ? values.image
        //     : uploadedImages?.mainIcon || "",
        file: values.image || "",
        icon_image: values.icon_image || "",
      };

      const formData = jsonToFormData(payload);

      console.log("payloaddddddddddd", payload);

      const components = [
        {
          name: "hero_section",
          mainHeading: values.heroMainHeading,
          subHeading: values.heroSubHeading,
          CTA_text: values.heroCTAText,
          // bgImage: values.heroBgImage,
          bgImage: uploadedImages?.heroBgImage || values.heroBgImage || "",
          order: 0,
        },
        {
          name: "product_overview",
          mainHeading: values.productOverviewMainHeading,
          subHeading: values.productOverviewSubHeading,
          image:
            uploadedImages?.productOverviewImage ||
            values.productOverviewImage ||
            "",
          // image: uploadedImages?.overviewImage || values.overviewImage || "",
          order: 1,
        },
        {
          name: "key_features",
          mainHeading: values.keyFeaturesMainHeading,
          subHeading: values.keyFeaturesSubHeading,
          image:
            uploadedImages?.keyFeatureDetailsImage ||
            values.keyFeatureDetailsImage ||
            "",
          // image: uploadedImages?.keyFeaImage || values.keyFeaImage || "",
          // others: values.keyFeaturesOthers,
          others: keyFeatDetailStepsOthers,
          order: 2,
        },
        {
          name: "developer_interface",
          mainHeading: values.developerInterfaceMainHeading,
          subHeading: values.developerInterfaceSubHeading,
          image:
            uploadedImages?.developerInterfaceImage ||
            values.developerInterfaceImage ||
            "",
          // image: uploadedImages?.devInterImage || values.devInterImage || "",
          order: 3,
        },
        {
          name: "feature_section_1",
          image:
            uploadedImages?.modularKernelImage ||
            values.modularKernelImage ||
            "",
          // image: uploadedImages?.fs1Image || values.fs1Image || "",
          mainHeading: values.modularKernelMainHeading,
          subHeading: values.modularKernelSubHeading,
          // others: values.keyFeaturesOther,
          others: addDevEdit1Others,
          order: 4,
        },
        {
          name: "feature_section_2",
          image:
            uploadedImages?.unifiedPluginImage || values.unifiedPluginImage,
          // image: uploadedImages?.fs2Image || values.fs2Image || "",
          mainHeading: values.unifiedPluginMainHeading,
          subHeading: values.unifiedPluginSubHeading,
          // others: values.keyFeaturesOther,
          others: addDevEdit2Others,
          order: 5,
        },
        {
          name: "feature_section_3",
          image:
            uploadedImages?.preBuiltEffectImage || values.preBuiltEffectImage,
          // image: uploadedImages?.fs3Image || values.fs3Image || "",
          mainHeading: values.preBuiltEffectMainHeading,
          subHeading: values.preBuiltEffectSubHeading,
          order: 6,
        },
        {
          name: "feature_section_4",
          image:
            uploadedImages?.optimizedPerformanceImage ||
            values.optimizedPerformanceImage,
          // image: uploadedImages?.fs4Image || values.fs4Image || "",
          mainHeading: values.optimizedPerformanceMainHeading,
          subHeading: values.optimizedPerformanceSubHeading,
          order: 7,
        },
        {
          name: "continuous_updates",
          image:
            uploadedImages?.continuousUpdatesImage ||
            values.continuousUpdatesImage,
          // image: uploadedImages?.updatesImage || values.updatesImage || "",
          mainHeading: values.continuousUpdatesMainHeading,
          subHeading: values.continuousUpdatesSubHeading,
          order: 8,
        },
        {
          name: "how_it_works",
          mainHeading: values.howItWorksMainHeading,
          // others: values.howItWorksSteps || "",
          others: howItWorksOthers,
          order: 9,
        },
        {
          name: "contact_us",
          image: uploadedImages?.contactUsImage || values.contactUsImage,
          // image: uploadedImages?.contactImage || values.contactImage || "",
          mainHeading: values.contactUsMainHeading,
          subHeading: values.contactUsSubHeading,
          CTA_text: values.contactUsCTAText,
          order: 10,
        },
      ];
      if (category?._id) {
        const data = { payload: formData, _id: category._id };
        dispatch({
          type: REQUEST_UPDATE_MASTER_HOME,
          data,
          onSuccess: async (response: any) => {
            console.log("response", response);
            // try {
            // After product update, update client story
            const proDetailsData = {
              product: category?._id,
              components,
            };
            console.log("proDetailsData", proDetailsData);

            await axios({
              method: "patch",
              url: `${process.env.REACT_APP_BASE_URL}/product-details/${category.productDetails?._id}`,
              data: proDetailsData,
              withCredentials: true,
            })
              .then((proDetailUpdateResponse) => {
                console.log(
                  "product details update response:",
                  proDetailUpdateResponse
                );
                dispatch({ type: REQUEST_MASTER_HOME });
                toast({
                  title: "Success.",
                  description: "Product details and product is updated.",
                  status: "success",
                  isClosable: true,
                  position: "top-right",
                });
                onClose();

                // If both updates are successful, refresh the client list and close
                // onClose();
              })
              .catch((error) => {
                console.error("API Error:", error);
              });
            // } catch (error) {
            //   console.error("Error updating product details:", error);
            //   toast({
            //     title: "Error updating product details",
            //     status: "error",
            //     duration: 3000,
            //   });
            // }
          },
        });
        // setTimeout(() => {
        //   onClose();
        // }, 1000);
      } else {
        dispatch({
          type: REQUEST_CREATE_MASTER_HOME,
          payload: formData,
          onSuccess: async (response: any) => {
            console.log("response", response);
            try {
              // After product creation, create product details
              const proDetailsData = {
                product: response.data.data._id,
                components,
              };
              console.log("proDetailsDataupdate", proDetailsData);

              axios({
                method: "post",
                url: `${process.env.REACT_APP_BASE_URL}/product-details`,
                data: proDetailsData,
                withCredentials: true,
              })
                .then((proDetailResponse) => {
                  console.log("Product details response:", proDetailResponse);
                  // If both create are successful, refresh the product list and close
                  dispatch({ type: REQUEST_MASTER_HOME });
                  toast({
                    title: "Success.",
                    description: "Product details and product is created.",
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                  });
                  onClose();
                })
                .catch((error) => {
                  console.error("API Error:", error);
                });
              onClose();
            } catch (error) {
              console.error("Error creating product details:", error);
              toast({
                title: "Error creating product details",
                status: "error",
                duration: 3000,
              });
            }
          },
        });
        // setTimeout(() => {
        //   onClose();
        // }, 1000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error submitting form",
        status: "error",
        duration: 3000,
      });
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
    if (category && masterHome) {
      const categoryFromStore = masterHome.find(
        (ml: any) => ml._id === category._id
      );

      console.log("category from store ", categoryFromStore);
      if (
        categoryFromStore &&
        // categoryFromStore.name !== category.name ||
        (categoryFromStore.heading_sub !== category.description ||
          // categoryFromStore.heading_main !== category.heading_main)
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
  }, [masterHome, category, onClose, toast, categoriess, busy, toast]);

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <Formik
            initialValues={initialValue}
            onSubmit={onSubmit}
            validationSchema={addProductDetails}
          >
            {({
              values,
              setFieldValue,
              errors,
              touched,
              submitForm,
              handleChange,
              handleBlur,
              isSubmitting,
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
                            document.getElementById("main-icon-upload")?.click()
                          }
                        >
                          {images.mainIcon.preview ||
                          images.mainIcon.existingUrl
                            ? "Change Product Image"
                            : "Upload Product Image"}
                          {/* {previewUrl ? "Change Icon" : "Upload Icon"} */}
                        </Button>
                        <Input
                          id="main-icon-upload"
                          type="file"
                          display="none"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls"
                          onChange={(e) =>
                            handleImageUpload(e, "mainIcon", setFieldValue)
                          }
                        />
                        {(images.mainIcon.preview ||
                          images.mainIcon.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.mainIcon.preview || getImageUrl(category)
                              }
                              alt="Main Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
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
                            document.getElementById("logo-icon-upload")?.click()
                          }
                        >
                          {images.logoIcons.preview ||
                          images.logoIcons.existingUrl
                            ? "Change Product Icon"
                            : "Upload Product Icon"}
                          {/* {previewUrl ? "Change Icon" : "Upload Icon"} */}
                        </Button>
                        <Input
                          id="logo-icon-upload"
                          type="file"
                          display="none"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls"
                          onChange={(e) =>
                            handleImageUpload(e, "logoIcons", setFieldValue)
                          }
                        />
                        {(images.logoIcons.preview ||
                          images.logoIcons.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.logoIcons.preview ||
                                getIconImageUrl(category)
                              }
                              alt="Main Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
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

                      {/* <Flex
                        alignItems="center"
                        justifyContent="center"
                        gap="14px"
                      > */}
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Name"
                          fieldName="name"
                          placeholder="Enter name"
                          type="text"
                          error={undefined}
                          // error={
                          //   touched.name
                          //     ? (errors.name as string)
                          //     : undefined
                          // }
                        />
                        {touched.name && errors.name && (
                          <Text color="red.500" fontSize="sm"></Text>
                        )}
                      </FormControl>

                      <FormControl pb={3}>
                        {/* <FormField
                            required={true}
                            name="Heading sub"
                            fieldName="description"
                            placeholder="Enter description"
                            type="text"
                            error={undefined}
                          />
                          {touched.description && errors.description && (
                            <Text color="red.500" fontSize="sm"></Text>
                          )} */}

                        <FormEditor
                          required={true}
                          name="Heading sub"
                          fieldName="description"
                          filedValue={values.description}
                        />
                      </FormControl>
                      {/* </Flex> */}

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

                      {/* <FormControl pb={3}>
                        <FormField
                          name="Statement"
                          fieldName="tstatement"
                          placeholder="Enter statement"
                          type="text"
                          error={undefined}
                          required={false}
                        />
                      </FormControl> */}
                      <FormEditor
                        required={true}
                        name="Statement"
                        fieldName="tstatement"
                        filedValue={values.tstatement}
                      />
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
                        {keyFeatures.length < 2 &&
                          editState.section !== "keyFeatureProcess" && (
                            <Text fontSize="sm" color="red.500" ml={2}>
                              (Minimum 2 key features have to be added)
                            </Text>
                          )}
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
                      {/* addsssssssssssssss hear other contentssssssssssssssss */}
                      {/* addsssssssssssssss hear other contentssssssssssssssss */}

                      {/* ---------description ------------*/}
                      <Text
                        fontWeight={"700"}
                        fontSize="22px"
                        mb={3}
                        color="#000"
                      >
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
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.heroBgImage && errors.heroBgImage && (
                          <Text fontSize="sm" color="red" mt={2}>
                            {touched.heroBgImage
                              ? (errors.heroBgImage as string)
                              : undefined}
                          </Text>
                        )} */}
                      </Flex>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Heading :"
                          fieldName="heroMainHeading"
                          placeholder="Enter Heading"
                          type="text"
                          error={
                            touched.heroMainHeading
                              ? (errors.heroMainHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Sub Heading : "
                          fieldName="heroSubHeading"
                          placeholder="Enter Sub Headng"
                          type="text"
                          error={
                            touched.heroSubHeading
                              ? (errors.heroSubHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="CTA text : "
                          fieldName="heroCTAText"
                          placeholder="Enter CTA Text:"
                          type="text"
                          error={
                            touched.heroCTAText
                              ? (errors.heroCTAText as string)
                              : undefined
                          }
                        />
                      </FormControl>

                      {/* other hirosection after textt */}
                      {/* other hirosection after textt */}
                      {/* other hirosection after textt */}

                      {/* Product Overview ------------------*/}
                      <Flex
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <FormLabel>Product Overview</FormLabel>
                        <Button
                          variant="ghost"
                          color="#cb30ff"
                          leftIcon={<FiUpload />}
                          border="1px dashed #CB30FF"
                          p={4}
                          borderRadius="md"
                          onClick={() =>
                            document
                              .getElementById("prouct-overview-upload")
                              ?.click()
                          }
                        >
                          {images.productOverviewImage.preview ||
                          images.productOverviewImage.existingUrl
                            ? "Change Title Image"
                            : "Upload Title Image"}
                        </Button>

                        <Input
                          id="prouct-overview-upload"
                          type="file"
                          display="none"
                          name="aboutimage"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "productOverviewImage",
                              setFieldValue
                            )
                          }
                        />

                        {/* // {images.aboutImage.preview && ( */}
                        {(images.productOverviewImage.preview ||
                          images.productOverviewImage.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.productOverviewImage.preview ||
                                getImageUrl(
                                  category?.productDetails?.components?.find(
                                    (c: any) => c.name === "product_overview"
                                  )?.image
                                )
                              }
                              alt="Product Overview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}
                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.productOverviewImage &&
                          errors.productOverviewImage && (
                            <Text fontSize="sm" color="red" mt={2}>
                              {touched.productOverviewImage
                                ? (errors.productOverviewImage as string)
                                : undefined}
                            </Text>
                          )} */}
                      </Flex>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Heading : "
                          fieldName="productOverviewMainHeading"
                          placeholder="Enter Heading"
                          type="text"
                          error={
                            touched.productOverviewMainHeading
                              ? (errors.productOverviewMainHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Description : "
                          fieldName="productOverviewSubHeading"
                          placeholder="Enter Description"
                          type="text"
                          error={
                            touched.productOverviewSubHeading
                              ? (errors.productOverviewSubHeading as string)
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

                      {/* Key Features ------------------*/}
                      <Flex
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <FormLabel>Key Features Details</FormLabel>
                        <Button
                          variant="ghost"
                          color="#cb30ff"
                          leftIcon={<FiUpload />}
                          border="1px dashed #CB30FF"
                          p={4}
                          borderRadius="md"
                          onClick={() =>
                            document
                              .getElementById("keyfeature-detail-upload")
                              ?.click()
                          }
                        >
                          {images.keyFeatureDetailsImage.preview ||
                          images.keyFeatureDetailsImage.existingUrl
                            ? "Change Title Image"
                            : "Upload Title Image"}
                        </Button>

                        <Input
                          id="keyfeature-detail-upload"
                          type="file"
                          display="none"
                          name="processimage"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "keyFeatureDetailsImage",
                              setFieldValue
                            )
                          }
                        />

                        {(images.keyFeatureDetailsImage.preview ||
                          images.keyFeatureDetailsImage.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.keyFeatureDetailsImage.preview ||
                                getImageUrl(
                                  category?.productDetails?.components?.find(
                                    (c: any) => c.name === "key_features"
                                  )?.image
                                )
                              }
                              alt="Key Features"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}

                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.keyFeatureDetailsImage &&
                          errors.keyFeatureDetailsImage && (
                            <Text fontSize="sm" color="red" mt={2}>
                              {touched.keyFeatureDetailsImage
                                ? (errors.keyFeatureDetailsImage as string)
                                : undefined}
                            </Text>
                          )} */}

                        <FormControl pb={3}>
                          <FormField
                            required={true}
                            name="Heading : "
                            fieldName="keyFeaturesMainHeading"
                            placeholder="Enter KeyFeatures Heading"
                            type="text"
                            error={
                              touched.keyFeaturesMainHeading
                                ? (errors.keyFeaturesMainHeading as string)
                                : undefined
                            }
                          />
                        </FormControl>

                        <FormControl pb={3}>
                          <FormField
                            required={true}
                            name="Description : "
                            fieldName="keyFeaturesSubHeading"
                            placeholder="Enter KeyFeatures Description"
                            type="text"
                            error={
                              touched.keyFeaturesSubHeading
                                ? (errors.keyFeaturesSubHeading as string)
                                : undefined
                            }
                          />
                        </FormControl>

                        <FormControl pb={3}>
                          <FormLabel htmlFor="keyFeatureProcessOtherHeading">
                            Heading
                          </FormLabel>
                          <Field
                            as={Input}
                            id="keyFeatureProcessOtherHeading"
                            name="keyFeatureProcessOtherHeading"
                            placeholder="Enter heading"
                            // value={values.title}
                            // onChange={handleChange}
                            // onBlur={handleBlur}
                          />
                        </FormControl>

                        <FormControl pb={3}>
                          <FormLabel htmlFor="keyFeatureProcessOtherTitle">
                            Title
                          </FormLabel>
                          <Field
                            as={Input}
                            id="keyFeatureProcessOtherTitle"
                            name="keyFeatureProcessOtherTitle"
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
                            handleAddOthers(
                              "keyFeatureProcess",
                              values,
                              setFieldValue
                            )
                          }
                          // onClick={() => {
                          //   if (keyFeatDetailStepsOthers.length < 4) {
                          //     handleAddOthers("keyFeatureProcess", values, setFieldValue);
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
                          {editState.section === "keyFeatureProcess" &&
                          editState.index !== null
                            ? "Update"
                            : "Add"}{" "}
                          Key Feature Details
                          {keyFeatDetailStepsOthers.length >= 4 &&
                            editState.section !== "keyFeatureProcess" && (
                              <Text fontSize="sm" color="red.500" ml={2}>
                                (Limit reached)
                              </Text>
                            )}
                        </Box>

                        <Flex wrap="wrap" gap="10px">
                          {keyFeatDetailStepsOthers.map((other, index) => (
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
                                  "keyFeatureProcess",
                                  values,
                                  setFieldValue
                                )
                              }
                              position="relative"
                            >
                              <Text fontWeight="bold">{other.heading}:</Text>
                              <Text>{other.title}</Text>
                              {editState.section === "keyFeatureProcess" &&
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

                      {/* Problem Statement ------------------*/}
                      <FormLabel>Developer-Friendly Interface</FormLabel>
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
                            document.getElementById("developer-upload")?.click()
                          }
                        >
                          {images.developerInterfaceImage.preview ||
                          images.developerInterfaceImage.existingUrl
                            ? "Change Title Image"
                            : "Upload Title Image"}
                        </Button>

                        <Input
                          id="developer-upload"
                          type="file"
                          display="none"
                          name="developerInterfaceImage"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "developerInterfaceImage",
                              setFieldValue
                            )
                          }
                        />
                        {/* {images.developerInterfaceImage.preview && ( */}
                        {(images.developerInterfaceImage.preview ||
                          images.developerInterfaceImage.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.developerInterfaceImage.preview ||
                                getImageUrl(
                                  category?.productDetails?.components?.find(
                                    (c: any) => c.name === "developer_interface"
                                  )?.image
                                )
                              }
                              alt="Developer Friendly Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}

                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.developerInterfaceImage &&
                          errors.developerInterfaceImage && (
                            <Text fontSize="sm" color="red" mt={2}>
                              {touched.developerInterfaceImage
                                ? (errors.developerInterfaceImage as string)
                                : undefined}
                            </Text>
                          )} */}
                      </Flex>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Heading : "
                          fieldName="developerInterfaceMainHeading"
                          placeholder="Enter Heading"
                          type="text"
                          error={
                            touched.developerInterfaceMainHeading
                              ? (errors.developerInterfaceMainHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Description : "
                          fieldName="developerInterfaceSubHeading"
                          placeholder="Enter Description"
                          type="text"
                          error={
                            touched.developerInterfaceSubHeading
                              ? (errors.developerInterfaceSubHeading as string)
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

                      {/* Developer Editon (Key Feture 1) ------------------*/}
                      <Flex
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <FormLabel>Developer Editon (Key Feture 1)</FormLabel>
                        <Button
                          variant="ghost"
                          color="#cb30ff"
                          leftIcon={<FiUpload />}
                          border="1px dashed #CB30FF"
                          p={4}
                          borderRadius="md"
                          onClick={() =>
                            document.getElementById("modular-upload")?.click()
                          }
                        >
                          {images.modularKernelImage.preview ||
                          images.modularKernelImage.existingUrl
                            ? "Change Title Image"
                            : "Upload Title Image"}
                        </Button>

                        <Input
                          id="modular-upload"
                          type="file"
                          display="none"
                          name="modularKernelImage"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "modularKernelImage",
                              setFieldValue
                            )
                          }
                        />
                        {/* {images.modularKernelImage.preview && ( */}
                        {(images.modularKernelImage.preview ||
                          images.modularKernelImage.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.modularKernelImage.preview ||
                                getImageUrl(
                                  category?.productDetails?.components?.find(
                                    (c: any) => c.name === "feature_section_1"
                                  )?.image
                                )
                              }
                              alt="feature_section"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}

                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.modularKernelImage &&
                          errors.modularKernelImage && (
                            <Text fontSize="sm" color="red" mt={2}>
                              {touched.modularKernelImage
                                ? (errors.modularKernelImage as string)
                                : undefined}
                            </Text>
                          )} */}
                      </Flex>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="MainHeading : "
                          fieldName="modularKernelMainHeading"
                          placeholder="Enter MainHeading"
                          type="text"
                          error={
                            touched.modularKernelMainHeading
                              ? (errors.modularKernelMainHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="SubHeading : "
                          fieldName="modularKernelSubHeading"
                          placeholder="Enter SubHeading"
                          type="text"
                          error={
                            touched.modularKernelSubHeading
                              ? (errors.modularKernelSubHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormControl pb={3}>
                        <FormLabel htmlFor="addDevEdit1OtherHeading">
                          Title
                        </FormLabel>
                        <Field
                          as={Input}
                          id="addDevEdit1OtherHeading"
                          name="addDevEdit1OtherHeading"
                          placeholder="Enter heading"
                          // isDisabled={addSolutionOthers.length >= 2}
                          // value={values.title}
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
                          handleAddOthers("addDevEdit1", values, setFieldValue)
                        }
                        // onClick={() => {
                        //   if (addDevEdit1Others.length < 2) {
                        //     handleAddOthers("addDevEdit1", values, setFieldValue);
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
                        {editState.section === "addDevEdit1" &&
                        // addDevEdit1Others.length < 2 &&
                        editState.index !== null
                          ? "Update"
                          : "Add"}{" "}
                        feature section{" "}
                        {addDevEdit1Others.length >= 1 &&
                          editState.section !== "addDevEdit1" && (
                            <Text fontSize="sm" color="red.500" ml={2}>
                              (Limit reached)
                            </Text>
                          )}
                        {/* <Text fontSize="sm" color="gray.500" mt={1}>
                      {section === "ourSolution"
                        ? `${2 - ourSolutionOthers.length} slots remaining`
                        : `${2 - addDevEdit1Others.length} slots remaining`}
                    </Text> */}
                      </Box>

                      <Flex wrap="wrap" gap="10px">
                        {addDevEdit1Others.map((other, index) => (
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
                                "addDevEdit1",
                                values,
                                setFieldValue
                              )
                            }
                            position="relative"
                          >
                            <Text fontWeight="bold">{other.heading} </Text>
                            {/* <Text>{other.title}</Text> */}
                            {editState.section === "addDevEdit1" &&
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

                      <Divider
                        borderRadius={"8px"}
                        opacity={"1"}
                        mb={5}
                        mt={2}
                        color={"#EFEFEF"}
                        size="xl"
                      />

                      {/* Developer Editon (Key Feture 2) ------------------*/}
                      <Flex
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <FormLabel>Developer Editon (Key Feture 2)</FormLabel>
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
                          {images.unifiedPluginImage.preview ||
                          images.unifiedPluginImage.existingUrl
                            ? "Change Title Image"
                            : "Upload Title Image"}
                        </Button>

                        <Input
                          id="problem-upload"
                          type="file"
                          display="none"
                          name="unifiedPluginImage"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "unifiedPluginImage",
                              setFieldValue
                            )
                          }
                        />
                        {/* {images.unifiedPluginImage.preview && ( */}
                        {(images.unifiedPluginImage.preview ||
                          images.unifiedPluginImage.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.unifiedPluginImage.preview ||
                                getImageUrl(
                                  category?.productDetails?.components?.find(
                                    (c: any) => c.name === "feature_section_2"
                                  )?.image
                                )
                              }
                              alt="feature_section"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}

                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.unifiedPluginImage &&
                          errors.unifiedPluginImage && (
                            <Text fontSize="sm" color="red" mt={2}>
                              {touched.unifiedPluginImage
                                ? (errors.unifiedPluginImage as string)
                                : undefined}
                            </Text>
                          )} */}
                      </Flex>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="MainHeading : "
                          fieldName="unifiedPluginMainHeading"
                          placeholder="Enter MainHeading"
                          type="text"
                          error={
                            touched.unifiedPluginMainHeading
                              ? (errors.unifiedPluginMainHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="SubHeading : "
                          fieldName="unifiedPluginSubHeading"
                          placeholder="Enter SubHeading"
                          type="text"
                          error={
                            touched.unifiedPluginSubHeading
                              ? (errors.unifiedPluginSubHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormControl pb={3}>
                        <FormLabel htmlFor="addDevEdit2OtherHeading">
                          Title
                        </FormLabel>
                        <Field
                          as={Input}
                          id="addDevEdit2OtherHeading"
                          name="addDevEdit2OtherHeading"
                          placeholder="Enter heading"
                          // isDisabled={addSolutionOthers.length >= 2}
                          // value={values.title}
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
                          handleAddOthers("addDevEdit2", values, setFieldValue)
                        }
                        // onClick={() => {
                        //   if (addDevEdit2Others.length < 2) {
                        //     handleAddOthers("addDevEdit2", values, setFieldValue);
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
                        {editState.section === "addDevEdit2" &&
                        // addDevEdit2Others.length < 2 &&
                        editState.index !== null
                          ? "Update"
                          : "Add"}{" "}
                        feature section{" "}
                        {addDevEdit2Others.length >= 1 &&
                          editState.section !== "addDevEdit2" && (
                            <Text fontSize="sm" color="red.500" ml={2}>
                              (Limit reached)
                            </Text>
                          )}
                        {/* <Text fontSize="sm" color="gray.500" mt={1}>
                      {section === "ourSolution"
                        ? `${2 - ourSolutionOthers.length} slots remaining`
                        : `${2 - addDevEdit2Others.length} slots remaining`}
                    </Text> */}
                      </Box>

                      <Flex wrap="wrap" gap="10px">
                        {addDevEdit2Others.map((other, index) => (
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
                                "addDevEdit2",
                                values,
                                setFieldValue
                              )
                            }
                            position="relative"
                          >
                            <Text fontWeight="bold">{other.heading} </Text>
                            <Text>{other.title}</Text>
                            {/* <Text fontWeight="bold">"Test": </Text>
                          <Text>"Test"</Text> */}
                            {editState.section === "addDevEdit2" &&
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

                      <Divider
                        borderRadius={"8px"}
                        opacity={"1"}
                        mb={5}
                        mt={2}
                        color={"#EFEFEF"}
                        size="xl"
                      />

                      {/* feature_section 3 ------------------*/}
                      <Flex
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <FormLabel>Feature Section 3</FormLabel>
                        <Button
                          variant="ghost"
                          color="#cb30ff"
                          leftIcon={<FiUpload />}
                          border="1px dashed #CB30FF"
                          p={4}
                          borderRadius="md"
                          onClick={() =>
                            document.getElementById("preBuilt-upload")?.click()
                          }
                        >
                          {images.preBuiltEffectImage.preview ||
                          images.preBuiltEffectImage.existingUrl
                            ? "Change Title Image"
                            : "Upload Title Image"}
                        </Button>

                        <Input
                          id="preBuilt-upload"
                          type="file"
                          display="none"
                          name="preBuiltEffectImage"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "preBuiltEffectImage",
                              setFieldValue
                            )
                          }
                        />
                        {/* {images.preBuiltEffectImage.preview && ( */}
                        {(images.preBuiltEffectImage.preview ||
                          images.preBuiltEffectImage.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.preBuiltEffectImage.preview ||
                                getImageUrl(
                                  category?.productDetails?.components?.find(
                                    (c: any) => c.name === "feature_section_3"
                                  )?.image
                                )
                              }
                              alt="feature_section"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}

                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.preBuiltEffectImage &&
                          errors.preBuiltEffectImage && (
                            <Text fontSize="sm" color="red" mt={2}>
                              {touched.preBuiltEffectImage
                                ? (errors.preBuiltEffectImage as string)
                                : undefined}
                            </Text>
                          )} */}
                      </Flex>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="MainHeading : "
                          fieldName="preBuiltEffectMainHeading"
                          placeholder="Enter MainHeading"
                          type="text"
                          error={
                            touched.preBuiltEffectMainHeading
                              ? (errors.preBuiltEffectMainHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="SubHeading : "
                          fieldName="preBuiltEffectSubHeading"
                          placeholder="Enter SubHeading"
                          type="text"
                          error={
                            touched.preBuiltEffectSubHeading
                              ? (errors.preBuiltEffectSubHeading as string)
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

                      {/* feature_section 4 ------------------*/}
                      <Flex
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <FormLabel>Feature Section 4</FormLabel>
                        <Button
                          variant="ghost"
                          color="#cb30ff"
                          leftIcon={<FiUpload />}
                          border="1px dashed #CB30FF"
                          p={4}
                          borderRadius="md"
                          onClick={() =>
                            document.getElementById("optimized-upload")?.click()
                          }
                        >
                          {images.optimizedPerformanceImage.preview ||
                          images.optimizedPerformanceImage.existingUrl
                            ? "Change Title Image"
                            : "Upload Title Image"}
                        </Button>

                        <Input
                          id="optimized-upload"
                          type="file"
                          display="none"
                          name="optimizedPerformanceImage"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "optimizedPerformanceImage",
                              setFieldValue
                            )
                          }
                        />
                        {/* {images.optimizedPerformanceImage.preview && ( */}
                        {(images.optimizedPerformanceImage.preview ||
                          images.optimizedPerformanceImage.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.optimizedPerformanceImage.preview ||
                                getImageUrl(
                                  category?.productDetails?.components?.find(
                                    (c: any) => c.name === "feature_section_4"
                                  )?.image
                                )
                              }
                              alt="feature_section"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}

                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.optimizedPerformanceImage &&
                          errors.optimizedPerformanceImage && (
                            <Text fontSize="sm" color="red" mt={2}>
                              {touched.optimizedPerformanceImage
                                ? (errors.optimizedPerformanceImage as string)
                                : undefined}
                            </Text>
                          )} */}
                      </Flex>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="MainHeading : "
                          fieldName="optimizedPerformanceMainHeading"
                          placeholder="Enter MainHeading"
                          type="text"
                          error={
                            touched.optimizedPerformanceMainHeading
                              ? (errors.optimizedPerformanceMainHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>

                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="SubHeading : "
                          fieldName="optimizedPerformanceSubHeading"
                          placeholder="Enter SubHeading"
                          type="text"
                          error={
                            touched.optimizedPerformanceSubHeading
                              ? (errors.optimizedPerformanceSubHeading as string)
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

                      {/*our solution solution------------------*/}

                      {/* Continuous Updates and Support ------------------*/}
                      <Flex
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <FormLabel>Continuous Updates and Support</FormLabel>
                        <Button
                          variant="ghost"
                          color="#cb30ff"
                          leftIcon={<FiUpload />}
                          border="1px dashed #CB30FF"
                          p={4}
                          borderRadius="md"
                          onClick={() =>
                            document.getElementById("updates-upload")?.click()
                          }
                        >
                          {images.continuousUpdatesImage.preview ||
                          images.continuousUpdatesImage.existingUrl
                            ? "Change Title Image"
                            : "Upload Title Image"}
                        </Button>

                        <Input
                          id="updates-upload"
                          type="file"
                          display="none"
                          name="continuousUpdatesImage"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "continuousUpdatesImage",
                              setFieldValue
                            )
                          }
                        />

                        {(images.continuousUpdatesImage.preview ||
                          images.continuousUpdatesImage.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.continuousUpdatesImage.preview ||
                                getImageUrl(
                                  category?.productDetails?.components?.find(
                                    (c: any) => c.name === "continuous_updates"
                                  )?.image
                                )
                              }
                              alt="call PreviewContinuous"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}

                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.continuousUpdatesImage &&
                          errors.continuousUpdatesImage && (
                            <Text fontSize="sm" color="red" mt={2}>
                              {touched.continuousUpdatesImage
                                ? (errors.continuousUpdatesImage as string)
                                : undefined}
                            </Text>
                          )} */}
                      </Flex>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Heading : "
                          fieldName="continuousUpdatesMainHeading"
                          placeholder="Enter Heading"
                          type="text"
                          error={
                            touched.continuousUpdatesMainHeading
                              ? (errors.continuousUpdatesMainHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Description : "
                          fieldName="continuousUpdatesSubHeading"
                          placeholder="Enter Description"
                          type="text"
                          error={
                            touched.continuousUpdatesSubHeading
                              ? (errors.continuousUpdatesSubHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>

                      <Divider
                        opacity={"1"}
                        mb={5}
                        mt={2}
                        color={"#EFEFEF"}
                        borderRadius={"8px"}
                        size="xl"
                      />

                      {/*How It Works------------------*/}
                      <Flex
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <FormLabel>How It Works</FormLabel>

                        <FormControl pb={3}>
                          <FormField
                            required={true}
                            name="Heading : "
                            type="text"
                            fieldName="howItWorksMainHeading"
                            placeholder="Enter heading"
                            error={
                              touched.howItWorksMainHeading
                                ? (errors.howItWorksMainHeading as string)
                                : undefined
                            }
                          />
                        </FormControl>
                        <FormControl pb={3}>
                          <FormLabel htmlFor="howItWorksOtherHeading">
                            Title
                          </FormLabel>
                          <Field
                            as={Input}
                            id="howItWorksOtherHeading"
                            name="howItWorksOtherHeading"
                            placeholder="Enter title"
                          />
                        </FormControl>

                        <FormControl pb={3}>
                          <FormLabel htmlFor="howItWorksOtherTitle">
                            Description
                          </FormLabel>
                          <Field
                            as={Input}
                            id="howItWorksOtherTitle"
                            name="howItWorksOtherTitle"
                            placeholder="Enter description"
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
                            handleAddOthers("howItWorks", values, setFieldValue)
                          }
                          // onClick={() => {
                          //   if (howItWorksOthers.length < 2) {
                          //     handleAddOthers("howItWorks", values, setFieldValue);
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
                          {editState.section === "howItWorks" &&
                          // howItWorksOthers.length < 2 &&
                          editState.index !== null
                            ? "Update"
                            : "Add"}{" "}
                          Work Features{" "}
                          {howItWorksOthers.length >= 2 &&
                            editState.section !== "howItWorks" && (
                              <Text fontSize="sm" color="red.500" ml={2}>
                                (Limit reached)
                              </Text>
                            )}
                          {/* <Text fontSize="sm" color="gray.500" mt={1}>
                      {section === "ourSolution"
                        ? `${2 - ourSolutionOthers.length} slots remaining`
                        : `${2 - howItWorksOthers.length} slots remaining`}
                    </Text> */}
                        </Box>

                        <Flex wrap="wrap" gap="10px">
                          {howItWorksOthers.map((other, index) => (
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
                                  "howItWorks",
                                  values,
                                  setFieldValue
                                )
                              }
                              position="relative"
                            >
                              <Text fontWeight="bold">{other.heading}: </Text>
                              <Text>{other.title}</Text>
                              {/* <Text fontWeight="bold">"Test": </Text>
                            <Text>"Test"</Text> */}
                              {editState.section === "howItWorks" &&
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

                      {/* <Divider color={"#EFEFEF"} size="xl" /> */}
                      {/* Outcome & Impact ------------------*/}

                      {/* Call to Action ------------------*/}
                      <Flex
                        direction="column"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                      >
                        <FormLabel>Contact Us</FormLabel>
                        <Button
                          variant="ghost"
                          color="#cb30ff"
                          leftIcon={<FiUpload />}
                          border="1px dashed #CB30FF"
                          p={4}
                          borderRadius="md"
                          onClick={() =>
                            document.getElementById("contactUs-upload")?.click()
                          }
                        >
                          {images.contactUsImage.preview ||
                          images.contactUsImage.existingUrl
                            ? "Change Title Image"
                            : "Upload Title Image"}
                        </Button>

                        <Input
                          id="contactUs-upload"
                          type="file"
                          display="none"
                          name="contactUsImage"
                          accept=".png,.jpg,.jpeg,.doc,.docx,.pdf,.xlsx,.xls,.webp,.svg"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "contactUsImage",
                              setFieldValue
                            )
                          }
                        />

                        {(images.contactUsImage.preview ||
                          images.contactUsImage.existingUrl) && (
                          <Box mt={2}>
                            <img
                              src={
                                images.contactUsImage.preview ||
                                getImageUrl(
                                  category?.productDetails?.components?.find(
                                    (c: any) => c.name === "contact_us"
                                  )?.image
                                )
                              }
                              alt="contactUs Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          </Box>
                        )}

                        <Text fontSize="sm" color="gray.500" mt={2}>
                          Supported file types: .png, .jpg, .jpeg, .doc, .docx,
                          .pdf, .xlsx, .xls Max file size: 20 MB
                        </Text>
                        {/* {touched.contactUsImage && errors.contactUsImage && (
                          <Text fontSize="sm" color="red" mt={2}>
                            {touched.contactUsImage
                              ? (errors.contactUsImage as string)
                              : undefined}
                          </Text>
                        )} */}
                      </Flex>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Heading : "
                          fieldName="contactUsMainHeading"
                          placeholder="Enter Heading"
                          type="text"
                          error={
                            touched.contactUsMainHeading
                              ? (errors.contactUsMainHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="Description : "
                          fieldName="contactUsSubHeading"
                          placeholder="Enter Description"
                          type="text"
                          error={
                            touched.contactUsSubHeading
                              ? (errors.contactUsSubHeading as string)
                              : undefined
                          }
                        />
                      </FormControl>
                      <FormControl pb={3}>
                        <FormField
                          required={true}
                          name="CTA text : "
                          fieldName="contactUsCTAText"
                          placeholder="Enter CTA Text:"
                          type="text"
                          error={
                            touched.contactUsCTAText
                              ? (errors.contactUsCTAText as string)
                              : undefined
                          }
                        />
                      </FormControl>
                      {/* other hirosection after textt */}
                    </DrawerBody>

                    {/* buttons  */}
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
                        // onClick={() => {
                        //   console.log("clickesd");
                        // }}
                        onClick={submitForm}
                        disabled={busy}
                        background="#cd30ff"
                        type="submit"
                        isLoading={isSubmitting}
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

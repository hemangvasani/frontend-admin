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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import { get } from "lodash";
import Select from "react-select";
import { MdModeEditOutline } from "react-icons/md";
import { FormField } from "../form/formField/FormField";
import {
  REQUEST_CREATE_MASTER_CATEGORIES,
  REQUEST_UPDATE_MASTER_CATEGORIES,
  SET_MESSAGE_MASTER_CATEGORIES,
} from "../../store/category/categoryActionTypes";
import { useCategoriesMaster } from "../../store/category/reducer";

interface Props {
  category?: any;
  isOpen: any;
  onClose: any;
}

const addSchema = Yup.object({
  // originalSizeImage: Yup.mixed().required("A file is required"),
  title: Yup.string().required("Required"),
  // tagId: Yup.array()
  //   .required("Required")
  //   .of(
  //     Yup.object().shape({
  //       value: Yup.string().required(),
  //     })
  //   )
  //   .min(1, "Select at least one Category"),
});

const AddCategoryDrawer: React.FC<Props> = ({ category, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const { masterCategory, busy, message } = useCategoriesMaster();
  // console.log(masterTags);

  const toast = useToast();
  const [isDisabled, setDisabled] = useState(!!(category && category._id));

  const initialValue = useMemo(() => {
    if (category) {
      return {
        // originalSizeImage: category.originalSizeImage
        //   ? category.originalSizeImage
        //   : "",
        // mediumSizeImage: category.mediumSizeImage
        //   ? category.mediumSizeImage
        //   : "",
        // smallSizeImage: category.smallSizeImage ? category.smallSizeImage : "",
        title: category.title,
      };
    }
    return {
      // originalSizeImage: "",
      title: "",
      // tagId: [],
    };
  }, [category]);

  const onSubmit = (values: Record<string, any>) => {
    let payload: Record<string, any> = {
      title: values.title,
      // originalSizeImage: values.originalSizeImage._id,
      // mediumSizeImage: values.mediumSizeImage._id,
      // smallSizeImage: values.smallSizeImage._id,
      // tagId: values.tagId.map((item: any) => {
      //   return item.value;
      // }),
    };
    if (category) {
      const data = { payload, _id: category._id };
      dispatch({ type: REQUEST_UPDATE_MASTER_CATEGORIES, data });
    } else {
      dispatch({ type: REQUEST_CREATE_MASTER_CATEGORIES, payload });
    }
  };

  const categories = useMemo(() => {
    return masterCategory;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (category) {
      const categoryFromStore = masterCategory.find(
        (ml: any) => ml._id === category._id
      );
      if (categoryFromStore !== category) {
        toast({
          title: "Success.",
          description: "Category is updated.",
          status: "success",
          isClosable: true,
          position: "top-right",
        });
        onClose();
      }
    } else if (categories.length !== masterCategory.length) {
      toast({
        title: "Success.",
        description: "Category is created.",
        status: "success",
        isClosable: true,
        position: "top-right",
      });
      onClose();
    }
  }, [categories, masterCategory, category, onClose, toast]);

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
              dispatch({ type: SET_MESSAGE_MASTER_CATEGORIES });
            }}
            closeOnOverlayClick={busy}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader backgroundColor={"gray.100"} alignItems={"stretch"}>
                <Flex>
                  {get(category, "title") || "Add Category"}
                  <Spacer></Spacer>
                  {category && category._id && (
                    <IconButton
                      aria-label="update Category"
                      key={"updateCategory"}
                      alignSelf={"end"}
                      onClick={() => {
                        setDisabled(!isDisabled);
                      }}
                      icon={<MdModeEditOutline />}
                    ></IconButton>
                  )}
                </Flex>

                {message && (
                  <Alert status="error">
                    <AlertTitle>{message}</AlertTitle>
                  </Alert>
                )}
              </DrawerHeader>
              <DrawerBody>
                {/* <FormLabel>Image :</FormLabel> */}
                {/* <MultipleImage
                  disabled={isDisabled}
                  image={values["originalSizeImage"]}
                  onSuccess={(fileList: any,fileList1:any,fileList2:any) => {
                    setFieldValue("originalSizeImage", fileList);`
                    setFieldValue("mediumSizeImage", fileList1);
                    setFieldValue("smallSizeImage", fileList2);
                  }}
                ></MultipleImage> */}
                {/* <ImageFormField
                  disabled={isDisabled || busy}
                  image={values["originalSizeImage"]}
                  onSuccess={({ img: image,img2:image2,img3:image3}: { img: string,img2:string ,img3:string}) => {
                    // console.log(image2)
                    if (image) setFieldValue("originalSizeImage", image);
                    if (image2) setFieldValue("mediumSizeImage", image2);
                    if (image3) setFieldValue("smallSizeImage", image3);
                  }}
                />
                <p style={{ color: "red", marginBottom: "10px" }}>
                  {errors.originalSizeImage as string}
                </p> */}

                <FormField
                  required={true}
                  disabled={isDisabled}
                  name="Title : "
                  fieldName="title"
                  placeholder="Enter Title"
                  type="text"
                  error={touched.title ? (errors.title as string) : undefined}
                />
              </DrawerBody>
              <DrawerFooter backgroundColor={"gray.100"}>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={() => {
                    onClose();
                    dispatch({ type: SET_MESSAGE_MASTER_CATEGORIES });
                  }}
                  disabled={busy}
                >
                  Close
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={submitForm}
                  disabled={busy || isDisabled}
                >
                  {category && category._id ? "Update" : "Save"}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};

export default AddCategoryDrawer;

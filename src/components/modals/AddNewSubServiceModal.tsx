import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  REQUEST_CREATE_MASTER_OUR_SERVICES,
  REQUEST_MASTER_OUR_SERVICES,
} from "../../store/ourservices/ourservicesActionTypes";
import { useOurServicesMaster } from "../../store/ourservices/reducer";
import { REQUEST_MASTER_SUB_SERVICES } from "../../store/subservices/subservicesActionTypes";

interface Props {
  servicemain?: any;
  isOpen: boolean;
  onClose: () => void;
  setForceRender: any;
  setFieldValue: any;
  values: any;
}

const AddNewSubServiceModal: React.FC<Props> = ({
  servicemain,
  isOpen,
  onClose,
  setForceRender,
  setFieldValue,
  values,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { masterOurServices, busy: ourservicebusy } = useOurServicesMaster();

  const initialValues = {
    name: "",
    description: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Service Name is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    dispatch({
      type: REQUEST_CREATE_MASTER_OUR_SERVICES,
      payload: formData,
      onSuccess: (response: any) => {
        dispatch({ type: REQUEST_MASTER_OUR_SERVICES });
        dispatch({ type: REQUEST_MASTER_SUB_SERVICES });
        toast({
          title: "Service Saved",
          status: "success",
          duration: 3000,
        });
        setForceRender((prev: any) => !prev);
        setFieldValue((p: any) => {
          console.log(p, response, "ananannana");
          return { ...p, service: response.data.data._id };
        });

        onClose();
        setSubmitting(false);
      },
      onError: () => {
        toast({
          title: "Failed to save service",
          status: "error",
          duration: 3000,
        });
        setSubmitting(false);
      },
    });
  };
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <DrawerContent>
                <DrawerHeader
                  backgroundColor="#E8D7EE"
                  alignItems={"stretch"}
                  borderBottom="1px solid #E0E0E0"
                >
                  {servicemain ? "Edit Main Service" : "Add New Main Service"}
                </DrawerHeader>
                <DrawerBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={!!(errors.name && touched.name)}>
                      <FormLabel>Service Name</FormLabel>
                      <Input
                        color="#08021B"
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.name && touched.name && <></>}
                    </FormControl>

                    <FormControl
                      isInvalid={!!(errors.description && touched.description)}
                    >
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        color="#08021B"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.description && touched.description && <></>}
                    </FormControl>
                  </VStack>
                </DrawerBody>
                <DrawerFooter>
                  <HStack spacing={4}>
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      color="#424242"
                      fontSize={"sm"}
                      border="1px solid #EEE"
                      borderRadius="6px"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={false}
                      fontSize={"sm"}
                      color="#fff"
                      background="#cd30ff"
                      _hover={{ background: "#cd30ff" }}
                    >
                      Save
                      {/* {servicemain ? "Update" : "Save"} */}
                    </Button>
                  </HStack>
                </DrawerFooter>
              </DrawerContent>
            </Form>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};

export default AddNewSubServiceModal;

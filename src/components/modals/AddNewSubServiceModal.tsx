// import React from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Input,
//   FormControl,
//   FormLabel,
//   useDisclosure,
// } from "@chakra-ui/react";

// interface AddNewSubServiceModalProps {
//   servicemain?: any;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const AddNewSubServiceModal: React.FC<AddNewSubServiceModalProps> = ({
//   servicemain,
//   isOpen,
//   onClose,
// }) => {
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle form submission logic here
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Add Main Service</ModalHeader>
//         <form onSubmit={handleSubmit}>
//           <ModalBody>
//             <FormControl>
//               <FormLabel>Service Name</FormLabel>
//               <Input placeholder="Enter category name" size="md" />
//             </FormControl>
//           </ModalBody>

//           <ModalFooter gap={3}>
//             <Button variant="ghost" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" colorScheme="purple">
//               Save
//             </Button>
//           </ModalFooter>
//         </form>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default AddNewSubServiceModal;
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
import { get, result } from "lodash";
// import AddNewSubServiceModal from "../modals/AddNewSubServiceModal";
import { MdModeEditOutline } from "react-icons/md";
import { FormField } from "../form/formField/FormField";
import { FiPlus, FiUpload } from "react-icons/fi";
import { useOurServicesMaster } from "../../store/ourservices/reducer";
import {
  REQUEST_CREATE_MASTER_OUR_SERVICES,
  SET_MASTER_OUR_SERVICES,
  REQUEST_UPDATE_MASTER_OUR_SERVICES,
} from "../../store/ourservices/ourservicesActionTypes";

import { useSubServicesMaster } from "../../store/subservices/reducer";
import { SET_MASTER_SUB_SERVICES } from "../../store/subservices/subservicesActionTypes";

interface Props {
  servicemain?: any;
  isOpen: boolean;
  onClose: () => void;
}

const AddNewSubServiceModal: React.FC<Props> = ({
  servicemain,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { masterOurServices, busy: ourservicebusy } = useOurServicesMaster();

  // Formik initial values
  // const initialValues = useMemo(() => {
  //   return {
  //     name: servicemain ? servicemain.name : "",
  //     description: servicemain ? servicemain.description : "",
  //   };
  // }, [servicemain]);
  const initialValues = {
    name: "",
    description: "",
  };

  // const [isDisabled, setDisabled] = useState(
  //   !!(servicemain && servicemain._id)
  // );

  // Form validation schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Service Name is required"),
    description: Yup.string().required("Description is required"),
    // categoryId: Yup.string().required("Category is required"),
  });

  // Form submit handler
  // const handleSubmit = (values: any) => {
  //   const formData = new FormData();
  //   formData.append("name", values.name);
  //   formData.append("description", values.description);
  //   const payload = formData;
  //   // if (servicemain) {
  //   //   // If we are editing, update the service
  //   //   const data = { payload, _id: servicemain._id };
  //   //   dispatch({
  //   //     type: REQUEST_UPDATE_MASTER_OUR_SERVICES,
  //   //     data,
  //   //   });
  //   //   // dispatch({
  //   //   //   type: REQUEST_UPDATE_MASTER_OUR_SERVICES,
  //   //   //   payload: { payload, _id: servicemain._id },
  //   //   // });
  //   // } else {
  //   // If we are creating a new service
  //   dispatch({
  //     type: REQUEST_CREATE_MASTER_OUR_SERVICES,
  //     payload,
  //   });
  //   // }

  //   toast({
  //     title: "Service Saved",
  //     description: "Your service has been successfully saved.",
  //     status: "success",
  //     duration: 3000,
  //     isClosable: true,
  //   });
  //   // dispatch({ type: REQUEST_MASTER_OUR_SERVICES });
  //   onClose(); // Close the modal after submission
  // };

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    dispatch({
      type: REQUEST_CREATE_MASTER_OUR_SERVICES,
      payload: formData,
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
      onError: () => {
        toast({
          title: "Failed to save service",
          status: "error",
          duration: 3000,
        });
        // setSubmitting(false);
      },
    });
    onClose();
  };
  // const subservicess = useMemo(() => {
  //   return masterOurServices;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // useEffect(() => {
  //   if (!ourservicebusy && !(masterOurServices || []).length) {
  //     dispatch({ type: REQUEST_MASTER_OUR_SERVICES });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
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
                      {errors.name && touched.name && (
                        <></>
                        // <Text color="red.500">{errors.name}</Text>
                      )}
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
                      {errors.description && touched.description && (
                        <></>
                        // <Text color="red.500">{errors.description}</Text>
                      )}
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
                      // colorScheme="teal"
                      // disabled={isDisabled}
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

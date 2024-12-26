import {
  Alert,
  AlertIcon,
  Button,
  CloseButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  AlertTitle,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSubServicesMaster } from "../../store/subservices/reducer";
import { REQUEST_DELETE_MASTER_SUB_SERVICES } from "../../store/subservices/subservicesActionTypes";
interface Props {
  servicemain: any;
  isOpen: any;
  onClose: any;
}
const ServiceMainDeleteConfirmation: React.FC<Props> = ({
  servicemain,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { masterSubServices, busy, message, success } = useSubServicesMaster();
  const { _id } = servicemain;
  const toast = useToast();

  // useEffect(() => {
  // const findEvent = masterSubServices.data.find(
  //   (val: Record<string, any>) => val._id === _id
  // );
  //   if (success && !busy) {
  //     toast({
  //       title: "Success.",
  //       description: "Service Main is deleted.",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top-right",
  //     });
  //     onClose();
  //   }
  // }, [_id, masterSubServices, success, busy, onClose, toast]);

  // useEffect(() => {
  //   if (success && !busy) {
  //     toast({
  //       title: "Success.",
  //       description: "Service is deleted.",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top-right",
  //     });
  //     onClose();
  //   } else if (!success && !busy) {
  //     toast({
  //       title: "Error.",
  //       description: message,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top-right",
  //     });
  //   }
  // }, [success, busy, onClose, toast]);

  useEffect(() => {
    let toastShown = false;

    if (!busy) {
      if (success) {
        toast({
          title: "Success",
          description: "Service is deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onClose();
        toastShown = true;
      } else if (message && !toastShown) {
        toast({
          title: "Error",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    }
  }, [success, busy, message, onClose, toast]);

  useEffect(() => {
    const findEvent = masterSubServices.data.find(
      (val: Record<string, any>) => val._id === _id
    );

    if (!findEvent) {
      onClose();
    }
  }, [_id, masterSubServices, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete News</ModalHeader>
        <ModalCloseButton disabled={busy} />
        <ModalBody>
          <Text fontWeight="bold" mb="1rem">
            Are you sure you want to delete this content?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} disabled={busy}>
            Close
          </Button>
          <Button
            colorScheme="red"
            variant={"outline"}
            mr={3}
            disabled={busy}
            onClick={() => {
              dispatch({
                type: REQUEST_DELETE_MASTER_SUB_SERVICES,
                payload: { _id: servicemain._id },
              });
            }}
          >
            Submit
          </Button>
        </ModalFooter>
        {message && !success && (
          <ModalFooter>
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{message}</AlertTitle>
              <CloseButton position="absolute" right="8px" top="8px" />
            </Alert>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ServiceMainDeleteConfirmation;

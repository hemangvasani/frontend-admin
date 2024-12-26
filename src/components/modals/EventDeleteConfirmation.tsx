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
import { useEventMaster } from "../../store/event/reducer";
import { REQUEST_DELETE_MASTER_EVENT } from "../../store/event/eventActionTypes";
interface Props {
  event: any;
  isOpen: any;
  onClose: any;
}
const EventDeleteConfirmation: React.FC<Props> = ({
  event,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { masterEvent: events, busy, message } = useEventMaster();
  const { _id } = event;
  const toast = useToast();
  useEffect(() => {
    const findEvent = events.find(
      (val: Record<string, any>) => val._id === _id
    );
    if (!findEvent) {
      toast({
        title: "Success.",
        description: "Event is deleted.",
        status: "success",
        isClosable: true,
        position: "top-right",
      });
      onClose();
    }
  }, [_id, events, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Event</ModalHeader>
        <ModalCloseButton disabled={busy} />
        <ModalBody>
          <Text fontWeight="bold" mb="1rem">
            {`Are you sure you want to delete this ${event.title}?`}
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
                type: REQUEST_DELETE_MASTER_EVENT,
                payload: { _id: event._id },
              });
            }}
          >
            Submit
          </Button>
        </ModalFooter>
        {message && (
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

export default EventDeleteConfirmation;

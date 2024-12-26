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
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { REQUEST_DELETE_MASTER_FAQS } from "../../store/faq/faqActionTypes";
import { useFaqsMaster } from "../../store/faq/reducer";
interface Props {
  faq: any;
  isOpen: any;
  onClose: any;
}
const FaqDeleteModal: React.FC<Props> = ({ faq, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { busy, masterFaqs, message } = useFaqsMaster();

  const { _id } = faq;
  useEffect(() => {
    const findCategory = masterFaqs.find(
      (val: Record<string, any>) => val._id === _id
    );

    if (!findCategory) {
      onClose();
    }
  }, [_id, masterFaqs, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Faqs</ModalHeader>
        <ModalCloseButton disabled={busy} />
        <ModalBody>
          <Text fontWeight="bold" mb="1rem">
            Are you sure to delete this faq?
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
                type: REQUEST_DELETE_MASTER_FAQS,
                payload: { _id: faq._id },
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

export default FaqDeleteModal;

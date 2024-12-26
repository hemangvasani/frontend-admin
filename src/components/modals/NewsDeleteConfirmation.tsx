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
import { REQUEST_DELETE_MASTER_NEWS } from "../../store/news/newsActionTypes";
import { useNewsMaster } from "../../store/news/reducer";
interface Props {
  news: any;
  isOpen: any;
  onClose: any;
}
const NewsDeleteConfirmation: React.FC<Props> = ({ news, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { masterNews, busy, message } = useNewsMaster();
  const { _id } = news;
  const toast = useToast();
  useEffect(() => {
    const findEvent = masterNews.find(
      (val: Record<string, any>) => val._id === _id
    );
    if (!findEvent) {
      toast({
        title: "Success.",
        description: "News is deleted.",
        status: "success",
        isClosable: true,
        position: "top-right",
      });
      onClose();
    }
  }, [_id, masterNews, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete News</ModalHeader>
        <ModalCloseButton disabled={busy} />
        <ModalBody>
          <Text fontWeight="bold" mb="1rem">
            {`Are you sure you want to delete this ${news.title}?`}
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
                type: REQUEST_DELETE_MASTER_NEWS,
                payload: { _id: news._id },
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

export default NewsDeleteConfirmation;

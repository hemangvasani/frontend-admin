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
import { REQUEST_DELETE_MASTER_CATEGORIES } from "../../store/category/categoryActionTypes";
import { useCategoriesMaster } from "../../store/category/reducer";
interface Props {
    tag: any;
    isOpen: any;
    onClose: any;
}
const CategoryDeleteConfirmation: React.FC<Props> = ({ tag, isOpen, onClose }) => {
    const dispatch = useDispatch();
  const { masterCategory, busy,message } = useCategoriesMaster();


    const { _id } = tag;
    useEffect(() => {
        const findCategory = masterCategory.find((val: Record<string, any>) => val._id === _id);
        
        if (!findCategory) {
            
            onClose();
        }
    }, [_id, masterCategory, onClose]);
    

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Delete Category</ModalHeader>
                <ModalCloseButton disabled={busy} />
                <ModalBody>
                    <Text fontWeight="bold" mb="1rem">
                        Are you sure to delete?
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
                                type: REQUEST_DELETE_MASTER_CATEGORIES,
                                payload: { _id: tag._id },
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

export default CategoryDeleteConfirmation;
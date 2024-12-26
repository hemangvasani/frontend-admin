import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Spacer,
  useDisclosure,
  VStack,
  Select,
} from "@chakra-ui/react";
import { useContactMaster } from "../../store/contactus/reducer";
import { REQUEST_MASTER_CONTACTUS } from "../../store/contactus/contactusActionTypes";
import ContactMasterTable from "../../components/ContactMasterTable/ContactMasterTable";
import ContactusEditDrawer from "../../components/drawer/ContactusEditDrawer/ContactusEditDrawer";

const Contactus = () => {
  const { masterContact, conbusy } = useContactMaster();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: REQUEST_MASTER_CONTACTUS });
  }, []);

  return (
    <>
      <VStack top={5} position="relative" key={"vStack"}>
        <Flex w="92%" alignItems="center" justifyContent="space-between">
          <Heading
            ml="8"
            size="md"
            fontWeight="semibold"
            color="black.400"
            p={2}
          >
            Contact us
          </Heading>
        </Flex>
      </VStack>
      <ContactMasterTable />
      {isOpen && <ContactusEditDrawer isOpen onClose={onClose} />}
    </>
  );
};

export default Contactus;

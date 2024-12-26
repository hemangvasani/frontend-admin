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
import {
  REQUEST_MASTER_FAQS,
  REQUEST_MASTER_FAQS_CATEGORIES,
} from "../../store/faq/faqActionTypes";
import { useFaqsMaster } from "../../store/faq/reducer";
import FaqsMasterTable from "../../components/FaqsMasterTable/FaqsMasterTable";
import FaqsEditDrawer from "../../components/drawer/FaqsEditDrawer";

const Home = () => {
  const { masterFaqsCat, busy, masterFaqs } = useFaqsMaster();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: REQUEST_MASTER_FAQS });
    dispatch({ type: REQUEST_MASTER_FAQS_CATEGORIES });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [searchQuery, setSearch] = useState("");

  return (
    <>
      <VStack top={5} position="relative" key={"vStack"}>
        <Flex w="92%" alignItems="center" justifyContent="space-between">
          <Heading ml="8" size="md" fontWeight="semibold" color="black.400">
            Faqs
          </Heading>
          <Spacer></Spacer>
          <Heading size="md" fontWeight="semibold">
            <Center>
              <Input
                id="search"
                type="text"
                placeholder="Search..."
                mr={3}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                fontSize="sm"
                bg="#ffffff80"
                color="#9E9E9E"
                border="1px solid #b2b2b233"
                w="250px"
              ></Input>
              <Box
                bg="#cd30ff"
                w="250px"
                color="white"
                textAlign={"center"}
                p={3}
                onClick={() => {
                  onOpen();
                  //   setaddErrorMsg("");
                }}
                fontSize="sm"
                style={{ cursor: "pointer" }}
                borderRadius="8px"
              >
                + Add Faqs
              </Box>
            </Center>
          </Heading>
        </Flex>
      </VStack>
      <FaqsMasterTable query={searchQuery} />
      {isOpen && <FaqsEditDrawer isOpen onClose={onClose} />}
    </>
  );
};

export default Home;

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
} from "@chakra-ui/react";
import { REQUEST_MASTER_NEWS } from "../../store/news/newsActionTypes";
import { useNewsMaster } from "../../store/news/reducer";
import NewsMaterTable from "../../components/NewsMaterTable/NewsMaterTable";
import NewsEditDrawer from "../../components/drawer/NewsEditDrawer";

const News = () => {
  const { masterNews, busy } = useNewsMaster();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!busy && !(masterNews || []).length) {
      dispatch({ type: REQUEST_MASTER_NEWS });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchQuery, setSearch] = useState("");
  return (
    <>
      <VStack top={5} position="relative" key={"vStack"}>
        <Flex w="92%">
          <Heading ml="8" size="lg" fontWeight="semibold" color="black.400">
            News
          </Heading>
          <Spacer></Spacer>
          <Heading size="md" fontWeight="semibold">
            <Center>
              <Input
                id="search"
                type="text"
                placeholder="Search..."
                mr={5}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              ></Input>
              <Box
                bg="tomato"
                w="300px"
                color="white"
                p={3}
                onClick={() => {
                  onOpen();
                  //   setaddErrorMsg("");
                }}
                style={{ cursor: "pointer" }}
              >
                + Add News
              </Box>
            </Center>
          </Heading>
        </Flex>
      </VStack>
      <NewsMaterTable query={searchQuery} />
      {isOpen && <NewsEditDrawer isOpen onClose={onClose} />}
    </>
  );
};

export default News;

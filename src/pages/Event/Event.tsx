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
import { REQUEST_MASTER_EVENT } from "../../store/event/eventActionTypes";
import { useEventMaster } from "../../store/event/reducer";
import EventMasterTable from "../../components/EventMasterTable/EventMasterTable";
import EventMasterEditDrawer from "../../components/drawer/EventMasterEditDrawer";
import { REQUEST_MASTER_CATEGORIES } from "../../store/category/categoryActionTypes";
import { useCategoriesMaster } from "../../store/category/reducer";

const Event = () => {
  const { masterEvent, busy } = useEventMaster();
  const { masterCategory, busy: categoryBusy } = useCategoriesMaster();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!busy && !(masterEvent || []).length) {
      dispatch({ type: REQUEST_MASTER_EVENT });
    }
    if (!categoryBusy && !(masterCategory || []).length) {
      dispatch({ type: REQUEST_MASTER_CATEGORIES });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchQuery, setSearch] = useState("");
  return (
    <>
      <VStack top={5} position="relative" key={"vStack"}>
        <Flex w="92%">
          <Heading ml="8" size="lg" fontWeight="semibold" color="black.400">
            Event
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
                + Add Event
              </Box>
            </Center>
          </Heading>
        </Flex>
      </VStack>
      <EventMasterTable query={searchQuery} />
      {isOpen && <EventMasterEditDrawer isOpen onClose={onClose} />}
    </>
  );
};

export default Event;

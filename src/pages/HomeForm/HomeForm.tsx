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
import { useHomeMaster } from "../../store/home/reducer";
import { REQUEST_MASTER_HOME } from "../../store/home/homeActionTypes";
import HomeMasterEditDrawer from "../../components/drawer/HomeMasterEditDrawer";
import HomeMasterFormTable from "../../components/HomeMasterFormTable/HomeMasterFormTable";

const HomeForm = () => {
  // const { masterHome, busy } = useHomeMaster();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   // if (!busy && !(masterCategory || []).length) {
  //   dispatch({ type: REQUEST_MASTER_HOME });
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // const [searchQuery, setSearch] = useState("");

  return (
    <>
      <VStack top={5} position="relative" key={"vStack"}>
        <Flex w="92%" alignItems="center" justifyContent="space-between">
          <Heading ml="8" size="md" fontWeight="semibold" color="black.400">
            Home Content
          </Heading>
          <Spacer></Spacer>
          <Heading size="md" fontWeight="semibold">
            <Center></Center>
          </Heading>
        </Flex>
      </VStack>
      <HomeMasterFormTable />
      {/* {isOpen && <HomeMasterEditDrawer isOpen onClose={onClose} />} */}
    </>
  );
};

export default HomeForm;

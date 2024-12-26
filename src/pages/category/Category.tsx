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
import { get } from "lodash";
import { useCategoriesMaster } from "../../store/category/reducer";
import { REQUEST_MASTER_CATEGORIES } from "../../store/category/categoryActionTypes";
import CategoryMasterTable from "../../components/CategoryMasterTable/CategoryMasterTable";
import CategoryMasterEditDrawer from "../../components/drawer/CategoryMasterEditDrawer";

const Category = () => {
  const { masterCategory, busy } = useCategoriesMaster();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!busy && !(masterCategory || []).length) {
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
            Category
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
                + Add Category
              </Box>
            </Center>
          </Heading>
        </Flex>
      </VStack>
      <CategoryMasterTable query={searchQuery} />
      {isOpen && <CategoryMasterEditDrawer isOpen onClose={onClose} />}
    </>
  );
};

export default Category;

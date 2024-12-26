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
import HomeMasterTable from "../../components/HomeMasterTable/HomeMasterTable";
import HomeMasterEditDrawer from "../../components/drawer/HomeMasterEditDrawer";

const Home = () => {
  const { masterHome, busy } = useHomeMaster();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  useEffect(() => {
    // if (!busy && !(masterCategory || []).length) {
    dispatch({ type: REQUEST_MASTER_HOME });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [searchQuery, setSearch] = useState("");

  return (
    <>
      <VStack top={5} position="relative" key={"vStack"}>
        <Flex w="92%" alignItems="center" justifyContent="space-between">
          <Heading ml="8" size="md" fontWeight="semibold" color="black.400">
            Products
          </Heading>
          <Spacer></Spacer>
          <Heading size="md" fontWeight="semibold">
            <Center>
              {/* <Select
                mr="3"
                bg="#ffffff80"
                color="#08021B"
                border="1px solid #b2b2b233"
                backgroundColor="white"
                placeholder="All Main Services"
                key={"All"}
                // onChange={(event: any) => {
                //   setCategory(event.target.value);
                // }}
                // onChange={(event: any) => {
                //   setCategory(event.target.value);
                //   let temp = event.target.value;
                //   let temp2 = temp.replace(/[^a-zA-Z0-9]/g, "");
                //   setTempCat(options2[temp2] ? options2[temp2] : []);
                //   setsubCat("");
                // }}
              > */}
              {/* {serviceOptions.map((option: any) => (
                  <option
                    value={option.value}
                    key={option.value}
                    color="#08021B"
                  >
                    {option.label}
                  </option>
                ))} */}
              {/* </Select> */}
              {/* {tempCat.length !== 0 ? (
                <Select
                  // width="100px"
                  mr="5"
                  backgroundColor="white"
                  placeholder="All"
                  key={"Alls"}
                  onChange={(event: any) => {
                    setsubCat(event.target.value);
                  }}
                >
                  {tempCat.map((val) => {
                    return (
                      <option value={val.value} key={val.value}>
                        {val.label}
                      </option>
                    );
                  })}
                </Select>
              ) : (
                ""
              )} */}
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
                w="130px"
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
                + Add Products
              </Box>
            </Center>
          </Heading>
        </Flex>
      </VStack>
      <HomeMasterTable query={searchQuery} />
      {isOpen && <HomeMasterEditDrawer isOpen onClose={onClose} />}
    </>
  );
};

export default Home;

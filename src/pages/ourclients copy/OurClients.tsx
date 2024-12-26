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
import { get } from "lodash";
import { useOurServicesMaster } from "../../store/ourservices/reducer";
import { REQUEST_MASTER_OUR_SERVICES } from "../../store/ourservices/ourservicesActionTypes";
import CategoryMasterTable from "../../components/CategoryMasterTable/CategoryMasterTable";
import OurServicesMasterTable from "../../components/OurServicesMasterTable/OurServicesMasterTable";
import AddSubServiceDrawer from "../../components/drawer/AddSubServiceDrawer";
import { REQUEST_MASTER_CATEGORIES } from "../../store/category/categoryActionTypes";
import { REQUEST_MASTER_SUB_SERVICES } from "../../store/subservices/subservicesActionTypes";
import { useOurClientsMaster } from "../../store/ourclients/reducer";
import { REQUEST_MASTER_OUR_CLIENTS } from "../../store/ourclients/ourclientssActionTypes";
import OurClientsMasterTable from "../../components/OurClientsMasterTable/OurClientsMasterTable";

const OurClients = () => {
  const { masterOurClients, busy } = useOurClientsMaster();
  // console.log(masterOurClients);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [category, setCategory] = useState("");
  const [tempCat, setTempCat] = useState<any[]>([]);
  const [subCat, setsubCat] = useState("");

  const serviceOptions = Array.isArray(masterOurClients.data)
    ? masterOurClients.data.map((service: any) => ({
        value: service._id,
        label: service.name,
      }))
    : [];
  const dispatch = useDispatch();
  useEffect(() => {
    if (!busy && !(masterOurClients || []).length) {
      dispatch({ type: REQUEST_MASTER_OUR_CLIENTS });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchQuery, setSearch] = useState("");
  return (
    <>
      <VStack top={5} position="relative" key={"vStack"}>
        <Flex w="92%" alignItems="center" justifyContent="space-between">
          <Heading ml="8" size="md" fontWeight="semibold" color="black.400">
            Home {">"} Our Services
          </Heading>
          <Spacer></Spacer>
          <Heading size="md" fontWeight="semibold">
            <Center>
              <Select
                // width="300px"
                mr="3"
                bg="#ffffff80"
                color="#08021B"
                border="1px solid #b2b2b233"
                backgroundColor="white"
                // placeholder="All Main Services"
                key={"All"}
                value={category}
                onChange={(event: any) => {
                  console.log("Selected service ID:", event.target.value); // Add thiss
                  setCategory(event.target.value);
                }}
                // onChange={(event: any) => {
                //   setCategory(event.target.value);
                //   let temp = event.target.value;
                //   let temp2 = temp.replace(/[^a-zA-Z0-9]/g, "");
                //   setTempCat(options2[temp2] ? options2[temp2] : []);
                //   setsubCat("");
                // }}
              >
                <option value="">All Services</option>
                {serviceOptions.map((option: any) => (
                  <option
                    value={option.value}
                    key={option.value}
                    color="#08021B"
                  >
                    {option.label}
                  </option>
                ))}
              </Select>
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
                w="250px"
                color="white"
                p={3}
                onClick={() => {
                  onOpen();
                  //   setaddErrorMsg("");
                }}
                fontSize="sm"
                style={{ cursor: "pointer" }}
                borderRadius="8px"
              >
                + Add Sub Service
              </Box>
            </Center>
          </Heading>
        </Flex>
      </VStack>
      <OurClientsMasterTable query={searchQuery} selectedService={category} />
      {/* <OurServicesMasterTable query={searchQuery} selectedService={category} /> */}
      {isOpen && <AddSubServiceDrawer isOpen onClose={onClose} />}
    </>
  );
};

export default OurClients;

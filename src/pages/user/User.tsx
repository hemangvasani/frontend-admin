import { SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useUsers } from "../../store/user/reducer";
import UserTable from "../../components/UserTable/UserTable";
import { REQUEST_USERS } from "../../store/user/userActionType";
import {
  Box,
  Center,
  Flex,
  Heading,
  Input,
  Spacer,
  VStack,
} from "@chakra-ui/react";

const User = () => {
  const { users, busy } = useUsers();
  // console.log(users,!busy && !(users || []).length);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!busy && !(users || []).length) {
      dispatch({ type: REQUEST_USERS });
    }
  }, [users, busy, dispatch]);
  console.log(users);

  const [searchQuery, setSearch] = useState("");
  return (
    <>
      <Box position={"fixed"} w="100%" zIndex={200}>
        <VStack py={3} key={"vStack"} >
          <Flex w="92%">
            <Heading ml="8" size="lg" fontWeight="semibold" >
              User
            </Heading>
            <Spacer></Spacer>
            {/* <Button mr={5}>
            {!busy && !(accounts || []).length ? null : <CSVLink data={csvData} filename="user">Excel</CSVLink>}
          </Button> */}
            <Heading size="md" fontWeight="semibold">
              <Center>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  backgroundColor="white"
                ></Input>
              </Center>
            </Heading>
          </Flex>
        </VStack>
      </Box>
      <UserTable query={searchQuery} />
    </>
  );
};

export default User;

import { Flex, Text, Icon, Menu, MenuButton, Box } from "@chakra-ui/react";
import React from "react";

interface aa {
  icon: any;
  title: any;
}

const NavItem: React.FC<aa> = ({ icon, title }) => {
  return (
    <>
      <Flex mt={1} flexDir="column" w="100%" alignItems="flex-start">
        <Menu placement="right">
          <Box
            p={3}
            borderRadius={8}
            _hover={{ color: "white", backgroundColor: "#cb30ff" }}
            w="100%"
            color="#7F7D95"
          >
            <MenuButton>
              <Flex>
                <Icon as={icon} fontSize="xl" />
                <Text ml={5} display="flex">
                  {title}
                </Text>
              </Flex>
            </MenuButton>
          </Box>
        </Menu>
      </Flex>
    </>
  );
};
export default NavItem;

import React from "react";
import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Flex,
  VStack,
  DrawerFooter,
  Text,
  Box,
} from "@chakra-ui/react";
import { BsList } from "react-icons/bs";
import { MdOutlineEventNote } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import {
  RiUser6Line,
  RiUser3Line,
  RiHeart2Line,
  RiContactsLine,
  RiShoppingBag2Line,
  RiShoppingCartLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import NavItem from "./NavItem";
import { useDispatch } from "react-redux";
import { BiLogOut, BiNews } from "react-icons/bi";
import { FaArrowsAlt } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const dispatch = useDispatch();

  return (
    <>
      <IconButton
        icon={<BsList />}
        //@ts-ignore
        ref={btnRef}
        onClick={onOpen}
        top={5}
        left={5}
        bg="transparent"
        // border="1px solid black"
        position="fixed"
        zIndex={300}
        // backgroundColor={"white"}
        _hover={{ color: "white", backgroundColor: "#cb30ff" }}
      ></IconButton>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        //@ts-ignore
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          {/* <DrawerCloseButton
            _focus={{ border: "none" }}
            my={1.5}
            border="none"
            // color="white"
            _hover={{
              bg: "#cb30ff",
              color: "#fff",
            }}
          /> */}
          <DrawerHeader
            borderBottomWidth="1px"
            fontWeight="bold"
            textAlign="center"
            // background={"black"}
            color="#ff6699"
          >
            <img src="/epenlogo.svg" alt="epenlogo" />
          </DrawerHeader>

          <DrawerBody onClick={onClose} color="#7F7D95">
            <Flex height="100%">
              <VStack alignItems="baseline" w={"100%"}>
                <Link to="/" style={{ width: "100%" }}>
                  <NavItem icon={FiHome} title="Home" />
                </Link>

                <Link to="/product" style={{ width: "100%" }}>
                  <NavItem icon={RiShoppingBag2Line} title="Product" />
                </Link>
                {/* <Link to="/customer" style={{ width: "100%" }}>
                  <NavItem icon={RiUser6Line} title="Customer" />
                </Link> */}
                {/* <Link to="/events" style={{ width: "100%" }}>
                  <NavItem icon={RiShoppingCartLine} title="Order" />
                </Link> */}
                <Link to="/ourservices" style={{ width: "100%" }}>
                  <NavItem icon={RiHeart2Line} title="Our Service" />
                </Link>
                <Link to="/ourclients" style={{ width: "100%" }}>
                  <NavItem icon={RiUser3Line} title="Our Clients" />
                </Link>
                <Link to="/faqs" style={{ width: "100%" }}>
                  <NavItem icon={MdOutlineEventNote} title="FAQs" />
                </Link>
                <Link to="/contactus" style={{ width: "100%" }}>
                  <NavItem icon={RiContactsLine} title="Contact Us" />
                </Link>
              </VStack>
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <IconButton
              icon={<NavItem icon={BiLogOut} title="Logout" />}
              aria-label="Logout"
              title="LogOut"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
                // dispatch({ type: REQUEST_LOGOUT_USER });
              }}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

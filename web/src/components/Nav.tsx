import {
  Box,
  Button,
  Heading,
  Spacer,
  useColorMode,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  MenuDivider,
  MenuGroup,
  Image
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

interface Props {
  isAuthenticated?: boolean;
}

export default function Nav({ isAuthenticated }: Props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const history = useHistory();
  const auth = useAuth();
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={4}
      color={["primary.700", "primary.700"]}
    >
      <Flex align="center">
        <Image src="./assets/logo.png" w="100px" />
      </Flex>
      <Spacer />
      <Box p="2">
        {isAuthenticated ? (
          <React.Fragment>
            <Button
              mr="4"
              bgColor="inherit"
              onClick={() => history.push("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              mr="4"
              bgColor="inherit"
              onClick={() => history.push("/create")}
            >
              Create
            </Button>
            <Button
              aria-label="sign-out"
              onClick={async () => {
                await auth.logout()
                history.push("/")
              }} bgColor="inherit">
              Sign Out
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button
              onClick={() => history.push("/login")}
              mr="4"
              bgColor="inherit"
            >
              Login
            </Button>
            <Button onClick={() => history.push("/register")} bgColor="inherit">
              Register
            </Button>
          </React.Fragment>
        )}
      </Box>
    </Flex>
  );
}

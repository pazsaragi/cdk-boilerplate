import { Flex } from "@chakra-ui/react";
import React from "react";
import Footer from "../Footer";
import Nav from "../Nav";

interface Props {
  children: any;
  isAuthenticated: boolean;
}

export default function Layout({ children, isAuthenticated }: Props) {
  return (
    <Flex direction="column" align="center" m="0 auto">
      <Nav isAuthenticated={isAuthenticated} />
      <Flex>
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
}

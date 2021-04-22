import { Heading, Square, Text } from "@chakra-ui/layout";
import { Box, Center, Flex } from "@chakra-ui/react";
import React from "react";

export default function Footer() {
  return (
    <Flex
      as="footer"
      bgColor="gray.800"
      width="100%"
      color="white"
      mt="20"
      direction="column"
      __css={{
        flex: "0 0 50px"
      }}
    >
      <Flex direction="row" align="center" maxW={{ xl: "900px" }} m="0 auto">
        <Box p="4">
          <Center>
            <Text>Company</Text>
          </Center>
        </Box>
        <Box p="4">
          <Square>
            <Text>Social Media</Text>
          </Square>
        </Box>
      </Flex>
    </Flex>
  );
}

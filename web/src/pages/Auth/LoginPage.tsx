import { Box, Flex, FormControl, FormHelperText, FormLabel, Heading, Input } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "aws-amplify-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Redirect, useHistory } from "react-router-dom";
import * as yup from "yup";
import ErrorAlert from "../../components/ErrorAlert";
import { useAuth } from "../../contexts/auth-context";
import { ErrorMessage, ErrorMessageType } from "../../types/errors";

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup
    .string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .required(),
});

interface Props {}

export default function LoginPage({}: Props) {
  const { register, handleSubmit, watch, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const history = useHistory();
  const [err, setErr] = useState<ErrorMessage>({
    name: "",
    message: "",
    code: "",
  });
  const auth = useAuth();
  const onSubmit = async ({
    username,
    password,
  }: {
    password: string;
    username: string;
  }) => {
    try {
      auth.login(username, password).then(({ user, error }) => {
        if (error) {
          setErr(error);
          return;
        }
        history.push("/dashboard");
      });
    } catch (error) {
      console.log("error loggin up:", error);
    }
  };

  return (
    <Box maxW="32rem"
      border="1px solid lightgray"
      borderRadius="10"
      p="10"
      height="100%"

    >
      <Heading as="h4"size="lg">Sign In</Heading>
      {err?.name && <ErrorAlert title={err.message} message={""} />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl  id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" name="username" ref={register} />
          <FormHelperText>{errors.firstName?.username}</FormHelperText>
        </FormControl>
        
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" ref={register} />
          <FormHelperText>{errors.firstName?.password}</FormHelperText>
        </FormControl>
        <FormControl >
        <Button mt={4} type="submit" colorScheme="teal" >
          Submit
          </Button>  
        </FormControl>
      </form>
      <Flex color="blue" textDecoration="underline" justifyContent="space-around" >
        <Box>
        <Link to="/forgot-password">Forgot Password</Link>
        </Box>
        <Box>
        <Link to="/register">Register Now!</Link>
        </Box>
      </Flex>
    </Box>
  );
}

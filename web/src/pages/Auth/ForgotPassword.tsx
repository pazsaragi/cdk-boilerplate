import { Box, Heading, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";

export default function ForgotPassword() {
  const auth = useAuth();
  const [redirect, setRedirect] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = async ({ username }: { username: string }) => {
    try {
      auth.forgotPassword(username).then(() => {
        setRedirect(true);
      });
    } catch (error) {
      console.log("error signing up:", error);
    }
  };

  return (
    <Box>
      <Heading>Forgot Password</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        Username:
        <Input type="text" name="username" ref={register} />
        <p>{errors.firstName?.username}</p>
        <Input type="submit" name="Submit" />
      </form>
      {redirect && (
        <Redirect
          to={{
            pathname: "/reset-password",
          }}
        />
      )}
    </Box>
  );
}

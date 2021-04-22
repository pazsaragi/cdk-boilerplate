import { Box, Heading, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";

export default function ConfirmEmail() {
  const [redirect, setRedirect] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm();

  const auth = useAuth();

  const onSubmit = async ({ code }: { code: string }) => {
    try {
      auth.confirmEmail(auth.state.username, code).then(() => {
        setRedirect(true);
      });
    } catch (error) {
      console.log("error confirming code:", error);
    }
  };
  return (
    <Box>
      <Heading>Check your email</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        Confirmation Code:
        <Input type="text" name="code" ref={register} />
        <p>{errors.firstName?.code}</p>
        <Input type="submit" />
      </form>
      {redirect && (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )}
    </Box>
  );
}

import { Heading } from "@chakra-ui/layout";
import { Box, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import ErrorAlert from "../../components/ErrorAlert";
import { ErrorMessage } from "../../types/errors";

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup
    .string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .required(),
  email: yup.string().required(),
  phone_number: yup.string().required(),
});

export default function SignUpPage() {
  const [redirect, setRedirect] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const auth = useAuth();

  const [err, setErr] = useState<ErrorMessage>({
    name: "",
    message: "",
    code: "",
  });

  const onSubmit = async ({
    email,
    username,
    password,
    phone_number,
  }: {
    email: string;
    password: string;
    username: string;
    phone_number: string;
  }) => {
    try {
      auth
        .register(username, password, email, phone_number)
        .then(({ error }) => {
          if (error) {
            setErr({
              code: error.code,
              name: error.name,
              message: error.message,
            });
            return;
          }
          setRedirect(true);
        });
    } catch (error) {
      console.log("error signing up:", error);
    }
  };

  return (
    <Box>
      <Heading>Sign up</Heading>
      {err?.message ? <ErrorAlert title={err.message} message={""} /> : <></>}
      <form onSubmit={handleSubmit(onSubmit)}>
        Username:
        <Input type="text" name="username" ref={register} />
        <p>{errors.firstName?.username}</p>
        Password:
        <Input type="password" name="password" ref={register} />
        <p>{errors.firstName?.password}</p>
        Email:
        <Input type="email" name="email" ref={register} />
        <p>{errors.firstName?.email}</p>
        Number:
        <Input type="text" name="phone_number" ref={register} />
        <p>{errors.firstName?.phone_number}</p>
        <Input type="submit" />
      </form>
      {redirect && (
        <Redirect
          to={{
            pathname: "/verify-code",
          }}
        />
      )}
    </Box>
  );
}

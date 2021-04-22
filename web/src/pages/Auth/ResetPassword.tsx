import { Heading, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";

export default function ResetPassword() {
  const auth = useAuth();
  const [redirect, setRedirect] = useState(false);

  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = async ({
    code,
    password,
  }: {
    username: string;
    code: string;
    password: string;
  }) => {
    try {
      if (!auth.state.username) {
        alert(`The username ${auth.state.username} is incorrect`);
        return;
      }
      auth.passwordReset(auth.state.username, code, password).then(() => {
        setRedirect(true);
      });
    } catch (error) {
      console.log("error signing up:", error);
    }
  };

  return (
    <React.Fragment>
      <Heading>Sign up</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        Confirmation Code:
        <Input type="text" name="code" ref={register} />
        <p>{errors.firstName?.code}</p>
        Password:
        <Input type="password" name="password" ref={register} />
        <p>{errors.firstName?.password}</p>
        <Input type="submit" />
      </form>
      {redirect && (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )}
    </React.Fragment>
  );
}

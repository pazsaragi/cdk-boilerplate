import Auth from "@aws-amplify/auth";
import { Heading } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { AUTH_USER_TOKEN_KEY } from "../constants";
import { ErrorMessageType } from "../types/errors";

const AuthContext = React.createContext<{
  login: (
    username: string,
    password: string
  ) => Promise<{
    user?: any;
    error?: ErrorMessageType;
  }>;
  logout: () => Promise<any>;
  confirmEmail: (username: string, code: string) => Promise<any>;
  forgotPassword: (username: string) => Promise<any>;
  passwordReset: (
    username: string,
    code: string,
    password: string
  ) => Promise<any>;
  register: (
    username: string,
    password: string,
    email: string,
    phone_number: string,
  ) => Promise<{
    error: any;
  }>;
  state: any;
}>({
  login: async () => {
    return new Promise(() => {
      return {
        user: null,
        error: null,
      };
    });
  },
  register: async () => {
    return new Promise(() => {
      return {
        error: null,
      };
    });
  },
  confirmEmail: async () => Promise,
  logout: async () => Promise,
  forgotPassword: async () => Promise,
  passwordReset: async () => Promise,
  state: null,
});

interface Props {
  children: any;
}

function AuthProvider({ children }: Props) {
  const [state, setState] = useState({
    status: "pending",
    error: null,
    user: null,
    username: null as any,
    isAuthenticated: false,
  });

  useEffect(() => {
    async function getUser() {
      try {
        return await Auth.currentAuthenticatedUser();
      } catch (error) {
        console.error(`getUser error ${error}`)
        throw new Error(error)
      }
    }
    getUser()
      .then((user) => {
        if (user) {
          setState({
            ...state,
            user,
            status: "",
            isAuthenticated: true,
          });
        }
        throw new Error(`Missing User Error`)
      })
      .catch((e) => {
        console.error(`AuthProvider useeffect error ${e}`);
        setState({
          ...state,
          status: "error",
          isAuthenticated: false,
        });
      });
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<{
    user?: any;
    error?: ErrorMessageType;
  }> => {
    try {
      return await Auth.signIn(username, password)
        .then((user) => {
          setState({
            error: null,
            status: "",
            user,
            username: null,
            isAuthenticated: true,
          });
          return user;
        })
        .catch((e) => {
          console.error(`caught error ${JSON.stringify(e)}`);
          return {
            error: {
              ...e,
            },
          };
        });
    } catch (error) {
      return {
        error: {
          code: "Something went wrong",
          name: "Something went wrong",
          message: "Something has gone wrong. Please try again later on.",
        },
      };
    }
  };

  const register = async (
    username: string,
    password: string,
    email: string,
    phone_number: string,
  ) => {
    try {
      return await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          phone_number,
        },
      })
        .then(() => {
          setState({
            ...state,
            username: username,
          });
          return {
            error: null,
          };
        })
        .catch((e) => {
          return {
            error: {
              name: e.name,
              code: e.code,
              message: e.message,
              ...e,
            },
          };
        });
    } catch (error) {
      return {
        error: {
          code: "Something went wrong",
          name: "Something went wrong",
          message: "Something has gone wrong. Please try again later on.",
        },
      };
    }
  };

  const confirmEmail = async (username: string, code: string) => {
    return await Auth.confirmSignUp(username, code);
  };

  const logout = async () => {
    return await Auth.signOut().then(() => {
      setState({
        error: null,
        status: "",
        user: null,
        username: null,
        isAuthenticated: false,
      });
    });
  };

  const forgotPassword = async (username: string) => {
    return await Auth.forgotPassword(username).then(() => {
      setState({
        ...state,
        username,
      });
    });
  };

  const passwordReset = async (
    username: string,
    code: string,
    password: string
  ) => {
    return await Auth.forgotPasswordSubmit(username, code, password);
  };

  if (state.status === "pending") {
    return <Heading>Loading...</Heading>;
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register,
        confirmEmail,
        forgotPassword,
        passwordReset,
        state,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

function useAuthState() {
  const { state } = React.useContext(AuthContext);
  const isPending = state.status === "pending";
  const isError = state.status === "error";
  const isSuccess = state.status === "success";
  // const isAuthenticated = state.user && isSuccess;
  return {
    ...state,
    isPending,
    isError,
    isSuccess,
    // isAuthenticated,
  };
}

export { AuthProvider, useAuth, useAuthState };

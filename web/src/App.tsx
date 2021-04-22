import React from "react";
import { ChakraProvider, Heading } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { AuthProvider, useAuthState } from "./contexts/auth-context";
import LandingLayout from "./components/layouts/LandingLayout";
import ConfirmEmail from "./pages/Auth/ConfirmEmail";
import LoginPage from "./pages/Auth/LoginPage";
import ResetPassword from "./pages/Auth/ResetPassword";
import SignUpPage from "./pages/Auth/SignUpPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import GetRecord from "./pages/Some/GetRecord";
import CreateRecord from "./pages/Some/CreateRecord";

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Home />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

function Home() {
  const data = useAuthState();
  return data.isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function Routes() {
  return (
    <React.Fragment>
      <Route path="/register">
        <SignUpPage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/verify-code">
        <ConfirmEmail />
      </Route>
      <Route path="/forgot-password">
        <ForgotPassword />
      </Route>
      <Route path="/reset-password">
        <ResetPassword />
      </Route>
    </React.Fragment>
  );
}

function AuthenticatedApp() {
  return (
    <LandingLayout isAuthenticated={true}>
      <Switch>
        <Route path="/dashboard">
          <Heading>Signed In!</Heading>
        </Route>
        <Route path="/get">
          <GetRecord />
        </Route>
        <Route path="/create">
          <CreateRecord />
        </Route>
        <Routes />
      </Switch>
    </LandingLayout>
  );
}

function UnauthenticatedApp() {
  return (
    <LandingLayout isAuthenticated={false}>
      <Switch>
        <Route exact path="/">
          <Heading>Welcome!</Heading>
        </Route>
        <Routes />
      </Switch>
    </LandingLayout>
  );
}

export default App;

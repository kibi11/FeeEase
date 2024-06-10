import React from "react";
import LoginForm from "./Pages/loginForm";
import { useState } from "react";
import Dashboard from "./Pages/Dashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
};

export default App;

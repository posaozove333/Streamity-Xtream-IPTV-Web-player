import React, { useState, useContext, createContext } from "react";
import {Route,Redirect} from "react-router-dom"
import * as axios from "./axios";
import {setInfo} from "./user_info"
import Cookies from 'js-cookie'
import {initDb} from "./local-db"

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

export function useProvideAuth() {
  const [auth, setAuth] = useState(1);

  const signin = (dns, username, password, successFallback, failFallback) => {
    // Skip authentication - set dummy user info
    setAuth(1);
    setInfo({
      username: 'demo',
      password: 'demo',
      exp_date: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year from now
      max_connections: '1',
      message: 'Demo Mode - No Authentication Required'
    }, {
      server_protocol: 'http',
      url: 'localhost',
      port: '3006'
    });
    initDb();
    successFallback && (successFallback());
  };

  const authLogin = (fallback) =>{
    // Auto-login in demo mode
    signin('', 'demo', 'demo', fallback);
  }

  const signout = (action) => {
    setAuth(null);
    action && (action());
  };

  const isAuth = () => {
    return true; // Always authenticated in demo mode
  }

  return {
    signin,
    signout,
    isAuth,
    authLogin
  };
}


export function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuth() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
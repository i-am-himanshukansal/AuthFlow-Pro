import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createContext } from "react";
import { useState } from "react";

export const Context = createContext({
  isAuthenticated : false,
  setIsAuthenticated : ()=>{},
  user : null,
  setUser : ()=>{},
});
const AppWrapper = ()=>{
  const [user,setUser]  = useState();
  const [isAuthenticated,setIsAuthenticated] = useState();
  return (
    <Context.Provider
      value={{isAuthenticated,setIsAuthenticated,user,setUser}}
    >
      <App/>
    </Context.Provider>
  )
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper/>
  </StrictMode>
);

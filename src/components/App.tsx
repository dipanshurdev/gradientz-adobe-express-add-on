import { Theme } from "@swc-react/theme";
import React, { createContext } from "react";
import "./App.css";
import GradientGenerator from "./GradientGenerator";

export const AddOnSdkContext = createContext(null);

const App = ({ addOnSdk }) => {
  return (
    <AddOnSdkContext.Provider value={addOnSdk}>
      <Theme system="express" scale="medium" color="light">
        <div className="container">
          <GradientGenerator />
        </div>
      </Theme>
    </AddOnSdkContext.Provider>
  );
};

export default App;

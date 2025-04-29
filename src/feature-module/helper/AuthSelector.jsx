import React, { createContext, useContext, useState } from 'react';

// Create Context
const AppContext = createContext();

// Create a Provider Component
export const AssignProvider = ({ children }) => {
  const [appState, setAppState] = useState({
    grade: '',
    section: '',
    type: '',
    selectedData: [],
  });
  
  const [dropdownStates, setDropdownStates] = useState({});



  return (
    <AppContext.Provider value={{ appState, setAppState , dropdownStates , setDropdownStates }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook for easier use
export const useAssignContext = () => {
  return useContext(AppContext);
};
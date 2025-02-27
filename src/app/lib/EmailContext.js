import { createContext, useState, useContext } from "react";
import { useEffect } from 'react';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");

  return (
    <EmailContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

// Custom hook for easy access
export const useEmail = () => useContext(EmailContext);

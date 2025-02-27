import { createContext, useContext, useState, useEffect } from 'react';

const CommandContext = createContext();

export const CommandProvider = ({ children }) => {
  const [command, setCommand] = useState(null);

  return (
    <CommandContext.Provider value={{ command, setCommand }}>
      {children}
    </CommandContext.Provider>
  );
};

export const useCommand = () => useContext(CommandContext);
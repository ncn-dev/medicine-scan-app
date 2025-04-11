import React, { createContext, useState } from 'react';

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const [alertData, setAlertData] = useState(null);

  return (
    <ReminderContext.Provider value={{ alertData, setAlertData }}>
      {children}
    </ReminderContext.Provider>
  );
};

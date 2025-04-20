import React, { createContext, useState, useContext } from 'react';

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const [alertData, setAlertData] = useState(null);
  const [beforeMealReminder, setBeforeMealReminder] = useState(false);
  const [afterMealReminder, setAfterMealReminder] = useState(false);

  const saveReminderSettings = (before, after) => {
    setBeforeMealReminder(before);
    setAfterMealReminder(after);
  };

  return (
    <ReminderContext.Provider value={{ alertData, setAlertData,  beforeMealReminder, afterMealReminder, saveReminderSettings }}>
      {children}
    </ReminderContext.Provider>
  );
};


export const useReminderContext = () => useContext(ReminderContext);
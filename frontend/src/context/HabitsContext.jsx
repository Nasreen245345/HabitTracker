import { createContext, useState, useContext } from "react";

// 1. Create context
const HabitsContext = createContext();

// 2. Provide context
export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);

  return (
    <HabitsContext.Provider value={{ habits, setHabits }}>
      {children}
    </HabitsContext.Provider>
  );
}

// 3. Custom hook (for easy use)
export function useHabits() {
  return useContext(HabitsContext);
}

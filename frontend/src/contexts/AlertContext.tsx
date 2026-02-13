import React, { createContext, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
  message: string;
  type: "success" | "error";
  index?: number;
}

interface AlertContextData {
  addAlert: (alert: Alert) => void;
}

export const AlertContext = createContext<AlertContextData>(
  {} as AlertContextData
);

export const AlertContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Alert) => {
    const newAlert = { ...alert, index: Date.now() };

    setAlerts((prev) => [...prev, newAlert]);

    setTimeout(() => {
      setAlerts((prev) =>
        prev.filter((a) => a.index !== newAlert.index)
      );
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-[320px]">

        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
              className={`rounded-xl border p-4 shadow-lg backdrop-blur-sm
                ${
                  alert.type === "success"
                    ? "bg-secondary text-secondary-foreground border-border"
                    : "bg-destructive text-destructive-foreground border-border"
                }`}
            >
              <p className="text-sm font-medium">
                {alert.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

      </div>

      {children}
    </AlertContext.Provider>
  );
};

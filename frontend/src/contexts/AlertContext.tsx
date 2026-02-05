import React, { createContext, useState, type ReactNode } from 'react';

interface Alert {
    message: string;
    type: 'success' | 'error';
    index?: number;
}


interface AlertContextData {
    addAlert: (alert: Alert) => void;
}

export const AlertContext = createContext<AlertContextData>({} as AlertContextData);

export const AlertContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [alerts, setAlerts] = useState<Alert[]>([]);


    const addAlert = (alert: Alert) => {
        const newAlert = { ...alert, index: (new Date()).getTime() };
        setAlerts(prev => [...prev, newAlert]);
        const timer = setTimeout(() => {
            setAlerts(prev => prev.filter(a => a.index !== newAlert.index));
        }, 3000);
        return () => clearTimeout(timer);
    }


    const successClass = 'bg-secondary text-white border-primary';
    const errorClass = 'bg-cancel-desc text-white border-cancel';

    return (
        <AlertContext.Provider value={{ addAlert }}>
            <div className={`fixed z-10 right-3 bg-transparent ${alerts.length > 0 ? 'top-3' : 'top-[-100px]'} transition-all duration-300 flex flex-col gap-2`}>
                {alerts.map((alert, index) => (
                    <div key={index} className={` ${alert && alert.type === 'success' ? successClass : errorClass}  p-4 rounded border border-l-4 min-w-[300px] transition-all duration-300`}>
                        {alert && alert.message}
                    </div>
                ))}
            </div>
            {children}
        </AlertContext.Provider>
    );
};


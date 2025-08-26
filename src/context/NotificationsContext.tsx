import React, { createContext, useContext, ReactNode } from 'react';
import { ModuleNotificationDTA, useModuleNotifications } from '../api/ModulesNotifications';
import { Modulo } from '../pages/Usuarios/GestionUsuarios/types.tsx';

interface NotificationsContextType {
    notifications: ModuleNotificationDTA[];
    loading: boolean;
    error: string | null;
    refreshNotifications: () => void;
    getNotificationForModule: (moduleName: Modulo) => ModuleNotificationDTA | undefined;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
//     console.log('NotificationsProvider - Inicializando contexto');
    const notificationsData = useModuleNotifications();

    // Función para obtener la notificación correspondiente a un módulo
    const getNotificationForModule = (moduleName: Modulo): ModuleNotificationDTA | undefined => {
//         console.log(`getNotificationForModule - Buscando notificación para: ${moduleName}`);

        const notification = notificationsData.notifications.find(
            notification => notification.modulo === moduleName
        );

//         console.log(`getNotificationForModule - Resultado para ${moduleName}:`, notification);

        // Si no se encuentra una notificación, devolver una por defecto
        if (!notification) {
//             console.log(`getNotificationForModule - No se encontró notificación para ${moduleName}, devolviendo default`);
            return {
                modulo: moduleName,
                requireAtention: false,
                message: ""
            };
        }

        return notification;
    };

    return (
        <NotificationsContext.Provider value={{
            ...notificationsData,
            getNotificationForModule
        }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
//     console.log('useNotifications - Contexto obtenido:', context);
    return context;
}

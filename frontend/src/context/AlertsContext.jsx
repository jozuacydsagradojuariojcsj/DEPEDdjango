import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import SuccessAlert from "../components/alerts/SuccessAlert";
import ErrorAlert from "../components/alerts/ErrorAlert";
import Notifications from "../components/alerts/Notifications";
import { useAuth } from "./AuthContext";
import {
  getPollingNotification,
  getUnreadNotifications,
  markAsReadNotifications,
} from "../api/notificationsApi";

const AlertsContext = createContext();

export const AlertsProvider = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notification, setNotification] = useState([]);
  const [modalNotification, setModalNotification] = useState([]);
  const [unreadNotification, setUnreadNotification] = useState();
  const { user } = useAuth();

  const addNotification = useCallback((message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newNotif = { id, message, timestamp: new Date() };
    setNotification((prev) => [...prev, newNotif]);

    setTimeout(() => {
      setNotification((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const syncAllNotifications = async () => {
    try {
      const response = await getPollingNotification();
      const { unseen, history } = response.data;

      if (unseen && unseen.length > 0) {
        unseen.forEach((notif) => {
          addNotification(notif.message);
        });
      }

      if (history) {
        console.log("Alerts Provider:", history);
        setModalNotification(history);
      }
    } catch (e) {
      console.error("Notification Polling Error:", e);
    }
  };

  const markNotificationAsRead = async (notification_id, notification) => {
    if (notification.is_read) {
      return syncAllNotifications();
    }

    try {
      console.log();
      const response = await markAsReadNotifications(
        notification.notification_id,
      );
      if (response.status === 200) {
        syncAllNotifications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!user) return;
    syncAllNotifications();
    const intervalId = setInterval(syncAllNotifications, 60000);
    return () => clearInterval(intervalId);
  }, [addNotification, user]);

  useEffect(() => {
    const unreadNotifications = modalNotification.filter(
      (n) => n.is_read === false,
    ).length;

    setUnreadNotification(unreadNotifications);
  }, [modalNotification]);

  const clearModalArchive = () => setModalNotifications([]);

  return (
    <AlertsContext.Provider
      value={{
        setSuccessMessage,
        setErrorMessage,
        setNotification,
        addNotification,
        clearModalArchive,
        markNotificationAsRead,
        modalNotification,
        unreadNotification,
      }}
    >
      {children}
      {successMessage && (
        <div className="toast toast-top toast-end z-1000 mt-16">
          <SuccessAlert message={successMessage} />
        </div>
      )}

      {errorMessage && (
        <div className="toast toast-top toast-end z-1000 mt-16">
          <ErrorAlert message={errorMessage} />
        </div>
      )}

      {notification.length > 0 && (
        <div className="toast toast-top toast-end z-1000 mt-16 flex flex-col gap-2">
          {notification.map((notif) => (
            <Notifications key={notif.id} message={notif.message} />
          ))}
        </div>
      )}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertsContext);

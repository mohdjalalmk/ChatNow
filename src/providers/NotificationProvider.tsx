import { PropsWithChildren, useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import { StreamChat } from "stream-chat";
import { useAuth } from "./AuthProvider";
import notifee, { AuthorizationStatus } from "@notifee/react-native";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { user } = useAuth();

  const requestPermission = async () => {
    try {
      const settings = await notifee.requestPermission();

      // Check if notification permissions are granted
      if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        console.log("Notification permission granted.");
        return true;
      } else if (
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
      ) {
        console.log("Provisional notification permission granted.");
        return true; // Allow fetching token for provisional permissions
      } else {
        console.warn("Notification permission not granted.");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  };

  const registerPushToken = async () => {
    try {
      const token = await messaging().getToken();

      const push_provider = "firebase";
      const push_provider_name = "Firebase"; // optional alias for your push provider

      await client.addDevice(token, push_provider, user?.id, push_provider_name);
    } catch (error) {
      console.error("Error registering push token:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestPermission();

      if (hasPermission) {
        await registerPushToken();
      }

      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

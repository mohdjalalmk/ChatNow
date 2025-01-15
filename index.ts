import "expo-router/entry";
import messaging from "@react-native-firebase/messaging";
import { StreamChat } from "stream-chat";
import notifee from "@notifee/react-native";
import { supabase } from "./src/lib/superbase";
import { tokenProvider } from "./src/utlis/TokenProvider";
import { setPushConfig } from "./src/utlis/setPushConfig";
import { firebaseDataHandler, isFirebaseStreamVideoMessage, isNotifeeStreamVideoEvent, onAndroidNotifeeEvent } from "@stream-io/video-react-native-sdk";

setPushConfig();

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("remote msg:",remoteMessage);

  if (isFirebaseStreamVideoMessage(remoteMessage)) {
    await firebaseDataHandler(remoteMessage.data);
  } else {
    // your other background notifications (if any)
  }

  notifee.onBackgroundEvent(async (event) => {
    if (isNotifeeStreamVideoEvent(event)) {
      await onAndroidNotifeeEvent({ event, isBackground: true });
    } else {
      // your other background notifications (if any)
    }
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    console.log("ERROR: no active auth session");
    return;
  }

  try {
    
  } catch (error) {
    
  }

  const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

  client._setToken(
    {
      id: session.user.id,
    },
    tokenProvider,
  );
  // handle the message
  const message = await client.getMessage(remoteMessage.data.id);
  console.log("message :",message);
  

  // create the android channel to send the notification to
  const channelId = await notifee.createChannel({
    id: "chat-messages",
    name: "Chat Messages",
  });

  console.log("channel",channelId);
  

  // display the notification
  const { stream, ...rest } = remoteMessage.data ?? {};
  const data = {
    ...rest,
    ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
  };
  const test = await notifee.displayNotification({
    title: "New message from " + message?.message?.user?.name,  
    body: message.message.text,
data,

    android: {
      channelId,
      // add a press action to open the app on press
      pressAction: {
        id: "default",
      },
    },
  });
  console.log("test:",test);
  
});

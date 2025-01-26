import {
    StreamVideoClient,
    StreamVideoRN,
  } from "@stream-io/video-react-native-sdk";
  import { AndroidImportance } from "@notifee/react-native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenProvider } from "./TokenProvider";
  
  export function setPushConfig() {
    StreamVideoRN.setPushConfig({
      // pass true to inform the SDK that this is an expo app
      isExpo: true,
      ios: {
        // add your push_provider_name for iOS that you have setup in Stream dashboard
        pushProviderName:'APN',
      },
      android: {
        // add your push_provider_name for Android that you have setup in Stream dashboard
        pushProviderName: __DEV__
          ? "firebase-video-staging"
          : "firebase-video-production",
        // configure the notification channel to be used for incoming calls for Android.
        incomingCallChannel: {
          id: "stream_incoming_call",
          name: "Incoming call notifications",
          // This is the advised importance of receiving incoming call notifications.
          // This will ensure that the notification will appear on-top-of applications.
          importance: AndroidImportance.HIGH,
          // optional: if you dont pass a sound, default ringtone will be used
          // sound: <your sound url>
        },
        // configure the functions to create the texts shown in the notification
        // for incoming calls in Android.
        incomingCallNotificationTextGetters: {
          getTitle: (createdUserName: string) =>
            `Incoming call from ${createdUserName}`,
          getBody: (_createdUserName: string) => "Tap to answer the call",
        },
      },
      // add the async callback to create a video client
      // for incoming calls in the background on a push notification
      createStreamVideoClient: async () => {

        //TODO: update user id 
        const userId = "9312e23c-3564-4056-926e-43c777ed30b7";
        const userName = await AsyncStorage.getItem("@userName");
        if (!userId) return undefined;

const user = {
    id:"9312e23c-3564-4056-926e-43c777ed30b7"
}

console.log("token:",await tokenProvider());

        return StreamVideoClient.getOrCreateInstance({
          apiKey: process?.env?.EXPO_PUBLIC_STREAM_API_KEY, // pass your stream api key
          user,
          //TODO: Update token  
          token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTMxMmUyM2MtMzU2NC00MDU2LTkyNmUtNDNjNzc3ZWQzMGI3In0.XwC3YhMCXAic3Q7EDDeKkW_bnqAan04jsOAsrBH5cps",
        });
      },
    });
  }
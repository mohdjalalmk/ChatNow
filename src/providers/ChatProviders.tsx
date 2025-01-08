import { Slot, Stack } from "expo-router";
import { useEffect, PropsWithChildren, useState } from "react";
import { ActivityIndicator } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export const ChatProvider = ({ children }: PropsWithChildren) => {

    const [ready,setIsReady] = useState(false)
  useEffect(() => {
    const connect = async () => {
      try {
        const resp = await client.connectUser(
          {
            id: "jlahey",
            name: "Jim Lahey",
            image: "https://i.imgur.com/fR9Jz14.png",
          },
          client.devToken("jlahey")
        );
        setIsReady(true)
      } catch (error) {
        console.log("error:", error);
      }

      /**
       *  Channel created using a channel id
       */
      // const channel = client.channel("messaging", "the_park", {
      //   name: "The Park",
      // });
      // channel.watch();
    };

    connect();

    return(()=>{
        client.disconnectUser()
        setIsReady(false)
    })
  },[]);

  if(!ready){
    return <ActivityIndicator/>
  }

  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
};

import { Slot, Stack } from "expo-router";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";

const client = StreamChat.getInstance("5gsxn33t5zd7");

export default function HomeLayout() {

  
  useEffect(() => {
    console.log("ss");

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
        console.log("resp:", resp);
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
  });
  return (
    <OverlayProvider>
      <Chat client={client}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown:false}}/>

        </Stack>
      </Chat>
    </OverlayProvider>
  );
}

import { Slot, Stack } from "expo-router";
import { useEffect, PropsWithChildren, useState } from "react";
import { ActivityIndicator } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/superbase";
import { tokenProvider } from "../utlis/TokenProvider";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [ready, setIsReady] = useState(false);
  const { profile } = useAuth();
  useEffect(() => {
    if (!profile) {
      return;
    }
    const connect = async () => {
  
      try {
        const { data } = supabase.storage.from('avatars').getPublicUrl(profile.avatar_url)

// console.log(data.publicUrl)

        const resp = await client.connectUser(
          {
            id: profile.id,
            name: profile.full_name,
            image: data.publicUrl,
          },
          tokenProvider
        );
        setIsReady(true);
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

    return () => {
      if (ready) {
        client.disconnectUser();
      }
      setIsReady(false);
    };
  }, [profile?.id]);

  if (!ready) {
    return <ActivityIndicator />;
  }

  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
};

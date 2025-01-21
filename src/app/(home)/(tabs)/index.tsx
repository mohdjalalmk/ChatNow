import { useAuth } from "@/src/providers/AuthProvider";
import { Link, Redirect, router, Stack } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
} from "stream-chat-expo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function ChatScreen() {
  const [channel, setChannel] = useState();
  const { user } = useAuth();

  return (
   <>
   {/* <Redirect href={'/(home)/call'}/> */}
   <Stack.Screen
      />
      <ChannelList
        filters={{ members: { $in: [user.id] } }}
        onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
      />
   </>
  );
}

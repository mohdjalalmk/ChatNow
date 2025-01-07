import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
} from "stream-chat-expo";

export default function ChatScreen() {
  const [channel, setChannel] = useState();
  console.log(channel);


  return <ChannelList onSelect={(channel)=>{router.push(`/channel/${channel.cid}`)}} />;
}

import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Channel as ChannelType } from "stream-chat";
import {
  MessageList,
  MessageInput,
  Channel,
  useChatContext,
} from "stream-chat-expo";
import * as Crypto from "expo-crypto";
import { View, Image, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { useAuth } from "@/src/providers/AuthProvider";

const ChannelScreen = () => {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const {session} = useAuth()

  console.log("channel:", channel);

  const { client } = useChatContext();
  const videoClient = useStreamVideoClient();

  const fetchChannel = async () => {
    const channel = await client.queryChannels({ cid });

    setChannel(channel[0]);
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  useEffect(() => {
    const getName = () => {
      const members = Object.values(channel?.state?.members);
  
      // Find the member that is not the current user
      const otherMember = members.find(
        (member) => member.user?.id !== session?.user.id // Replace `currentUser.id` with the actual variable for the current user's ID
      );
  
      // If a valid other member exists, set the name and image
      if (otherMember) {
        setName(otherMember.user?.name);
        setImageUrl(otherMember.user?.image);
      }
    };
  
    if (channel) {
      getName();
    }
  }, [channel?.state, session?.user.id]); // Add `currentUser.id` to the dependency array
  

  const startACall = async () => {
    // create a call using channel members
    const UUID = Crypto.randomUUID();
    const members = Object.values(channel?.state?.members).map((member) => {
      // Log the member object for debugging
      console.log("Mapping member:", member);

      // Return the transformed object
      return {
        user_id: member.user_id,
      };
    });

    console.log("Mapped members:", members);


    const call = videoClient.call("default", UUID);

    await call.getOrCreate({
      ring: true,
      data: {
        members,
      },
    });
  };

  if (!channel) {
    return <LoadingIndicator loading={!channel} />;
  }
  const UserAvatar = () => {
    return (
      <Image
        source={
          imageUrl && !imageUrl.includes("null") && imageUrl.trim() !== ""
            ? { uri: imageUrl }
            : require("../../../../assets/images/user-placeholder.jpg")
        }
        style={styles.avatar}
      />
    );
  };

  const EmptyStateIndicator = () => {
    return (
      <View style={styles.container}>
        <Entypo name="chat" size={40} color="#002244" />
        <Text style={styles.message}>
          No messages yet. Start a conversation!
        </Text>
      </View>
    );
  };

  return (
    <Channel
      audioRecordingEnabled={true}
      channel={channel}
    >
      <Stack.Screen
        options={{
          // title: name,
          // headerTitle: name,
          title: "",
          headerLeft: () => {
            return (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Ionicons
                    onPress={() => {
                      if (router.canGoBack()) {
                        router.back();
                      }
                    }}
                    name="arrow-back-outline"
                    size={24}
                    color="black"
                  />
                  <UserAvatar />
                  <Text style={{ fontWeight: "700" }}> {name} </Text>
                </View>
              </>
            );
          },
          headerRight: () => {
            return (
              <Pressable onPress={startACall}>
                <Ionicons name="call" size={24} color="#008000" />
              </Pressable>
            );
          },
        }}
      />
      <MessageList EmptyStateIndicator={EmptyStateIndicator} />
      {/* <SafeAreaView edges={["bottom"]}> */}
        <MessageInput />
      {/* </SafeAreaView> */}
    </Channel>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginHorizontal: 5,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100, 
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#888", 
    textAlign: "center",
  },
});

export default ChannelScreen;

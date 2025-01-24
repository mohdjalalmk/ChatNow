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

const ChannelScreen = () => {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

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
      console.log("new:", members[0]);
      setName(members[0].user?.name);
      setImageUrl(members[0].user.image);
      console.log("new imageUrl:", members[0].user.image); // Debugging imageUrl

      console.log("new name:", members[0].user?.name);
    };
    if (channel) {
      getName();
    }
  }, [channel?.state]);

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

    console.log("members:", members);

    const call = videoClient.call("default", UUID);

    await call.getOrCreate({
      ring: true,
      data: {
        members,
      },
    });
    // await call.join()
    // await call.getOrCreate();
    // navigate to the call screen
    // router.push(`/call`);
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
        <Entypo name="chat" size={40} color="#36454F" />
        <Text style={styles.message}>
          No messages yet. Start a conversation!
        </Text>
      </View>
    );
  };

  return (
    <Channel
      giphyEnabled={false}
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
      <SafeAreaView edges={["bottom"]}>
        <MessageInput />
      </SafeAreaView>
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
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#888", // Adjust the color to match your design
    textAlign: "center",
  },
});

export default ChannelScreen;

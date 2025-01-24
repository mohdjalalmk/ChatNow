import React, { useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet, Alert, Image } from "react-native";
import { useChatContext } from "stream-chat-expo";
import { useAuth } from "../providers/AuthProvider";
import { router } from "expo-router";
import { supabase } from "../lib/superbase";

const UsersListItem = ({ userItem }) => {
  const { client } = useChatContext();
  const { user: loggedInUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userItem?.avatar_url) {
      downloadImage(userItem.avatar_url);
    }
  }, [userItem?.avatar_url]);

  const downloadImage = async (path) => {
    console.log("started");
    
    try {
      const { data, error } = await supabase.storage.from("avatars").download(path);

      if (error) {
        console.error("Error downloading avatar:", error.message);
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
        console.log("setting...");
        
      };
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onStartChat = async () => {
    try {
      const channel = client.channel("messaging", {
        members: [loggedInUser?.id, userItem?.id],
        name:userItem.full_name
      });

      await channel.watch();
      router.push(`/(home)/channel/${channel?.cid}`);
    } catch (error) {
      console.error("Error starting chat:", error.message);
      Alert.alert("Error", "Failed to start the chat. Please try again later.");
    }
  };

  const firstLetter = userItem.full_name.toUpperCase()[0];

  return (
    <Pressable style={styles.container} onPress={onStartChat}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.placeholderText}>{firstLetter}</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{userItem?.full_name || "Unknown User"}</Text>
        <Text style={styles.subtitle}>
          {userItem?.status || "Tap to start a chat"}
        </Text>
      </View>
    </Pressable>
  );
};

export default UsersListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});

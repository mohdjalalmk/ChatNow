import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Image, Text, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/superbase";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Props {
  size?: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => setAvatarUrl(fr.result as string);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];
      if (!image.uri) {
        throw new Error("No image uri!");
      }

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
      const fileExt = image.uri.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (error) {
        throw error;
      }

      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View>
      <View>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            accessibilityLabel="Avatar"
            style={[avatarSize, { borderRadius: size / 2 }, styles.avatar, styles.image]}
          />
        ) : (
          <View style={[{ borderRadius: size / 2 }, styles.avatar, styles.noImage]}>
            <MaterialIcons onPress={uploadAvatar} name="add-a-photo" size={36} color="green" />
          </View>
        )}
      </View>
      <Pressable style={styles.editButton} onPress={uploadAvatar}>
        <Text style={styles.editText}>Edit</Text>
        <FontAwesome name="edit" size={24} color="#008000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "rgb(200, 200, 200)",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  editText: {
    marginRight: 10,
    color: "#002244",
  },
});

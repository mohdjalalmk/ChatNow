import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, ScrollView, Text } from "react-native";
import { Button, Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/superbase";
import { useAuth } from "@/src/providers/AuthProvider";
import Avatar from "@/src/components/Avatar";
import { useChatContext } from "stream-chat-expo";
import { tokenProvider } from "@/src/utlis/TokenProvider";

export default function Account() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { client } = useChatContext();
  const { profile } = useAuth();
  const { user } = useAuth();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url,full_name`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setFullname(data.full_name);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    avatar_url,
    full_name,
  }: {
    avatar_url: string;
    full_name: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        full_name,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Avatar
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({
              avatar_url: url,
              full_name: fullname,
            });
          }}
        />
      </View>
      <View style={styles.horizontalLine}/>

      <View style={styles.verticallySpaced}>
        <Input
          label="Email"
          value={session?.user?.email}
          disabled
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          labelStyle={styles.inputLabel}
          disabledInputStyle={styles.disabledInput}
        />
      </View>
      {/* <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View> */}
      <View style={styles.verticallySpaced}>
        <Input
          label="Fullname"
          value={fullname || ""}
          onChangeText={(text) => setFullname(text)}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          labelStyle={styles.inputLabel}
          placeholder="Enter your full name"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile({
              avatar_url: avatarUrl,
              full_name: fullname,
            })
          }
          disabled={loading}
          buttonStyle={styles.updateButton}
          titleStyle={styles.updateButtonText}
          disabledStyle={styles.disabledButton}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          title="Sign Out"
          onPress={async () => {
            await client.disconnectUser();
            supabase.auth.signOut();
          }}
          buttonStyle={styles.signOutButton}
          titleStyle={styles.signOutButtonText}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Delete Account"
          onPress={async () => {
            if (!user) throw new Error("No user");
            const resp = await supabase.functions.invoke("delete-account");
            console.log("resp:", resp);
            await client.disconnectUser();
            supabase.auth.signOut();
          }}
          buttonStyle={styles.deleteButton}
          titleStyle={styles.deleteButtonText}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  verticallySpaced: {
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    marginLeft: 5,
  },
  disabledInput: {
    color: "#aaa",
    backgroundColor: "#eee",
  },
  updateButton: {
    backgroundColor: "#008000",
    borderRadius: 25,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },
  horizontalLine: {
    height: 1, // Thickness of the line
    backgroundColor: "#ccc", // Line color
    marginVertical: 15, // Space above and below the line,
    marginHorizontal:15,
  },
  signOutButton: {
    backgroundColor: "#36454F",
    borderRadius: 25,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    borderRadius: 25,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

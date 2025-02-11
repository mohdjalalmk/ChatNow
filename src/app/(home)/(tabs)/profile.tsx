import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { Button, Input } from "@rneui/themed";
import { supabase } from "@/src/lib/superbase";
import { useAuth } from "@/src/providers/AuthProvider";
import Avatar from "@/src/components/Avatar";
import { useChatContext } from "stream-chat-expo";
import AnimatedLoader from "react-native-animated-loader";
import AlertBox from "@/src/components/AlertBox";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Account() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const { client } = useChatContext();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, full_name`)
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

  async function updateProfile({ username, website, avatar_url, full_name }: { username: string; website: string; avatar_url: string; full_name: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
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

  const handleSignOut = async () => {
    await client.disconnectUser();
    supabase.auth.signOut();
    setShowSignOutModal(false);
  };

  const handleDeleteAccount = async () => {
    await supabase.functions.invoke("delete-account");
    await client.disconnectUser();
    supabase.auth.signOut();
    setShowDeleteAccountModal(false);
  };

  const LoadingIndicator = () => (
    <AnimatedLoader
      source={require("../../../../assets/animations/loading.json")}
      visible={loading}
      overlayColor="rgba(255,255,255,0.4)"
      animationStyle={styles.lottie}
      speed={2}
      loop={true}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Avatar
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({ username, website, avatar_url: url, full_name: fullname });
          }}
        />
      </View>
      <View style={styles.horizontalLine} />
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
      {LoadingIndicator()}
      <View style={styles.verticallySpaced}>
        <Input
          label="User name"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          labelStyle={styles.inputLabel}
          placeholder="Enter your user name"
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Full Name"
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
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl, full_name: fullname })}
          disabled={loading}
          buttonStyle={styles.updateButton}
          titleStyle={styles.updateButtonText}
          disabledStyle={styles.disabledButton}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign Out"
          onPress={() => setShowSignOutModal(true)}
          buttonStyle={styles.signOutButton}
          titleStyle={styles.signOutButtonText}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Delete Account"
          onPress={() => setShowDeleteAccountModal(true)}
          buttonStyle={styles.deleteButton}
          titleStyle={styles.deleteButtonText}
        />
      </View>
      <AlertBox
        visible={showSignOutModal}
        title="Sign Out"
        description="Are you sure you want to sign out? You will need to log back in to access your account."
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutModal(false)}
        logo={<FontAwesome name="sign-out" size={40} color="#002244" />}
      />
      <AlertBox
        visible={showDeleteAccountModal}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteAccountModal(false)}
        logo={<AntDesign name="deleteuser" size={40} color="#002244" />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, marginBottom: 120 },
  lottie: { width: 200, height: 100, color: "#008000" },
  verticallySpaced: { paddingBottom: 4, alignSelf: "stretch" },
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
  inputText: { fontSize: 16, color: "#333" },
  inputLabel: { fontSize: 14, fontWeight: "bold", color: "#555", marginBottom: 10, marginLeft: 5 },
  disabledInput: { color: "#aaa", backgroundColor: "#eee" },
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
  updateButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  disabledButton: { backgroundColor: "#ddd" },
  horizontalLine: { height: 1, backgroundColor: "#ccc", marginVertical: 15, marginHorizontal: 15 },
  signOutButton: {
    backgroundColor: "#002244",
    borderRadius: 25,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  signOutButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
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
  deleteButtonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});

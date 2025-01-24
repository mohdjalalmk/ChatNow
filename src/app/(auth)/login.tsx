import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  ImageBackground,
} from "react-native";
import { Button, Input } from "@rneui/themed";
import { supabase } from "@/src/lib/superbase";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
    if (!data?.session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <ImageBackground
      source={require("../../../assets/images/background.avif")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email"
            leftIcon={{ type: "font-awesome", name: "envelope", color: "#000" }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            labelStyle={styles.inputLabel}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={{ type: "font-awesome", name: "lock", color: "#000" }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            labelStyle={styles.inputLabel}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <LinearGradient
            colors={["#6CB4EE", "#002244"]}
            start={{ x: 0, y: 0 }} // Top-left corner
            end={{ x: 1, y: 1 }} // Bottom-right corner
            style={[styles.buttonStyle, { paddingVertical: 8 }]}
          >
            <Button
              title="Sign in"
              disabled={loading}
              onPress={() => signInWithEmail()}
              buttonStyle={{ backgroundColor: "transparent" }} // Transparent background
              containerStyle={{ borderRadius: 25 }}
              titleStyle={styles.buttonTitle}
              disabledStyle={{ backgroundColor: "transparent" }}
            />
          </LinearGradient>
        </View>
        <View style={styles.verticallySpaced}>
          <LinearGradient
            colors={["#002244", "#6CB4EE"]}
            start={{ x: 0, y: 0 }} // Top-left corner
            end={{ x: 1, y: 1 }} // Bottom-right corner
            style={[styles.buttonStyle, { paddingVertical: 8 }]}
          >
            <Button
              title="Sign up"
              disabled={loading}
              onPress={() => signUpWithEmail()}
              buttonStyle={{ backgroundColor: "transparent" }} // Transparent background
              containerStyle={{ borderRadius: 25 }}
              titleStyle={styles.buttonTitle}
              disabledStyle={{ backgroundColor: "transparent" }}
            />
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#008000",
    borderRadius: 10,
    backgroundColor: "#fff",
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
    color: "002244",
    marginBottom: 5,
    marginLeft: 5,
  },
  buttonStyle: {
    borderRadius: 25,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonInner: {
    borderRadius: 25, // Keep inner button rounded
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

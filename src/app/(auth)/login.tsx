import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  AppStateStatus,
  ImageBackground,
} from "react-native";
import { Button, Input } from "@rneui/themed";
import { supabase } from "@/src/lib/superbase";
import { LinearGradient } from "expo-linear-gradient";

type InputFieldProps = {
  label: string;
  icon: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  value,
  placeholder,
  onChangeText,
  secureTextEntry,
}) => (
  <View style={styles.verticallySpaced}>
    <Input
      label={label}
      leftIcon={{ type: "font-awesome", name: icon, color: "#000" }}
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.inputText}
      labelStyle={styles.inputLabel}
    />
  </View>
);

type GradientButtonProps = {
  title: string;
  loading: boolean;
  onPress: () => void;
  colors: string[];
};
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  loading,
  onPress,
  colors,
}) => (
  <View style={styles.verticallySpaced}>
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={colors}
      style={styles.buttonStyle}
    >
      <Button
        title={title}
        disabled={loading}
        onPress={onPress}
        buttonStyle={styles.transparentButton}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.buttonTitle}
        disabledStyle={styles.transparentButton}
      />
    </LinearGradient>
  </View>
);

export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert("Error", error.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert("Error", error.message);
    if (!data?.session) Alert.alert("Check your inbox for email verification!");
    setLoading(false);
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/background.avif")}
      style={styles.background}
    >
      <View style={styles.container}>
        <InputField
          label="Email"
          icon="envelope"
          value={email}
          placeholder="email@address.com"
          onChangeText={setEmail}
        />
        <InputField
          label="Password"
          icon="lock"
          value={password}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
        />
        <GradientButton
          title="Sign In"
          loading={loading}
          onPress={handleSignIn}
          colors={["#6CB4EE", "#002244"]}
        />
        <GradientButton
          title="Sign Up"
          loading={loading}
          onPress={handleSignUp}
          colors={["#002244", "#6CB4EE"]}
        />
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
    marginVertical: 10,
    alignSelf: "stretch",
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
    color: "#002244",
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
  transparentButton: {
    backgroundColor: "transparent",
  },
  buttonContainer: {
    borderRadius: 25,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
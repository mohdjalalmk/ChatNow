import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

interface FloatingTabBarButtonProps {
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  focused?: boolean;
}

const FloatingTabBarButton: React.FC<FloatingTabBarButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.floatingButtonContainer, styles.shadowProp]}
      onPress={onPress}
    >
      <View style={styles.floatingButton}>
        <AntDesign name="adduser" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const TabsNavigator: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBarStyle, styles.shadowProp],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Entypo
                name="chat"
                size={24}
                color={focused ? "#008000" : color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="UsersScreen"
        options={{
          tabBarButton: (props) => <FloatingTabBarButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color, focused }) => (
            <View style={styles.iconContainer}>
              <FontAwesome5
                name="user-edit"
                size={size}
                color={focused ? "#008000" : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tabBarStyle: {
    position: "absolute",
    bottom: 35,
    left: 20,
    right: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    paddingBottom: 0,
    marginHorizontal: 20,
  },
  floatingButtonContainer: {
    top: -25,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#002244",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17.5,
    marginTop: 15,
  },
});

export default TabsNavigator;

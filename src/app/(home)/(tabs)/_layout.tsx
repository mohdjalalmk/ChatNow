import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabsNavigator() {
  const FloatingTabBarButton = ({ children, onPress, focused }) => {
    console.log(focused);

    return (
      <TouchableOpacity
        style={{
          top: -25,
          justifyContent: "center",
          alignItems: "center",
          ...styles.shadowProp,
        }}
        onPress={onPress}
      >
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#002244",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AntDesign name="adduser" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Tabs
      screenOptions={(props) => {
        console.log("props:", props);

        return {
          // headerShown:false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 35,
            left: 20,
            right: 20,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 0,
            marginHorizontal: 20,
            height: 60,
            ...styles.shadowProp,
          },
        };
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                // backgroundColor: focused ? "#7EC8E3" : "transparent",
                width: 35,
                height: 35,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 17.5,
                marginTop: 15,
              }}
            >
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
          tabBarButton: (props) => (
            <FloatingTabBarButton
              focused={props.focusable}
              {...props}
            ></FloatingTabBarButton>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color, focused }) => (
            <View
              style={{
                // backgroundColor: focused ? "#7EC8E3" : "transparent",
                width: 35,
                height: 35,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 17.5,
                marginTop: 15,
              }}
            >
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
}

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

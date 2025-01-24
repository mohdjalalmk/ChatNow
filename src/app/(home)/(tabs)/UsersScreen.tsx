import LoadingIndicator from "@/src/components/LoadingIndicator";
import UsersListItem from "@/src/components/UsersList";
import { supabase } from "@/src/lib/superbase";
import { useAuth } from "@/src/providers/AuthProvider";
import React, { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, View } from "react-native";
import AnimatedLoader from "react-native-animated-loader";

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { user } = useAuth();

  console.log("users:", users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", user?.id)
          .neq("full_name", null);

        if (error) {
          console.error("Error fetching profiles:", error.message);
          return;
        }

        setUsers(profiles || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false); // Ensure loading ends regardless of success or failure
      }
    };

    fetchUsers();
  }, [user?.id]);

  const renderUserList = ({ item }) => {
    return <UsersListItem userItem={item} />;
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <LoadingIndicator loading={loading} />
      {users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderUserList}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No users found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 100,
    color: "#008000",
  },
});
export default UsersScreen;

import LoadingIndicator from "@/src/components/LoadingIndicator";
import UsersListItem from "@/src/components/UsersList";
import { supabase } from "@/src/lib/superbase";
import { useAuth } from "@/src/providers/AuthProvider";
import React, { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, View } from "react-native";

type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  website: string | null;
  avatar_url: string | null;
};

const UsersScreen = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

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
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.id]);

  const renderUserList = ({ item }: { item: Profile }) => {
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

export default UsersScreen;

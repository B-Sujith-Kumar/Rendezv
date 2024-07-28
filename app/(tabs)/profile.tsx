import { View, Text, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

const Profile = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Pressable onPress={() => signOut()}>
        <Text style={{ color: "white" }}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Profile;

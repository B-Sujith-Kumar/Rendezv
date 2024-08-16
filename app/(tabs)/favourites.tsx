import { View, Text, TextInput } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import useUserStore from "@/store/userStore";
import { useUser } from "@clerk/clerk-expo";

const Favourites = () => {
  const { user } = useUser();
  useEffect(() => {
    
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Favorites",
          headerTransparent: true,
          headerTitleStyle: {
            fontWeight: "bold",
            fontFamily: "FontBold",
            fontSize: 19,
          },
        }}
      />
      <View style={{ marginTop: 40, padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 15,
            backgroundColor: "#212121",
            padding: 16,
            paddingHorizontal: 16,
            borderRadius: 19,
            borderWidth: 1,
            borderColor: "#343434",
          }}
        >
          <Feather name="search" size={24} color="#a0a0a0" />
          <TextInput
            placeholder="Search events..."
            style={{ color: "white", fontFamily: "FontSemiBold", fontSize: 16 }}
            maxLength={30}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Favourites;

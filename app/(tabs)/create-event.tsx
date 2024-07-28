import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateEvent = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{padding: 15, paddingHorizontal: 20}}>
        <Text style={{color: "white", fontFamily: "FontBold", fontSize: 22}}>Create event</Text>
        
      </View>
    </SafeAreaView>
  );
};

export default CreateEvent;

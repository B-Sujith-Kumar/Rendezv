import { View, Text } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const Layout = () => {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }
  return <Stack />;
};

export default Layout;

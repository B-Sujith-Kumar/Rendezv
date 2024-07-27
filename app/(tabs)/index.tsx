import { Pressable, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Redirect, Stack } from "expo-router";
import { SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import HomeHeader from "@/components/Header/HomeHeader";

export default function TabOneScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return (
    <View style={{flex: 1, marginTop: 160}}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          header: () => <HomeHeader />,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Hey, {user?.firstName + " " + user?.lastName} 👋</Text>
        <Text style={styles.subtitle}>Fuel your passions, Discover events you'll love.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 29,
    fontFamily: "FontMedium",
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "FontRegular",
    alignSelf: "center",
    marginTop: 12,
    letterSpacing: 0.7,
    color: "#7a7a7a",
  }
});

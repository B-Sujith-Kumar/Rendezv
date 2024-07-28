import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { supabase } from "@/lib/supabase";

import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useUser();
  const updateProfileImage = async () => {
    const { data, error } = await supabase
      .from("Users")
      .update({ profileImage: user?.imageUrl })
      .eq("email", user?.primaryEmailAddress?.emailAddress)
      .is("profileImage", null)
      .select();
  };

  useEffect(() => {
    user && updateProfileImage();
  }, [user]);

  const { isSignedIn } = useAuth();
  
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <>
      <SignedOut>
        <Redirect href="/(auth)/sign-up" />
      </SignedOut>
      <SignedIn>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: useClientOnlyValue(false, true),
            tabBarShowLabel: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarLabelStyle: { fontFamily: "FontRegular" },
              tabBarIcon: ({ color }) => (
                <AntDesign name="home" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="two"
            options={{
              title: "Explore",
              tabBarLabelStyle: { fontFamily: "FontRegular" },
              tabBarInactiveTintColor: "gray",
              tabBarIcon: ({ color }) => (
                <Feather name="compass" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="create-event"
            options={{
              title: "Create Event",
              tabBarLabelStyle: { fontFamily: "FontRegular" },
              tabBarInactiveTintColor: "gray",
              tabBarIcon: ({ color }) => (
                <AntDesign name="pluscircleo" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="favourites"
            options={{
              title: "Favourites",
              tabBarLabelStyle: { fontFamily: "FontRegular" },
              tabBarInactiveTintColor: "gray",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="favorite-border" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarLabelStyle: { fontFamily: "FontRegular" },
              tabBarInactiveTintColor: "gray",
              tabBarIcon: ({ color }) => (
                <Feather name="user" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </SignedIn>
    </>
  );
}

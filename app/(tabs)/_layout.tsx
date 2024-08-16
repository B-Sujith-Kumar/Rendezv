import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { host } from "@/constants";
import axios from "axios";
import { useStore } from "zustand";
import useUserStore from "@/store/userStore";

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
    await fetch(`${host}/users/update-user-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.primaryEmailAddress?.emailAddress,
        profileImage: user?.imageUrl,
        clerkId: user?.id,
      }),
    }).catch((err) => console.error(err));
  };

  useEffect(() => {
    user && updateProfileImage();
  }, [user]);

  useEffect(() => {
    (async () => {
      const newUser = await axios.post(`${host}/users/get-user`, {
        email: user?.primaryEmailAddress?.emailAddress,
      });
      useUserStore.setState({ user: newUser.data });
      console.log(useUserStore.getState().user);
    })();
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

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { Redirect, router, Stack } from "expo-router";
import { SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import HomeHeader from "@/components/Header/HomeHeader";
import { host, tabs } from "@/constants";
import { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import PopularEvents from "@/components/Events/PopularEvents";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlineEvents from "@/components/Events/OnlineEvents";
import FreeEvents from "@/components/Events/FreeEvents";
import axios from "axios";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ListingsMap from "@/components/Map/ListingsMap";
import useUserStore from "@/store/userStore";

export default function TabOneScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { user: currentUser, userCity } = useUserStore();
  const [city, setCity] = useState<string | null>(currentUser?.city!);

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  const selectTab = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  useEffect(() => {
    setCity(currentUser?.city!);
  }, [currentUser?.city!, currentUser, city]);

  const fetchCity = async () => {
    const response = await axios.post(`${host}/users/get-city`, {
      email: user?.emailAddresses[0].emailAddress,
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView
        edges={["top"]}
        style={{
          backgroundColor: "black",
          marginVertical: 0,
          paddingVertical: 0,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <HomeHeader city={userCity} />
          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={styles.container}>
              <Text style={styles.title}>
                Hey,{" "}
                {user?.firstName + (user?.lastName ? " " + user?.lastName : "")}{" "}
                👋
              </Text>
              <Text style={styles.subtitle}>
                Fuel your passions, Discover events you'll love.
              </Text>
              <View style={{ marginTop: 18, paddingHorizontal: 10 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ref={scrollRef}
                >
                  {tabs.map((tab, index) => (
                    <TouchableOpacity
                      key={index}
                      style={
                        activeIndex === index
                          ? styles.tabButtonActive
                          : styles.tabButton
                      }
                      onPress={() => selectTab(index)}
                      ref={(el) => (itemsRef.current[index] = el)}
                    >
                      <Text
                        style={
                          activeIndex === index
                            ? styles.tabTextActive
                            : styles.tabText
                        }
                      >
                        {tab.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <PopularEvents />
                <OnlineEvents />
                <FreeEvents />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.absoluteBtn}>
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => router.push("/(events)/listings-map")}
          >
            <Entypo name="map" size={16} color="white" />
            <Text style={{ fontFamily: "FontBold" }}>Map view</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 31,
    fontFamily: "FontSemiBold",
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "FontRegular",
    alignSelf: "center",
    marginTop: 12,
    letterSpacing: 0.7,
    color: "#7a7a7a",
  },
  tabButton: {
    padding: 12,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#121212",
    borderWidth: 0.6,
    borderColor: "gray",
  },
  tabButtonActive: {
    padding: 12,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#f8eb6b",
    borderWidth: 0.6,
    borderColor: "black",
  },
  tabText: {
    color: "gray",
    fontFamily: "FontMedium",
  },
  tabTextActive: {
    color: "black",
    fontFamily: "FontSemiBold",
  },
  absoluteBtn: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    backgroundColor: "",
  },
  mapBtn: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#121212",
  },
});

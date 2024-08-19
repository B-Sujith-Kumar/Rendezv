import { ScrollView, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "@/store/userStore";
import ExploreMap from "@/components/Map/ExploreMap";
import { useEffect } from "react";
import axios from "axios";
import { host } from "@/constants";
import useEventStore from "@/store/eventStore";
import { FlatList } from "react-native";
import HorizontalEventCard from "@/components/EventItem/HorizontalEventCard";
import ExploreEventCard from "@/components/EventItem/ExploreEventCard";

export default function TabTwoScreen() {
  const { city, user } = useUserStore();
  const { popularEvents } = useEventStore();

  useEffect(() => {
    try {
      const fetchPopularEvents = async () => {
        const res = await axios.get(
          `${host}/events/get-popular-events/${city}`
        );
        useEventStore.setState({ popularEvents: res.data });
      };
      fetchPopularEvents();
    } catch (error) {}
  }, []);

  return (
    <View  style={styles.container}>
        <Stack.Screen
          options={{
            title: "Explore",
            headerTransparent: false,
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "FontBold",
              fontSize: 19,
            },
            headerStyle: {
                backgroundColor: "black",
            }
          }}
        />
      <ScrollView>
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <View style={styles.title}>
            <Text style={{ fontSize: 16, fontFamily: "FontSemiBold" }}>
              Find events near {""}
            </Text>
            <Link
              href=""
              style={{ flexDirection: "row", alignItems: "flex-end" }}
            >
              <Text
                style={{
                  color: "cyan",
                  fontSize: 16,
                  fontFamily: "FontSemiBold",
                }}
              >
                {" "}
                {city}
                {"  "}
              </Text>
            </Link>
          </View>
          <ExploreMap />
          <Text style={{ fontFamily: "FontBold", marginTop: 23, fontSize: 18 }}>
            Explore Rendezv
          </Text>
          <Text style={{ fontFamily: "FontBold", marginTop: 20, fontSize: 16 }}>
            Popular Now
          </Text>
          {popularEvents.length > 0 && <FlatList
            data={popularEvents}
            renderItem={({ item }) => <ExploreEventCard event={item} />}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 20 }}
          />}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

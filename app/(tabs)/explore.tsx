import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { Link, router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "@/store/userStore";
import ExploreMap from "@/components/Map/ExploreMap";
import { useEffect, useState } from "react";
import axios from "axios";
import { host } from "@/constants";
import useEventStore from "@/store/eventStore";
import { FlatList } from "react-native";
import ExploreEventCard from "@/components/EventItem/ExploreEventCard";
import { IEvent } from "@/types";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { Types } from "mongoose";
import { useUser } from "@clerk/clerk-expo";

export default function TabTwoScreen() {
  const { city } = useUserStore();
  const {
    popularEvents,
    setEvents,
    setFilteredEvents,
    filteredEvents,
    setCategoryId,
  } = useEventStore();
  const [categoryEvents, setCategoryEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const fetchPopularEvents = async () => {
        const res = await axios.get(
          `${host}/events/get-popular-events/${city}`
        );
        useEventStore.setState({ popularEvents: res.data });
      };
      const getCategoryEvents = async () => {
        const res = await axios.post(`${host}/events/categories-with-events`, {
          city,
        });
        setCategoryEvents(res.data);
      };
      const getCategories = async () => {
        const res = await axios.get(
          `${host}/events/popular-categories/${city}`
        );
        setCategories(res.data);
        setLoading(false);
      };
      setLoading(true);
      fetchPopularEvents();
      getCategoryEvents();
      getCategories();
    } catch (error) {
      console.log(error);
    }
  }, [city]);

  useEffect(() => {
    try {
      const fetchEvents = async () => {
        const res = await axios.get(`${host}/events/get-event-by-city/${city}`);
        setEvents(res.data);
        setFilteredEvents(res.data);
      };
      const fetchOnlineEvents = async () => {
        const res = await axios.get(`${host}/events/get-online-events`);
        useEventStore.setState({ online_events: res.data });
      };
      fetchEvents();
      fetchOnlineEvents();
    } catch (error) {
      console.log(error);
    }
  }, [city]);

  const handleCategoryPress = (categoryId: string) => {
    setCategoryId(categoryId);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          },
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
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
          {/* <Text
            style={{
              fontFamily: "FontBold",
              marginTop: 27,
              fontSize: 20,
              alignSelf: "center",
            }}
          >
            Explore Rendezv
          </Text> */}
          <Text
            style={{ fontFamily: "FontBold", marginTop: 20, fontSize: 17.5 }}
          >
            Popular Now
          </Text>
          {popularEvents.length > 0 && (
            <FlatList
              data={popularEvents}
              renderItem={({ item }) => <ExploreEventCard event={item} />}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={true}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 20 }}
            />
          )}
          {
            <View style={{}}>
              {categoryEvents.map(
                (category: {
                  _id: Types.ObjectId;
                  name: string;
                  eventCount: number;
                  events: IEvent[];
                }) => (
                  <View key={category.name} style={{ marginTop: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingRight: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "FontBold",
                          marginTop: 20,
                          fontSize: 17.5,
                          textTransform: "capitalize",
                        }}
                      >
                        {category.name}
                      </Text>
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          alignContent: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                        onPress={() => {
                          handleCategoryPress(category.name);
                          router.push("/(events)/filter-events");
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "FontMedium",
                            marginTop: 20,
                            fontSize: 16.5,
                            color: "cyan",
                          }}
                        >
                          See all
                        </Text>
                        {/* <FontAwesome6
                          name="arrow-right-long"
                          size={17}
                          color="cyan"
                          style={{ marginTop: 20 }}
                        /> */}
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={category.events}
                      renderItem={({ item }) => (
                        <ExploreEventCard
                          event={item}
                          key={item._id.toString()}
                        />
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      scrollEnabled={true}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 20 }}
                    />
                  </View>
                )
              )}
            </View>
          }
          <View style={{ paddingBottom: 20 }}>
            <Text
              style={{
                fontFamily: "FontBold",
                marginTop: 25,
                fontSize: 17.5,
              }}
            >
              Browse by categories
            </Text>
            <SafeAreaView edges={[]}>
              <View style={{ marginTop: 20 }}>
                {categories && (
                  <FlatList
                    data={categories}
                    numColumns={2}
                    scrollEnabled={false}
                    key={2}
                    keyExtractor={(item, index) => index.toString()}
                    columnWrapperStyle={{
                      gap: 10,
                    }}
                    contentContainerStyle={{
                      gap: 15,
                    }}
                    renderItem={({ item }: { item: { name: string } }) => (
                      <View
                        style={{
                          width: "48%",
                          borderWidth: 1,
                          borderColor: "gray",
                          padding: 10,
                          paddingVertical: 14,
                          overflow: "hidden",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "FontBold",
                            fontSize: 17.5,
                            textTransform: "capitalize",
                          }}
                        >
                          {item.name}
                        </Text>
                        <AntDesign name="right" size={18} color="gray" />
                      </View>
                    )}
                  />
                )}
              </View>
            </SafeAreaView>
          </View>
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

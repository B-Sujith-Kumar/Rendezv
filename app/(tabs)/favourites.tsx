import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import useUserStore from "@/store/userStore";
import { useUser } from "@clerk/clerk-expo";
import { IEvent } from "@/types";
import { host, url } from "@/constants";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";

const Favourites = () => {
  const { user } = useUser();
  const [search, setSearch] = React.useState("");
  const {
    user: currentUser,
    removeFavoriteEvent,
    addFavoriteEvent,
  } = useUserStore();
  const [filterdEvents, setFilteredEvents] = React.useState(
    currentUser?.favorite_events
  );

  useEffect(() => {
    setFilteredEvents(currentUser?.favorite_events);
  }, [currentUser, currentUser?.favorite_events]);

  const handleFavorite = async (event: IEvent) => {
    try {
      const res = await axios.post(`${host}/users/add-favorite`, {
        eventId: event._id.toString(),
        email: user?.emailAddresses[0].emailAddress,
      });
      if (res.data.success) {
        if (res.data.removed) {
          setFilteredEvents(
            filterdEvents?.filter(
              (e) => e._id.toString() !== event._id.toString()
            )
          );
          removeFavoriteEvent(event._id.toString());
        } else {
          addFavoriteEvent(event);
        }
      }
    } catch (error) {
      console.log("API error:", error);
    }
  };

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
      <View style={{ marginTop: 40, padding: 20, paddingHorizontal: 30 }}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={24} color="#a0a0a0" />
          <TextInput
            placeholder="Search events..."
            style={{ color: "white", fontFamily: "FontSemiBold", fontSize: 16 }}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              if (text.trim() === "") {
                setFilteredEvents(currentUser?.favorite_events);
              } else {
                setFilteredEvents(
                  currentUser?.favorite_events?.filter((event) =>
                    event.title.toLowerCase().includes(text.toLowerCase())
                  )
                );
              }
            }}
          />
        </View>
        <ScrollView style={{ height: "100%" }}>
          {filterdEvents?.map((event: IEvent, index) => (
            <Link
              href={`/(events)/event/${event._id.toString()}`}
              key={index}
              asChild
            >
              <Pressable>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                    width: "100%",
                    gap: 15,
                  }}
                  key={index}
                >
                  <View>
                    <Image
                      source={{ uri: url + event.banner }}
                      style={styles.imgStyle}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 10, paddingVertical: 10 }}>
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "FontBold",
                        fontSize: 18,
                      }}
                    >
                      {event.title}
                    </Text>
                    <Text style={styles.subText}>
                      {event.dateField?.split(",")[0]}
                    </Text>
                    {!event.is_online && (
                      <Text style={styles.subText}>{event.venueName}</Text>
                    )}
                    {event.is_online && (
                      <Text style={styles.subText}>Online</Text>
                    )}
                  </View>
                  <View>
                    <TouchableOpacity
                      style={{ marginVertical: "100%" }}
                      onPress={() => handleFavorite(event)}
                    >
                      <MaterialIcons
                        name="favorite"
                        size={18}
                        color="#ff4e4f"
                        style={styles.iconStyle}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {index !== filterdEvents.length - 1 && (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#3a3a3a",
                      width: "100%",
                      marginTop: 20,
                    }}
                  ></View>
                )}
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    gap: 15,
    backgroundColor: "#212121",
    padding: 16,
    paddingHorizontal: 16,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#343434",
    marginBottom: 10,
  },
  imgStyle: {
    width: 125,
    height: 125,
    borderWidth: 1,
    borderColor: "#343434",
    borderRadius: 15,
  },
  iconStyle: {
    borderWidth: 1.5,
    borderColor: "#3c3c3c",
    padding: 10,
    borderRadius: 13,
  },
  subText: {
    color: "#a0a0a0",
    fontFamily: "FontSemiBold",
    fontSize: 14,
  },
});

export default Favourites;

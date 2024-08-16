import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ListingsMap from "@/components/Map/ListingsMap";
import axios from "axios";
import { host } from "@/constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router, Stack } from "expo-router";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import EventListView from "@/components/EventItem/EventListView";

const ListMap = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollIndex, setScrollIndex] = useState(0);
  useEffect(() => {
    const getAllEvents = async () => {
      const res = await axios.get(`${host}/events/get-events`);
      setEvents(res.data.events);
      setLoading(false);
    };
    getAllEvents();
  }, []);
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerRight: () => <View></View>,
          headerLeft: () => (
            <View style={{ paddingVertical: 5 }}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.iconStyle}
              >
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={28}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <MapView style={styles.map}>
        {events.map(
          (event: any, index) =>
            !event.is_online && (
              <Marker
                key={event._id.toString()}
                coordinate={{
                  latitude: event.venue.latitude,
                  longitude: event.venue.longitude,
                }}
                
                onPress={() => {
                  setScrollIndex(index);
                }}
              ></Marker>
            )
        )}
      </MapView>
      <View style={styles.eventListContainer}>
        <EventListView
          events={events}
          scrollIndex={scrollIndex}
          setScrollIndex={setScrollIndex}
        />
      </View>
    </View>
  );
};

export default ListMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  iconStyle: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 25,
    marginLeft: 10,
  },
  eventListContainer: {
    position: "absolute",
    bottom: 30,
    zIndex: 10,
    width: "100%",
  },
});

import { View, Text, FlatList } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { events } from "@/constants";
import EventItem from "../EventItem/EventItem";
import HorizontalEventCard from "../EventItem/HorizontalEventCard";
import { useOnlineEvents } from "@/api/events";

const OnlineEvents = () => {
  const { isLoading, data: events, error } = useOnlineEvents();
  return (
    <View style={{ marginTop: 15, paddingBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{ color: "white", fontFamily: "FontSemiBold", fontSize: 18 }}
        >
          Online events
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ color: "#e0e0e0", fontFamily: "FontRegular" }}>
            See all
          </Text>
          <AntDesign name="arrowright" size={17} color="#e0e0e0" />
        </View>
      </View>
      <FlatList
        data={events}
        renderItem={({ item }) => <HorizontalEventCard event={item} />}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={true}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 20 }}
      />
    </View>
  );
};

export default OnlineEvents;

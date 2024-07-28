import { View, Text, ScrollView } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import EventItem from "../EventItem/EventItem";
import { event } from "@/constants";

const PopularEvents = () => {
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
          Popular events
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ color: "#e0e0e0", fontFamily: "FontRegular" }}>
            See all
          </Text>
          <AntDesign name="arrowright" size={17} color="#e0e0e0" />
        </View>
      </View>
      <EventItem event={event} />
      <EventItem event={event} />
      <EventItem event={event} />
      <EventItem event={event} />
    </View>
  );
};

export default PopularEvents;

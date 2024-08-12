import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import EventItem from "../EventItem/EventItem";
import HorizontalEventCard from "../EventItem/HorizontalEventCard";
import { useFreeEvents } from "@/api/events";
import { Link } from "expo-router";

const FreeEvents = () => {
  const { isLoading, data: events, error } = useFreeEvents();
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
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
          Free events
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

export default FreeEvents;

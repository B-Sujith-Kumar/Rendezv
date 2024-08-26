import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import FilterHeader from "@/components/Header/FilterHeader";
import useEventStore from "@/store/eventStore";
import EventItem from "@/components/EventItem/EventItem";

const FilterPage = () => {
  const { filteredEvents: events } = useEventStore();
  return (
    <View style={{ paddingHorizontal: 15 }}>
      <Stack.Screen
        options={{
          headerTitle: "Filter",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "black",
          },
          header: () => <FilterHeader />,
        }}
      />
      <ScrollView style={{ height: "100%", width: "100%" }}>
        <FlatList
          data={events}
          renderItem={({ item }) => <EventItem event={item} />}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};

export default FilterPage;

const styles = StyleSheet.create({});

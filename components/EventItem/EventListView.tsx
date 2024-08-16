import { View, Text, FlatList } from "react-native";
import React from "react";
import EventListItem from "./EventListItem";

const EventListView = ({ events }: { events: any }) => {
  return (
    <View style={{ marginHorizontal: 10 }}>
      <FlatList
        data={events}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <View key={index}>
              <EventListItem event={item} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default EventListView;

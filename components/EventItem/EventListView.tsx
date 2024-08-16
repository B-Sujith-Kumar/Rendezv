import { View, Text, FlatList, Dimensions } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import EventListItem from "./EventListItem";
import { getItem } from "expo-secure-store";

const EventListView = ({
  events,
  scrollIndex,
  setScrollIndex,
}: {
  events: any;
  scrollIndex: number;
  setScrollIndex: Dispatch<SetStateAction<number>>;
}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    scrollToIndex(scrollIndex);
  }, [scrollIndex]);

  const getItemLayout = (_: any, index: number) => ({
    length: Dimensions.get("window").width,
    offset: Dimensions.get("window").width * index - 13,
    index,
  });

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  return (
    <View style={{ marginHorizontal: 10 }}>
      <FlatList
        data={events}
        ref={flatListRef}
        getItemLayout={getItemLayout}
        horizontal
        pagingEnabled
        contentContainerStyle={{ gap: 10 }}
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

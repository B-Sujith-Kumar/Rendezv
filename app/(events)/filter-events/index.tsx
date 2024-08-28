import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Stack } from "expo-router";
import FilterHeader from "@/components/Header/FilterHeader";
import useEventStore from "@/store/eventStore";
import EventItem from "@/components/EventItem/EventItem";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";

const FilterPage = () => {
  const { filteredEvents: events } = useEventStore();
  const bottomSheetRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const openBottomSheet = (type: string) => {
    setSelectedFilter(type);
    setOptions(getOptionsByType(type));
    bottomSheetRef.current?.expand();
  };

  const getOptionsByType = (type: string): string[] => {
    switch (type) {
      case "Sort":
        return ["Alphabetical", "Date Created", "Most Popular"];
      case "Date":
        return ["Today", "Tomorrow", "This Week", "Weekend", "Choose Dates"];
      case "Category":
        return ["Music", "Sports", "Tech"];
      case "Venue type":
        return ["Any venue", "Virtual", "Offline"];
      case "Ticket type":
        return ["Any", "Free", "Paid"];
      default:
        return [];
    }
  };
  const handleOptionSelect = (option: string) => {
    console.log(`Selected option: ${option}`);
    bottomSheetRef.current?.close();
  };
  return (
    <View style={{ paddingHorizontal: 15 }}>
      <Stack.Screen
        options={{
          headerTitle: "Filter",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "black",
          },
          header: () => (
            <FilterHeader
              openBottomSheet={openBottomSheet}
              bottomSheetRef={bottomSheetRef}
              snapPoints={snapPoints}
              selectedFilter={selectedFilter}
              handleOptionSelect={handleOptionSelect}
              options={options}
            />
          ),
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
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={() => {}}
        backgroundStyle={{ backgroundColor: "#1c1c1c", opacity: 1 }}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: "#2c2c2e",
          height: 8,
          width: 50,
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <Text
            style={{
              fontSize: 23,
              marginBottom: 10,
              color: "white",
              fontFamily: "FontBold",
            }}
          >
            {selectedFilter}
          </Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOptionSelect(option)}
            >
              <Text
                style={{
                  color: "white",
                  paddingVertical: 15,
                  fontFamily: "FontMedium",
                  fontSize: 18,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
};

export default FilterPage;

const styles = StyleSheet.create({});

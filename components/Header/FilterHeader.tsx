import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, Feather, SimpleLineIcons } from "@expo/vector-icons";
import useEventStore from "@/store/eventStore";
import useUserStore from "@/store/userStore";
import { router } from "expo-router";

const FilterHeader = () => {
  const { city } = useUserStore();
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: "black" }}>
      <View style={styles.container}>
        <Entypo
          name="chevron-left"
          size={28}
          color="#a0a0a0"
          onPress={() => router.back()}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#a0a0a0" />
            <TextInput
              placeholder="Search events..."
              style={{
                color: "white",
                fontFamily: "FontSemiBold",
                fontSize: 16,
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "black",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    backgroundColor: "#212121",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#343434",
  },
});

export default FilterHeader;

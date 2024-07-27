import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const HomeHeader = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.locationContainer}>
          <Text
            style={{ fontSize: 20, fontFamily: "FontMedium", color: "white" }}
          >
            Kochi
          </Text>
          <AntDesign name="right" size={16} color="white" />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={{
              backgroundColor: "#1c1c1c",
              padding: 10,
              borderRadius: 25,
              paddingHorizontal: 12,
            }}
          >
            <Fontisto name="bell" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#1c1c1c",
              padding: 10,
              borderRadius: 25,
            }}
          >
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    backgroundColor: "#1c1c1c",
    borderWidth: 0.3,
    borderColor: "gray",
    borderRadius: 25,
    padding: 10,
    paddingHorizontal: 15,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 20,
    padding: 10,
  },
});

export default HomeHeader;

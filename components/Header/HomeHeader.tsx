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
import { Link } from "expo-router";

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <Link href="/location">
        <View style={styles.locationContainer}>
          <Text
            style={{ fontSize: 20, fontFamily: "FontMedium", color: "white" }}
          >
            Kochi
          </Text>
          <AntDesign name="right" size={16} color="white" />
        </View>
      </Link>
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
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    marginTop: 15,
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

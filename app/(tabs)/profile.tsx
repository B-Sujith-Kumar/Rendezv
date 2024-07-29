import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { imgUrl, interests } from "@/constants";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";

const Profile = () => {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-225, 0, 255],
            [-225 / 2, 0, 255 * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-225, 0, 255], [2, 1, 0.75]),
        },
      ],
    };
  });

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleSignOut = async () => {
    Alert.alert("Are you sure you want to sign out?", "", [
      {
        text: "Yes",
        onPress: () => signOut(),
        style: "destructive",
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={{ borderBottomWidth: 0.3, borderBottomColor: "gray" }}>
          <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
            <Animated.Image
              source={{ uri: imgUrl }}
              style={[styles.image, imageAnimatedStyle]}
            />
          </Animated.ScrollView>
          <Image
            source={{ uri: user?.imageUrl }}
            height={70}
            width={70}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{
            alignSelf: "center",
            marginTop: 45,
            color: "white",
            fontFamily: "FontBold",
            fontSize: 25,
          }}
        >
          {user?.firstName + (user?.lastName ? " " + user.lastName : "")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-evenly",
            marginTop: 24,
            paddingHorizontal: 20,
          }}
        >
          <View style={styles.statContainer}>
            <Text style={styles.number}>233</Text>
            <Text style={styles.subtitle}>Friends</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.number}>10</Text>
            <Text style={styles.subtitle}>Followers</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.number}>12</Text>
            <Text style={styles.subtitle}>Following</Text>
          </View>
        </View>
        <View style={{ marginTop: 28, paddingHorizontal: 16 }}>
          <View
            style={{
              paddingHorizontal: 20,
              backgroundColor: "#121212",
              borderRadius: 25,
              paddingVertical: 18,
              borderWidth: 0.5,
              borderColor: "#515151",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ color: "white", fontFamily: "FontBold", fontSize: 20 }}
              >
                Interests
              </Text>
              <FontAwesome name="pencil-square-o" size={18} color="white" />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 15,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              {interests.map((interest, index) => (
                <Text
                  style={{
                    color: "white",
                    fontFamily: "FontMedium",
                    fontSize: 13,
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 10,
                    paddingHorizontal: 13,
                    borderRadius: 20,
                  }}
                  key={index}
                >
                  {interest.name}
                </Text>
              ))}
            </View>
          </View>
          <View style={{ marginTop: 20, gap: 21 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "FontSemiBold",
                  fontSize: 18,
                }}
              >
                Tickets
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "FontSemiBold",
                  fontSize: 18,
                }}
              >
                History
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "FontSemiBold",
                  fontSize: 18,
                }}
              >
                Settings
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
                color="white"
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              borderRadius: 15,
              marginTop: 25,
              paddingVertical: 15,
              backgroundColor: "#f8eb6b",
            }}
            onPress={handleSignOut}
          >
            <Text
              style={{
                color: "black",
                fontFamily: "FontBold",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 200,
    width: "100%",
  },
  profileImage: {
    alignSelf: "center",
    position: "absolute",
    top: "85%",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "black",
  },
  statContainer: { justifyContent: "center", alignItems: "center", gap: 8 },
  number: {
    color: "white",
    fontSize: 20,
    fontFamily: "FontBold",
  },
  subtitle: {
    color: "gray",
    fontSize: 15,
    fontFamily: "FontMedium",
  },
});

export default Profile;

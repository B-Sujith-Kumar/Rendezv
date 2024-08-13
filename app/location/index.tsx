import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import axios from "axios";
import { host } from "@/constants";
import { useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";

const Page = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [enableConfirm, setEnableConfirm] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      let res = await axios.post(`${host}/users/get-user`, {
        email: user?.emailAddresses[0].emailAddress,
      });
      setUserLocation({
        latitude: res.data.location.latitude,
        longitude: res.data.location.longitude,
      });
      if (!res.data.location) {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          setEnableConfirm(true);
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        })();
      }
      setLoading(false);
    };
    getLocation();
    setLoading(false);
  }, []);

  const handleMapPress = (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    setUserLocation(coordinate);
    setEnableConfirm(true);
  };

  const handleConfirmLocation = async () => {
    const rev = await Location.reverseGeocodeAsync(userLocation!);
    const city = rev[0].city;
    try {
      const res = await axios.post(`${host}/users/update-location`, {
        userLocation,
        city,
        email: user?.emailAddresses[0].emailAddress,
      });
      setEnableConfirm(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "Choose your location",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "FontBold",
          },
          headerLeft: () => (
            <View style={{ paddingVertical: 5 }}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.iconStyle}
              >
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={28}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => <View></View>,
        }}
      />
      <MapView
        style={{ width: "100%", height: "100%" }}
        region={{
          latitude: userLocation?.latitude!,
          longitude: userLocation?.longitude!,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0221,
        }}
        onPress={handleMapPress}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
          />
        )}
      </MapView>
      {enableConfirm && userLocation && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            disabled={userLocation === null}
            onPress={handleConfirmLocation}
          >
            <Text style={{ fontFamily: "FontBold" }}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  iconStyle: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 25,
    marginLeft: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
    zIndex: 100,
  },
  button: {
    backgroundColor: "#f8eb6b",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 19,
    borderRadius: 15,
    width: "100%",
    paddingHorizontal: 40,
  },
});

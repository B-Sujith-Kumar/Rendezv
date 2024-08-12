// import { StyleSheet, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import { router, Stack } from "expo-router";
// import MapView from "react-native-maps";
// import { Marker } from "react-native-maps";
// import { AntDesign, MaterialIcons } from "@expo/vector-icons";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import * as Location from "expo-location";

// const Page = () => {
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setUserLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//       console.log(location);
//     })();
//   }, []);

//   const handleMapPress = (e: any) => {
//     const coordinate = e.nativeEvent.coordinate;
//     console.log(coordinate);
//     setUserLocation(coordinate);
//   };

//   return (
//     <View>
//       <Stack.Screen
//         options={{
//           headerShown: true,
//           headerTransparent: true,
//           headerTitle: "Choose your location",
//           headerTitleStyle: {
//             fontSize: 18,
//             fontFamily: "FontBold",
//           },
//           headerLeft: () => (
//             <View style={{ paddingVertical: 5 }}>
//               <TouchableOpacity
//                 onPress={() => router.back()}
//                 style={styles.iconStyle}
//               >
//                 <MaterialIcons
//                   name="keyboard-arrow-left"
//                   size={28}
//                   color="black"
//                 />
//               </TouchableOpacity>
//             </View>
//           ),
//           headerRight: () => <View></View>,
//         }}
//       />
//       <MapView
//         style={{ width: "100%", height: "100%", zIndex: -1 }}
//         initialRegion={{
//           latitude: userLocation?.latitude! || 10.015861,
//           longitude: userLocation?.longitude! || 76.341867,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//         onPress={handleMapPress}
//       >
//         {userLocation && (
//           <Marker
//             coordinate={{
//               latitude: userLocation.latitude,
//               longitude: userLocation.longitude,
//             }}
//             title={"Kochi"}
//             description={"Kochi"}
//           />
//         )}
//       </MapView>
//       <View style={{ paddingHorizontal: 25 }}>
//         <TouchableOpacity
//           style={styles.button}
//           disabled={userLocation === null}
//         >
//           <Text style={{ fontFamily: "FontBold" }}>Confirm Location</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Page;

// const styles = StyleSheet.create({
//   iconStyle: {
//     backgroundColor: "white",
//     padding: 5,
//     borderRadius: 25,
//     marginLeft: 10,
//   },
//   button: {
//     backgroundColor: "#f8eb6b",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 19,
//     borderRadius: 15,
//     marginTop: 20,
//     position: "absolute",
//     bottom : 50,
//     width: "100%",
//     zIndex: 100,
//   },
// });

import { StyleSheet, Text, View } from "react-native";
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

const Page = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleMapPress = (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    setUserLocation(coordinate);
  };

  const handleConfirmLocation = async () => {
    const rev = await Location.reverseGeocodeAsync(userLocation!);
    const city = rev[0].city;
    console.log(userLocation, city);
    try {
      const res = await axios.post(`${host}/users/update-location`, {
        userLocation,
        city,
        email: user?.emailAddresses[0].emailAddress,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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
        initialRegion={{
          latitude: userLocation?.latitude || 10.015861,
          longitude: userLocation?.longitude || 76.341867,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          disabled={userLocation === null}
          onPress={handleConfirmLocation}
        >
          <Text style={{ fontFamily: "FontBold" }}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
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

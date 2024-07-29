import { View, Text } from "react-native";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const MapComponent = ({
  venue,
  setVenue,
}: {
  venue: { latitude: number; longitude: number };
  setVenue: (venue: { latitude: number; longitude: number }) => void;
}) => {
    
  const handleMapPress = (e: any) => {
    const coordinate = e.nativeEvent.coordinate;
    setVenue(coordinate);
  };

  return (
    <MapView style={{ width: "100%", height: "100%" }} onPress={handleMapPress}>
      {venue && (
        <Marker
          coordinate={{
            latitude: venue.latitude,
            longitude: venue.longitude,
          }}
          onPress={(data) => console.log(data.nativeEvent.coordinate)}
        />
      )}
    </MapView>
  );
};

export default MapComponent;

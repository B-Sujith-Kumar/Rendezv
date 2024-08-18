import { View, Text, ActivityIndicator, Image } from "react-native";
import React, { useEffect } from "react";
import useUserStore from "@/store/userStore";
import useEventStore from "@/store/eventStore";
import axios from "axios";
import { host } from "@/constants";
import MapView, { Marker } from "react-native-maps";

const ExploreMap = () => {
  const { userCity } = useUserStore();
  const { events, setEvents } = useEventStore();
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const response = await axios.get(
        `${host}/events/get-event-by-city/${userCity}`
      );
      setEvents(response.data.events);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ marginTop: 20 }}>
      {events.length > 0 && (
        <MapView
          style={{ height: 180, width: "100%", borderRadius: 13 }}
          initialRegion={{
            latitude: events[0].venue?.latitude!,
            longitude: events[0].venue?.longitude!,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {events &&
            events.map((event, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: event.venue?.latitude!,
                  longitude: event.venue?.longitude!,
                }}
              >
              </Marker>
            ))}
        </MapView>
      )}

    </View>
  );
};

export default ExploreMap;

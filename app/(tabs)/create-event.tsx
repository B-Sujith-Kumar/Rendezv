import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Entypo, EvilIcons, FontAwesome } from "@expo/vector-icons";
import { calculateTimeDifference, formatDateToIST } from "@/lib/utils";
import * as ImagePicker from "expo-image-picker";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MapComponent from "@/components/Map/MapComponent";
import { useState, useRef } from "react";
import { useInsertEvent } from "@/api/events";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";

const CreateEvent = () => {
  const [eventMode, setEventMode] = useState("Offline");
  const [isPaid, setIsPaid] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [image, setImage] = useState("");
  const [venue, setVenue] = useState({ latitude: 0, longitude: 0 });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateField, setDateField] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [venueName, setVenueName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const { mutate: insertEvent } = useInsertEvent();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={true}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="collapse"
        opacity={0.6}
      />
    ),
    []
  );

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
  };

  const handleOpenPress = () => {
    bottomSheetRef.current?.expand();
    setShowMap(true);
  };

  const onChange = (e: any, selectedDate: any) => {
    const datetime = formatDateToIST(selectedDate);
    setDate(selectedDate);
    setDateField(datetime);
    if (calculateTimeDifference(selectedDate) < 0) {
      setDateField("");
      setErrors({ ...errors, date: "Invalid date and time" });
    } else {
      setErrors({ ...errors, date: "" });
    }
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const handleDeleteCategory = (category: string) => {
    const newCategories = categories.filter((cat) => cat !== category);
    setCategories(newCategories);
  };

  const handleAddCategory = () => {
    return Alert.prompt(
      "Enter a category",
      `Enter a category for the event`,
      (text) => {
        if (text.trim()) {
          if (categories.includes(text)) {
            return;
          }
          setCategories([...categories, text.toLowerCase()]);
        }
      }
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("event-banners")
      .upload(filePath, decode(base64), { contentType });

    console.log(data);

    if (data) {
      return data.path;
    }
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!title) {
      errors.title = "Title is required";
    }
    if (!description) {
      errors.description = "Description is required";
    }
    if (!dateField) {
      errors.date = "Date and time is required";
    }

    if (!categories.length) {
      errors.category = "Category is required";
    }
    if (eventMode === "Offline" && !venueName) {
      errors.venueName = "Venue is required";
    }
    if (eventMode === "Offline" && !venue.latitude && !venue.longitude) {
      errors.venue = "Select a venue on the map";
    }
    if (eventMode === "Virtual" && !meetingLink) {
      errors.meetingLink = "Meeting link is required";
    }
    if (isPaid && !ticketPrice) {
      errors.price = "Price is required";
    }
    if (!image) {
      errors.image = "Banner image is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    const imagePath = await uploadImage();
    if (validate()) {
      const data = {
        title,
        description,
        dateField,
        eventMode,
        venueName,
        meetingLink,
        isPaid,
        ticketPrice,
        capacity,
        categories,
        image: imagePath,
        venue,
      };
      insertEvent(data, {
        onSuccess: () => {
            Alert.alert("Event created successfully");
        }
      });
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable  style={{ height: "100%" }}>
          <View style={{ padding: 15, paddingHorizontal: 20 }}>
            <Text
              style={{
                color: "white",
                fontFamily: "FontBold",
                fontSize: 25,
                alignSelf: "center",
              }}
            >
              Create event
            </Text>
            <Text
              style={{
                color: "gray",
                fontFamily: "FontMedium",
                fontSize: 16,
                marginTop: 10,
                alignSelf: "center",
              }}
            >
              Fill in the details to create an event
            </Text>
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Title</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Event name"
                value={title}
                onChangeText={setTitle}
              />
            </View>
            {errors.title && (
              <Text
                style={{
                  color: "red",
                  marginTop: 10,
                  fontFamily: "FontMedium",
                }}
              >
                {errors.title}
              </Text>
            )}
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Description</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="About the event..."
                multiline={true}
                scrollEnabled={false}
                numberOfLines={6}
                value={description}
                onChangeText={setDescription}
              />
            </View>
            {errors.description && (
              <Text
                style={{
                  color: "red",
                  marginTop: 10,
                  fontFamily: "FontMedium",
                }}
              >
                {errors.description}
              </Text>
            )}
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Date and time</Text>
              <View style={styles.dateTimeContainer}>
                <TextInput
                  style={{ ...styles.inputStyle, marginTop: 0, width: "93%" }}
                  placeholder="Pick a date and time"
                  value={dateField}
                  editable={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (show) {
                      setShow(false);
                      return;
                    }
                    showMode("datetime");
                  }}
                >
                  <EvilIcons name="calendar" size={24} color="gray" />
                </TouchableOpacity>
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode as any}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                  style={{
                    position: "absolute",
                    top: "105%",
                    right: "2%",
                    zIndex: 10,
                  }}
                />
              )}
            </View>
            {errors.date && (
              <Text
                style={{
                  color: "red",
                  marginTop: 10,
                  fontFamily: "FontMedium",
                }}
              >
                {errors.date}
              </Text>
            )}
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Mode of event</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 30,
                }}
              >
                <TouchableOpacity
                  onPress={() => setEventMode("Offline")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor:
                        eventMode === "Offline" ? "#f26711" : "#2c2c2c",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {eventMode === "Offline" && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "white",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      color: eventMode === "Offline" ? "white" : "gray",
                      fontFamily: "FontMedium",
                      fontSize: 16,
                      marginLeft: 10,
                    }}
                  >
                    Offline
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEventMode("Virtual")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor:
                        eventMode === "Virtual" ? "#f26711" : "#2c2c2c",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {eventMode === "Virtual" && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "white",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      color: eventMode === "Virtual" ? "white" : "gray",
                      fontFamily: "FontMedium",
                      fontSize: 16,
                      marginLeft: 10,
                    }}
                  >
                    Virtual
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {eventMode === "Offline" && (
              <View style={{ marginTop: 25 }}>
                <Text style={styles.title}>Venue</Text>
                <View style={styles.dateTimeContainer}>
                  <TextInput
                    style={{ ...styles.inputStyle, marginTop: 0, width: "93%" }}
                    placeholder="Name of venue"
                    value={venueName}
                    onChangeText={setVenueName}
                  />
                  <TouchableOpacity onPress={handleOpenPress}>
                    <Entypo name="location" size={18} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {eventMode === "Virtual" && (
              <View style={{ marginTop: 25 }}>
                <Text style={styles.title}>Meeting link</Text>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Meeting link"
                  value={meetingLink}
                  onChangeText={setMeetingLink}
                />
              </View>
            )}
            {errors.venue && (
              <Text
                style={{
                  color: "red",
                  marginTop: 10,
                  fontFamily: "FontMedium",
                }}
              >
                {errors.venue}
              </Text>
            )}
            {errors.venueName && (
              <Text
                style={{
                  color: "red",
                  marginTop: 10,
                  fontFamily: "FontMedium",
                }}
              >
                {errors.venueName}
              </Text>
            )}
            {errors.meetingLink && (
              <Text
                style={{
                  color: "red",
                  marginTop: 10,
                  fontFamily: "FontMedium",
                }}
              >
                {errors.meetingLink}
              </Text>
            )}
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Paid or free</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 30,
                }}
              >
                <TouchableOpacity
                  onPress={() => setIsPaid(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: isPaid ? "#f26711" : "#2c2c2c",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isPaid === true && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "white",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      color: isPaid === true ? "white" : "gray",
                      fontFamily: "FontMedium",
                      fontSize: 16,
                      marginLeft: 10,
                    }}
                  >
                    Paid
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsPaid(false)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: !isPaid ? "#f26711" : "#2c2c2c",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {!isPaid && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "white",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      color: !isPaid ? "white" : "gray",
                      fontFamily: "FontMedium",
                      fontSize: 16,
                      marginLeft: 10,
                    }}
                  >
                    Free
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {isPaid && (
              <View style={{ marginTop: 25 }}>
                <Text style={styles.title}>Price of ticket</Text>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Price of ticket"
                  keyboardType="number-pad"
                  value={ticketPrice}
                  onChangeText={setTicketPrice}
                />
              </View>
            )}
            {errors.price && (
              <Text
                style={{
                  color: "red",
                  marginTop: 10,
                  fontFamily: "FontMedium",
                }}
              >
                {errors.price}
              </Text>
            )}
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Capacity</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Capacity of event"
                keyboardType="number-pad"
                value={capacity}
                onChangeText={setCapacity}
              />
            </View>
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Category</Text>
              <View style={styles.categoryContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity onPress={() => handleAddCategory()}>
                    <FontAwesome
                      name="pencil-square-o"
                      size={18}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 15,
                    flexWrap: "wrap",
                  }}
                >
                  {categories.map((category, index) => (
                    <View style={styles.category} key={index}>
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "FontMedium",
                          fontSize: 13,
                          textTransform: "capitalize",
                        }}
                      >
                        {category}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteCategory(category)}
                      >
                        <Entypo
                          name="circle-with-cross"
                          size={16}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            {errors.category && (
              <Text
                style={{
                  color: "red",
                  marginTop: 10,
                  fontFamily: "FontMedium",
                }}
              >
                {errors.category}
              </Text>
            )}
            <View style={{ marginTop: 25 }}>
              <Text style={styles.title}>Banner image</Text>
              <Pressable
                onPress={pickImage}
                style={{
                  width: "100%",
                  height: 200,
                  backgroundColor: "#2c2c2c",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                {!image && (
                  <Text style={{ color: "gray", fontFamily: "FontMedium" }}>
                    Tap to upload image
                  </Text>
                )}
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 15,
                      borderWidth: 0.7,
                      borderColor: "gray",
                    }}
                  />
                )}
              </Pressable>
            </View>
            {errors.image && (
              <Text
                style={{
                  color: "red",
                  marginTop: 10,
                  fontFamily: "FontMedium",
                }}
              >
                {errors.image}
              </Text>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text
                style={{ color: "black", fontSize: 18, fontFamily: "FontBold" }}
              >
                Create event
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </ScrollView>
      {showMap && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          style={{ backgroundColor: "#2c2c2c" }}
          backgroundStyle={{ backgroundColor: "#2c2c2c", opacity: 0.5 }}
          handleIndicatorStyle={{ backgroundColor: "gray" }}
          backdropComponent={renderBackdrop}
        >
          <View style={{ backgroundColor: "#2c2c2c" }}>
            <MapComponent venue={venue} setVenue={setVenue} />
          </View>
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontFamily: "FontSemiBold",
    fontSize: 19,
  },
  inputStyle: {
    marginTop: 20,
    width: "100%",
    padding: 15,
    paddingVertical: 20,
    backgroundColor: "#2c2c2c",
    color: "white",
    borderRadius: 15,
    fontFamily: "FontMedium",
    textAlignVertical: "top",
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#2c2c2c",
    borderRadius: 25,
    paddingVertical: 18,
    borderWidth: 0.5,
    borderColor: "#515151",
    marginTop: 20,
  },
  category: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    paddingHorizontal: 13,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    borderRadius: 15,
    gap: 15,
    // backgroundColor: "#2c2c2c",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#f8eb6b",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 19,
    borderRadius: 15,
    marginTop: 20,
  },
});

export default CreateEvent;

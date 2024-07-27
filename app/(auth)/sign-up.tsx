import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Link, Redirect, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import OAuthGoogle from "@/components/auth/OAuthGoogle";
import OAuthFacebook from "@/components/auth/OAuthFacebook";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

const SignUp = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <SignedIn>
          <Redirect href="/(tabs)" />
        </SignedIn>
        <SignedOut>
          <Text
            style={{ fontFamily: "FontRegular", color: "white", fontSize: 17 }}
          >
            Hey there,
          </Text>
          <Text
            style={{
              fontFamily: "FontBold",
              color: "white",
              fontSize: 32,
              marginVertical: 10,
            }}
          >
            Create an account
          </Text>
          <View style={{ width: "100%", padding: 10, gap: 15, marginTop: 20 }}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={16} color="#a0a0a0" />
              <TextInput style={styles.input} placeholder="Name" />
            </View>
            <View style={styles.inputContainer}>
              <Fontisto name="email" size={16} color="#a0a0a0" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={16} color="#a0a0a0" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={showPassword ? false : true}
              />
              {showPassword && (
                <TouchableOpacity onPress={() => setShowPassword(false)}>
                  <FontAwesome5 name="eye" size={16} color="#a0a0a0" />
                </TouchableOpacity>
              )}
              {!showPassword && (
                <TouchableOpacity onPress={() => setShowPassword(true)}>
                  <FontAwesome5 name="eye-slash" size={16} color="#a0a0a0" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.button}>
              <Text
                style={{ color: "black", fontSize: 18, fontFamily: "FontBold" }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.seperatorContainer}>
            <View style={styles.seperator}></View>
            <Text style={{ color: "white" }}>Or</Text>
            <View style={styles.seperator}></View>
          </View>
          <OAuthGoogle />
          <OAuthFacebook />
          <View>
            <Text style={{ color: "#8d8d8d", marginTop: 20 }}>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                style={{ color: "white", fontFamily: "FontBold" }}
              >
                Login
              </Link>
            </Text>
          </View>
        </SignedOut>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    color: "white",
  },
  inputContainer: {
    backgroundColor: "#202020",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    paddingHorizontal: 18,
    borderRadius: 15,
    gap: 10,
    borderColor: "#353535",
    fontFamily: "FontRegular",
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#f8eb6b",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 19,
    borderRadius: 15,
    marginTop: 20,
  },
  seperatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginVertical: 30,
  },
  seperator: {
    height: 1,
    width: "40%",
    backgroundColor: "#8d8d8d",
  },
  socialLogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginVertical: 10,
    paddingVertical: 22,
    borderColor: "#313131",
    borderWidth: 1,
    width: "100%",
    borderRadius: 15,
  },
});

export default SignUp;

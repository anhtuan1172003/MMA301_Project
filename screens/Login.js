import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import COLORS from "../constants/colors";

const Login = ({ navigation }) => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginVertical: 12,
              color: COLORS.black,
            }}
          >
            Hey, Welcome back !
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.black }}>
            Hello again you have been missed!
          </Text>
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>
            Email address
          </Text>
          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 8,
              justifyContent: "center",
              paddingLeft: 12,
            }}
          >
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.grey}
              keyboardType="email-address"
              style={{ width: "100%" }}
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>
            Password
          </Text>
          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 12,
            }}
          >
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={COLORS.grey}
              secureTextEntry={!isPasswordShow} // ✅ Hiển thị hoặc ẩn mật khẩu đúng cách
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShow(!isPasswordShow)}
              style={{ padding: 10 }}
            >
              <Ionicons
                name={isPasswordShow ? "eye-off" : "eye"}
                size={24}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Checkbox */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 6,
          }}
        >
          <Checkbox
            style={{ marginRight: 8 }}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.info : undefined}
          />
          <Text>Remember me</Text>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          onPress={() => console.log("Sign Up Pressed")}
          style={{
            backgroundColor: COLORS.info,
            padding: 14,
            borderRadius: 8,
            borderColor: COLORS.greenInfo,
            borderWidth: 1,
            alignItems: "center",
            marginTop: 18,
          }}
        >
          <Text
            style={{ color: COLORS.white, fontWeight: "bold", fontSize: 16 }}
          >
            Login
          </Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.grey }} />
          <Text style={{ fontSize: 14, marginHorizontal: 10 }}>
            Or Login with
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.grey }} />
        </View>

        {/* Social Login Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 10,
              marginRight: 4,
            }}
          >
            <Image
              source={require("../assets/facebook.png")}
              style={{ height: 36, width: 36, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text> Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../assets/google.png")}
              style={{ height: 36, width: 36, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text> Google</Text>
          </TouchableOpacity>
        </View>

        {/* Already have an account */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 22,
          }}
        >
          <Text style={{ fontSize: 16, color: COLORS.black }}>
            Don't have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.info,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

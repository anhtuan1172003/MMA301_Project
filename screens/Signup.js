import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import COLORS from "../constants/colors";
import RNFS from "react-native-fs";
import CryptoJS from "crypto-js";
const filePath = RNFS.DocumentDirectoryPath + "/data.json";
const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSignup = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!isChecked) {
      Alert.alert("Lỗi", "Bạn phải đồng ý với điều khoản sử dụng.");
      return;
    }

    try {
      let users = [];
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        const fileContent = await RNFS.readFile(filePath, "utf8");
        users = JSON.parse(fileContent);
      }

      // Kiểm tra email đã tồn tại chưa
      const existingUser = users.find((user) => user.account.email === email);
      if (existingUser) {
        Alert.alert(
          "Lỗi",
          "Email đã được đăng ký. Vui lòng sử dụng email khác."
        );
        return;
      }

      // Mã hóa mật khẩu
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        "mySecretKey"
      ).toString();

      // Tạo đối tượng user mới
      const newUser = {
        id: Date.now(),
        userId: Date.now(),
        name: username,
        account: {
          email,
          password: encryptedPassword,
          activeCode: "",
          isActive: true,
        },
        address: {
          street: "",
          city: "",
          zipCode: "",
        },
      };

      users.push(newUser);
      await RNFS.writeFile(filePath, JSON.stringify(users, null, 2), "utf8");

      Alert.alert("Thành công", "Tài khoản của bạn đã được tạo.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{ fontSize: 22, fontWeight: "bold", color: COLORS.black }}
          >
            Create Account
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.black }}>
            Connect with your friends today!
          </Text>
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>
            Email address
          </Text>
          <TextInput
            placeholder="Enter your email address"
            placeholderTextColor={COLORS.grey}
            keyboardType="email-address"
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 12,
            }}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Username Input */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>
            Username
          </Text>
          <TextInput
            placeholder="Enter your username"
            placeholderTextColor={COLORS.grey}
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 12,
            }}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>
            Password
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={COLORS.grey}
              secureTextEntry={!isPasswordShow}
              style={{
                flex: 1,
                height: 48,
                borderColor: COLORS.primary,
                borderWidth: 1,
                borderRadius: 8,
                paddingLeft: 12,
              }}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShow(!isPasswordShow)}
              style={{ padding: 10, position: "absolute", right: 10 }}
            >
              <Ionicons
                name={isPasswordShow ? "eye-off" : "eye"}
                size={24}
                color={COLORS.black}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Confirm Password Input */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>
            Confirm Password
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor={COLORS.grey}
              secureTextEntry={!isPasswordShow}
              style={{
                flex: 1,
                height: 48,
                borderColor: COLORS.primary,
                borderWidth: 1,
                borderRadius: 8,
                paddingLeft: 12,
              }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShow(!isPasswordShow)}
              style={{ padding: 10, position: "absolute", right: 10 }}
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
          <Text> I agree to the terms and conditions</Text>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          onPress={handleSignup}
          style={{
            backgroundColor: COLORS.info,
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 18,
          }}
        >
          <Text
            style={{ color: COLORS.white, fontWeight: "bold", fontSize: 16 }}
          >
            Sign Up
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
            Or Sign up with
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
            Already have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.info,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signup;

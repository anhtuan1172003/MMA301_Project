import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import COLORS from "../constants/colors";
import axios from "axios";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const API_URL = "https://mma-json-deploy.onrender.com";

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về
  
      const user = response.data.find((u) => u.account.email === email); // Tìm user theo email
  
      if (!user) {
        Alert.alert("Lỗi", "Email không tồn tại!");
        return;
      }
  
      if (!user.account.isActive) {
        Alert.alert("Lỗi", "Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản!");
        return;
      }
  
      if (user.account.password !== password) {
        Alert.alert("Lỗi", "Mật khẩu không đúng!");
        return;
      }
  
      Alert.alert("Thành công", "Đăng nhập thành công!");
      navigation.navigate("Home");
  
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối đến server. Kiểm tra mạng hoặc thử lại sau.");
      console.error("Login error", error);
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{ fontSize: 22, fontWeight: "bold", marginVertical: 12, color: COLORS.black }}
          >
            Hey, Welcome back !
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.black }}>
            Hello again you have been missed!
          </Text>
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>Email address</Text>
          <TextInput
            placeholder="Enter your email address"
            placeholderTextColor={COLORS.grey}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={{ width: "100%", borderColor: COLORS.primary, borderWidth: 1, borderRadius: 8, padding: 12 }}
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginVertical: 8 }}>Password</Text>
          <View
            style={{ width: "100%", borderColor: COLORS.primary, borderWidth: 1, borderRadius: 8, flexDirection: "row", alignItems: "center", paddingLeft: 12 }}
          >
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={COLORS.grey}
              secureTextEntry={!isPasswordShow}
              value={password}
              onChangeText={setPassword}
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => setIsPasswordShow(!isPasswordShow)} style={{ padding: 10 }}>
              <Ionicons name={isPasswordShow ? "eye-off" : "eye"} size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Checkbox */}
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
          <Checkbox style={{ marginRight: 8 }} value={isChecked} onValueChange={setIsChecked} color={isChecked ? COLORS.info : undefined} />
          <Text>Remember me</Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: COLORS.info, padding: 14, borderRadius: 8, alignItems: "center", marginTop: 18 }}>
          <Text style={{ color: COLORS.white, fontWeight: "bold", fontSize: 16 }}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

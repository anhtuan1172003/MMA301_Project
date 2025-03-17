import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import COLORS from "../constants/colors";
import Button from "../components/Button";
import PostTab from "./TabProfile/PostTab";
import FavoriteTab from "./TabProfile/FavoriteTab";
import TaggedTab from "./TabProfile/TaggedTab";
import { useAuth } from "../AuthContext";

const API_URL = "https://mma301-project-be-9e9f.onrender.com/users";
const Tab = createMaterialTopTabNavigator();

function ProfileScreen({ navigation }) {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserId();
  }, []);

  const getUserId = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      console.log("Stored user data:", storedUser); // Thêm log để kiểm tra dữ liệu
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user data:", parsedUser); // Thêm log để kiểm tra dữ liệu đã parse
        fetchUserData(parsedUser._id);
      } else {
        console.log("No user data found in AsyncStorage"); // Thêm log khi không tìm thấy dữ liệu
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error getting user ID:", error); // Thêm log chi tiết lỗi
      Alert.alert("Lỗi", "Không thể lấy ID người dùng.");
      setLoading(false);
    }
  };

  const fetchUserData = async (id) => {
    try {
      console.log("Fetching user data for ID:", id); // Thêm log ID đang fetch
      const response = await axios.get(`${API_URL}/${id}`);
      console.log("API Response:", response.data); // Thêm log response từ API
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error); // Thêm log chi tiết lỗi
      Alert.alert("Lỗi", "Không thể lấy thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Đã đăng xuất", "Bạn đã đăng xuất thành công!");
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng xuất.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.white }}>Không tìm thấy thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}
      colors={[COLORS.greenInfo, COLORS.info]}
    >
      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <Image
          source={require("../assets/p1.png")}
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            marginBottom: 10,
          }}
        />
        <Text style={{ fontSize: 22, fontWeight: "bold", color: COLORS.white }}>
          {user?.name}
        </Text>
        <Text style={{ fontSize: 16, color: COLORS.white, opacity: 0.8 }}>
          {user?.account?.email}
        </Text>
      </View>

      <View
        style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 20 }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
          Thông tin cá nhân
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.dark }}>
          📍 {user?.address?.street}, {user?.address?.city}
        </Text>
      </View>

      <View style={{ flex: 1, marginTop: 5 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => {
              let iconName;
              if (route.name === "Posts") {
                iconName = "grid-on";
              } else if (route.name === "Favorite") {
                iconName = "favorite";
              } else if (route.name === "Tagged") {
                iconName = "person-outline";
              }
              return <Icon name={iconName} size={26} color={color} />;
            },
            tabBarShowLabel: false,
            tabBarStyle: { backgroundColor: "#fff" },
            tabBarActiveTintColor: "#000",
            tabBarInactiveTintColor: "#888",
          })}
        >
          <Tab.Screen name="Posts" component={PostTab} />
          <Tab.Screen name="Favorite" component={FavoriteTab} />
          <Tab.Screen name="Tagged" component={TaggedTab} />
        </Tab.Navigator>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <Button
          title="Chỉnh sửa"
          style={{ marginTop: 12 }}
          onPress={() => navigation.navigate("ProfileEdit", { user })}
        />
        <Button
          title="Đăng xuất"
          onPress={handleLogout}
          color="red"
          style={{ marginTop: 12 }}
        />
      </View>
    </LinearGradient>
  );
}

export default ProfileScreen;

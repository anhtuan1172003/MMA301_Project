import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width } = Dimensions.get("window");
const imageSize = (width - 47) / 3; // 3 images per row with padding

const FavoriteTab = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  const fetchUserFavorites = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        throw new Error("No user logged in");
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser._id;

      const response = await axios.get(
        `https://mma301-project-be-9e9f.onrender.com/photos`
      );
      const favoritePhotos = response.data;
      const formattedData = favoritePhotos.map((photo) => ({
        id: photo._id || photo.id,
        uri: photo.image.thumbnail || photo.image.url[0],
      }));

      setFavorites(formattedData);
    } catch (error) {
      console.error("Error fetching favorite photos:", error);
      setError("Không thể tải danh sách ảnh yêu thích. Vui lòng thử lại sau.");
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách ảnh yêu thích. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.uri }}
        style={styles.image}
        onError={(e) => console.log("Image failed to load:", item.uri)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bạn chưa có ảnh yêu thích nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  imageContainer: {
    margin: 1,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});

export default FavoriteTab;

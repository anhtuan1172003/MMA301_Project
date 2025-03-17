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

const PostTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserPhotos();
  }, []);

  const fetchUserPhotos = async () => {
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
      const photos = response.data.data;
      const formattedData = photos.map((photo) => ({
        id: photo._id || photo.id,
        uri: photo.image.thumbnail || photo.image.url[0],
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Không thể tải ảnh. Vui lòng thử lại sau.");
      Alert.alert("Lỗi", "Không thể tải ảnh. Vui lòng thử lại sau.");
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

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
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
    borderColor: 2,
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
});

export default PostTab;

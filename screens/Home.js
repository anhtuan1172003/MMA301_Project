import React, { useEffect, useState } from "react";
import {
    View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
    const [photos, setPhotos] = useState([]);
    const [search, setSearch] = useState("");
    const [favoritePhotos, setFavoritePhotos] = useState([]);
    const [likes, setLikes] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        axios.get("https://mma301-project-be-9e9f.onrender.com/photos")
            .then(response => setPhotos(response.data))
            .catch(err => console.log("Error: " + err));
    }, []);

    const loadFavorites = async () => {
        try {
            const savedFavorites = await AsyncStorage.getItem("favoritePhotos");
            if (savedFavorites) {
                setFavoritePhotos(JSON.parse(savedFavorites));
            }
        } catch (error) {
            console.log("Lỗi khi tải danh sách yêu thích:", error);
        }
    };

    const loadLikes = async () => {
        try {
            const savedLikes = await AsyncStorage.getItem("likes");
            if (savedLikes) {
                setLikes(JSON.parse(savedLikes));
            }
        } catch (error) {
            console.log("Lỗi khi tải lượt thích:", error);
        }
    };

    useEffect(() => {
        loadFavorites();
        loadLikes();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
            loadLikes();
        }, [])
    );

    const toggleFavorite = async (photo) => {
        let updatedFavorites;
        let updatedLikes = { ...likes };

        if (favoritePhotos.some(fav => fav.id === photo.id)) {
            updatedFavorites = favoritePhotos.filter(fav => fav.id !== photo.id);
            updatedLikes[photo.id] = Math.max((updatedLikes[photo.id] || 0) - 1, 0);
        } else {
            updatedFavorites = [...favoritePhotos, photo];
            updatedLikes[photo.id] = (updatedLikes[photo.id] || 0) + 1;
        }

        setFavoritePhotos(updatedFavorites);
        setLikes(updatedLikes);

        await AsyncStorage.setItem("favoritePhotos", JSON.stringify(updatedFavorites));
        await AsyncStorage.setItem("likes", JSON.stringify(updatedLikes));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchBox}
                    placeholder="Nhập tiêu đề..."
                    onChangeText={text => setSearch(text)}
                />
                <TouchableOpacity 
                    style={styles.favoriteListButton} 
                    onPress={() => navigation.navigate("FavouritePhotos", { 
                        updateFavorites: setFavoritePhotos, 
                        updateLikes: setLikes 
                    })}
                >
                    <FontAwesome name="heart" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={photos.filter(photo => 
                    search === "" || photo.title.toUpperCase().includes(search.toUpperCase())
                )}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.photoContainer}>
                        <Image source={{ uri: item.image?.thumbnail }} style={styles.image} />
                        <View style={styles.infoContainer}>
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => toggleFavorite(item)}
                            >
                                <FontAwesome
                                    name={favoritePhotos.some(fav => fav.id === item.id) ? "heart" : "heart-o"}
                                    size={24}
                                    color="red"
                                />
                            </TouchableOpacity>
                            <Text style={styles.likeCount}>{likes[item.id] || 0} lượt thích</Text>
                            <Text style={styles.description}>{item.title}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.notFound}>Không tìm thấy ảnh</Text>}
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#45f7f4", paddingVertical: 50 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
    searchBox: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: "#fff" },
    favoriteListButton: { marginLeft: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 8 },
    photoContainer: { alignItems: "center", marginBottom: 20, backgroundColor: "#fff", borderRadius: 10, overflow: "hidden" },
    image: { width: "100%", height: 400, resizeMode: "cover" },
    infoContainer: { flexDirection: "column", alignItems: "flex-start", width: "100%", padding: 10 },
    favoriteButton: { marginBottom: 5 },
    likeCount: { fontSize: 16, fontWeight: "bold", color: "black", marginBottom: 5 },
    description: { fontSize: 18, fontWeight: "bold", textAlign: "left" },
    notFound: { textAlign: "center", fontSize: 16, color: "red", marginVertical: 20 }
});

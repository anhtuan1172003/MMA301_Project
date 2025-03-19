import React, { useEffect, useState } from "react";
import {
    View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { toggleFavorite, checkIsFavorite } from "../services/FavoriteService";

const HomeScreen = () => {
    const route = useRoute();
    const [photos, setPhotos] = useState([]);
    const [search, setSearch] = useState("");
    const [favoritePhotos, setFavoritePhotos] = useState([]);
    const [likes, setLikes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const fetchPhotos = () => {
        setLoading(true);
        axios.get("https://mma301-project-be-9e9f.onrender.com/photos")
            .then(response => {
                if (response.data && response.data.data) {
                    setPhotos(response.data.data);
                } else {
                    console.log("Dữ liệu không đúng định dạng:", response.data);
                    setPhotos([]);
                }
            })
            .catch(err => {
                console.log("Error: " + err);
                setError("Không thể tải dữ liệu");
                setPhotos([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (route.params?.refresh) {
            fetchPhotos();
            navigation.setParams({ refresh: false });
        }
    }, [route.params]);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const loadFavorites = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            if (!storedUser) {
                console.log("Không tìm thấy thông tin người dùng");
                return;
            }
            
            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser._id;
            
            // Kiểm tra trạng thái yêu thích cho mỗi ảnh
            if (photos && photos.length > 0) {
                const favoriteStatuses = await Promise.all(
                    photos.map(async (photo) => {
                        const favorite = await checkIsFavorite(photo._id, userId);
                        if (favorite) {
                            return { ...photo, isFavorite: true, favoriteId: favorite._id };
                        }
                        return { ...photo, isFavorite: false };
                    })
                );
                
                // Lọc ra những ảnh đã được yêu thích
                const favorites = favoriteStatuses.filter(photo => photo.isFavorite);
                setFavoritePhotos(favorites);
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
            if (photos.length > 0) {
                loadFavorites();
                loadLikes();
            }
        }, [photos])
    );

    const handleToggleFavorite = async (photo) => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            if (!storedUser) {
                Alert.alert("Thông báo", "Vui lòng đăng nhập để sử dụng tính năng này");
                return;
            }
            
            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser._id;
            
            // Sử dụng service để toggle favorite
            const result = await toggleFavorite(photo._id, userId);
            
            // Cập nhật UI
            let updatedLikes = { ...likes };
            
            if (result.isFavorite) {
                // Thêm vào danh sách yêu thích
                const newFavoritePhoto = {
                    ...photo,
                    isFavorite: true,
                    favoriteId: result.favorite._id
                };
                setFavoritePhotos([...favoritePhotos, newFavoritePhoto]);
                updatedLikes[photo._id] = (updatedLikes[photo._id] || 0) + 1;
            } else {
                // Xóa khỏi danh sách yêu thích
                const updatedFavorites = favoritePhotos.filter(fav => fav._id !== photo._id);
                setFavoritePhotos(updatedFavorites);
                updatedLikes[photo._id] = Math.max((updatedLikes[photo._id] || 0) - 1, 0);
            }
            
            setLikes(updatedLikes);
            await AsyncStorage.setItem("likes", JSON.stringify(updatedLikes));
            
            // Tải lại danh sách yêu thích
            loadFavorites();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái yêu thích:", error);
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại sau.");
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        }

        const filteredPhotos = photos.filter(photo => 
            search === "" || (photo.title && photo.title.toUpperCase().includes(search.toUpperCase()))
        );

        return (
            <FlatList
                data={filteredPhotos}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.photoContainer}>
                        <TouchableOpacity 
                            style={styles.imageWrapper}
                            onPress={() => navigation.navigate('PhotoDetails', { photo: { _id: item._id, title: item.title, image: item.image, userId: item.userId } })}>
                            <Image source={{ uri: item.image?.thumbnail }} style={styles.image} />
                        </TouchableOpacity>
                        <View style={styles.infoContainer}>
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => handleToggleFavorite(item)}
                            >
                                <FontAwesome
                                    name={favoritePhotos.some(fav => fav._id === item._id) ? "heart" : "heart-o"}
                                    size={24}
                                    color="red"/>
                            </TouchableOpacity>
                            <Text style={styles.likeCount}>{likes[item._id] || 0} lượt thích</Text>
                            <Text style={styles.description}>{item.title}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.notFound}>Không tìm thấy ảnh</Text>}
            />
        );
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
                    style={styles.postButton} 
                    onPress={() => navigation.navigate("PostScreen")}
                >
                    <FontAwesome name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {renderContent()}
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    imageWrapper: { width: "100%", height: 400 },
    container: { flex: 1, padding: 10, backgroundColor: "#45f7f4", paddingVertical: 50 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
    searchBox: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: "#fff" },
    postButton: { marginLeft: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 8 },
    photoContainer: { alignItems: "center", marginBottom: 20, backgroundColor: "#fff", borderRadius: 10, overflow: "hidden" },
    image: { width: "100%", height: 400, resizeMode: "cover" },
    infoContainer: { flexDirection: "column", alignItems: "flex-start", width: "100%", padding: 10 },
    favoriteButton: { marginBottom: 5 },
    likeCount: { fontSize: 16, fontWeight: "bold", color: "black", marginBottom: 5 },
    description: { fontSize: 18, fontWeight: "bold", textAlign: "left" },
    notFound: { textAlign: "center", fontSize: 16, color: "red", marginVertical: 20 },
    centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 10, fontSize: 16, color: "#007bff" },
    errorText: { fontSize: 16, color: "red", textAlign: "center" }
});
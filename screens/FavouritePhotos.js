import React, { useEffect, useState } from "react";
import {
    View, Text, FlatList, Image, TouchableOpacity, StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const FavouritePhotos = ({ route }) => {
    const [favoritePhotos, setFavoritePhotos] = useState([]);
    const navigation = useNavigation();

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

    useEffect(() => {
        loadFavorites();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    );

    const removeFavorite = async (photoId) => {
        const updatedFavorites = favoritePhotos.filter(photo => photo.id !== photoId);
        setFavoritePhotos(updatedFavorites);
        await AsyncStorage.setItem("favoritePhotos", JSON.stringify(updatedFavorites));

        // Truyền lại danh sách yêu thích mới cho trang Home
        if (route?.params?.updateFavorites) {
            route.params.updateFavorites(updatedFavorites);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ảnh Yêu Thích</Text>

            <FlatList
                data={favoritePhotos}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image?.thumbnail }} style={styles.image} />
                        <Text style={styles.photoTitle}>{item.title}</Text>
                        <TouchableOpacity style={styles.removeButton} onPress={() => removeFavorite(item.id)}>
                            <FontAwesome name="trash" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.notFound}>Không có ảnh yêu thích</Text>}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" size={20} color="white" />
                <Text style={styles.backText}> Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FavouritePhotos;


const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 10, 
        backgroundColor: "#45f7f4", 
        paddingVertical: 50 
    },
    title: { 
        fontSize: 20, 
        fontWeight: "bold", 
        textAlign: "center", 
        marginBottom: 10 
    },
    card: { 
        flex: 1, 
        margin: 5, 
        borderRadius: 10, 
        overflow: "hidden", 
        backgroundColor: "#fff" 
    },
    image: { 
        width: "100%", 
        height: 120, 
        resizeMode: "cover" 
    },
    photoTitle: { 
        textAlign: "center", 
        padding: 5, 
        fontSize: 14, 
        fontWeight: "500"
    },
    removeButton: { 
        position: "absolute", 
        top: 5, 
        right: 5, 
        backgroundColor: "#FF5733", 
        padding: 5, 
        borderRadius: 20 
    },
    emptyText: { 
        textAlign: "center", 
        fontSize: 16, 
        color: "red", 
        marginTop: 20 
    },
    backButton: { 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#FF5733", 
        padding: 10, 
        borderRadius: 8, 
        marginTop: 10 
    },
    backButtonText: { 
        color: "white", 
        fontSize: 16, 
        marginLeft: 5 
    },
});





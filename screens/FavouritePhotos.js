import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const FavouritePhotos = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const favorites = route.params?.favorites || []; // Nhận danh sách ảnh yêu thích

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ảnh Yêu Thích</Text>
            <FlatList
                data={favorites}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image?.thumbnail }} style={styles.image} />
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Chưa có ảnh yêu thích</Text>}
            />
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <FontAwesome name="arrow-left" size={20} color="white" />
                <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FavouritePhotos;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#45f7f4", paddingVertical: 50 },
    title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    card: { flex: 1, margin: 5, borderRadius: 10, overflow: "hidden", backgroundColor: "#fff" },
    image: { width: "100%", height: 120, resizeMode: "cover" },
    emptyText: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
    backButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FF5733", padding: 10, borderRadius: 8, marginTop: 10 },
    backButtonText: { color: "white", fontSize: 16, marginLeft: 5 },
});

import React, { useEffect, useState } from "react";
import { 
    View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const HomeScreen = () => {
    const [photos, setPhotos] = useState([]);
    const [filterPhoto, setFilterPhoto] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {

        
        axios.get("https://mma301-project-be-9e9f.onrender.com/photos") // Thay 192.168.x.x bằng IP máy tính của bạn


            .then(response => {
                let tempPhoto = response.data;

                // Lọc theo từ khóa tìm kiếm
                if (search.length !== 0) {
                    tempPhoto = tempPhoto.filter(p =>
                        p.title.toUpperCase().includes(search.toUpperCase()) ||
                        p.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
                    );
                }

                // Lọc theo tag đã chọn
                if (selectedTags.length > 0) {
                    tempPhoto = tempPhoto.filter(p =>
                        selectedTags.some(tag => p.tags?.includes(tag.toLowerCase()))
                    );
                }

                setPhotos(tempPhoto);
                setFilterPhoto(response.data);
            })
            .catch(err => console.log("Error: " + err));
    }, [search, selectedTags]);

    function filterByTag(tag) {
        if (tag === "all") {
            setSelectedTags([]);
        } else {
            setSelectedTags(prevTags =>
                prevTags.includes(tag.toLowerCase())
                    ? prevTags.filter(t => t !== tag.toLowerCase())
                    : [...prevTags, tag.toLowerCase()]
            );
        }
    }

    function toggleSortOrder() {
        setSortOrder(prevOrder => {
            const newOrder = prevOrder === "asc" ? "desc" : "asc";
            const sortedPhotos = [...photos].sort((a, b) =>
                newOrder === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title)
            );
            setPhotos(sortedPhotos);
            return newOrder;
        });
    }

    // Lấy danh sách tag
    let tagsList = [];
    filterPhoto.forEach(p => {
        let photoTags = Array.isArray(p.tags) ? p.tags : [];
        tagsList = [...tagsList, ...photoTags];
    });

    let tagsSet = new Set(tagsList);
    let newTags = [...tagsSet];

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBox}
                placeholder="Nhập tiêu đề hoặc thẻ ảnh..."
                onChangeText={text => setSearch(text)}
            />

            {/* Nút sắp xếp */}
            <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
                <FontAwesome name="sort" size={20} color="#17a2b8" />
                <Text style={styles.sortText}> {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}</Text>
            </TouchableOpacity>

            {/* Danh sách ảnh */}
            <FlatList
                data={photos}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card} 
                        onPress={() => Alert.alert("Chọn ảnh", item.title)}
                    >
                        <Image

                            source={{ uri: `https://mma-json-deploy.onrender.com/albums/${item.image?.thumbnail}` }}
                            style={styles.image}
                        />
                        <Text style={styles.title}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.notFound}>Không tìm thấy ảnh</Text>}
            />

            {/* Bộ lọc tag */}
            <View style={styles.tagContainer}>
                <TouchableOpacity
                    style={styles.tagButton}
                    onPress={() => filterByTag("all")}
                >
                    <Text style={styles.tagText}>Tất cả</Text>
                </TouchableOpacity>
                {newTags.map(tag => (
                    <TouchableOpacity
                        key={tag}
                        style={[
                            styles.tagButton,
                            selectedTags.includes(tag.toLowerCase()) && styles.tagActive
                        ]}
                        onPress={() => filterByTag(tag)}
                    >
                        <Text style={styles.tagText}>{tag}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f8f9fa",
    },
    searchBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
        backgroundColor: "#e3f2fd",
        padding: 8,
        borderRadius: 8,
        marginBottom: 10,
    },
    sortText: {
        fontSize: 14,
        color: "#17a2b8",
        marginLeft: 5,
    },
    card: {
        flex: 1,
        margin: 5,
        borderWidth: 2,
        borderColor: "#17a2b8",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 120,
        resizeMode: "cover",
    },
    title: {
        padding: 10,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    notFound: {
        textAlign: "center",
        fontSize: 16,
        color: "red",
        marginVertical: 20,
    },
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },
    tagButton: {
        backgroundColor: "#e0f7fa",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        margin: 5,
    },
    tagText: {
        fontSize: 14,
        color: "#007bff",
    },
    tagActive: {
        backgroundColor: "#007bff",
    },
});

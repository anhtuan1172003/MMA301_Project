// import React, { useEffect, useState } from "react";
// import {
//     View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Alert
// } from "react-native";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import { FontAwesome } from "@expo/vector-icons";


// const HomeScreen = () => {
//     const [photos, setPhotos] = useState([]);
//     const [search, setSearch] = useState("");
//     const [sortOrder, setSortOrder] = useState(null);
//     const [selectedTags, setSelectedTags] = useState([]);
//     const [favoritePhotos, setFavoritePhotos] = useState([]);
//     const [newTags, setNewTags] = useState([]);
//     const navigation = useNavigation();

//     useEffect(() => {
//         axios.get("https://mma301-project-be-9e9f.onrender.com/photos")
//             .then(response => {
//                 let tempPhoto = response.data;
//                 let allTags = new Set();
                
//                 tempPhoto.forEach(photo => {
//                     if (photo.tags) {
//                         photo.tags.forEach(tag => allTags.add(tag));
//                     }
//                 });
                
//                 setNewTags(Array.from(allTags));

//                 // Lọc theo từ khóa tìm kiếm
//                 if (search.length !== 0) {
//                     tempPhoto = tempPhoto.filter(p =>
//                         p.title.toUpperCase().includes(search.toUpperCase()) ||
//                         p.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
//                     );
//                 }

//                 // Lọc theo tag đã chọn
//                 if (selectedTags.length > 0) {
//                     tempPhoto = tempPhoto.filter(p =>
//                         selectedTags.some(tag => p.tags?.includes(tag.toLowerCase()))
//                     );
//                 }

//                 setPhotos(tempPhoto);
//             })
//             .catch(err => console.log("Error: " + err));
//     }, [search, selectedTags]);

//     const filterByTag = (tag) => {
//         if (tag === "all") {
//             setSelectedTags([]);
//         } else {
//             setSelectedTags(prevTags =>
//                 prevTags.includes(tag.toLowerCase())
//                     ? prevTags.filter(t => t !== tag.toLowerCase())
//                     : [...prevTags, tag.toLowerCase()]
//             );
//         }
//     };

//     function toggleSortOrder() {
//         setSortOrder(prevOrder => {
//             const newOrder = prevOrder === "asc" ? "desc" : "asc";
//             const sortedPhotos = [...photos].sort((a, b) =>
//                 newOrder === "asc"
//                     ? a.title.localeCompare(b.title)
//                     : b.title.localeCompare(a.title)
//             );
//             setPhotos(sortedPhotos);
//             return newOrder;
//         });
//     }

//     function toggleFavorite(photo) {
//         setFavoritePhotos(prevFavorites => {
//             if (prevFavorites.some(fav => fav.id === photo.id)) {
//                 return prevFavorites.filter(fav => fav.id !== photo.id);
//             } else {
//                 return [...prevFavorites, photo];
//             }
//         });
//     }

//     return (
//         <View style={styles.container}>
//             <TextInput
//                 style={styles.searchBox}
//                 placeholder="Nhập tiêu đề hoặc thẻ ảnh..."
//                 onChangeText={text => setSearch(text)}
//             />

//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
//                     <FontAwesome name="sort" size={20} color="#17a2b8" />
//                     <Text style={styles.sortText}> {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.favoriteButton}
//                     onPress={() => navigation.navigate("FavouritePhotos", { favorites: favoritePhotos })}
//                 >
//                     <FontAwesome name="heart" size={20} color="red" />
//                     <Text style={styles.favoriteText}> Yêu thích ({favoritePhotos.length})</Text>
//                 </TouchableOpacity>
//             </View>

//             <FlatList
//                 data={photos}
//                 keyExtractor={item => item.id.toString()}
//                 numColumns={2}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Chọn ảnh", item.title)}>
//                         <Image source={{ uri: item.image?.thumbnail }} style={styles.image} />
//                         <Text style={styles.title}>{item.title}</Text>
//                         <TouchableOpacity
//                             style={styles.favoriteIcon}
//                             onPress={() => toggleFavorite(item)}
//                         >
//                             <FontAwesome
//                                 name={favoritePhotos.some(fav => fav.id === item.id) ? "heart" : "heart-o"}
//                                 size={20}
//                                 color="red"
//                             />
//                         </TouchableOpacity>
//                     </TouchableOpacity>
//                 )}
//                 ListEmptyComponent={<Text style={styles.notFound}>Không tìm thấy ảnh</Text>}
//             />

//             <View style={styles.tagContainer}>
//                 <TouchableOpacity style={styles.tagButton} onPress={() => filterByTag("all")}>
//                     <Text style={styles.tagText}>Tất cả</Text>
//                 </TouchableOpacity>
//                 {newTags.map(tag => (
//                     <TouchableOpacity
//                         key={tag}
//                         style={[styles.tagButton, selectedTags.includes(tag.toLowerCase()) && styles.tagActive]}
//                         onPress={() => filterByTag(tag)}
//                     >
//                         <Text style={styles.tagText}>{tag}</Text>
//                     </TouchableOpacity>
//                 ))}
//             </View>
//         </View>
//     );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 10, backgroundColor: "#45f7f4", paddingVertical: 50},
//     searchBox: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: "#fff", marginBottom: 10 },
//     buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
//     sortButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#e3f2fd", padding: 8, borderRadius: 8 },
//     sortText: { fontSize: 14, color: "#17a2b8", marginLeft: 5 },
//     favoriteButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffcccc", padding: 8, borderRadius: 8 },
//     favoriteText: { fontSize: 14, color: "red", marginLeft: 5 },
//     card: { flex: 1, margin: 5, borderWidth: 2, borderColor: "#17a2b8", borderRadius: 10, overflow: "hidden", backgroundColor: "#fff", alignItems: "center", position: "relative" },
//     image: { width: "100%", height: 120, resizeMode: "cover" },
//     title: { padding: 10, fontSize: 16, fontWeight: "bold", textAlign: "center" },
//     notFound: { textAlign: "center", fontSize: 16, color: "red", marginVertical: 20 },
//     favoriteIcon: { position: "absolute", top: 10, right: 10 },
//     tagContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
//     tagButton: { backgroundColor: "#e3f2fd", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, margin: 5 },
//     tagText: { fontSize: 14, color: "#007bff", textTransform: "capitalize" },
//     tagActive: { backgroundColor: "#007bff" },
//     tagAll: { backgroundColor: "#17a2b8" },
//     tagAllText: { color: "#fff" }
// });





import React, { useEffect, useState } from "react";
import {
    View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Alert
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
    const [photos, setPhotos] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [favoritePhotos, setFavoritePhotos] = useState([]);
    const [newTags, setNewTags] = useState([]);
    const navigation = useNavigation();

    // Lấy dữ liệu từ API
    useEffect(() => {
        axios.get("https://mma301-project-be-9e9f.onrender.com/photos")
            .then(response => {
                let tempPhoto = response.data;
                let allTags = new Set();
                
                tempPhoto.forEach(photo => {
                    if (photo.tags) {
                        photo.tags.forEach(tag => allTags.add(tag));
                    }
                });

                setNewTags(Array.from(allTags));

                setPhotos(tempPhoto);
            })
            .catch(err => console.log("Error: " + err));
    }, []);

    // Lấy danh sách yêu thích từ AsyncStorage
    useEffect(() => {
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
        loadFavorites();
    }, [favoritePhotos]);

    // Bộ lọc ảnh theo tìm kiếm và tag
    const filteredPhotos = photos.filter(photo => {
        return (
            (search === "" || photo.title.toUpperCase().includes(search.toUpperCase())) &&
            (selectedTags.length === 0 || selectedTags.some(tag => photo.tags?.includes(tag)))
        );
    });

    // Lọc theo tag
    const filterByTag = (tag) => {
        if (tag === "all") {
            setSelectedTags([]);
        } else {
            setSelectedTags(prevTags =>
                prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
            );
        }
    };

    // Sắp xếp danh sách ảnh
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => {
            const newOrder = prevOrder === "asc" ? "desc" : "asc";
            const sortedPhotos = [...filteredPhotos].sort((a, b) =>
                newOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
            );
            setPhotos(sortedPhotos);
            return newOrder;
        });
    };

    // Xử lý yêu thích ảnh
    const toggleFavorite = async (photo) => {
        let updatedFavorites;
        if (favoritePhotos.some(fav => fav.id === photo.id)) {
            updatedFavorites = favoritePhotos.filter(fav => fav.id !== photo.id);
        } else {
            updatedFavorites = [...favoritePhotos, photo];
        }
        setFavoritePhotos(updatedFavorites);
        await AsyncStorage.setItem("favoritePhotos", JSON.stringify(updatedFavorites));
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBox}
                placeholder="Nhập tiêu đề hoặc thẻ ảnh..."
                onChangeText={text => setSearch(text)}
            />

            {/* Nút sắp xếp và yêu thích */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
                    <FontAwesome name="sort" size={20} color="#17a2b8" />
                    <Text style={styles.sortText}> {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => navigation.navigate("FavouritePhotos")}
                >
                    <FontAwesome name="heart" size={20} color="red" />
                    <Text style={styles.favoriteText}> Yêu thích ({favoritePhotos.length})</Text>
                </TouchableOpacity>
            </View>

            {/* Danh sách ảnh */}
            <FlatList
                data={filteredPhotos}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Chọn ảnh", item.title)}>
                        <Image source={{ uri: item.image?.thumbnail }} style={styles.image} />
                        <Text style={styles.title}>{item.title}</Text>
                        <TouchableOpacity
                            style={styles.favoriteIcon}
                            onPress={() => toggleFavorite(item)}
                        >
                            <FontAwesome
                                name={favoritePhotos.some(fav => fav.id === item.id) ? "heart" : "heart-o"}
                                size={20}
                                color="red"
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.notFound}>Không tìm thấy ảnh</Text>}
            />

            {/* Bộ lọc tag */}
            <View style={styles.tagContainer}>
                <TouchableOpacity style={styles.tagButton} onPress={() => filterByTag("all")}>
                    <Text style={styles.tagText}>Tất Cả</Text>
                </TouchableOpacity>
                {newTags.map(tag => (
                    <TouchableOpacity
                        key={tag}
                        style={[styles.tagButton, selectedTags.includes(tag) && styles.tagActive]}
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
    container: { flex: 1, padding: 10, backgroundColor: "#45f7f4", paddingVertical: 50 },
    searchBox: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: "#fff", marginBottom: 10 },
    buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    sortButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#e3f2fd", padding: 8, borderRadius: 8 },
    sortText: { fontSize: 14, color: "#17a2b8", marginLeft: 5 },
    favoriteButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffcccc", padding: 8, borderRadius: 8 },
    favoriteText: { fontSize: 14, color: "red", marginLeft: 5 },
    card: { flex: 1, margin: 5, borderRadius: 10, overflow: "hidden", backgroundColor: "#fff", alignItems: "center", position: "relative" },
    image: { width: "100%", height: 120, resizeMode: "cover" },
    title: { padding: 10, fontSize: 16, fontWeight: "bold", textAlign: "center" },
    notFound: { textAlign: "center", fontSize: 16, color: "red", marginVertical: 20 },
    favoriteIcon: { position: "absolute", top: 10, right: 10 },
    tagContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
    tagButton: { backgroundColor: "#e3f2fd", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, margin: 5 },
    tagText: { fontSize: 14, color: "#007bff", textTransform: "capitalize" },
    tagActive: { backgroundColor: "#007bff" }
});

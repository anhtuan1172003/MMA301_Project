import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator,
    FlatList
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const PostScreen = () => {
    const [title, setTitle] = useState("");
    const [images, setImages] = useState([]);
    const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Thông báo", "Cần cấp quyền truy cập thư viện ảnh để tiếp tục");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,

            quality: 1,
        });

        if (!result.canceled) {
            setImages(prev => [...prev, ...result.assets.map(asset => asset.uri)]);
            if (images.length === 0) setSelectedThumbnailIndex(0);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Thông báo", "Cần cấp quyền truy cập camera để tiếp tục");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({

            quality: 1,
        });

        if (!result.canceled) {
            setImages(prev => [...prev, ...result.assets.map(asset => asset.uri)]);
            if (images.length === 0) setSelectedThumbnailIndex(0);
        }
    };

    
    const handlePost = async () => {
        if (!title.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập tiêu đề cho bài viết");
            return;
        }
    
        if (images.length === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ảnh cho bài viết");
            return;
        }
    
        try {
            setLoading(true);
            const storedUser = await AsyncStorage.getItem("user");
    
            if (!storedUser) {
                Alert.alert("Thông báo", "Vui lòng đăng nhập để đăng bài");
                return;
            }
    
            const parsedUser = JSON.parse(storedUser);
    
            // Prepare Cloudinary upload data
            const uploadPromises = images.map(async (uri) => {
                const cloudinaryData = new FormData();
                cloudinaryData.append("file", {
                    uri: uri,
                    name: 'upload.jpg',
                    type: 'image/jpeg'
                });
                cloudinaryData.append("upload_preset", "MMA_Upload");
                cloudinaryData.append("cloud_name", "dvdnw79tk");
    
                const response = await fetch(
                    "https://api.cloudinary.com/v1_1/dvdnw79tk/image/upload",
                    {
                        method: "POST",
                        body: cloudinaryData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                );
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
                }
                return response.json();
            });
    
            const cloudinaryResults = await Promise.all(uploadPromises);
            
            // Extract URLs correctly
            const imageUrls = cloudinaryResults.map(result => result.secure_url);
            const thumbnailUrl = imageUrls[selectedThumbnailIndex];
            
            // IMPORTANT: Send the first URL as a string, not as an array
            // This is because the backend wraps it in an array again
            const postData = {
                title: title,
                userId: parsedUser._id,
                image: {
                    url: imageUrls.join(','), // Send as comma-separated string
                    thumbnail: thumbnailUrl
                }
            };
            
            console.log("Sending data:", JSON.stringify(postData, null, 2));
    
            const postResponse = await axios.post(
                "https://mma301-project-be-9e9f.onrender.com/photos",
                postData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${parsedUser.token}`
                    }
                }
            );
    
            if (postResponse.data) {
                Alert.alert("Thành công", "Đăng bài thành công");
                navigation.navigate('Home', { refresh: true });
            }
        } catch (error) {
            console.error("Lỗi khi đăng bài:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
    
            const errorMessage = error.response?.data?.error || error.response?.data?.message
                || `Mã lỗi: ${error.response?.status || 'Không xác định'}`
                || "Không thể đăng bài. Vui lòng thử lại sau.";
    
            Alert.alert("Lỗi", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tạo bài viết mới</Text>
                <TouchableOpacity
                    style={[styles.postButton, (!title.trim() || images.length === 0) && styles.disabledButton]}
                    onPress={handlePost}
                    disabled={!title.trim() || images.length === 0 || loading}
                >
                    <Text style={styles.postButtonText}>Đăng</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.titleInput}
                placeholder="Nhập tiêu đề bài viết..."
                value={title}
                onChangeText={setTitle}
                multiline
            />

            <View style={styles.imagePickerContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.pickerButton} onPress={pickImage}>
                        <FontAwesome name="photo" size={20} color="white" />
                        <Text style={styles.buttonText}>Thư viện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pickerButton} onPress={takePhoto}>
                        <FontAwesome name="camera" size={20} color="white" />
                        <Text style={styles.buttonText}>Chụp ảnh</Text>
                    </TouchableOpacity>
                </View>
                {images.length > 0 ? (
                    <View style={styles.imageListContainer}>
                        <FlatList
                            horizontal
                            data={images}
                            renderItem={({ item, index }) => (
                                <View style={styles.imageItem}>
                                    <Image source={{ uri: item }} style={styles.selectedImage} />
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => setImages(prev => prev.filter((_, i) => i !== index))}>
                                        <FontAwesome name="times-circle" size={24} color="red" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.thumbnailSelector}
                                        onPress={() => setSelectedThumbnailIndex(index)}>
                                        <FontAwesome
                                            name={selectedThumbnailIndex === index ? "check-circle" : "circle"}
                                            size={24}
                                            color="green"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <View style={styles.imagePickerButtons}>
                            <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
                                <FontAwesome name="image" size={30} color="#666" />
                                <Text style={styles.buttonText}>Thư viện</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pickButton} onPress={takePhoto}>
                                <FontAwesome name="camera" size={30} color="#666" />
                                <Text style={styles.buttonText}>Chụp ảnh</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>Đang đăng bài...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    imageListContainer: {
        height: 120,
        marginVertical: 10,
    },
    imageItem: {
        position: 'relative',
        marginRight: 10,
    },
    selectedImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 12,
        padding: 2,
    },
    thumbnailSelector: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 12,
        padding: 2,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold"
    },
    postButton: {
        backgroundColor: "#007bff",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5
    },
    disabledButton: {
        backgroundColor: "#ccc"
    },
    postButtonText: {
        color: "#fff",
        fontWeight: "bold"
    },
    titleInput: {
        padding: 15,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: "top"
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    pickerButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    imagePickerContainer: {
        flex: 1,
        margin: 15,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#f8f8f8"
    },
    selectedImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    imagePlaceholderText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#007bff"
    },
    imagePickerButtons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 30
    },
    pickButton: {
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        marginTop: 8,
        fontSize: 14,
        color: "#666"
    }
});

export default PostScreen;
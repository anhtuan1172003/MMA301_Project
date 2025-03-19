import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const PostScreen = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
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
            setImage(result.assets[0].uri);
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
            setImage(result.assets[0].uri);
        }
    };

    const handlePost = async () => {
        if (!title.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập tiêu đề cho bài viết");
            return;
        }

        if (!image) {
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
            const cloudinaryData = new FormData();
            cloudinaryData.append("file", {
                uri: `file://${image}`,
                name: 'upload.jpg',
                type: 'image/jpeg'
            });
            cloudinaryData.append("upload_preset", "MMA_Upload");
            cloudinaryData.append("cloud_name", "dvdnw79tk");

            const cloudinaryResponse = await fetch(
                "https://api.cloudinary.com/v1_1/dvdnw79tk/image/upload",
                {
                    method: "POST",
                    body: cloudinaryData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!cloudinaryResponse.ok) {
                const errorData = await cloudinaryResponse.json();
                throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
            }

            const cloudinaryResult = await cloudinaryResponse.json();
            const imageUrl = cloudinaryResult.secure_url;

            // Send post data to backend
            const postData = {
                title: title,
                userId: parsedUser._id,
                image: {
                    url: imageUrl,
                    thumbnail: imageUrl
                }
            };

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
            
            const errorMessage = error.response?.data?.message 
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
                    style={[styles.postButton, (!title.trim() || !image) && styles.disabledButton]}
                    onPress={handlePost}
                    disabled={!title.trim() || !image || loading}
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
                {image ? (
                    <Image source={{ uri: image }} style={styles.selectedImage} />
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
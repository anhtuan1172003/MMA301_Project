import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { PhotoContext } from "./PhotoContext";
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from "./cloudinaryConfig";
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';

export default function Camera() {
    const { savePhotos, photos } = useContext(PhotoContext);
    const hasRun = useRef(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [caption, setCaption] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const captureImage = async () => {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraPermission.status !== "granted") {
                alert("Camera permission is required!");
                navigation.goBack();
                return;
            }

            const locationPermission = await Location.requestForegroundPermissionsAsync();
            if (locationPermission.status !== "granted") {
                alert("Location permission is required!");
                navigation.goBack();
                return;
            }

            const result = await ImagePicker.launchCameraAsync({ quality: 1, base64: true });
            if (!result.canceled) {
                setCapturedImage(result.assets[0]);
                const loc = await Location.getCurrentPositionAsync({});
                setLocation(loc.coords);
            } else {
                navigation.goBack();
            }
        };

        captureImage();
    }, [navigation]);

    const uploadAndSave = async () => {
        if (!capturedImage || !location) return;

        const { uri } = capturedImage;
        const { latitude, longitude } = location;

        const uploadToCloudinary = async (imageUri) => {
            let formData = new FormData();
            formData.append("file", {
                uri: imageUri,
                type: "image/jpeg",
                name: "photo.jpg",
            });
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

            try {
                let response = await fetch(CLOUDINARY_UPLOAD_URL, {
                    method: "POST",
                    body: formData,
                });
                let data = await response.json();
                if (data.secure_url) {
                    return data.secure_url;
                }
                throw new Error('Upload failed');
            } catch (error) {
                console.error("Cloudinary upload failed:", error);
                return null;
            }
        };

        const cloudinaryUrl = await uploadToCloudinary(uri);

        if (cloudinaryUrl) {
            const newPhoto = {
                id: Date.now().toString(),
                uri: cloudinaryUrl,
                latitude,
                longitude,
                timestamp: new Date().toLocaleString(),
                size: capturedImage.fileSize || "N/A",
                caption: caption,
            };
            console.log('New photo being saved:', newPhoto);
            const updatedPhotos = [...photos, newPhoto];
            await savePhotos(updatedPhotos);
            navigation.navigate('ProfileDetails');
        } else {
            alert('Failed to upload photo');
        }
    };

    const discardImage = () => {
        setCapturedImage(null);
        navigation.goBack();
    };

    if (capturedImage) {
        return (
            <View style={{ flex: 1 }}>
                <Image source={{ uri: capturedImage.uri }} style={{ flex: 1 }} resizeMode="contain" />
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
                    onChangeText={setCaption}
                    value={caption}
                    placeholder="Nhập caption..."
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20 }}>
                    <TouchableOpacity onPress={uploadAndSave} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>Đăng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={discardImage} style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}>
                        <Text style={{ color: 'white' }}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return null;
}
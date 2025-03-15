import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, Alert, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import COLORS from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { PhotoContext } from './PhotoContext';

const API_URL = 'https://mma301-project-be-9e9f.onrender.com/users';

export default function ProfileScreen() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { photos } = useContext(PhotoContext);
    const [sortedPhotos, setSortedPhotos] = useState([]); // Mảng đã sắp xếp

    useEffect(() => {
        console.log('Photos in ProfileScreen:', photos);
        getUserId();
        sortPhotosByTimestamp(); // Sắp xếp ảnh khi photos thay đổi
    }, [photos]);

    // Hàm sắp xếp photos theo thời gian chụp (mới nhất trước)
    const sortPhotosByTimestamp = () => {
        const sorted = [...photos].sort((a, b) => {
            // Chuyển timestamp thành Date để so sánh
            const dateA = parseTimestamp(a.timestamp);
            const dateB = parseTimestamp(b.timestamp);
            return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
        });
        setSortedPhotos(sorted);
    };

    // Hàm parse timestamp từ "HH:mm:ss DD/M/YYYY" thành Date
    const parseTimestamp = (timestamp) => {
        // Ví dụ: "09:09:13 15/3/2025" -> [HH:mm:ss, DD/M/YYYY]
        const [time, date] = timestamp.split(' '); // Tách thành ["09:09:13", "15/3/2025"]
        const [hours, minutes, seconds] = time.split(':').map(Number); // Tách giờ: [9, 9, 13]
        const [day, month, year] = date.split('/').map(Number); // Tách ngày: [15, 3, 2025]
        // Tạo đối tượng Date (lưu ý: tháng trong Date bắt đầu từ 0, nên trừ 1)
        return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const getUserId = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            console.log('Stored user:', storedUser);

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                fetchUserData(parsedUser._id);
            } else {
                Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
                setLoading(false);
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lấy ID người dùng.');
            setLoading(false);
        }
    };

    const fetchUserData = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            console.log('API response:', response.data);
            setUser(response.data);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng.');
            console.error('API error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderPhotoItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => navigation.navigate('PhotoDetails', { photoId: item.id })}
            style={styles.photoItem}
        >
            <Image 
                source={{ uri: item.uri }} 
                style={styles.photoImage}
                onError={(e) => console.log('Image load error:', item.uri, e.nativeEvent.error)}
            />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.white} />
            </View>
        );
    }

    return (
        <LinearGradient
            style={styles.container}
            colors={[COLORS.greenInfo, COLORS.info]}
        >
            <View style={styles.header}>
                <Image
                    source={require('../assets/p1.png')}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>
                        {user?.name}
                    </Text>
                    <Text style={styles.email}>
                        {user?.account?.email}
                    </Text>
                </View>
            </View>

            <View style={styles.bioContainer}>
                <Text style={styles.bioTitle}>Thông tin cá nhân</Text>
                <Text style={styles.bioText}>
                    {user?.address?.street}, {user?.address?.city}
                </Text>
            </View>

            <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('ProfileEdit', { user })}
            >
                <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.cameraButton}
                onPress={() => navigation.navigate('Camera')}
            >
                <Text style={styles.cameraButtonText}>Chụp ảnh</Text>
            </TouchableOpacity>

            <View style={styles.photosContainer}>
                <FlatList
                    data={sortedPhotos} // Sử dụng mảng đã sắp xếp
                    renderItem={renderPhotoItem}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Chưa có ảnh nào!</Text>
                    }
                />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: COLORS.white,
        opacity: 0.8,
    },
    bioContainer: {
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    bioTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    bioText: {
        fontSize: 14,
        color: COLORS.dark,
    },
    editButton: {
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    editButtonText: {
        fontSize: 16,
        color: COLORS.dark,
        fontWeight: '600',
    },
    cameraButton: {
        backgroundColor: '#007AFF',
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    cameraButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    photosContainer: {
        flex: 1,
    },
    photoItem: {
        flex: 1/3,
        aspectRatio: 1,
        margin: 1,
    },
    photoImage: {
        width: '100%',
        height: '100%',
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.white,
        fontSize: 16,
        marginTop: 20,
    },
});
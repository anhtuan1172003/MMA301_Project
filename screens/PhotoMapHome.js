// PhotoMapHome.js
import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { PhotoContext } from './PhotoContext';

export default function PhotoMapHome({ navigation }) {
    const { photos } = useContext(PhotoContext);
    const [viewMode, setViewMode] = useState('list');
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);

    console.log('Photos in PhotoMapHome:', photos);

    const handleTakePhoto = () => {
        if (isTakingPhoto) return;
        setIsTakingPhoto(true);
        navigation.navigate('Camera');
        setTimeout(() => setIsTakingPhoto(false), 1000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                <TouchableOpacity onPress={() => setViewMode('list')}>
                    <Text style={viewMode === 'list' ? styles.activeTab : styles.tab}>List</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item }) => {
                    console.log('Image URI:', item.uri); // Thêm console.log
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate('PhotoDetails', { photoId: item.id })}>
                            <Image source={{ uri: item.uri }} style={styles.gridImage} />
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={<Text style={styles.emptyText}>No photos yet!</Text>}
            />

            <TouchableOpacity
                style={[styles.cameraButton, isTakingPhoto && styles.disabledButton]}
                onPress={handleTakePhoto}
                disabled={isTakingPhoto}
            >
                <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    tabBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#f0f0f0' },
    tab: { fontSize: 16, color: '#666' },
    activeTab: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#666' },
    cameraButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007AFF', padding: 15, borderRadius: 30 },
    disabledButton: { backgroundColor: '#aaa' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    gridImage: {
        width: '33.33%',
        height: 120,
        borderWidth: 1,
        borderColor: '#fff',
    },
});
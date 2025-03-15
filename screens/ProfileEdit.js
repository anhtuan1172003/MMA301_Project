import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const API_URL = 'https://mma301-project-be-9e9f.onrender.com/users';

export default function ProfileEdit({ route, navigation }) {
    const { user: initialUser } = route.params;
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await axios.put(`${API_URL}/${user._id}`, user);
            Alert.alert('Success', 'Profile updated successfully.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text>Name:</Text>
            <TextInput
                value={user?.name}
                onChangeText={(text) => setUser({ ...user, name: text })}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />

            <Text>Street:</Text>
            <TextInput
                value={user?.address?.street}
                onChangeText={(text) => setUser({ ...user, address: { ...user.address, street: text } })}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />

            <Text>City:</Text>
            <Picker
                selectedValue={user?.address?.city}
                onValueChange={(value) => setUser({ ...user, address: { ...user.address, city: value } })}
            >
                <Picker.Item label="Choose..." value="" />
                {cities.map(city => (
                    <Picker.Item key={city} label={city} value={city} />
                ))}
            </Picker>

            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <Button title="Update Profile" onPress={handleUpdate} color="green" />
            )}
        </View>
    );
}

const cities = [
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bạc Liêu', 'Bắc Giang', 'Bắc Kạn', 'Bắc Ninh', 'Bến Tre',
    'Bình Dương', 'Bình Định', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng',
];
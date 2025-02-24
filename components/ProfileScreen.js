import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'https://mma-json-deploy.onrender.com/users/2';

function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(API_URL);
      setUser(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.account?.email}</Text>
      <Text>Street: {user?.address?.street}</Text>
      <Text>City: {user?.address?.city}</Text>
      <Button title="Edit Profile" onPress={() => navigation.navigate('ProfileEdit', { user })} />
    </View>
  );
}

export default ProfileScreen;
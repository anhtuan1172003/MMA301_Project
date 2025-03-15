import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import ProfileStackComponent from './screens/ProfileStack';
import { useAuth } from './AuthContext';
import { Button } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainApp() {
    const { logout } = useAuth();

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen
                name="Profile"
                component={ProfileStackComponent}
                options={{
                    headerShown: true,
                    headerRight: () => <Button onPress={logout} title="Logout" />,
                }}
            />
        </Tab.Navigator>
    );
}
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./AuthContext";
import { ActivityIndicator, View } from "react-native";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Welcome from "./screens/Welcome";
import MainApp from "./MainApp";
import { PhotoProvider } from "./screens/PhotoContext";

const Stack = createNativeStackNavigator();

function Navigation() {
    const { isLoading, userToken } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0095f6" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken == null ? (
                    <>
                        <Stack.Screen name="Welcome" component={Welcome} />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Signup" component={Signup} />
                    </>
                ) : (
                    <Stack.Screen name="MainApp" component={MainApp} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <PhotoProvider>
                <Navigation />
            </PhotoProvider>
        </AuthProvider>
    );
}
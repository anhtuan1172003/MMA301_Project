import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PhotoMapHome from './PhotoMapHome';
import Camera from './Camera';
import PhotoDetails from './PhotoDetails';

const Stack = createStackNavigator();

export default function PhotoMapStack() {
    return (
        <Stack.Navigator initialRouteName="PhotoMapHome">
            <Stack.Screen name="PhotoMapHome" component={PhotoMapHome} options={{ title: 'Photo' }} />
            <Stack.Screen name="Camera" component={Camera} />
            <Stack.Screen name="PhotoDetails" component={PhotoDetails} />
        </Stack.Navigator>
    );
}
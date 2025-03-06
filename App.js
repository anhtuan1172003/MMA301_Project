import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// import ProfileScreen from './components/ProfileScreen';
// import ProfileEdit from './components/ProfileEdit';
import Home from './components/Home';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator cho tab Profile
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      {/* <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} /> */}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Hoome" component={Home} />
        {/* <Tab.Screen name="Home" component={ProfileScreen} />
        <Tab.Screen name="Profile" component={ProfileStack} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
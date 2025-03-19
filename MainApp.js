import { Button } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "./screens/Home"
import ProfileStack from "./screens/ProfileStack"
import { useAuth } from "./AuthContext"

const Tab = createBottomTabNavigator()

export default function MainApp() {
  const { logout } = useAuth()

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} options={{ tabBarStyle: { display: 'none' } }}/>
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarStyle: { display: 'none' } }}
      />
    </Tab.Navigator>
  )
}


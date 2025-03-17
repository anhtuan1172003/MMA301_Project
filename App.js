import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AuthProvider, useAuth } from "./AuthContext"
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Welcome from "./screens/Welcome";
import MainApp from "./MainApp"
import FavouritePhotos from "./screens/FavouritePhotos";
import PhotoDetails from "./screens/PhotoDetails";

const Stack = createNativeStackNavigator()

function Navigation() {
  const { isLoading, userToken } = useAuth()

  if (isLoading) {
    return null // or a loading screen
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
          <>
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="FavouritePhotos" component={FavouritePhotos} />
          <Stack.Screen name="PhotoDetails" component={PhotoDetails} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  )
}


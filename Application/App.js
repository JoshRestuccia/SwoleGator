import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PairingScreen from './screens/PairingScreen';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Data from './screens/Data';
import HomeScreen from './screens/HomeScreen';
import RootNavigator from './screens/RootNavigator';
import GraphingScreen from './screens/GraphingScreen';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: 'lightblue',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen
          name="Sign Up"
          component={SignUp}
          options={{title: "Sign Up"}}
        />
        <Stack.Screen
        name="Login"
        component={Login}
        options={{title: "Login"}}
        />
        <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: "Home"}}
        />
        <Stack.Screen
        name="Pair Device"
        component={PairingScreen}
        options={{title: "Pair Device"}}
        />
        <Stack.Screen
        name="Root Navigator"
        component={RootNavigator}
        option={{title: "Root Navigator"}}
        />
        <Stack.Screen
        name="Graphing Screen"
        component={GraphingScreen}
        option={{title: "Graphing Screen"}}
        />
        <Stack.Screen
        name="SwoleGator Data"
        component={Data}
        option={{title: "SwoleGator Data"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

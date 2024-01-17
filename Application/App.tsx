import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PairingScreen from './screens/PairingScreen';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Data from './screens/Data';
import HomeScreen from './screens/HomeScreen';
import GraphingScreen from './screens/GraphingScreen';

import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

function UserStackGroup() {
  return(
    <Stack.Navigator initialRouteName='Home'>
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
        name="Graphing Screen"
        component={GraphingScreen}
        options={{title: "Graphing Screen"}}
      />
      <Stack.Screen
        name="SwoleGator Data"
        component={Data}
        options={{title: "SwoleGator Data"}}
      />
    </Stack.Navigator>
  );
};

function GuestStackGroup() {
  return(
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{title: "Login"}}
      />
      <Stack.Screen
        name="Sign Up"
        component={SignUp}
        options={{title: "Sign Up"}}
      />
    </Stack.Navigator>
  );
}

export default function App() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  console.log(user)
  // User State Change Listener
  function onAuthStateChanged(user: any) {
    setUser(user);
    if(initializing) setInitializing(false);
  }

  useEffect(() => {
    const authorizedUser = auth().onAuthStateChanged(onAuthStateChanged);
    return authorizedUser;
  }, []);

  if(initializing) return null;

  return(
    <NavigationContainer>
      <Stack.Navigator>
        {user? (
          <Stack.Screen
            name="User Stack" 
            component={UserStackGroup}
            options={{title: "User Stack", headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name="Guest Stack"
            component={GuestStackGroup}
            options={{title: "Guest Stack", headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )

}



/* export default function App() {
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

{         <Stack.Screen
        name="Root Navigator"
        component={RootNavigator}
        options={{title: "Root Navigator"}}
        /> 
}
        <Stack.Screen
        name="Graphing Screen"
        component={GraphingScreen}
        options={{title: "Graphing Screen"}}
        />
        <Stack.Screen
        name="SwoleGator Data"
        component={Data}
        options={{title: "SwoleGator Data"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 */
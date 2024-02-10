import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./components/Home";
import { SafeAreaProvider } from "react-native-safe-area-context";

export type RootStackParamList = {
  Home: undefined;
}

export const App = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName='Home'>
          <RootStack.Screen name='Home' component={Home} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

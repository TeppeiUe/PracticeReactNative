import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./components/Home";

export type RootStackParamList = {
  Home: undefined;
}

export const App = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName='Home'>
        <RootStack.Screen name='Home' component={Home} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

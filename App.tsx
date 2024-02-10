import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./components/Home";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Mountains } from "./models/ClimbingPlan";
import { Detail } from "./components/Detail";

export type RootStackParamList = {
  Home: undefined;
  Detail: { mountain: Mountains };
}

export const App = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName='Home'>
          <RootStack.Screen name='Home' component={Home} />
          <RootStack.Screen name='Detail' component={Detail} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

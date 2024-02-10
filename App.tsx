import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./components/Home";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Mountains } from "./models/ClimbingPlan";
import { Detail } from "./components/Detail";
import { PrefecturesProvider } from "./hooks/PrefecturesProvider";

export type RootStackParamList = {
  Home: undefined;
  Detail: { mountain: Mountains };
}

export const App = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();
  return (
    <SafeAreaProvider>
      <PrefecturesProvider>
        <NavigationContainer>
          <RootStack.Navigator initialRouteName='Home'>
            <RootStack.Screen name='Home' component={Home} />
            <RootStack.Screen name='Detail' component={Detail} />
          </RootStack.Navigator>
        </NavigationContainer>
      </PrefecturesProvider>
    </SafeAreaProvider>
  );
}

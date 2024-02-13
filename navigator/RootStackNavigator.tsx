import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MountainList} from '../components/MountainList';
import {MountainTabNavigator} from './MountainTabNavigator';
import {NavigationContainer} from '@react-navigation/native';

export type RootStackParamList = {
  MountainList: undefined;
  MountainTabNavigator: {mountain_id: number};
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="MountainList">
        <RootStack.Screen name="MountainList" component={MountainList} />
        <RootStack.Screen
          name="MountainTabNavigator"
          component={MountainTabNavigator}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

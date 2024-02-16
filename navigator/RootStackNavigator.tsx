import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MountainList} from '../components/MountainList';
import {
  MountainTabNavigator,
  MountainTabParamList,
} from './MountainTabNavigator';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';

/**
 * ルートスタックパラメータ定義
 */
export type RootStackParamList = {
  /** 山リスト画面 */
  MountainList: undefined;
  /** 山情報詳細画面 */
  MountainTabNavigator: NavigatorScreenParams<MountainTabParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * ルートスタックパラメータ
 */
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

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MountainList} from '../components/MountainList';
import {
  MountainTabNavigator,
  MountainTabParamList,
} from './MountainTabNavigator';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {MountainRegister} from '../components/MountainRegister';
import {HeaderButtonsProvider} from 'react-navigation-header-buttons';

/**
 * ルートスタックパラメータ定義
 */
export type RootStackParamList = {
  /** 山リスト画面 */
  MountainList: undefined;
  /** 山登録 */
  MountainRegister: undefined;
  /** 山情報詳細画面 */
  MountainTabNavigator: NavigatorScreenParams<MountainTabParamList> & {
    title: string;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * ルートスタックパラメータ
 */
export const RootStackNavigator = () => {
  const theme = useColorScheme();
  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <HeaderButtonsProvider stackType="native">
        <RootStack.Navigator initialRouteName="MountainList">
          <RootStack.Screen
            name="MountainList"
            component={MountainList}
            options={{title: 'Mountain List'}}
          />
          <RootStack.Screen
            name="MountainRegister"
            component={MountainRegister}
            options={{title: 'Mountain Register'}}
          />
          <RootStack.Screen
            name="MountainTabNavigator"
            component={MountainTabNavigator}
            options={({route}) => ({title: route.params.title})}
          />
        </RootStack.Navigator>
      </HeaderButtonsProvider>
    </NavigationContainer>
  );
};

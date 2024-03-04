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
import {Settings} from '../components/Settings';
import {Home} from '../components/Home';

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
  /** ホーム画面 */
  Home: undefined;
  /** 設定画面 */
  Settings: undefined;
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
        <RootStack.Navigator initialRouteName="Home">
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
          <RootStack.Screen
            name="Home"
            component={Home}
            options={{title: 'Home'}}
          />
          <RootStack.Screen
            name="Settings"
            component={Settings}
            options={{title: 'Settings'}}
          />
        </RootStack.Navigator>
      </HeaderButtonsProvider>
    </NavigationContainer>
  );
};

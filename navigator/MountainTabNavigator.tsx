import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {MountainDetail} from '../components/MountainDetail';
import {PlanStackNavigator, PlanStackParamList} from './PlanStackNavigator';
import {NavigatorScreenParams} from '@react-navigation/native';

/**
 * 山情報タブパラメータ定義
 */
export type MountainTabParamList = {
  /** 山情報詳細画面 */
  MountainDetail: undefined;
  /** 計画情報スタック画面 */
  PlanStackNavigator: NavigatorScreenParams<PlanStackParamList>;
};

const MountainTab = createMaterialTopTabNavigator<MountainTabParamList>();

/**
 * 山情報タブナビゲータ
 */
export const MountainTabNavigator = () => {
  return (
    <MountainTab.Navigator initialRouteName="MountainDetail">
      <MountainTab.Screen
        name="MountainDetail"
        component={MountainDetail}
        options={{title: 'Mountain Information'}}
      />
      <MountainTab.Screen
        name="PlanStackNavigator"
        component={PlanStackNavigator}
        options={{title: 'Climbing Plan'}}
      />
    </MountainTab.Navigator>
  );
};

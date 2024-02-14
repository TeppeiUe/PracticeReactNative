import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {MountainDetail} from '../components/MountainDetail';
import {PlanStackNavigator, PlanStackParamList} from './PlanStackNavigator';
import {NavigatorScreenParams} from '@react-navigation/native';

export type MountainTabParamList = {
  MountainDetail: undefined;
  PlanStackNavigator: NavigatorScreenParams<PlanStackParamList>;
};

const MountainTab = createMaterialTopTabNavigator<MountainTabParamList>();

export const MountainTabNavigator = () => {
  return (
    <MountainTab.Navigator initialRouteName="MountainDetail">
      <MountainTab.Screen
        name="MountainDetail"
        component={MountainDetail}
      />
      <MountainTab.Screen
        name="PlanStackNavigator"
        component={PlanStackNavigator}
      />
    </MountainTab.Navigator>
  );
};

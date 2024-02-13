import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootStackNavigator';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {MountainDetail} from '../components/MountainDetail';
import {PlanList} from '../components/PlanList';

export type MountainTabParamList = {
  MountainDetail: {mountain_id: number};
  PlanList: {mountain_id: number};
};

const MountainTab = createMaterialTopTabNavigator<MountainTabParamList>();

export const MountainTabNavigator = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>) => {
  const {mountain_id} = route.params;
  return (
    <MountainTab.Navigator initialRouteName="MountainDetail">
      <MountainTab.Screen
        name="MountainDetail"
        component={MountainDetail}
        initialParams={{mountain_id}}
      />
      <MountainTab.Screen
        name="PlanList"
        component={PlanList}
        initialParams={{mountain_id}}
      />
    </MountainTab.Navigator>
  );
};

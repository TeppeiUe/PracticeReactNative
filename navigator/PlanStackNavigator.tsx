import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PlanList} from '../components/PlanList';
import {PlanDetail} from '../components/PlanDetail';

export type PlanStackParamList = {
  PlanList: undefined;
  PlanDetail: {plan_id: number};
};

const PlanStack = createNativeStackNavigator<PlanStackParamList>();

export const PlanStackNavigator = () => {
  return (
    <PlanStack.Navigator
      initialRouteName="PlanList"
      screenOptions={{headerShown: false}}>
      <PlanStack.Screen name="PlanList" component={PlanList} />
      <PlanStack.Screen name="PlanDetail" component={PlanDetail} />
    </PlanStack.Navigator>
  );
};

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PlanList} from '../components/PlanList';

/**
 * 計画スタックパラメータ定義
 */
export type PlanStackParamList = {
  /** 計画リスト画面 */
  PlanList: undefined;
};

const PlanStack = createNativeStackNavigator<PlanStackParamList>();

/**
 * 計画スタックナビゲータ
 */
export const PlanStackNavigator = () => {
  return (
    <PlanStack.Navigator
      initialRouteName="PlanList"
      screenOptions={{headerShown: false}}>
      <PlanStack.Screen name="PlanList" component={PlanList} />
    </PlanStack.Navigator>
  );
};

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PlanList} from '../components/PlanList';
import {PlanDetail} from '../components/PlanDetail';
import {PlanRegister} from '../components/PlanRegister';

/**
 * 計画スタックパラメータ定義
 */
export type PlanStackParamList = {
  /** 計画リスト画面 */
  PlanList: undefined;
  /** 計画登録 */
  PlanRegister: undefined;
  /** 計画詳細画面 */
  PlanDetail: {plan_id: number};
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
      <PlanStack.Screen name="PlanRegister" component={PlanRegister} />
      <PlanStack.Screen name="PlanDetail" component={PlanDetail} />
    </PlanStack.Navigator>
  );
};

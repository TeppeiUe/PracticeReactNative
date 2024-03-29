import {useCallback, useState} from 'react';
import {PlanForm} from './PlanForm';
import {Plans, PlansInit} from '../models/ClimbingPlan';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {Alert, ScrollView} from 'react-native';
import {ConfirmDialog} from './ConfirmDialog';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {HeaderRegisterButton} from './HeaderButtons';
import {registerPlan} from '../utils/ClimbingPlanConnection';
import Const from '../utils/Const';

/**
 * 計画登録ダイアログコンポーネント
 */
export const PlanRegister = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<PlanStackParamList, 'PlanRegister'>,
  CompositeScreenProps<
    MaterialTopTabScreenProps<MountainTabParamList, 'PlanStackNavigator'>,
    NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>
  >
>) => {
  const {mountainId} = useMountainIdContext();
  const plansInit = new PlansInit();
  plansInit.mountain_id = mountainId;

  // 登録計画データ制御
  const [plan, setPlan] = useState<Omit<Plans, 'id'>>(plansInit);
  // 登録ボタン制御
  const [saveDisabled, setSaveDisabled] = useState<boolean>(true);
  // 確認ダイアログ制御
  const [registerVisible, setRegisterVisible] = useState<boolean>(false);

  // ヘッダ情報の設定
  useFocusEffect(
    useCallback(
      () =>
        navigation
          .getParent()
          ?.getParent()
          ?.setOptions({
            headerRight: () => (
              <HeaderRegisterButton
                onPress={() => setRegisterVisible(true)}
                disabled={saveDisabled}
              />
            ),
          }),
      [saveDisabled, navigation],
    ),
  );

  /**
   * 計画データ登録
   */
  const handleSaveClick = () =>
    registerPlan(
      plan,
      () => navigation.goBack(),
      (tx, _) => Alert.alert(Const.FAILED_MESSAGE_REGISTER, JSON.stringify(tx)),
    );

  return (
    <>
      <ScrollView>
        <PlanForm
          plan={plan}
          handleValueChange={setPlan}
          disabled={false}
          hasError={setSaveDisabled}
        />
      </ScrollView>

      {/* 登録確認ダイアログ */}
      <ConfirmDialog
        title={Const.CONFIRM_MESSAGE_REGISTER}
        visible={registerVisible}
        setVisible={setRegisterVisible}
        okCallback={handleSaveClick}
      />
    </>
  );
};

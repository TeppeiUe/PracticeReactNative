import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState} from 'react';
import {Plans, PlansInit} from '../models/ClimbingPlan';
import {Alert, ScrollView} from 'react-native';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {PlanForm} from './PlanForm';
import {ConfirmDialog} from './ConfirmDialog';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {
  HeaderDeleteHiddenButton,
  HeaderOverflowMenu,
  HeaderSaveButton,
  HeaderUpdateHiddenButton,
} from './HeaderButtons';
import {deletePlan, getPlan, updatePlan} from '../utils/ClimbingPlanConnection';
import Const from '../utils/Const';

/**
 * 計画データ詳細表示コンポーネント
 */
export const PlanDetail = ({
  route,
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<PlanStackParamList, 'PlanDetail'>,
  CompositeScreenProps<
    MaterialTopTabScreenProps<MountainTabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>) => {
  const {plan_id} = route.params;
  // 表示計画データ制御
  const [plan, setPlan] = useState<Omit<Plans, 'id'>>(new PlansInit());
  // 編集状態制御
  const [editDisabled, setEditDisabled] = useState<boolean>(true);
  // 登録ボタン制御
  const [saveDisabled, setSaveDisabled] = useState<boolean>(true);
  // 登録ダイアログ表示制御
  const [registerVisible, setRegisterVisible] = useState<boolean>(false);
  // 削除確認ダイアログ表示制御
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);

  /**
   * 計画データ取得
   */
  const fetch = useCallback(
    () =>
      getPlan(
        plan_id,
        (_, res) => setPlan(res.rows.item(0)),
        (tx, _) =>
          Alert.alert(Const.FAILED_MESSAGE_ACQUISITION, JSON.stringify(tx)),
      ),
    [plan_id],
  );

  // 取得計画データ表示反映
  useFocusEffect(fetch);
  // ヘッダ情報の設定
  useFocusEffect(
    useCallback(
      () =>
        navigation
          .getParent()
          ?.getParent()
          ?.setOptions({
            headerRight: () => (
              <HeaderButtons>
                {!editDisabled && (
                  <HeaderSaveButton
                    onPress={() => setRegisterVisible(true)}
                    disabled={saveDisabled}
                  />
                )}
                <HeaderOverflowMenu>
                  <HeaderDeleteHiddenButton
                    onPress={() => setDeleteVisible(true)}
                  />
                  <HeaderUpdateHiddenButton
                    onPress={() => setEditDisabled(false)}
                    disabled={!editDisabled}
                  />
                </HeaderOverflowMenu>
              </HeaderButtons>
            ),
          }),
      [editDisabled, saveDisabled, navigation],
    ),
  );

  /**
   * 登録確認okの場合の処理
   */
  const registerOkCallback = () =>
    updatePlan(
      {...plan, id: plan_id},
      () => setEditDisabled(true),
      (tx, _) => Alert.alert(Const.FAILED_MESSAGE_UPDATE, JSON.stringify(tx)),
    );

  /**
   * 登録確認cancelの場合の処理
   */
  const registerCancelCallback = () => {
    fetch();
    setEditDisabled(true);
  };

  /**
   * 削除確認okの場合の処理
   */
  const deleteOkCallback = () =>
    deletePlan(
      plan_id,
      () => navigation.goBack(),
      (tx, _) => Alert.alert(Const.FAILED_MESSAGE_DELETE, JSON.stringify(tx)),
    );

  return (
    <>
      <ScrollView>
        <PlanForm
          plan={plan}
          handleValueChange={setPlan}
          disabled={editDisabled}
          hasError={setSaveDisabled}
        />
      </ScrollView>

      {/* 登録ダイアログ */}
      <ConfirmDialog
        title={Const.CONFIRM_MESSAGE_UPDATE}
        visible={registerVisible}
        setVisible={setRegisterVisible}
        okCallback={registerOkCallback}
        cancelCallback={registerCancelCallback}
      />

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        title={Const.CONFIRM_MESSAGE_DELETE}
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        okCallback={deleteOkCallback}
      />
    </>
  );
};

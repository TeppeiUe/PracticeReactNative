import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useCallback, useState} from 'react';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {ScrollView} from 'react-native';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {PlanForm} from './PlanForm';
import {ConfirmDialog} from './ConfirmDialog';
import {useSpeedDialSettingContext} from '../hooks/SpeedDialContext';

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
  const [plan, setPlan] = useState<Plans>(new Plans());
  // 編集状態制御
  const [disabled, setDisabled] = useState<boolean>(true);
  // 登録ダイアログ表示制御
  const [registerVisible, setRegisterVisible] = useState<boolean>(false);
  // 削除確認ダイアログ表示制御
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);

  const {setActions} = useSpeedDialSettingContext();

  /**
   * 計画データ取得
   */
  const fetch = useCallback(
    () =>
      executeSql('SELECT * FROM plans WHERE id = ?', [plan_id], (_, res) =>
        setPlan(res.rows.item(0)),
      ),
    [plan_id],
  );

  useFocusEffect(fetch);
  useFocusEffect(
    useCallback(
      () =>
        setActions([
          {
            icon: 'delete',
            title: 'Delete',
            onPress: () => setDeleteVisible(true),
          },
          {
            icon: disabled ? 'edit' : 'save',
            title: disabled ? 'Edit' : 'Save',
            onPress: () =>
              disabled ? setDisabled(false) : setRegisterVisible(true),
          },
          {
            icon: 'list',
            title: 'back',
            onPress: () => navigation.goBack(),
          },
        ]),
      [disabled, setActions, navigation],
    ),
  );

  /**
   * 登録確認okの場合の処理
   */
  const registerOkCallback = () => {
    // const {
    //   name,
    //   url,
    //   effective_height,
    //   effective_distance,
    //   access_information,
    //   is_car_access,
    //   id,
    // } = plan;
    // const query = `
    //   UPDATE plans SET
    //   name = ?,
    //   url = ?,
    //   effective_height = ?,
    //   effective_distance = ?,
    //   access_information = ?,
    //   is_car_access = ?
    //   WHERE id = ?
    // `;
    // const params = [
    //   name,
    //   url,
    //   effective_height,
    //   effective_distance,
    //   access_information,
    //   is_car_access,
    //   id,
    // ];
    // executeSql(query, params, (_, res) => console.log(JSON.stringify(res)));
    setDisabled(true);
  };

  /**
   * 登録確認cancelの場合の処理
   */
  const registerCancelCallback = () => {
    fetch();
    setDisabled(true);
  };

  /**
   * 削除確認okの場合の処理
   */
  const deleteOkCallback = () => {
    // executeSql('DELETE FROM plans WHERE id = ?', [plan.id], (_, res) =>
    //   console.log(JSON.stringify(res)),
    // );
    navigation.goBack();
  };

  return (
    <>
      <ScrollView>
        <PlanForm plan={plan} handleValueChange={setPlan} disabled={disabled} />
      </ScrollView>

      {/* 登録ダイアログ */}
      <ConfirmDialog
        title="Would you like to save?"
        visible={registerVisible}
        setVisible={setRegisterVisible}
        okCallback={registerOkCallback}
        cancelCallback={registerCancelCallback}
      />

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        title="Would you like to delete?"
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        okCallback={deleteOkCallback}
      />
    </>
  );
};

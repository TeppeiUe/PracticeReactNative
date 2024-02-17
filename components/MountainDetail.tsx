import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useCallback, useState} from 'react';
import {Mountains, executeSql} from '../models/ClimbingPlan';
import {ScrollView} from 'react-native';
import {MountainForm} from './MountainForm';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {ConfirmDialog} from './ConfirmDialog';
import {useSpeedDialSettingContext} from '../hooks/SpeedDialContext';

/**
 * 山データ詳細表示コンポーネント
 */
export const MountainDetail = ({}: CompositeScreenProps<
  MaterialTopTabScreenProps<MountainTabParamList, 'MountainDetail'>,
  NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>
>) => {
  // 表示山データ制御
  const [mountain, setMountain] = useState<Mountains>(new Mountains());
  // 編集状態制御
  const [disabled, setDisabled] = useState<boolean>(true);
  // 登録確認ダイアログ表示制御
  const [visible, setVisible] = useState<boolean>(false);

  const {mountainId} = useMountainIdContext();
  const {setActions} = useSpeedDialSettingContext();

  /**
   * 山データ取得
   */
  const fetch = useCallback(
    () =>
      executeSql(
        'SELECT * FROM mountains WHERE id = ?',
        [mountainId],
        (_, res) => setMountain(res.rows.item(0)),
      ),
    [mountainId],
  );

  useFocusEffect(fetch);
  useFocusEffect(
    useCallback(
      () =>
        setActions([
          {
            icon: disabled ? 'edit' : 'save',
            title: disabled ? 'Edit' : 'Save',
            onPress: () => (disabled ? setDisabled(false) : setVisible(true)),
          },
        ]),
      [disabled, setActions],
    ),
  );

  /**
   * 登録確認okの場合の処理
   */
  const okCallback = () => {
    const {
      name,
      kana,
      latitude,
      longitude,
      prefecture_id,
      weather_view,
      logical_delete,
    } = mountain;
    const query = `
      UPDATE mountains SET
      name = ?,
      kana = ?,
      latitude = ?,
      longitude = ?,
      prefecture_id = ?,
      weather_view = ?,
      logical_delete = ?
      WHERE id = ?
    `;
    const params = [
      name,
      kana,
      latitude,
      longitude,
      prefecture_id,
      weather_view,
      logical_delete,
      mountainId,
    ];
    executeSql(query, params, (_, res) => console.log(JSON.stringify(res)));
    setDisabled(true);
  };

  /**
   * 登録確認cancelの場合の処理
   */
  const cancelCallback = () => {
    fetch();
    setDisabled(true);
  };

  return (
    <>
      <ScrollView>
        <MountainForm
          mountain={mountain}
          handleValueChange={m => setMountain(m)}
          disabled={disabled}
        />
      </ScrollView>

      {/* 登録確認ダイアログ */}
      <ConfirmDialog
        title="Would you like to save?"
        visible={visible}
        setVisible={setVisible}
        okCallback={okCallback}
        cancelCallback={cancelCallback}
      />
    </>
  );
};

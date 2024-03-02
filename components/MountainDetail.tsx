import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useCallback, useState} from 'react';
import {Mountains, MountainsInit} from '../models/ClimbingPlan';
import {Alert, ScrollView} from 'react-native';
import {MountainForm} from './MountainForm';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {ConfirmDialog} from './ConfirmDialog';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {
  HeaderOverflowMenu,
  HeaderSaveButton,
  HeaderUpdateHiddenButton,
} from './HeaderButtons';
import {getMountain, updateMountain} from '../utils/ClimbingPlanConnection';
import Const from '../utils/Const';

/**
 * 山データ詳細表示コンポーネント
 */
export const MountainDetail = ({
  navigation,
}: CompositeScreenProps<
  MaterialTopTabScreenProps<MountainTabParamList, 'MountainDetail'>,
  NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>
>) => {
  // 表示山データ制御
  const [mountain, setMountain] = useState<Omit<Mountains, 'id'>>(
    new MountainsInit(),
  );
  // 編集状態制御
  const [editDisabled, setEditDisabled] = useState<boolean>(true);
  // 登録ボタン制御
  const [saveDisabled, setSaveDisabled] = useState<boolean>(true);
  // 登録確認ダイアログ表示制御
  const [visible, setVisible] = useState<boolean>(false);

  const {mountainId} = useMountainIdContext();

  /**
   * 山データ取得
   */
  const fetch = useCallback(
    () =>
      getMountain(
        mountainId,
        (_, res) => {
          const m = res.rows.item(0) as Mountains;
          m.id = mountainId;
          setMountain(m);
        },
        (tx, _) =>
          Alert.alert(Const.FAILED_MESSAGE_ACQUISITION, JSON.stringify(tx)),
      ),
    [mountainId],
  );

  useFocusEffect(fetch);
  useFocusEffect(
    useCallback(
      () =>
        navigation.getParent()?.setOptions({
          headerRight: () => (
            <HeaderButtons>
              {!editDisabled && (
                <HeaderSaveButton
                  onPress={() => setVisible(true)}
                  disabled={saveDisabled}
                />
              )}
              <HeaderOverflowMenu>
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
  const okCallback = () =>
    updateMountain(
      {...mountain, id: mountainId},
      () => setEditDisabled(true),
      (tx, _) => Alert.alert(Const.FAILED_MESSAGE_UPDATE, JSON.stringify(tx)),
    );

  /**
   * 登録確認cancelの場合の処理
   */
  const cancelCallback = () => {
    fetch();
    setEditDisabled(true);
  };

  return (
    <>
      <ScrollView>
        <MountainForm
          mountain={mountain}
          handleValueChange={setMountain}
          disabled={editDisabled}
          hasError={setSaveDisabled}
        />
      </ScrollView>

      {/* 登録確認ダイアログ */}
      <ConfirmDialog
        title={Const.CONFIRM_MESSAGE_UPDATE}
        visible={visible}
        setVisible={setVisible}
        okCallback={okCallback}
        cancelCallback={cancelCallback}
      />
    </>
  );
};

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
  const [disabled, setDisabled] = useState<boolean>(true);
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
          const mountain = res.rows.item(0) as Mountains;
          mountain.id = mountainId;
          setMountain(mountain);
        },
        (tx, _) =>
          Alert.alert('Failed to retrieve data.', JSON.stringify(tx), [
            {text: 'OK'},
          ]),
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
              {!disabled && (
                <HeaderSaveButton onPress={() => setVisible(true)} />
              )}
              <HeaderOverflowMenu>
                <HeaderUpdateHiddenButton
                  onPress={() => setDisabled(false)}
                  disabled={!disabled}
                />
              </HeaderOverflowMenu>
            </HeaderButtons>
          ),
        }),
      [disabled, navigation],
    ),
  );

  /**
   * 登録確認okの場合の処理
   */
  const okCallback = () =>
    updateMountain(
      {...mountain, id: mountainId},
      () => setDisabled(true),
      (tx, _) =>
        Alert.alert('Update failed.', JSON.stringify(tx), [{text: 'OK'}]),
    );

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

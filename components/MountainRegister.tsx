import {useCallback, useState} from 'react';
import {MountainForm} from './MountainForm';
import {Mountains, MountainsInit} from '../models/ClimbingPlan';
import {ConfirmDialog} from './ConfirmDialog';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {useFocusEffect} from '@react-navigation/native';
import {HeaderRegisterButton} from './HeaderButtons';
import {registerMountain} from '../utils/ClimbingPlanConnection';
import {Alert} from 'react-native';

/**
 * 山登録コンポーネント
 */
export const MountainRegister = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'MountainRegister'>) => {
  // 登録山データ制御
  const [mountain, setMountain] = useState<Omit<Mountains, 'id'>>(
    new MountainsInit(),
  );
  // 確認ダイアログ制御
  const [registerVisible, setRegisterVisible] = useState<boolean>(false);

  // ヘッダ情報の編集
  useFocusEffect(
    useCallback(
      () =>
        navigation.setOptions({
          headerRight: () => (
            <HeaderRegisterButton onPress={() => setRegisterVisible(true)} />
          ),
        }),
      [navigation],
    ),
  );

  /**
   * 山データ登録
   */
  const handleSaveClick = () =>
    registerMountain(
      mountain,
      () => navigation.goBack(),
      (tx, _) =>
        Alert.alert('Registration failed.', JSON.stringify(tx), [{text: 'OK'}]),
    );

  return (
    <>
      <MountainForm
        mountain={mountain}
        handleValueChange={m => setMountain(m)}
        disabled={false}
      />

      {/* 登録確認ダイアログ */}
      <ConfirmDialog
        title="Would you like to register?"
        visible={registerVisible}
        setVisible={setRegisterVisible}
        okCallback={handleSaveClick}
      />
    </>
  );
};

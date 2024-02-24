import {useCallback, useState} from 'react';
import {MountainForm} from './MountainForm';
import {Mountains, executeSql} from '../models/ClimbingPlan';
import {ConfirmDialog} from './ConfirmDialog';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {useFocusEffect} from '@react-navigation/native';
import {HeaderRegisterButton} from './HeaderButtons';

/**
 * 山登録コンポーネント
 */
export const MountainRegister = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'MountainRegister'>) => {
  // 登録山データ制御
  const [mountain, setMountain] = useState<Mountains>(new Mountains());
  // 確認ダイアログ制御
  const [registerVisible, setRegisterVisible] = useState<boolean>(false);

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
  const handleSaveClick = () => {
    const query = `
      INSERT INTO mountains (
        name,
        kana,
        latitude,
        longitude,
        prefecture_id,
        weather_view,
        logical_delete
      ) VALUES (
        ?, -- name
        ?, -- kana
        ?, -- latitude
        ?, -- longitude
        ?, -- prefecture_id
        ?, -- weather_view
        ? -- logical_delete
      )
    `;
    const {
      name,
      kana,
      latitude,
      longitude,
      prefecture_id,
      weather_view,
      logical_delete,
    } = mountain;
    const params = [
      name,
      kana,
      latitude,
      longitude,
      prefecture_id,
      weather_view,
      logical_delete,
    ];
    executeSql(query, params, (_, res) => console.log(JSON.stringify(res)));
    navigation.goBack();
  };

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

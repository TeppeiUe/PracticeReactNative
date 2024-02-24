import {useCallback, useState} from 'react';
import {PlanForm} from './PlanForm';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {ScrollView} from 'react-native';
import {ConfirmDialog} from './ConfirmDialog';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {HeaderRegisterButton} from './HeaderButtons';

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
  // 登録計画データ制御
  const [plan, setPlan] = useState<Plans>(new Plans());
  // 確認ダイアログ制御
  const [registerVisible, setRegisterVisible] = useState<boolean>(false);

  const {mountainId} = useMountainIdContext();

  useFocusEffect(
    useCallback(
      () =>
        navigation
          .getParent()
          ?.getParent()
          ?.setOptions({
            headerRight: () => (
              <HeaderRegisterButton onPress={() => setRegisterVisible(true)} />
            ),
          }),
      [navigation],
    ),
  );

  /**
   * 計画データ登録
   */
  const handleSaveClick = () => {
    const {
      name,
      url,
      effective_height,
      effective_distance,
      access_information,
      is_car_access,
    } = plan;
    const query = `
      INSERT INTO plans (
        mountain_id,
        name,
        url,
        effective_height,
        effective_distance,
        access_information,
        is_car_access
      ) VALUES (
        ?, -- mountain_id
        ?, -- name
        ?, -- url
        ?, -- effective_height
        ?, -- effective_distance,
        ?, -- access_information
        ? -- is_car_access
      )
    `;
    const params = [
      mountainId,
      name,
      url,
      effective_height,
      effective_distance,
      access_information,
      is_car_access,
    ];
    executeSql(query, params, (_, res) => console.log(JSON.stringify(res)));
    navigation.goBack();
  };

  return (
    <>
      <ScrollView>
        <PlanForm
          plan={plan}
          handleValueChange={m => setPlan(m)}
          disabled={false}
        />
      </ScrollView>

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

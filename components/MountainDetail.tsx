import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useCallback, useState} from 'react';
import {Mountains, executeSql} from '../models/ClimbingPlan';
import {ScrollView} from 'react-native';
import {MountainForm} from './MountainForm';
import {FAB} from '@rneui/themed';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';

/**
 * 山データ詳細表示コンポーネント
 */
export const MountainDetail = ({}: CompositeScreenProps<
  MaterialTopTabScreenProps<MountainTabParamList, 'MountainDetail'>,
  NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>
>) => {
  const [mountain, setMountain] = useState<Mountains>(new Mountains());
  // 編集状態制御
  const [disabled, setDisabled] = useState<boolean>(true);
  const {mountainId} = useMountainIdContext();

  useFocusEffect(
    useCallback(() => {
      executeSql(
        'SELECT * FROM mountains WHERE id = ?',
        [mountainId],
        (_, res) => setMountain(res.rows.item(0)),
      );
    }, [mountainId]),
  );

  /**
   * 編集内容の保存
   */
  const handleSaveClick = () => {
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

      {/* 編集ボタン */}
      <FAB
        icon={{name: 'edit', color: 'white'}}
        size="small"
        placement="right"
        onPress={() => setDisabled(!disabled)}
        color={disabled ? '' : '#e3e6e8'}
      />
      {/* 保存ボタン */}
      <FAB
        icon={{name: 'save', color: 'white'}}
        size="small"
        placement="left"
        onPress={() => {
          handleSaveClick();
          setDisabled(!disabled);
        }}
        visible={!disabled}
      />
    </>
  );
};

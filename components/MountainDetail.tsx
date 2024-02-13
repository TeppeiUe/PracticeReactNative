import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useEffect, useState} from 'react';
import {Mountains, executeSql} from '../models/ClimbingPlan';
import {ScrollView} from 'react-native';
import {MountainForm} from './MountainForm';
import {FAB} from '@rneui/themed';

export const MountainDetail = ({
  route,
}: MaterialTopTabScreenProps<MountainTabParamList, 'MountainDetail'>) => {
  const {mountain_id} = route.params;
  const [mountain, setMountain] = useState<Mountains>(new Mountains());
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    executeSql(
      'SELECT * FROM mountains WHERE id = ?',
      [mountain_id],
      (_, res) => setMountain(res.rows.item(0)),
    );
  }, [mountain_id]);

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
      mountain_id,
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

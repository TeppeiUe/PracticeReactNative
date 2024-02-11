import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {  ListItem, FAB } from "@rneui/themed";
import { RootStackParamList } from "../App";
import { ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Plans, executeSql } from "../models/ClimbingPlan";
import { MountainForm } from "./MountainForm";

export const Detail = ({ route }: NativeStackScreenProps<RootStackParamList, 'Detail'>) => {
  const { mountain } = route.params;
  const [planList, setPlanList] = useState<Plans[]>([]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const mountainRef = useRef(mountain);

  useEffect(() => {
    executeSql(
      'SELECT * FROM plans WHERE mountain_id = ?',
      [mountain.id],
      (_, res) => setPlanList(res.rows.raw())
    );
  }, []);

  const handleSaveClick = () => {
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
    const {
      name,
      kana,
      latitude,
      longitude,
      prefecture_id,
      weather_view,
      logical_delete,
      id,
    } = mountainRef.current;
    const params = [
      name,
      kana,
      latitude,
      longitude,
      prefecture_id,
      weather_view,
      logical_delete,
      id,
    ];
    executeSql(
      query,
      params,
      (_, res) => console.log(JSON.stringify(res))
    );
  }

  return (
    <>
      <ScrollView>
        <MountainForm
          mountain={mountain}
          handleValueChange={m => mountainRef.current = m}
          disabled={disabled}
        />

        {planList.map(plan => {
          const { effective_distance } = plan;
          return (
            <ListItem
              key={plan.id}
              onPress={() => console.log(plan)}
              bottomDivider
            >
              <ListItem.Content>
                <ListItem.Title>{plan.name}</ListItem.Title>
                <ListItem.Subtitle>
                  {effective_distance ? effective_distance/1000 : '-'} km /
                  {plan.effective_height ?? '-'} m
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )
        })}
      </ScrollView>

      {/* 編集ボタン */}
      <FAB
        icon={{ name: 'edit', color: 'white' }}
        size='small'
        placement='right'
        onPress={() => setDisabled(!disabled)}
        color={disabled ? '' : '#e3e6e8'}
      />
      {/* 保存ボタン */}
      <FAB
        icon={{ name: 'save', color: 'white' }}
        size='small'
        placement='left'
        onPress={() => {
          handleSaveClick();
          setDisabled(!disabled);
        }}
        visible={!disabled}
      />
    </>
  )
}
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, ListItem, Input, CheckBox } from "@rneui/themed";
import { RootStackParamList } from "../App";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Plans, db } from "../models/ClimbingPlan";
import { usePrefecturesContext } from "../hooks/PrefecturesContext";

export const Detail = ({ route }: NativeStackScreenProps<RootStackParamList, 'Detail'>) => {
  const { mountain } = route.params;
  const disabled = true;
  const [planList, setPlanList] = useState<Plans[]>([]);
  const prefectures = usePrefecturesContext();

  useEffect(() => {
    db.transaction(tx => {
      const query = 'SELECT * FROM plans WHERE mountain_id = ?';
      const params = [mountain.id];
      tx.executeSql(
        query,
        params,
        (tx, res) => setPlanList(res.rows.raw()),
        (tx, e) => console.error(e)
      );
    });

  }, []);

  return (
    <ScrollView>
      <Text h4>basic information</Text>
      <Input label='name' disabled={disabled}>{mountain.name}</Input>
      <Input label='kana' disabled={disabled}>{mountain.kana}</Input>
      <Input label='prefecture' disabled={disabled}>
        {
          prefectures
          .filter(p => (JSON.parse(mountain.prefecture_id) as number[]).some(i => i === p.id))
          .map(m => m.name)
          .join(', ')
        }
      </Input>
      <Input label='latitude' disabled={disabled}>{mountain.latitude}</Input>
      <Input label='longitude' disabled={disabled}>{mountain.longitude}</Input>
      <CheckBox
        title='weather view'
        checked={mountain.weather_view === 1}
        containerStyle={{ backgroundColor: '' }}
        disabled={disabled}
      />
      <CheckBox
        title='logical delete'
        checked={mountain.logical_delete === 1}
        containerStyle={{ backgroundColor: '' }}
        disabled={disabled}
      />

      <Text h4>plans</Text>
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
  )
}
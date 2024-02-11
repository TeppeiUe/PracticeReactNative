import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, ListItem } from "@rneui/themed";
import { RootStackParamList } from "../App";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Plans, db } from "../models/ClimbingPlan";
import { MountainForm } from "./MountainForm";

export const Detail = ({ route }: NativeStackScreenProps<RootStackParamList, 'Detail'>) => {
  const { mountain } = route.params;
  const [planList, setPlanList] = useState<Plans[]>([]);

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
      <MountainForm mountain={mountain}/>

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
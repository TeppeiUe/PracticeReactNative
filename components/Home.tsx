import { useEffect, useState } from "react";
import { Mountains, db } from "../models/ClimbingPlan";
import { ListItem } from "@rneui/themed";
import { ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { usePrefecturesContext } from "../hooks/PrefecturesContext";

export const Home = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const [mountainList, setMountainList] = useState<Mountains[]>([]);
  const prefectures = usePrefecturesContext();

  useEffect(() => {
    db.transaction(tx => {
      const query = 'SELECT * FROM mountains';
      const params: string[] = [];
      tx.executeSql(
        query,
        params,
        (tx, res) => setMountainList(res.rows.raw()),
        (tx, e) => console.error(e)
      );
    });

  }, []);

  return (
    <ScrollView>
      {mountainList.map(mountain => (
        <ListItem
          key={mountain.id}
          onPress={() => navigation.navigate('Detail', { mountain })}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>{mountain.name}</ListItem.Title>
            <ListItem.Subtitle>
              {
                prefectures
                .filter(p => (JSON.parse(mountain.prefecture_id) as number[]).some(i => i === p.id))
                .map(m => m.name)
                .join(', ')
              }
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ScrollView>
  );
};
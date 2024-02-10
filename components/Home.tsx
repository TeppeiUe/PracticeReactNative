import { useEffect, useState } from "react";
import { openDatabase } from "react-native-sqlite-storage";
import { Mountains, db } from "../models/ClimbingPlan";
import { ListItem } from "@rneui/themed";
import { ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

export const Home = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const [mountainList, setMountainList] = useState<Mountains[]>([]);

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
            <ListItem.Subtitle>{JSON.parse(mountain.prefecture_id).join('-')}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ScrollView>
  );
};
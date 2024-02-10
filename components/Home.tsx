import { useEffect, useState } from "react";
import { openDatabase } from "react-native-sqlite-storage";
import { Mountains } from "../models/ClimbingPlan";
import { ListItem } from "@rneui/themed";
import { ScrollView } from "react-native";

export const Home = () => {
  const [mountainList, setMountainList] = useState<Mountains[]>([]);

  useEffect(() => {
    const db = openDatabase({
      name: 'climbingPlan.sqlite3',
      createFromLocation: 1,
      },
      () => {},
      e => console.error(e)
    );

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
      {mountainList.map(m => (
        <ListItem
          key={m.id}
          onPress={() => console.log(m)}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>{m.name}</ListItem.Title>
            <ListItem.Subtitle>{JSON.parse(m.prefecture_id).join('-')}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ScrollView>
  );
};
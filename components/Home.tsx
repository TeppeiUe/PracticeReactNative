import { useEffect, useState } from "react";
import { Text } from "react-native";
import { openDatabase } from "react-native-sqlite-storage";

export const Home = () => {
  const [text, setText] = useState<string>('');

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
        (tx, res) => setText(JSON.stringify(res.rows.raw())),
        (tx, e) => console.error(e)
      );
    });

  }, []);

  return <Text>{text}</Text>
};
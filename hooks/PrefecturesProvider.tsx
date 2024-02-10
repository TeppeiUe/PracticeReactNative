import { ReactNode, useEffect, useState } from "react"
import { Prefectures, db } from "../models/ClimbingPlan";
import { PrefecturesContext } from "./PrefecturesContext";

export const PrefecturesProvider = ({ children }: { children: ReactNode }) => {
  const [prefectures, setPrefectures] = useState<Prefectures[]>([]);

  useEffect(() => {
    db.transaction(tx => {
      const query = 'SELECT * FROM prefectures';
      const params: string[] = [];
      tx.executeSql(
        query,
        params,
        (tx, res) => setPrefectures(res.rows.raw()),
        (tx, e) => console.error(e)
      );
    });
  }, []);

  return (
    <PrefecturesContext.Provider value={prefectures}>
      {children}
    </PrefecturesContext.Provider>
  )
}
import {ReactNode, useEffect, useState} from 'react';
import {Prefectures, executeSql} from '../models/ClimbingPlan';
import {PrefecturesContext} from './PrefecturesContext';

export const PrefecturesProvider = ({children}: {children: ReactNode}) => {
  const [prefectures, setPrefectures] = useState<Prefectures[]>([]);

  useEffect(() => {
    executeSql('SELECT * FROM prefectures', [], (_, res) =>
      setPrefectures(res.rows.raw()),
    );
  }, []);

  return (
    <PrefecturesContext.Provider value={prefectures}>
      {children}
    </PrefecturesContext.Provider>
  );
};

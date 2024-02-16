import {ReactNode, useEffect, useState} from 'react';
import {Prefectures, executeSql} from '../models/ClimbingPlan';
import {PrefecturesContext} from './PrefecturesContext';

/**
 * 都道府県リストプロバイダー
 */
export const PrefecturesProvider = ({children}: {children: ReactNode}) => {
  // 都道府県リスト状態制御
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

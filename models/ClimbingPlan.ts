import {
  ResultSet,
  Transaction,
  openDatabase,
} from 'react-native-sqlite-storage';

const db = openDatabase(
  {
    name: 'climbingPlan.sqlite3',
    createFromLocation: 1,
  },
  () => {},
  e => console.error(e),
);

export const executeSql = (
  query: string,
  params: any[],
  callback: (tx: Transaction, res: ResultSet) => void,
) => {
  db.transaction(tx => {
    tx.executeSql(query, params, callback, (tx, e) => {
      console.error(JSON.stringify(tx));
      console.error(JSON.stringify(e));
    });
  });
};

/** 都道府県テーブル */
export type Prefectures = {
  /** ID */
  id: number;
  /** 都道府県名 */
  name: string;
};

/** 山テーブル */
export class Mountains {
  /** ID */
  id: number | null = null;
  /** 山名 */
  name: string | null = null;
  /** 山名かな */
  kana: string | null = null;
  /** 都道府県ID */
  prefecture_id: string = '[]';
  /** 経度 */
  latitude: number | null = null;
  /** 緯度 */
  longitude: number | null = null;
  /** 備考 */
  remarks: string | null = null;
  /** 天気表示フラグ */
  weather_view: 0 | 1 = 0;
  /** 論理削除フラグ */
  logical_delete: 0 | 1 = 0;
}

/** 計画テーブル */
export class Plans {
  /** ID */
  id: number | null = null;
  /** 山ID */
  mountain_id: number | null = null;
  /** 計画名 */
  name: string | null = null;
  /** URL */
  url: string | null = null;
  /** 累積標高 */
  effective_height: number | null = null;
  /** 累積距離 */
  effective_distance: number | null = null;
  /** アクセス情報 */
  access_information: string = '';
  /** 備考 */
  remarks: string | null = null;
  /** 車でアクセスフラグ */
  is_car_access: 0 | 1 = 0;
}

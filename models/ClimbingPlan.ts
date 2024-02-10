import { openDatabase } from "react-native-sqlite-storage";

export const db = openDatabase({
  name: 'climbingPlan.sqlite3',
  createFromLocation: 1,
  },
  () => {},
  e => console.error(e)
);

/** 都道府県テーブル */
export type Prefectures = {
  /** ID */
  id: number;
  /** 都道府県名 */
  name: string;
}

/** 山テーブル */
export type Mountains = {
  /** ID */
  id: number;
  /** 山名 */
  name: string;
  /** 山名かな */
  kana: string | null;
  /** 都道府県ID */
  prefecture_id: string;
  /** 経度 */
  latitude: number;
  /** 緯度 */
  longitude: number;
  /** 備考 */
  remarks: string | null;
  /** 天気表示フラグ */
  weather_view: 0 | 1;
  /** 論理削除フラグ */
  logical_delete: 0 | 1;
}

/** 計画テーブル */
export type Plans = {
  /** ID */
  id: number;
  /** 山ID */
  mountain_id: number;
  /** 計画名 */
  name: string | null;
  /** URL */
  url: string | null;
  /** 累積標高 */
  effective_height: number | null;
  /** 累積距離 */
  effective_distance: number | null;
  /** アクセス情報 */
  access_information: string | null;
  /** 備考 */
  remarks: string | null;
  /** 車でアクセスフラグ */
  is_car_access: 0 | 1;
}

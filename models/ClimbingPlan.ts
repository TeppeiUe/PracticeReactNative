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

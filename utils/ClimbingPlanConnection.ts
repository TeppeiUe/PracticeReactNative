import {
  ResultSet,
  SQLError,
  StatementCallback,
  StatementErrorCallback,
  Transaction,
  openDatabase,
} from 'react-native-sqlite-storage';
import {Mountains, Plans} from '../models/ClimbingPlan';
import Const from './Const';

/**
 * DB接続
 */
const db = openDatabase(
  {
    name: Const.DB_NAME,
    createFromLocation: 1,
  },
  () => {},
  e => console.error(e),
);

/**
 * SQL実行
 * @param query 実行クエリ
 * @param params パラメータ
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
const executeSql = (
  query: string,
  params: any[],
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) => {
  const callbackWrap = (tx: Transaction, resultSet: ResultSet) => {
    console.log(JSON.stringify(resultSet));
    if (callback !== undefined) {
      callback(tx, resultSet);
    }
  };
  const errorCallbackWrap = (tx: Transaction, e: SQLError) => {
    console.error(JSON.stringify(tx));
    console.error(JSON.stringify(e));
    if (errorCallback !== undefined) {
      errorCallback(tx, e);
    }
  };
  db.transaction(tx =>
    tx.executeSql(query, params, callbackWrap, errorCallbackWrap),
  );
};

/**
 * 都道府県リスト取得
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
export const getPrefectureList = (
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) => executeSql('SELECT * FROM prefectures', [], callback, errorCallback);

/**
 * 山情報登録
 * @param mountain 山情報
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
export const registerMountain = (
  mountain: Omit<Mountains, 'id'>,
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) => {
  const query = `
    INSERT INTO mountains (
      name,
      kana,
      latitude,
      longitude,
      prefecture_id,
      weather_view,
      logical_delete
    ) VALUES (
      ?, -- name
      ?, -- kana
      ?, -- latitude
      ?, -- longitude
      ?, -- prefecture_id
      ?, -- weather_view
      ? -- logical_delete
    )
  `;
  const params = [
    mountain.name,
    mountain.kana,
    mountain.latitude,
    mountain.longitude,
    mountain.prefecture_id,
    mountain.weather_view,
    mountain.logical_delete,
  ];
  executeSql(query, params, callback, errorCallback);
};

/**
 * 山情報取得
 * @param id 山ID
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
export const getMountain = (
  id: number,
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) =>
  executeSql(
    'SELECT * FROM mountains WHERE id = ?',
    [id],
    callback,
    errorCallback,
  );

/**
 * 山情報リスト取得
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
export const getMountainList = (
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) => executeSql('SELECT * FROM mountains', [], callback, errorCallback);

/**
 * 山情報更新
 * @param mountain 山情報
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
export const updateMountain = (
  mountain: Mountains,
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) => {
  const query = `
    UPDATE mountains SET
    name = ?,
    kana = ?,
    latitude = ?,
    longitude = ?,
    prefecture_id = ?,
    weather_view = ?,
    logical_delete = ?
    WHERE id = ?
  `;
  const params = [
    mountain.name,
    mountain.kana,
    mountain.latitude,
    mountain.longitude,
    mountain.prefecture_id,
    mountain.weather_view,
    mountain.logical_delete,
    mountain.id,
  ];
  executeSql(query, params, callback, errorCallback);
};

/**
 * 計画情報登録
 * @param plan 計画情報
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
export const registerPlan = (
  plan: Omit<Plans, 'id'>,
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) => {
  const query = `
    INSERT INTO plans (
      mountain_id,
      name,
      url,
      effective_height,
      effective_distance,
      access_information,
      is_car_access
    ) VALUES (
      ?, -- mountain_id
      ?, -- name
      ?, -- url
      ?, -- effective_height
      ?, -- effective_distance,
      ?, -- access_information
      ? -- is_car_access
    )
  `;
  const params = [
    plan.mountain_id,
    plan.name,
    plan.url,
    plan.effective_height,
    plan.effective_distance,
    plan.access_information,
    plan.is_car_access,
  ];
  executeSql(query, params, callback, errorCallback);
};

/**
 * 計画情報取得
 * @param id 計画ID
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
export const getPlan = (
  id: number,
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) =>
  executeSql('SELECT * FROM plans WHERE id = ?', [id], callback, errorCallback);

export const getPlanList = (
  id: number,
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) =>
  executeSql(
    'SELECT * FROM plans WHERE mountain_id = ?',
    [id],
    callback,
    errorCallback,
  );

/**
 * 計画情報更新
 * @param plan 計画情報
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
export const updatePlan = (
  plan: Plans,
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) => {
  const query = `
    UPDATE plans SET
    name = ?,
    url = ?,
    effective_height = ?,
    effective_distance = ?,
    access_information = ?,
    is_car_access = ?
    WHERE id = ?
  `;
  const params = [
    plan.name,
    plan.url,
    plan.effective_height,
    plan.effective_distance,
    plan.access_information,
    plan.is_car_access,
    plan.id,
  ];
  executeSql(query, params, callback, errorCallback);
};

/**
 * 計画情報削除
 * @param id 計画ID
 * @param callback クエリ実行成功時のコールバック
 * @param errorCallback クエリ実行時のエラーコールバック
 */
export const deletePlan = (
  id: number,
  callback?: StatementCallback,
  errorCallback?: StatementErrorCallback,
) =>
  executeSql('DELETE FROM plans WHERE id = ?', [id], callback, errorCallback);

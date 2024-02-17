import {createContext, useContext} from 'react';

/**
 * スピードダイアル表示部
 */
export type SpeedDialAction = {
  /** タイトル */
  title: string;
  /** アイコン */
  icon: string;
  /** コールバック */
  onPress: () => void;
};

/**
 * スピードダイアル状態管理コンテキストで管理する型
 */
type SpeedDialSetting = {
  /** スピードダイアル表示部状態制御 */
  setActions: (actions: SpeedDialAction[]) => void;
};

/**
 * スピードダイアル状態管理コンテキスト
 */
export const SpeedDialSettingContext = createContext<SpeedDialSetting>({
  setActions: () => {},
});

/**
 * スピードダイアル状態管理
 */
export const useSpeedDialSettingContext = () =>
  useContext(SpeedDialSettingContext);

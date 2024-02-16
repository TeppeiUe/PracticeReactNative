import {Dispatch, SetStateAction, createContext, useContext} from 'react';

/**
 * 山ID状態管理コンテキストで管理する型
 */
type MountainId<T = number> = {
  /** 山ID */
  mountainId: T;
  /** 山ID状態設定 */
  setMountainId: Dispatch<SetStateAction<T>>;
};

/**
 * 山ID状態管理コンテキスト
 */
export const MountainIdContext = createContext<MountainId>({
  mountainId: 0,
  setMountainId: () => {},
});

/**
 * 山ID状態管理
 */
export const useMountainIdContext = () => useContext(MountainIdContext);

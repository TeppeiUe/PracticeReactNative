import {ReactNode, useState} from 'react';
import {MountainIdContext} from './MountainIdContext';

/**
 * 山ID状態管理プロバイダー
 */
export const MountainIdProvider = ({children}: {children: ReactNode}) => {
  // 山ID状態制御
  const [mountainId, setMountainId] = useState<number>(0);
  return (
    <MountainIdContext.Provider value={{mountainId, setMountainId}}>
      {children}
    </MountainIdContext.Provider>
  );
};

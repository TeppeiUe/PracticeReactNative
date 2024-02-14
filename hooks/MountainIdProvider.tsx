import {ReactNode, useState} from 'react';
import {MountainIdContext} from './MountainIdContext';

export const MountainIdProvider = ({children}: {children: ReactNode}) => {
  const [mountainId, setMountainId] = useState<number>(0);

  return (
    <MountainIdContext.Provider value={{mountainId, setMountainId}}>
      {children}
    </MountainIdContext.Provider>
  );
};

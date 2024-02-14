import {Dispatch, SetStateAction, createContext, useContext} from 'react';

type MountainId<T = number> = {
  mountainId: T;
  setMountainId: Dispatch<SetStateAction<T>>;
};

export const MountainIdContext = createContext<MountainId>({
  mountainId: 0,
  setMountainId: () => {},
});

export const useMountainIdContext = () => useContext(MountainIdContext);

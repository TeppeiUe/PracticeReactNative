import {createContext, useContext} from 'react';
import {Prefectures} from '../models/ClimbingPlan';

export const PrefecturesContext = createContext<Prefectures[]>([]);

export const usePrefecturesContext = () => useContext(PrefecturesContext);

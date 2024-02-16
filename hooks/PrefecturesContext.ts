import {createContext, useContext} from 'react';
import {Prefectures} from '../models/ClimbingPlan';

/**
 * 都道府県リストコンテキスト
 */
export const PrefecturesContext = createContext<Prefectures[]>([]);

/**
 * 都道府県リスト
 */
export const usePrefecturesContext = () => useContext(PrefecturesContext);

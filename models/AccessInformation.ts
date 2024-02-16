/** 位置情報 */
export type PositionInformation = {
  /** 名称 */
  name: string;
  /** 時間 */
  time: string;
};

/** アクセス情報 */
export class AccessInformation {
  /** 路線 */
  route: string | null = null;
  /** 出発地 */
  departure: Partial<PositionInformation> | null = null;
  /** 到着地 */
  arrival: Partial<PositionInformation> | null = null;
  /** 備考 */
  remarks: string | null = null;
}

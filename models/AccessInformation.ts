/** 位置情報 */
export type PositionInformation = {
  /** 名称 */
  name: string;
  /** 時間 */
  time: string | null;
};

/** アクセス情報 */
export class AccessInformation {
  /** 路線 */
  route: string | null = null;
  /** 出発地 */
  departure: PositionInformation | null = null;
  /** 到着地 */
  arrival: PositionInformation | null = null;
  /** 備考 */
  remarks: string | null = null;
}

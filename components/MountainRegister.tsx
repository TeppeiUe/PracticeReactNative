import {FC, useState} from 'react';
import {Dialog} from '@rneui/themed';
import {MountainForm} from './MountainForm';
import {Mountains, executeSql} from '../models/ClimbingPlan';

/**
 * 山登録コンポーネントのプロパティ
 */
type MountainRegisterProps = {
  /** 表示状態 */
  visible: boolean;
  /** 表示状態管理 */
  setVisible: (visible: boolean) => void;
};

/**
 * 山登録ダイアログコンポーネント
 */
export const MountainRegister: FC<MountainRegisterProps> = props => {
  const {visible, setVisible} = props;
  // 登録山データ制御
  const [mountain, setMountain] = useState<Mountains>(new Mountains());

  /**
   * ダイアログを閉じる場合の処理
   */
  const closeDialog = () => {
    setVisible(false);
    setMountain(new Mountains());
  };

  /**
   * 山データ登録
   */
  const handleSaveClick = () => {
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
    const {
      name,
      kana,
      latitude,
      longitude,
      prefecture_id,
      weather_view,
      logical_delete,
    } = mountain;
    const params = [
      name,
      kana,
      latitude,
      longitude,
      prefecture_id,
      weather_view,
      logical_delete,
    ];
    executeSql(query, params, (_, res) => console.log(JSON.stringify(res)));
    closeDialog();
  };

  return (
    <Dialog isVisible={visible}>
      <Dialog.Title title="mountain register" />
      <MountainForm
        mountain={mountain}
        handleValueChange={m => setMountain(m)}
        disabled={false}
      />
      <Dialog.Actions>
        <Dialog.Button title="save" onPress={() => handleSaveClick()} />
        <Dialog.Button title="cancel" onPress={() => closeDialog()} />
      </Dialog.Actions>
    </Dialog>
  );
};

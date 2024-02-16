import {FC, useState} from 'react';
import {Dialog} from '@rneui/themed';
import {PlanForm} from './PlanForm';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {ScrollView, StyleSheet} from 'react-native';

/**
 * 計画登録コンポーネントのプロパティ
 */
type PlanRegisterProps = {
  /** 表示状態 */
  visible: boolean;
  /** 表示状態管理 */
  setVisible: (visible: boolean) => void;
};

/**
 * 計画登録ダイアログコンポーネント
 */
export const PlanRegister: FC<PlanRegisterProps> = props => {
  const {visible, setVisible} = props;
  // 登録計画データ制御
  const [plan, setPlan] = useState<Plans>(new Plans());
  const {mountainId} = useMountainIdContext();

  /**
   * ダイアログを閉じる場合の処理
   */
  const closeDialog = () => {
    setVisible(false);
    setPlan(new Plans());
  };

  /**
   * 計画データ登録
   */
  const handleSaveClick = () => {
    const {
      name,
      url,
      effective_height,
      effective_distance,
      access_information,
      is_car_access,
    } = plan;
    const query = `
      INSERT INTO plans (
        mountain_id,
        name,
        url,
        effective_height,
        effective_distance,
        access_information,
        is_car_access
      ) VALUES (
        ?, -- mountain_id
        ?, -- name
        ?, -- url
        ?, -- effective_height
        ?, -- effective_distance,
        ?, -- access_information
        ? -- is_car_access
      )
    `;
    const params = [
      mountainId,
      name,
      url,
      effective_height,
      effective_distance,
      access_information,
      is_car_access,
    ];
    executeSql(query, params, (_, res) => console.log(JSON.stringify(res)));
    closeDialog();
  };

  return (
    <Dialog isVisible={visible} overlayStyle={styles.overlayStyle}>
      <Dialog.Title title="plan register" />
      <ScrollView>
        <PlanForm
          plan={plan}
          handleValueChange={m => setPlan(m)}
          disabled={false}
        />
      </ScrollView>
      <Dialog.Actions>
        <Dialog.Button title="save" onPress={() => handleSaveClick()} />
        <Dialog.Button title="cancel" onPress={() => closeDialog()} />
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  overlayStyle: {
    maxHeight: '80%',
  },
});

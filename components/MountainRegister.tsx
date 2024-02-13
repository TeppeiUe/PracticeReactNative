import {FC, useState} from 'react';
import {Dialog} from '@rneui/themed';
import {MountainForm} from './MountainForm';
import {Mountains, executeSql} from '../models/ClimbingPlan';

type MountainRegisterProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const MountainRegister: FC<MountainRegisterProps> = props => {
  const {visible, setVisible} = props;
  const [mountain, setMountain] = useState<Mountains>(new Mountains());

  const closeDialog = () => {
    setVisible(false);
    setMountain(new Mountains());
  };

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
    <Dialog
      isVisible={visible}
      // onBackdropPress={() => closeDialog())}
    >
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

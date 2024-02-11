import { FC, useRef } from "react";
import { Dialog } from "@rneui/base";
import { MountainForm } from "./MountainForm";
import { Mountains, db } from "../models/ClimbingPlan";

type MountainRegisterProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const MountainRegister: FC<MountainRegisterProps> = props => {
  const { visible, setVisible } = props;
  const mountainRef = useRef(new Mountains);

  const handleSaveClick = () => {
    db.transaction(tx => {
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
      } = mountainRef.current;
      const params = [
        name,
        kana,
        latitude,
        longitude,
        prefecture_id,
        weather_view,
        logical_delete,
      ];
      tx.executeSql(
        query,
        params,
        (_, res) => console.log(JSON.stringify(res)),
        (tx, _) => console.error(tx)
      );
    });
  }

  return (
    <Dialog
    isVisible={visible}
    // onBackdropPress={() => setVisible(false))}
  >
    <Dialog.Title title='mountain register' />
    <MountainForm
      mountain={mountainRef.current}
      handleValueChange={m => mountainRef.current = m}
      disabled={false}
    />
    <Dialog.Actions>
      <Dialog.Button
        title='save'
        onPress={() => {
          handleSaveClick();
          setVisible(false);
        }}
      />
      <Dialog.Button
        title='cancel'
        onPress={() => setVisible(false)}
      />
    </Dialog.Actions>
  </Dialog>
  )
}
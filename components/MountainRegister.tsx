import { FC, useRef } from "react";
import { Dialog } from "@rneui/base";
import { MountainForm } from "./MountainForm";
import { Mountains } from "../models/ClimbingPlan";

type MountainRegisterProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const MountainRegister: FC<MountainRegisterProps> = props => {
  const { visible, setVisible } = props;
  const mountainRef = useRef(new Mountains);

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
        onPress={() => console.log(JSON.stringify(mountainRef.current))}
      />
      <Dialog.Button
        title='cancel'
        onPress={() => setVisible(false)}
      />
    </Dialog.Actions>
  </Dialog>
  )
}
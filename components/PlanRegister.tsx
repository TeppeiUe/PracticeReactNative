import {FC, useState} from 'react';
import {Dialog} from '@rneui/themed';
import {PlanForm} from './PlanForm';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {ScrollView, StyleSheet} from 'react-native';

type PlanRegisterProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const PlanRegister: FC<PlanRegisterProps> = props => {
  const {visible, setVisible} = props;
  const [plan, setPlan] = useState<Plans>(new Plans());
  const {mountainId} = useMountainIdContext();

  const closeDialog = () => {
    setVisible(false);
    setPlan(new Plans());
  };

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
    <Dialog
      isVisible={visible}
      overlayStyle={styles.overlayStyle}
      // onBackdropPress={() => closeDialog())}
    >
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

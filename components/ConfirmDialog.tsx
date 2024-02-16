import {FC} from 'react';
import {Dialog, Text} from '@rneui/themed';

type ConfirmDialogProps = {
  title: string;
  text?: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  okCallback: () => void;
  cancelCallback?: () => void;
};

export const ConfirmDialog: FC<ConfirmDialogProps> = props => {
  const {title, text, visible, setVisible, okCallback, cancelCallback} = props;

  const closeDialog = () => setVisible(false);

  const handleOkClick = () => {
    okCallback();
    closeDialog();
  };

  const handleCancel = () => {
    if (cancelCallback !== undefined) {
      cancelCallback();
    }
    closeDialog();
  };

  return (
    <Dialog isVisible={visible} onBackdropPress={() => handleCancel()}>
      <Dialog.Title title={title} />
      {text !== undefined && <Text>{text}</Text>}
      <Dialog.Actions>
        <Dialog.Button title="ok" onPress={() => handleOkClick()} />
        <Dialog.Button title="cancel" onPress={() => handleCancel()} />
      </Dialog.Actions>
    </Dialog>
  );
};

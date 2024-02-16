import {FC} from 'react';
import {Dialog, Text, useTheme} from '@rneui/themed';

/**
 * 確認ダイアログコンポーネントのプロパティ
 */
type ConfirmDialogProps = {
  /** 表示タイトル */
  title: string;
  /** 表示テキスト */
  text?: string;
  /** 表示状態 */
  visible: boolean;
  /** 表示状態設定コールバック */
  setVisible: (visible: boolean) => void;
  /** okの場合のコールバック */
  okCallback: () => void;
  /** cancelの場合のコールバック */
  cancelCallback?: () => void;
};

/**
 * 確認ダイアログコンポーネント
 */
export const ConfirmDialog: FC<ConfirmDialogProps> = props => {
  const {title, text, visible, setVisible, okCallback, cancelCallback} = props;
  const {theme} = useTheme();

  /**
   * ダイアログを閉じる場合の処理
   */
  const closeDialog = () => setVisible(false);

  /**
   * okの場合の処理
   */
  const handleOkClick = () => {
    okCallback();
    closeDialog();
  };

  /**
   * cancelの場合の処理
   */
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
        <Dialog.Button
          title="Ok"
          titleStyle={{color: theme.colors.primary}}
          onPress={() => handleOkClick()}
        />
        <Dialog.Button
          title="Cancel"
          titleStyle={{color: theme.colors.warning}}
          onPress={() => handleCancel()}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

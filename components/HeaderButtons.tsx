import {Icon} from '@rneui/themed';
import {ReactNode} from 'react';
import {
  HiddenItem,
  HiddenItemProps,
  Item,
  ItemProps,
  OverflowMenu,
} from 'react-navigation-header-buttons';

/**
 * メニュー用ヘッダボタンコンポーネント
 */
export const HeaderOverflowMenu = ({children}: {children: ReactNode}) => (
  <OverflowMenu OverflowIcon={<Icon name="more-horiz" />} children={children} />
);

/**
 * 登録用ヘッダボタンコンポーネント
 */
export const HeaderRegisterButton = ({onPress}: Pick<ItemProps, 'onPress'>) => (
  <Item title="Register" onPress={onPress} />
);

/**
 * 保存用ヘッダボタンコンポーネント
 */
export const HeaderSaveButton = ({onPress}: Pick<ItemProps, 'onPress'>) => (
  <Item title="Save" onPress={onPress} />
);

/**
 * 更新用メニュー格納ヘッダボタンコンポーネント
 */
export const HeaderUpdateHiddenButton = ({
  onPress,
  disabled,
}: Pick<HiddenItemProps, 'onPress' | 'disabled'>) => (
  <HiddenItem title="Update" onPress={onPress} disabled={disabled} />
);

/**
 * 削除用メニュー格納ヘッダボタンコンポーネント
 */
export const HeaderDeleteHiddenButton = ({
  onPress,
}: Pick<HiddenItemProps, 'onPress'>) => (
  <HiddenItem title="Delete" onPress={onPress} />
);

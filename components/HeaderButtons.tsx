import { Icon } from '@rneui/themed';
import { ReactNode } from 'react';
import {
  HiddenItem,
  HiddenItemProps,
  Item,
  ItemProps,
  OverflowMenu,
} from 'react-navigation-header-buttons';

export const HeaderOverflowMenu = ({children}: { children: ReactNode}) =>
  <OverflowMenu OverflowIcon={<Icon name="more-horiz" />} children={children} />;

export const HeaderRegisterButton = ({onPress}: Pick<ItemProps, 'onPress'>) => (
  <Item title="Register" onPress={onPress} />
);

export const HeaderSaveButton = ({onPress}: Pick<ItemProps, 'onPress'>) => (
  <Item title="Save" onPress={onPress} />
);

export const HeaderUpdateHiddenButton = ({
  onPress,
  disabled,
}: Pick<HiddenItemProps, 'onPress' | 'disabled'>) => (
  <HiddenItem title="Update" onPress={onPress} disabled={disabled} />
);

export const HeaderDeleteHiddenButton = ({
  onPress,
}: Pick<HiddenItemProps, 'onPress'>) => (
  <HiddenItem title="Delete" onPress={onPress} />
);

import {FC, useState} from 'react';
import {AccessInformation} from '../models/AccessInformation';
import {ListItem, Icon, useTheme} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

/**
 * アクセス情報フォームコンポーネントのプロパティ
 */
type AccessInformationFormProps<T> = {
  /** disabled */
  disabled?: boolean;
  /** 表示アクセス情報データ */
  accessInformation: T;
  /** アクセス情報データのコールバック */
  handleValueChange?: (accessInformation: T) => void;
};

/**
 * アクセス情報内部フォームコンポーネント
 */
const AccessInformationInnerForm: FC<
  AccessInformationFormProps<AccessInformation>
> = props => {
  const {disabled = true, accessInformation, handleValueChange} = props;

  /**
   * アクセス情報データのコールバック
   */
  const handleInputChange = (val: {
    [K in keyof AccessInformation]?: AccessInformation[K];
  }) => {
    if (handleValueChange !== undefined) {
      handleValueChange({...props.accessInformation, ...val});
    }
  };

  return (
    <>
      <ListItem.Input
        label="route"
        disabled={disabled}
        onChangeText={route => handleInputChange({route})}>
        {accessInformation.route}
      </ListItem.Input>
      <ListItem.Input
        label="departure name"
        disabled={disabled}
        onChangeText={name => {
          const departure = {...accessInformation.departure, ...{name}};
          handleInputChange({departure});
        }}>
        {accessInformation.departure?.name}
      </ListItem.Input>
      <ListItem.Input
        label="departure time"
        disabled={disabled}
        onChangeText={time => {
          const departure = {...accessInformation.departure, ...{time}};
          handleInputChange({departure});
        }}>
        {accessInformation.departure?.time}
      </ListItem.Input>
      <ListItem.Input
        label="arrival name"
        disabled={disabled}
        onChangeText={name => {
          const arrival = {...accessInformation.arrival, ...{name}};
          handleInputChange({arrival});
        }}>
        {accessInformation.arrival?.name}
      </ListItem.Input>
      <ListItem.Input
        label="arrival time"
        disabled={disabled}
        onChangeText={time => {
          const arrival = {...accessInformation.arrival, ...{time}};
          handleInputChange({arrival});
        }}>
        {accessInformation.arrival?.time}
      </ListItem.Input>
    </>
  );
};

/**
 * アクセス情報リストフォームコンポーネント
 */
export const AccessInformationForm: FC<
  AccessInformationFormProps<AccessInformation[]>
> = props => {
  const {disabled = true, handleValueChange} = props;
  /** アコーディオン開閉制御 */
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const {theme} = useTheme();

  /**
   * アクセス情報リストデータのコールバック
   * @param index アクセス情報リストデータのインデックス
   * @param val 変更後のアクセス情報データ
   */
  const handleInputChange = (index: number, val: AccessInformation) => {
    const a: AccessInformation[] = [...props.accessInformation];
    a[index] = val;
    if (handleValueChange !== undefined) {
      handleValueChange(a);
    }
  };

  /**
   * アクセス情報データ削除
   * @param index アクセス情報リストデータのインデックス
   */
  const handleInputDelete = (index: number) => {
    const a: AccessInformation[] = [...props.accessInformation];
    a.splice(index, 1);
    if (handleValueChange !== undefined) {
      handleValueChange(a);
    }
  };

  /**
   * 新規アクセス情報データ追加
   */
  const handleInputAdd = () => {
    if (handleValueChange !== undefined) {
      handleValueChange([...props.accessInformation, new AccessInformation()]);
    }
  };

  return (
    <>
      {props.accessInformation.map((a, i) => (
        <ListItem.Accordion
          key={i}
          topDivider
          bottomDivider
          noIcon
          containerStyle={styles.containerStyle}
          isExpanded={expandedItems.includes(i)}
          content={
            <View style={styles.listItemAccordionContent}>
              <ListItem.Content>
                <ListItem.Title>
                  {`${a.departure?.name ?? ''} -> ${a.arrival?.name ?? ''}`}
                </ListItem.Title>
                <ListItem.Subtitle>{a.route ?? ''}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon
                name="delete"
                color={theme.colors.secondary}
                disabled={disabled}
                onPress={() => handleInputDelete(i)}
              />
            </View>
          }
          onPress={() =>
            expandedItems.includes(i)
              ? setExpandedItems(expandedItems.filter(v => v !== i))
              : setExpandedItems([...expandedItems, i])
          }>
          <AccessInformationInnerForm
            accessInformation={a}
            disabled={disabled}
            handleValueChange={ai => handleInputChange(i, ai)}
          />
        </ListItem.Accordion>
      ))}
      <View style={styles.listItemAddition}>
        <Icon
          name="add"
          color={theme.colors.secondary}
          disabled={disabled}
          onPress={() => handleInputAdd()}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  listItemAccordionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemAddition: {
    alignItems: 'center',
  },
  containerStyle: {
    backgroundColor: 'transparent',
  },
});

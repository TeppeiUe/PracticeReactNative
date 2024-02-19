import {FC, useState} from 'react';
import {AccessInformation} from '../models/AccessInformation';
import {ListItem, Icon, useTheme, Chip} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

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
  // departure time picker表示制御
  const [departureVisible, setDepartureVisible] = useState<boolean>(false);
  // arrival time picker表示制御
  const [arrivalVisible, setArrivalVisible] = useState<boolean>(false);

  const {theme} = useTheme();

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

  /**
   * Datetime pickerから時間取得
   */
  const getTimeStringFromPicker = (event: DateTimePickerEvent, date?: Date) =>
    event.type !== 'dismissed'
      ? date?.toLocaleTimeString().replace(':00', '') ?? null
      : null;

  /**
   * 画面表示用の時間取得
   */
  const getTimeString = (time?: string | null) => time ?? '--:--';

  /**
   * Datetime pickerの初期表示用日時生成
   */
  const setDate = (time?: string) => {
    const date = new Date();
    if (time === undefined) {
      return date;
    }
    const regExp = new RegExp(/^\d{2}:\d{2}$/);
    if (regExp.test(time)) {
      const [hours, minutes] = time.split(':');
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
    }
    return date;
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
      <Chip
        icon={{
          name: 'schedule',
          color: disabled ? theme.colors.disabled : theme.colors.primary,
        }}
        type="outline"
        title={`departure ${getTimeString(accessInformation.departure?.time)}`}
        onPress={() => setDepartureVisible(true)}
        disabled={disabled}
      />
      {departureVisible && (
        <RNDateTimePicker
          mode="time"
          value={setDate(accessInformation.departure?.time)}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            setDepartureVisible(false);
            const time = getTimeStringFromPicker(event, date);
            if (time !== null) {
              const departure = {...accessInformation.departure, ...{time}};
              handleInputChange({departure});
            }
          }}
        />
      )}
      <ListItem.Input
        label="arrival name"
        disabled={disabled}
        onChangeText={name => {
          const arrival = {...accessInformation.arrival, ...{name}};
          handleInputChange({arrival});
        }}>
        {accessInformation.arrival?.name}
      </ListItem.Input>
      <Chip
        icon={{
          name: 'schedule',
          color: disabled ? theme.colors.disabled : theme.colors.primary,
        }}
        type="outline"
        title={`arrival ${getTimeString(accessInformation.arrival?.time)}`}
        onPress={() => setArrivalVisible(true)}
        disabled={disabled}
      />
      {arrivalVisible && (
        <RNDateTimePicker
          mode="time"
          value={setDate(accessInformation.arrival?.time)}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            setArrivalVisible(false);
            const time = getTimeStringFromPicker(event, date);
            if (time !== null) {
              const arrival = {...accessInformation.arrival, ...{time}};
              handleInputChange({arrival});
            }
          }}
        />
      )}
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

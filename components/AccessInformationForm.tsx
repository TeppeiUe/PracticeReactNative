import {FC, useEffect, useRef, useState} from 'react';
import {AccessInformation} from '../models/AccessInformation';
import {ListItem, useTheme, Chip, Input} from '@rneui/themed';
import {StyleSheet} from 'react-native';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {ConfirmDialog} from './ConfirmDialog';
import Const from '../utils/Const';

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
    if (new RegExp(/^\d{2}:\d{2}$/).test(time)) {
      const [hours, minutes] = time.split(':');
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
    }
    return date;
  };

  return (
    <>
      {/* 路線 */}
      <ListItem.Input
        label="route"
        disabled={disabled}
        onChangeText={route => handleInputChange({route})}>
        {accessInformation.route}
      </ListItem.Input>

      {/* 出発地点名 */}
      <ListItem.Input
        label="departure name"
        disabled={disabled}
        onChangeText={name => {
          const departure = {...accessInformation.departure, ...{name}};
          handleInputChange({departure});
        }}>
        {accessInformation.departure?.name}
      </ListItem.Input>

      {/* 出発時刻 */}
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

      {/* 到着地点名 */}
      <ListItem.Input
        label="arrival name"
        disabled={disabled}
        onChangeText={name => {
          const arrival = {...accessInformation.arrival, ...{name}};
          handleInputChange({arrival});
        }}>
        {accessInformation.arrival?.name}
      </ListItem.Input>

      {/* 到着時刻 */}
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

      {/* 備考 */}
      <Input
        label="remarks"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        disabled={disabled}
        onChangeText={remarks => handleInputChange({remarks})}>
        {accessInformation.remarks}
      </Input>
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
  // 削除確認ダイアログ表示制御
  const [visible, setVisible] = useState<boolean>(false);
  // 削除対象アクセス情報のインデックス管理
  const deletionRef = useRef<number>(0);

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
   */
  const handleInputDelete = () => {
    if (handleValueChange !== undefined) {
      const a: AccessInformation[] = [...props.accessInformation];
      a.splice(deletionRef.current, 1);
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

  useEffect(() => {
    if (disabled) {
      setExpandedItems([]);
    }
  }, [disabled]);

  return (
    <>
      {props.accessInformation.map((a, i) => (
        <ListItem.Accordion
          key={i}
          bottomDivider
          containerStyle={styles.listItemAccordionContainerStyle}
          isExpanded={expandedItems.includes(i)}
          onLongPress={() => {
            deletionRef.current = i;
            setVisible(true);
          }}
          content={
            <ListItem.Content>
              <ListItem.Title>
                {a.departure?.name ?? '-'}
                {`(${a.departure?.time ?? '-'})`}
                {' -> '}
                {a.arrival?.name ?? ''}
                {`(${a.arrival?.time ?? '-'})`}
              </ListItem.Title>
              <ListItem.Subtitle>{a.route ?? ''}</ListItem.Subtitle>
            </ListItem.Content>
          }
          onPress={() =>
            expandedItems.includes(i)
              ? setExpandedItems(expandedItems.filter(v => v !== i))
              : setExpandedItems([...expandedItems, i])
          }
          disabled={disabled}>
          <AccessInformationInnerForm
            accessInformation={a}
            disabled={disabled}
            handleValueChange={ai => handleInputChange(i, ai)}
          />
        </ListItem.Accordion>
      ))}

      {/* 新規アクセス情報データ追加 */}
      {!disabled && (
        <Chip
          icon={{
            name: 'add',
            color: theme.colors.primary,
          }}
          type="outline"
          title="access information"
          containerStyle={styles.chipContainerStyle}
          onPress={handleInputAdd}
        />
      )}

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        title={Const.CONFIRM_MESSAGE_DELETE}
        visible={visible}
        setVisible={setVisible}
        okCallback={handleInputDelete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listItemAccordionContainerStyle: {
    backgroundColor: 'transparent',
  },
  chipContainerStyle: {
    marginRight: 'auto',
  },
});

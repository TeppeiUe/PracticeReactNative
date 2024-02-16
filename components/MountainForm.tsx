import {FC} from 'react';
import {Mountains} from '../models/ClimbingPlan';
import {usePrefecturesContext} from '../hooks/PrefecturesContext';
import {Input, CheckBox} from '@rneui/themed';
import {MultiSelect} from 'react-native-element-dropdown';
import {StyleSheet, View} from 'react-native';
import {checkPositiveNumber} from '../utils/validation';

/**
 * 山フォームコンポーネントのプロパティ
 */
type MountainFormProps<T = Mountains> = {
  /** disabled */
  disabled?: boolean;
  /** 表示山データ */
  mountain: T;
  /** 山データのコールバック */
  handleValueChange?: (mountain: T) => void;
};

/**
 * 山フォームコンポーネント
 */
export const MountainForm: FC<MountainFormProps> = props => {
  const {disabled = true, handleValueChange} = props;
  const prefectures = usePrefecturesContext();

  /**
   * 山データのコールバック
   */
  const handleInputChange = (val: {[K in keyof Mountains]?: Mountains[K]}) => {
    if (handleValueChange !== undefined) {
      handleValueChange({...props.mountain, ...val});
    }
  };

  return (
    <>
      <Input
        label="name"
        disabled={disabled}
        onChangeText={name => handleInputChange({name})}>
        {props.mountain.name}
      </Input>
      <Input
        label="kana"
        disabled={disabled}
        onChangeText={kana => handleInputChange({kana})}>
        {props.mountain.kana}
      </Input>
      <Input
        label="latitude"
        disabled={disabled}
        onChangeText={t => {
          const latitude = checkPositiveNumber(t) ? Number(t) : null;
          handleInputChange({latitude});
        }}>
        {props.mountain.latitude}
      </Input>
      <Input
        label="longitude"
        disabled={disabled}
        onChangeText={t => {
          const longitude = checkPositiveNumber(t) ? Number(t) : null;
          handleInputChange({longitude});
        }}>
        {props.mountain.longitude}
      </Input>
      <View style={styles.container}>
        <MultiSelect
          placeholder="prefecture"
          data={prefectures.map(p => ({...p, id: String(p.id)}))}
          labelField="name"
          valueField="id"
          value={JSON.parse(props.mountain.prefecture_id).map(String)}
          onChange={i => {
            const prefecture_id = JSON.stringify(i.map(Number));
            handleInputChange({prefecture_id});
          }}
          disable={disabled}
          placeholderStyle={styles.placeholderStyle}
          selectedStyle={styles.selectedStyle}
        />
      </View>
      <CheckBox
        title="weather view"
        checked={props.mountain.weather_view === 1}
        onPress={() => {
          const weather_view = props.mountain.weather_view === 1 ? 0 : 1;
          handleInputChange({weather_view});
        }}
        disabled={disabled}
        containerStyle={styles.containerStyle}
        textStyle={styles.textStyle}
      />
      <CheckBox
        title="logical delete"
        checked={props.mountain.logical_delete === 1}
        onPress={() => {
          const logical_delete = props.mountain.logical_delete === 1 ? 0 : 1;
          handleInputChange({logical_delete});
        }}
        disabled={disabled}
        containerStyle={styles.containerStyle}
        textStyle={styles.textStyle}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#86939e',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  },
  selectedStyle: {
    borderRadius: 12,
  },
  textStyle: {
    fontSize: 16,
    color: '#86939e',
  },
  containerStyle: {
    backgroundColor: 'transparent',
  },
});

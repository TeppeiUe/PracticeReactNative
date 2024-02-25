import {FC} from 'react';
import {Mountains} from '../models/ClimbingPlan';
import {usePrefecturesContext} from '../hooks/PrefecturesContext';
import {Input, CheckBox, useTheme, Chip} from '@rneui/themed';
import {MultiSelect} from 'react-native-element-dropdown';
import {Linking, StyleSheet, View} from 'react-native';
import {checkPositiveNumber} from '../utils/validation';

/**
 * 山フォームコンポーネントのプロパティ
 */
type MountainFormProps<T = Omit<Mountains, 'id'>> = {
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
  const {disabled = true, handleValueChange, mountain} = props;
  const prefectures = usePrefecturesContext();
  const {theme} = useTheme();

  /**
   * 山データのコールバック
   */
  const handleInputChange = (val: {[K in keyof Mountains]?: Mountains[K]}) => {
    if (handleValueChange !== undefined) {
      handleValueChange({...mountain, ...val});
    }
  };

  /**
   * リンクを開く
   */
  const openURL = async (
    latitude: Mountains['latitude'],
    longitude: Mountains['longitude'],
  ) => {
    if (latitude !== null && longitude !== null) {
      const url = `https://maps.google.co.jp/maps?q=${latitude},${longitude}&t=p`;
      console.log(url);
      await Linking.openURL(url).catch(e => console.error(JSON.stringify(e)));
    }
  };

  return (
    <>
      <Input
        label="name"
        disabled={disabled}
        onChangeText={name => handleInputChange({name})}>
        {mountain.name}
      </Input>
      <Input
        label="kana"
        disabled={disabled}
        onChangeText={kana => handleInputChange({kana})}>
        {mountain.kana}
      </Input>
      {!disabled && (
        <Input
          label="latitude"
          disabled={disabled}
          onChangeText={t => {
            const latitude = checkPositiveNumber(t) ? Number(t) : null;
            handleInputChange({latitude});
          }}>
          {mountain.latitude}
        </Input>
      )}
      {!disabled && (
        <Input
          label="longitude"
          disabled={disabled}
          onChangeText={t => {
            const longitude = checkPositiveNumber(t) ? Number(t) : null;
            handleInputChange({longitude});
          }}>
          {mountain.longitude}
        </Input>
      )}
      {mountain.latitude !== null && mountain.longitude !== null && (
        <Chip
          icon={{
            name: 'pageview',
            color: theme.colors.primary,
          }}
          type="outline"
          title="Google Map"
          onPress={() => openURL(mountain.latitude, mountain.longitude)}
        />
      )}
      <View style={styles.container}>
        <MultiSelect
          placeholder="prefecture"
          data={prefectures.map(p => ({...p, id: String(p.id)}))}
          labelField="name"
          valueField="id"
          value={JSON.parse(mountain.prefecture_id).map(String)}
          onChange={i => {
            const prefecture_id = JSON.stringify(i.map(Number));
            handleInputChange({prefecture_id});
          }}
          disable={disabled}
          containerStyle={{backgroundColor: theme.colors.background}}
          activeColor={
            theme.mode === 'dark' ? theme.colors.searchBg : undefined
          }
          placeholderStyle={styles.placeholderStyle}
          selectedStyle={styles.selectedStyle}
        />
      </View>
      <CheckBox
        title="weather view"
        checked={mountain.weather_view === 1}
        onPress={() => {
          const weather_view = mountain.weather_view === 1 ? 0 : 1;
          handleInputChange({weather_view});
        }}
        disabled={disabled}
      />
      <CheckBox
        title="logical delete"
        checked={mountain.logical_delete === 1}
        onPress={() => {
          const logical_delete = mountain.logical_delete === 1 ? 0 : 1;
          handleInputChange({logical_delete});
        }}
        disabled={disabled}
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
});

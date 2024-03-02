import {FC, useRef} from 'react';
import {Mountains} from '../models/ClimbingPlan';
import {usePrefecturesContext} from '../hooks/PrefecturesContext';
import {Input, CheckBox, useTheme, Chip} from '@rneui/themed';
import {MultiSelect} from 'react-native-element-dropdown';
import {Linking, StyleSheet, View} from 'react-native';
import {checkPositiveNumber} from '../utils/validation';
import Const from '../utils/Const';

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
  /** 検証結果のコールバック */
  hasError?: (error: boolean) => void;
};

/**
 * 山フォームコンポーネント
 */
export const MountainForm: FC<MountainFormProps> = props => {
  const {disabled = true, handleValueChange, mountain, hasError} = props;
  const prefectures = usePrefecturesContext();
  const {theme} = useTheme();
  /** バリデーション結果格納 */
  const validation = useRef<{
    [K in keyof Pick<
      Mountains,
      'name' | 'kana' | 'latitude' | 'longitude'
    >]: string;
  }>({name: '', kana: '', latitude: '', longitude: ''});

  /**
   * 入力情報更新時のコールバック
   */
  const handleInputChange = (val: {
    [K in keyof Omit<Mountains, 'id'>]?: Mountains[K];
  }) => {
    const updateMountain = {...mountain, ...val};
    validationCheck(updateMountain);
    if (handleValueChange !== undefined) {
      handleValueChange(updateMountain);
    }
    if (hasError !== undefined) {
      hasError(Object.values(validation.current).some(v => v !== ''));
    }
  };

  /**
   * バリデーションチェック
   */
  const validationCheck = (m: Omit<Mountains, 'id'>) => {
    const {name, kana, latitude, longitude} = m;
    validation.current = {
      name: name ? '' : Const.VALIDATION_MESSAGE_REQUIRED,
      kana:
        !kana || new RegExp(/^[ぁ-ん]+$/u).test(kana)
          ? ''
          : Const.VALIDATION_MESSAGE_INVALID,
      latitude:
        latitude === null || checkPositiveNumber(String(latitude))
          ? ''
          : Const.VALIDATION_MESSAGE_INVALID,
      longitude:
        longitude === null || checkPositiveNumber(String(longitude))
          ? ''
          : Const.VALIDATION_MESSAGE_INVALID,
    };
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
      await Linking.openURL(url).catch(e => console.error(JSON.stringify(e)));
    }
  };

  return (
    <>
      {/* 山名 */}
      <Input
        label="name*"
        disabled={disabled}
        onChangeText={name => handleInputChange({name})}
        errorMessage={validation.current.name}>
        {mountain.name}
      </Input>

      {/* 山名かな */}
      <Input
        label="kana"
        disabled={disabled}
        onChangeText={t => handleInputChange({kana: t === '' ? null : t})}
        errorMessage={validation.current.kana}>
        {mountain.kana}
      </Input>

      {/* 経度 */}
      {!disabled && (
        <Input
          label="latitude"
          disabled={disabled}
          onChangeText={t =>
            handleInputChange({latitude: t === '' ? null : Number(t)})
          }
          errorMessage={validation.current.latitude}>
          {mountain.latitude}
        </Input>
      )}

      {/* 緯度 */}
      {!disabled && (
        <Input
          label="longitude"
          disabled={disabled}
          onChangeText={t =>
            handleInputChange({longitude: t === '' ? null : Number(t)})
          }
          errorMessage={validation.current.longitude}>
          {mountain.longitude}
        </Input>
      )}

      {/* URIリンク */}
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

      {/* 都道府県セレクタ */}
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

      {/* 天気表示チェックボックス */}
      <CheckBox
        title="weather view"
        checked={mountain.weather_view === 1}
        onPress={() => {
          const weather_view = mountain.weather_view === 1 ? 0 : 1;
          handleInputChange({weather_view});
        }}
        disabled={disabled}
      />

      {/* 論理削除チェックボックス */}
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

import {FC, useRef} from 'react';
import {Mountains} from '../models/ClimbingPlan';
import {usePrefecturesContext} from '../hooks/PrefecturesContext';
import {Input, CheckBox, useTheme, Chip, Icon} from '@rneui/themed';
import {MultiSelect} from 'react-native-element-dropdown';
import {Linking, StyleSheet, View} from 'react-native';
import Const from '../utils/Const';
import Geocoder from 'react-native-geocoding';
import Config from 'react-native-config';

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
    [K in keyof Pick<Mountains, 'name' | 'kana'>]: string;
  }>({name: '', kana: ''});

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
    const {name, kana} = m;
    validation.current = {
      name: name ? '' : Const.VALIDATION_MESSAGE_REQUIRED,
      kana:
        !kana || new RegExp(/^[ぁ-ん]+$/u).test(kana)
          ? ''
          : Const.VALIDATION_MESSAGE_INVALID,
    };
  };

  /**
   * リンクを開く
   */
  const openURL = async () => {
    const {latitude, longitude} = mountain;
    if (latitude !== null && longitude !== null) {
      const query = new URLSearchParams({
        q: `${latitude},${longitude}`,
        t: 'p',
      });
      const url = `https://maps.google.co.jp/maps?${query}`;
      await Linking.openURL(url).catch(e => console.error(JSON.stringify(e)));
    }
  };

  /**
   * GeoCoding
   */
  const getLatLng = async () => {
    const apiKey = Config.GOOGLE_MAPS_API_KEY;
    const {name} = mountain;
    if (name !== null && name !== '' && apiKey !== undefined) {
      Geocoder.init(apiKey);
      Geocoder.from(name)
        .then(json => {
          const {location} = json.results[0].geometry;
          handleInputChange({
            latitude: location.lat,
            longitude: location.lng,
          });
        })
        .catch(error => console.warn(error));
    }
  };

  return (
    <>
      {/* 山名 */}
      <Input
        label="name*"
        rightIcon={
          <Icon
            name="search"
            disabled={disabled}
            disabledStyle={styles.disabledStyle}
            onPress={getLatLng}
          />
        }
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

      {/* URIリンク */}
      {mountain.latitude !== null && mountain.longitude !== null && (
        <Chip
          icon={{
            name: 'pageview',
            color: theme.colors.primary,
          }}
          type="outline"
          title="Google Map"
          onPress={openURL}
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

      {/* 備考 */}
      <Input
        label="remarks"
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        disabled={disabled}
        onChangeText={remarks => handleInputChange({remarks})}>
        {mountain.remarks}
      </Input>
    </>
  );
};

const styles = StyleSheet.create({
  disabledStyle: {
    backgroundColor: 'transparent',
  },
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

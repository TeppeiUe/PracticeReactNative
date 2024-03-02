import {FC, useRef} from 'react';
import {Plans} from '../models/ClimbingPlan';
import {Input, CheckBox, Text, Chip, useTheme} from '@rneui/themed';
import {Linking, StyleSheet, View} from 'react-native';
import {AccessInformationForm} from './AccessInformationForm';
import {checkNaturalNumber} from '../utils/validation';
import Const from '../utils/Const';

/**
 * 計画フォームコンポーネントのプロパティ
 */
type PlanFormProps<T = Omit<Plans, 'id'>> = {
  /** disabled */
  disabled?: boolean;
  /** 表示計画データ */
  plan: T;
  /** 計画データのコールバック */
  handleValueChange?: (plan: T) => void;
  /** 検証結果のコールバック */
  hasError?: (error: boolean) => void;
};

/**
 * 計画フォームコンポーネント
 */
export const PlanForm: FC<PlanFormProps> = props => {
  const {disabled = true, handleValueChange, plan, hasError} = props;
  const {theme} = useTheme();
  /** バリデーション結果格納 */
  const validation = useRef<{
    [K in keyof Pick<
      Plans,
      'name' | 'url' | 'effective_height' | 'effective_distance'
    >]: string;
  }>({name: '', url: '', effective_height: '', effective_distance: ''});

  /**
   * 入力情報更新時のコールバック
   */
  const handleInputChange = (val: {[K in keyof Plans]?: Plans[K]}) => {
    const updatePlan = {...plan, ...val};
    validationCheck(updatePlan);
    if (handleValueChange !== undefined) {
      handleValueChange(updatePlan);
    }
    if (hasError !== undefined) {
      hasError(Object.values(validation.current).some(v => v !== ''));
    }
  };

  /**
   * バリデーションチェック
   */
  const validationCheck = (updatePlan: Omit<Plans, 'id'>) => {
    const {name, url, effective_height, effective_distance} = updatePlan;
    validation.current = {
      name: name ? '' : Const.VALIDATION_MESSAGE_REQUIRED,
      url:
        !url || new RegExp(/^https:\/\/[^\s/$.?#].[^\s]*$/i).test(url)
          ? ''
          : Const.VALIDATION_MESSAGE_INVALID,
      effective_height:
        effective_height === null ||
        checkNaturalNumber(String(effective_height))
          ? ''
          : Const.VALIDATION_MESSAGE_INVALID,
      effective_distance:
        effective_distance === null ||
        checkNaturalNumber(String(effective_distance))
          ? ''
          : Const.VALIDATION_MESSAGE_INVALID,
    };
  };

  /**
   * リンクを開く
   */
  const openURL = async (url: Plans['url']) => {
    if (url !== null) {
      await Linking.openURL(url).catch(e => console.error(JSON.stringify(e)));
    }
  };

  return (
    <>
      {/* 計画名 */}
      <Input
        label="name*"
        disabled={disabled}
        onChangeText={name => handleInputChange({name})}
        errorMessage={validation.current.name}>
        {plan.name}
      </Input>

      {/* URL */}
      {disabled ? (
        <Chip
          icon={{
            name: 'pageview',
            color: theme.colors.primary,
          }}
          type="outline"
          title="page view"
          onPress={() => openURL(plan.url)}
        />
      ) : (
        <Input
          label="url"
          disabled={disabled}
          onChangeText={url => handleInputChange({url})}
          errorMessage={validation.current.url}>
          {plan.url}
        </Input>
      )}

      {/* 有効累積標高 */}
      <Input
        label="effective_height [m]"
        disabled={disabled}
        onChangeText={t =>
          handleInputChange({effective_height: t === '' ? null : Number(t)})
        }
        errorMessage={validation.current.effective_height}>
        {plan.effective_height}
      </Input>

      {/* 有効累積距離 */}
      <Input
        label="effective_distance [m]"
        disabled={disabled}
        onChangeText={t =>
          handleInputChange({effective_distance: t === '' ? null : Number(t)})
        }
        errorMessage={validation.current.effective_distance}>
        {plan.effective_distance}
      </Input>

      {/* アクセス情報 */}
      <View style={styles.container}>
        <Text style={styles.placeholderStyle}>access_information</Text>
        <AccessInformationForm
          accessInformation={JSON.parse(plan.access_information)}
          disabled={disabled}
          handleValueChange={a => {
            const access_information = JSON.stringify(a);
            handleInputChange({access_information});
          }}
        />
      </View>

      {/* 車でアクセスチェックボックス */}
      <CheckBox
        title="is_car_access"
        checked={plan.is_car_access === 1}
        onPress={() => {
          const is_car_access = plan.is_car_access === 1 ? 0 : 1;
          handleInputChange({is_car_access});
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
});

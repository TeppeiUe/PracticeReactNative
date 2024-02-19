import {FC} from 'react';
import {Plans} from '../models/ClimbingPlan';
import {Input, CheckBox, Text, Chip, useTheme} from '@rneui/themed';
import {Linking, StyleSheet, View} from 'react-native';
import {AccessInformationForm} from './AccessInformationForm';
import {checkNaturalNumber} from '../utils/validation';

/**
 * 計画フォームコンポーネントのプロパティ
 */
type PlanFormProps<T = Plans> = {
  /** disabled */
  disabled?: boolean;
  /** 表示計画データ */
  plan: T;
  /** 計画データのコールバック */
  handleValueChange?: (plan: T) => void;
};

/**
 * 計画フォームコンポーネント
 */
export const PlanForm: FC<PlanFormProps> = props => {
  const {disabled = true, handleValueChange} = props;
  const {theme} = useTheme();

  /**
   * 計画データのコールバック
   */
  const handleInputChange = (val: {[K in keyof Plans]?: Plans[K]}) => {
    if (handleValueChange !== undefined) {
      handleValueChange({...props.plan, ...val});
    }
  };

  /**
   * リンクを開く
   */
  const openURL = async (url: string | null) => {
    if (url !== null) {
      await Linking.openURL(url).catch(e => console.error(JSON.stringify(e)));
    }
  };

  return (
    <>
      <Input
        label="name"
        disabled={disabled}
        onChangeText={name => handleInputChange({name})}>
        {props.plan.name}
      </Input>
      {disabled ? (
        <Chip
          icon={{
            name: 'pageview',
            color: theme.colors.primary,
          }}
          type="outline"
          title="page view"
          onPress={() => openURL(props.plan.url)}
        />
      ) : (
        <Input
          label="url"
          disabled={disabled}
          onChangeText={url => handleInputChange({url})}>
          {props.plan.url}
        </Input>
      )}
      <Input
        label="effective_height [m]"
        disabled={disabled}
        onChangeText={t => {
          const effective_height = checkNaturalNumber(t) ? Number(t) : null;
          handleInputChange({effective_height});
        }}>
        {props.plan.effective_height}
      </Input>
      <Input
        label="effective_distance [m]"
        disabled={disabled}
        onChangeText={t => {
          const effective_distance = checkNaturalNumber(t) ? Number(t) : null;
          handleInputChange({effective_distance});
        }}>
        {props.plan.effective_distance}
      </Input>
      <View style={styles.container}>
        <Text style={styles.placeholderStyle}>access_information</Text>
        <AccessInformationForm
          accessInformation={JSON.parse(props.plan.access_information)}
          disabled={disabled}
          handleValueChange={a => {
            const access_information = JSON.stringify(a);
            handleInputChange({access_information});
          }}
        />
      </View>
      <CheckBox
        title="is_car_access"
        checked={props.plan.is_car_access === 1}
        onPress={() => {
          const is_car_access = props.plan.is_car_access === 1 ? 0 : 1;
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

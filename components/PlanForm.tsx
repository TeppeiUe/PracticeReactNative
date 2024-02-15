import {FC} from 'react';
import {Plans} from '../models/ClimbingPlan';
import {Input, CheckBox, Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import {AccessInformationForm} from './AccessInformationForm';

type PlanFormProps<T = Plans> = {
  disabled?: boolean;
  plan: T;
  handleValueChange?: (plan: T) => void;
};

export const PlanForm: FC<PlanFormProps> = props => {
  const {disabled = true, handleValueChange} = props;

  const handleInputChange = (val: any) => {
    const p: Plans = {...props.plan, ...val};
    if (handleValueChange !== undefined) {
      handleValueChange(p);
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
      <Input
        label="url"
        disabled={disabled}
        onChangeText={url => handleInputChange({url})}>
        {props.plan.url}
      </Input>
      <Input
        label="effective_height"
        disabled={disabled}
        onChangeText={t => {
          const effective_height = Number(t);
          handleInputChange({effective_height});
        }}>
        {props.plan.effective_height}
      </Input>
      <Input
        label="effective_distance"
        disabled={disabled}
        onChangeText={t => {
          const effective_distance = Number(t);
          handleInputChange({effective_distance});
        }}>
        {props.plan.effective_distance}
      </Input>
      <View style={styles.container}>
        <Text style={styles.placeholderStyle}>access_information</Text>
        <AccessInformationForm
          accessInformation={JSON.parse(props.plan.access_information)}
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
  textStyle: {
    fontSize: 16,
    color: '#86939e',
  },
  containerStyle: {
    backgroundColor: 'transparent',
  },
});

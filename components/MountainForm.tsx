import { FC } from "react"
import { Mountains } from "../models/ClimbingPlan";
import { usePrefecturesContext } from "../hooks/PrefecturesContext";
import { Input, CheckBox } from "@rneui/themed";
import { MultiSelect } from "react-native-element-dropdown";
import { StyleSheet, View } from "react-native";

type MountainFormProps = {
  disabled?: boolean;
  mountain: Mountains
}

export const MountainForm: FC<MountainFormProps> = props => {
  const { disabled = true, mountain } = props;
  const prefectures = usePrefecturesContext();

  return (
    <>
      <Input label='name' disabled={disabled}>{mountain.name}</Input>
      <Input label='kana' disabled={disabled}>{mountain.kana}</Input>
      <Input label='latitude' disabled={disabled}>{mountain.latitude}</Input>
      <Input label='longitude' disabled={disabled}>{mountain.longitude}</Input>
      <View style={styles.container}>
        <MultiSelect
          placeholder='prefecture'
          data={prefectures}
          labelField='name'
          valueField='id'
          value={JSON.parse(mountain.prefecture_id)}
          onChange={i => console.log(i)}
          disable={disabled}
          placeholderStyle={styles.placeholderStyle}
          selectedStyle={styles.selectedStyle}
        />
      </View>
      <CheckBox
        title='weather view'
        checked={mountain.weather_view === 1}
        disabled={disabled}
        containerStyle={styles.containerStyle}
        textStyle={styles.textStyle}
      />
      <CheckBox
        title='logical delete'
        checked={mountain.logical_delete === 1}
        disabled={disabled}
        containerStyle={styles.containerStyle}
        textStyle={styles.textStyle}
      />
    </>
  )
}

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
    backgroundColor: 'transparent'
  },
});

import { FC, useState } from "react"
import { Mountains } from "../models/ClimbingPlan";
import { usePrefecturesContext } from "../hooks/PrefecturesContext";
import { Input, CheckBox } from "@rneui/themed";
import { MultiSelect } from "react-native-element-dropdown";
import { StyleSheet, View } from "react-native";

type MountainFormProps<T=Mountains> = {
  disabled?: boolean;
  mountain: T;
  handleValueChange?: (mountain: T) => void;
}

export const MountainForm: FC<MountainFormProps> = props => {
  const { disabled = true, handleValueChange } = props;
  const [mountain, setMountain] = useState<Mountains>(props.mountain);
  const prefectures = usePrefecturesContext();

  const handleInputChange = (val: any) => {
    const m: Mountains = { ...mountain, ...val };
    setMountain(m);
    if (handleValueChange !== undefined) handleValueChange(m);
  }

  return (
    <>
      <Input
        label='name'
        disabled={disabled}
        onChangeText={name => handleInputChange({ name })}
      >
        {mountain.name}
      </Input>
      <Input
        label='kana'
        disabled={disabled}
        onChangeText={kana => handleInputChange({ kana })}
      >
        {mountain.kana}
      </Input>
      <Input
        label='latitude'
        disabled={disabled}
        onChangeText={t => {
          const latitude = Number(t);
          handleInputChange({ latitude });
        }}
      >
        {mountain.latitude}
      </Input>
      <Input
        label='longitude'
        disabled={disabled}
        onChangeText={t => {
          const longitude = Number(t);
          handleInputChange({ longitude });
        }}
      >
        {mountain.longitude}
      </Input>
      <View style={styles.container}>
        <MultiSelect
          placeholder='prefecture'
          data={prefectures.map(p => ({ ...p, id: String(p.id) }))}
          labelField='name'
          valueField='id'
          value={JSON.parse(mountain.prefecture_id).map(String)}
          onChange={i => {
            const prefecture_id = JSON.stringify(i.map(Number));
            handleInputChange({ prefecture_id });
          }}
          disable={disabled}
          placeholderStyle={styles.placeholderStyle}
          selectedStyle={styles.selectedStyle}
        />
      </View>
      <CheckBox
        title='weather view'
        checked={mountain.weather_view === 1}
        onPress={() => {
          const weather_view = mountain.weather_view === 1 ? 0 : 1;
          handleInputChange({ weather_view });
        }}
        disabled={disabled}
        containerStyle={styles.containerStyle}
        textStyle={styles.textStyle}
      />
      <CheckBox
        title='logical delete'
        checked={mountain.logical_delete === 1}
        onPress={() => {
          const logical_delete = mountain.logical_delete === 1 ? 0 : 1;
          handleInputChange({ logical_delete });
        }}
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

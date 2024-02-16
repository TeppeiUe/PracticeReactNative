import {FC, useState} from 'react';
import {AccessInformation} from '../models/AccessInformation';
import {ListItem, Icon, Button} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

type AccessInformationFormProps<T> = {
  disabled?: boolean;
  accessInformation: T;
  handleValueChange?: (accessInformation: T) => void;
};

const AccessInformationInnerForm: FC<
  AccessInformationFormProps<AccessInformation>
> = props => {
  const {disabled = true, accessInformation, handleValueChange} = props;

  const handleInputChange = (val: any) => {
    const a: AccessInformation = {...props.accessInformation, ...val};
    if (handleValueChange !== undefined) {
      handleValueChange(a);
    }
  };

  return (
    <>
      <ListItem.Input
        label="route"
        disabled={disabled}
        onChangeText={route => handleInputChange({route})}>
        {accessInformation.route}
      </ListItem.Input>
      <ListItem.Input
        label="departure name"
        disabled={disabled}
        onChangeText={name => {
          const departure = {...accessInformation.departure, ...{name}};
          handleInputChange({departure});
        }}>
        {accessInformation.departure?.name}
      </ListItem.Input>
      <ListItem.Input
        label="departure time"
        disabled={disabled}
        onChangeText={time => {
          const departure = {...accessInformation.departure, ...{time}};
          handleInputChange({departure});
        }}>
        {accessInformation.departure?.time}
      </ListItem.Input>
      <ListItem.Input
        label="arrival name"
        disabled={disabled}
        onChangeText={name => {
          const arrival = {...accessInformation.arrival, ...{name}};
          handleInputChange({arrival});
        }}>
        {accessInformation.arrival?.name}
      </ListItem.Input>
      <ListItem.Input
        label="arrival time"
        disabled={disabled}
        onChangeText={time => {
          const arrival = {...accessInformation.arrival, ...{time}};
          handleInputChange({arrival});
        }}>
        {accessInformation.arrival?.time}
      </ListItem.Input>
    </>
  );
};

export const AccessInformationForm: FC<
  AccessInformationFormProps<AccessInformation[]>
> = props => {
  const {disabled = true, handleValueChange} = props;
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const handleInputChange = (index: number, val: AccessInformation) => {
    const a: AccessInformation[] = [...props.accessInformation];
    a[index] = val;
    if (handleValueChange !== undefined) {
      handleValueChange(a);
    }
  };

  const handleInputDelete = (index: number) => {
    const a: AccessInformation[] = [...props.accessInformation];
    a.splice(index, 1);
    if (handleValueChange !== undefined) {
      handleValueChange(a);
    }
  };

  const handleInputAdd = () => {
    if (handleValueChange !== undefined) {
      handleValueChange([...props.accessInformation, new AccessInformation()]);
    }
  };

  return (
    <>
      {props.accessInformation.map((a, i) => (
        <ListItem.Accordion
          key={i}
          topDivider
          bottomDivider
          containerStyle={styles.containerStyle}
          isExpanded={expandedItems.includes(i)}
          content={
            <View style={styles.container}>
              <ListItem.Content>
                <ListItem.Title>
                  {`${a.departure?.name ?? ''} -> ${a.arrival?.name ?? ''}`}
                </ListItem.Title>
                <ListItem.Subtitle>{a.route ?? ''}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon
                name="delete"
                reverse
                disabled={disabled}
                onPress={() => handleInputDelete(i)}
              />
            </View>
          }
          onPress={() =>
            expandedItems.includes(i)
              ? setExpandedItems(expandedItems.filter(v => v !== i))
              : setExpandedItems([...expandedItems, i])
          }>
          <AccessInformationInnerForm
            accessInformation={a}
            disabled={disabled}
            handleValueChange={ai => handleInputChange(i, ai)}
          />
        </ListItem.Accordion>
      ))}
      <Button size="sm" disabled={disabled} onPress={() => handleInputAdd()}>
        <Icon name="add" color="white" />
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerStyle: {
    backgroundColor: 'transparent',
  },
});

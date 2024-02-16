import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useCallback, useState} from 'react';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Icon, ListItem} from '@rneui/themed';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {PlanForm} from './PlanForm';

export const PlanList = ({}: CompositeScreenProps<
  NativeStackScreenProps<PlanStackParamList, 'PlanList'>,
  CompositeScreenProps<
    MaterialTopTabScreenProps<MountainTabParamList, 'PlanStackNavigator'>,
    NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>
  >
>) => {
  const [planList, setPlanList] = useState<Plans[]>([]);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [editItems, setEditItems] = useState<number[]>([]);
  const {mountainId} = useMountainIdContext();

  useFocusEffect(
    useCallback(() => {
      executeSql(
        'SELECT * FROM plans WHERE mountain_id = ?',
        [mountainId],
        (_, res) => setPlanList(res.rows.raw()),
      );
    }, [mountainId]),
  );

  const handleClickDelete = (id: number) =>
    console.log(`delete plan id is ${id}`);

  return (
    <>
      <ScrollView>
        {planList.map(plan => {
          const {effective_distance} = plan;
          return (
            <ListItem.Accordion
              key={plan.id}
              content={
                <View style={styles.container}>
                  <ListItem.Content>
                    <ListItem.Title>{plan.name}</ListItem.Title>
                    <ListItem.Subtitle>
                      {effective_distance ? effective_distance / 1000 : '-'} km
                      /{plan.effective_height ?? '-'} m
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <Icon
                    name={editItems.includes(plan.id!) ? 'save' : 'edit'}
                    reverse
                    onPress={() =>
                      editItems.includes(plan.id!)
                        ? setEditItems(editItems.filter(i => i !== plan.id))
                        : setEditItems([...editItems, plan.id!])
                    }
                  />
                  <Icon
                    name="delete"
                    reverse
                    onPress={() => handleClickDelete(plan.id!)}
                  />
                </View>
              }
              isExpanded={expandedItems.includes(plan.id!)}
              onPress={() =>
                expandedItems.includes(plan.id!)
                  ? setExpandedItems(expandedItems.filter(i => i !== plan.id))
                  : setExpandedItems([...expandedItems, plan.id!])
              }>
              <PlanForm
                plan={plan}
                handleValueChange={p =>
                  setPlanList(planList.map(pl => (pl.id === p.id ? p : pl)))
                }
                disabled={!editItems.includes(plan.id!)}
              />
            </ListItem.Accordion>
          );
        })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

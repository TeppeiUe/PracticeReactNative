import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useCallback, useState} from 'react';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {ScrollView} from 'react-native';
import {ListItem} from '@rneui/themed';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';

export const PlanList = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<PlanStackParamList, 'PlanList'>,
  CompositeScreenProps<
    MaterialTopTabScreenProps<MountainTabParamList, 'PlanStackNavigator'>,
    NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>
  >
>) => {
  const [planList, setPlanList] = useState<Plans[]>([]);
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

  return (
    <>
      <ScrollView>
        {planList.map(plan => {
          const {effective_distance} = plan;
          return (
            <ListItem
              key={plan.id}
              onPress={() =>
                navigation.navigate('PlanDetail', {
                  plan_id: plan.id,
                })
              }
              bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{plan.name}</ListItem.Title>
                <ListItem.Subtitle>
                  {effective_distance ? effective_distance / 1000 : '-'} km /
                  {plan.effective_height ?? '-'} m
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          );
        })}
      </ScrollView>
    </>
  );
};

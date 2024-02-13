import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useEffect, useState} from 'react';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {ScrollView} from 'react-native';
import {ListItem} from '@rneui/themed';

export const PlanList = ({
  route,
}: MaterialTopTabScreenProps<MountainTabParamList, 'PlanList'>) => {
  const {mountain_id} = route.params;
  const [planList, setPlanList] = useState<Plans[]>([]);

  useEffect(() => {
    executeSql(
      'SELECT * FROM plans WHERE mountain_id = ?',
      [mountain_id],
      (_, res) => setPlanList(res.rows.raw()),
    );
  }, [mountain_id]);

  return (
    <>
      <ScrollView>
        {planList.map(plan => {
          const {effective_distance} = plan;
          return (
            <ListItem
              key={plan.id}
              onPress={() => console.log(plan)}
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

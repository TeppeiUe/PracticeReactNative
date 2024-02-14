import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {ScrollView} from 'react-native';
import {Text} from '@rneui/themed';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {RootStackParamList} from '../navigator/RootStackNavigator';

export const PlanDetail = ({
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<PlanStackParamList, 'PlanDetail'>,
  CompositeScreenProps<
    MaterialTopTabScreenProps<MountainTabParamList, 'PlanStackNavigator'>,
    NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>
  >
>) => {
  const {plan_id} = route.params;
  const [plan, setPlan] = useState<Plans>();
  // const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    executeSql('SELECT * FROM plans WHERE id = ?', [plan_id], (_, res) =>
      setPlan(res.rows.item(0)),
    );
  }, [plan_id]);

  return (
    <>
      <ScrollView>
        <Text>{JSON.stringify(plan)}</Text>
      </ScrollView>
    </>
  );
};

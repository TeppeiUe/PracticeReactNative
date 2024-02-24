import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useCallback, useState} from 'react';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {RefreshControl, ScrollView} from 'react-native';
import {ListItem} from '@rneui/themed';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {HeaderRegisterButton} from './HeaderButtons';

/**
 * 計画リスト表示コンポーネント
 */
export const PlanList = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<PlanStackParamList, 'PlanList'>,
  CompositeScreenProps<
    MaterialTopTabScreenProps<MountainTabParamList, 'PlanStackNavigator'>,
    NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>
  >
>) => {
  // 表示計画リスト制御
  const [planList, setPlanList] = useState<Plans[]>([]);
  // 画面リフレッシュ制御
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {mountainId} = useMountainIdContext();

  /**
   * 計画データ取得
   */
  const fetch = useCallback(
    () =>
      executeSql(
        'SELECT * FROM plans WHERE mountain_id = ?',
        [mountainId],
        (_, res) => setPlanList(res.rows.raw()),
      ),
    [mountainId],
  );

  /**
   * 画面リフレッシュ
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useFocusEffect(fetch);
  useFocusEffect(
    useCallback(
      () =>
        navigation
          .getParent()
          ?.getParent()
          ?.setOptions({
            headerRight: () => (
              <HeaderRegisterButton
                onPress={() => navigation.navigate('PlanRegister')}
              />
            ),
          }),
      [navigation],
    ),
  );

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {planList.map(plan => {
          const {effective_distance} = plan;
          return (
            <ListItem
              key={plan.id}
              onPress={() => {
                navigation.navigate('PlanDetail', {
                  plan_id: plan.id!,
                });
              }}
              bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{plan.name}</ListItem.Title>
                <ListItem.Subtitle>
                  {effective_distance ? effective_distance / 1000 : '-'} km /
                  {plan.effective_height ?? '-'} m
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          );
        })}
      </ScrollView>
    </>
  );
};

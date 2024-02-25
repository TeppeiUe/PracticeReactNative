import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useCallback, useState} from 'react';
import {Plans} from '../models/ClimbingPlan';
import {Alert, RefreshControl, ScrollView} from 'react-native';
import {ListItem} from '@rneui/themed';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {HeaderRegisterButton} from './HeaderButtons';
import {getPlanList} from '../utils/ClimbingPlanConnection';

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
      getPlanList(
        mountainId,
        (_, res) => setPlanList(res.rows.raw()),
        (tx, _) =>
          Alert.alert('Failed to retrieve data.', JSON.stringify(tx), [
            {text: 'OK'},
          ]),
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

  // 取得計画データ画面反映
  useFocusEffect(fetch);
  // ヘッダ情報の設定
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

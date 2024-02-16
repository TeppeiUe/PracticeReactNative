import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {MountainTabParamList} from '../navigator/MountainTabNavigator';
import {useCallback, useState} from 'react';
import {Plans, executeSql} from '../models/ClimbingPlan';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {FAB, Icon, ListItem} from '@rneui/themed';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {PlanStackParamList} from '../navigator/PlanStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import {PlanForm} from './PlanForm';
import {PlanRegister} from './PlanRegister';

export const PlanList = ({}: CompositeScreenProps<
  NativeStackScreenProps<PlanStackParamList, 'PlanList'>,
  CompositeScreenProps<
    MaterialTopTabScreenProps<MountainTabParamList, 'PlanStackNavigator'>,
    NativeStackScreenProps<RootStackParamList, 'MountainTabNavigator'>
  >
>) => {
  const [planList, setPlanList] = useState<Plans[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [editItems, setEditItems] = useState<number[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const {mountainId} = useMountainIdContext();

  const fetch = useCallback(
    () =>
      executeSql(
        'SELECT * FROM plans WHERE mountain_id = ?',
        [mountainId],
        (_, res) => setPlanList(res.rows.raw()),
      ),
    [mountainId],
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useFocusEffect(fetch);

  const handleSaveClick = (id: number) => {
    const {
      name,
      url,
      effective_height,
      effective_distance,
      access_information,
      is_car_access,
    } = planList.filter(p => p.id === id)[0];
    const query = `
      UPDATE plans SET
      name = ?,
      url = ?,
      effective_height = ?,
      effective_distance = ?,
      access_information = ?,
      is_car_access = ?
      WHERE id = ?
    `;
    const params = [
      name,
      url,
      effective_height,
      effective_distance,
      access_information,
      is_car_access,
      id,
    ];
    executeSql(query, params, (_, res) => console.log(JSON.stringify(res)));
    setEditItems(editItems.filter(i => i !== id));
  };

  const handleClickDelete = (id: number) => {
    executeSql('DELETE FROM plans WHERE id = ?', [id], (_, res) =>
      console.log(JSON.stringify(res)),
    );
    setPlanList(planList.filter(i => i.id !== id));
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
                    onPress={() => {
                      editItems.includes(plan.id!)
                        ? handleSaveClick(plan.id!)
                        : setEditItems([...editItems, plan.id!]);
                    }}
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

      {/* 登録ボタン */}
      <FAB
        icon={{name: 'add', color: 'white'}}
        size="small"
        placement="right"
        onPress={() => setVisible(true)}
      />

      {/* 登録ダイアログ */}
      <PlanRegister visible={visible} setVisible={setVisible} />
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

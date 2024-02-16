import {useCallback, useEffect, useState} from 'react';
import {Mountains, executeSql} from '../models/ClimbingPlan';
import {FAB, ListItem} from '@rneui/themed';
import {RefreshControl, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {usePrefecturesContext} from '../hooks/PrefecturesContext';
import {MountainRegister} from './MountainRegister';
import {useMountainIdContext} from '../hooks/MountainIdContext';

/**
 * 山リスト表示コンポーネント
 */
export const MountainList = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'MountainList'>) => {
  // 表示山リスト制御
  const [mountainList, setMountainList] = useState<Mountains[]>([]);
  // 画面リフレッシュ制御
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // 登録ダイアログ表示制御
  const [visible, setVisible] = useState<boolean>(false);

  const prefectures = usePrefecturesContext();
  const {setMountainId} = useMountainIdContext();

  /**
   * 画面リフレッシュ
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetch();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  /**
   * 山データ取得
   */
  const fetch = () =>
    executeSql('SELECT * FROM mountains', [], (_, res) =>
      setMountainList(res.rows.raw()),
    );

  useEffect(() => fetch(), []);

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {mountainList.map(mountain => (
          <ListItem
            key={mountain.id}
            onPress={() => {
              setMountainId(mountain.id!);
              navigation.navigate('MountainTabNavigator', {
                screen: 'MountainDetail',
              });
            }}
            bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{mountain.name}</ListItem.Title>
              <ListItem.Subtitle>
                {prefectures
                  .filter(p =>
                    JSON.parse(mountain.prefecture_id).some(
                      (i: number) => i === p.id,
                    ),
                  )
                  .map(p => p.name)
                  .join(', ')}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </ScrollView>

      {/* 登録ボタン */}
      <FAB
        icon={{name: 'add', color: 'white'}}
        size="small"
        placement="right"
        onPress={() => setVisible(true)}
      />

      {/* 登録ダイアログ */}
      <MountainRegister visible={visible} setVisible={setVisible} />
    </>
  );
};

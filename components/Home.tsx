import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import MapView, {LatLng, Marker} from 'react-native-maps';
import {getMountainList} from '../utils/ClimbingPlanConnection';
import Const from '../utils/Const';
import {Mountains} from '../models/ClimbingPlan';
import {useTheme} from '@rneui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import GetLocation from 'react-native-get-location';

/**
 * ホームコンポーネント
 */
export const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  // 表示山リスト制御
  const [mountainList, setMountainList] = useState<Mountains[]>([]);
  // 端末位置情報制御
  const [location, setLocation] = useState<LatLng>();

  const {theme} = useTheme();
  const {setMountainId} = useMountainIdContext();

  /** 地図を表示する範囲 */
  const dLatLng = ((500 / 6378) * 180) / Math.PI;

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ])
        .then(permission => {
          if (
            permission['android.permission.ACCESS_COARSE_LOCATION'] ===
              'granted' &&
            permission['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
          ) {
            GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 60000,
            })
              .then(({latitude, longitude}) => {
                // 精度は不要なので足切り
                if (
                  Math.abs((location?.latitude ?? 0) - latitude) > 1e-4 ||
                  Math.abs((location?.longitude ?? 0) - longitude) > 1e-4
                ) {
                  setLocation({latitude, longitude});
                }
              })
              .catch(e => console.error(JSON.stringify(e)));
          }
        })
        .catch(e => console.error(JSON.stringify(e)));
    }
  }, [location]);

  useEffect(
    () =>
      getMountainList(
        (_, res) => setMountainList(res.rows.raw()),
        (tx, _) =>
          Alert.alert(Const.FAILED_MESSAGE_ACQUISITION, JSON.stringify(tx)),
      ),
    [],
  );

  return (
    <>
      {location?.latitude !== undefined && location.longitude !== undefined && (
        <MapView
          style={styles.mapView}
          userInterfaceStyle={theme.mode}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: dLatLng,
            longitudeDelta: dLatLng,
          }}>
          {mountainList
            .filter(m => m.latitude && m.longitude)
            .map(mountain => (
              <Marker
                key={mountain.id}
                coordinate={{
                  latitude: mountain.latitude!,
                  longitude: mountain.longitude!,
                }}
                title={mountain.name}
                description={mountain.kana ?? 'test'}
                onPress={() => {
                  setMountainId(mountain.id);
                  navigation.navigate('MountainTabNavigator', {
                    screen: 'MountainDetail',
                    title: mountain.name,
                  });
                }}
              />
            ))}
        </MapView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
});

import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import MapView, {Callout, LatLng, Marker} from 'react-native-maps';
import {getMountainList} from '../utils/ClimbingPlanConnection';
import Const from '../utils/Const';
import {Mountains} from '../models/ClimbingPlan';
import {Icon, Text, useTheme} from '@rneui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';
import {useMountainIdContext} from '../hooks/MountainIdContext';
import GetLocation from 'react-native-get-location';
import {Forecast5} from '../models/OpenWeatherMap';
import {getForeCast} from '../utils/OpenWeatherMapConnection';
import {Dropdown} from 'react-native-element-dropdown';

/**
 * ホームコンポーネント
 */
export const Home = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  // 表示山リスト制御
  const [mountainList, setMountainList] = useState<Mountains[]>([]);
  // 表示天気リスト制御
  const [weatherList, setWeatherList] = useState<
    (Forecast5 & Pick<Mountains, 'name'>)[]
  >([]);
  // 端末位置情報制御
  const [location, setLocation] = useState<LatLng>();
  // 選択した日時
  const [selectedDateTime, setSelectedDateTime] = useState<number>(0);

  const {theme} = useTheme();
  const {setMountainId} = useMountainIdContext();

  /** 地図を表示する範囲 */
  const dLatLng = ((500 / 6378) * 180) / Math.PI;

  /**
   * フォーマット日時取得
   * @param date Unix Time
   */
  const getFormattedDateTime = (date: number) => {
    if (date === undefined) {
      return;
    }
    const d = new Date(date * 1000);
    const yyyy = d.getFullYear();
    const mm = `0${d.getMonth() + 1}`.slice(-2);
    const dd = `0${d.getDate()}`.slice(-2);
    const hh = `0${d.getHours()}`.slice(-2);
    const www = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'][
      d.getDay()
    ];
    return `${yyyy}/${mm}/${dd} ${hh}:00 (${www})`;
  };

  // 位置情報取得
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

  // 山情報及び天気情報取得
  useEffect(
    () =>
      getMountainList(
        (_, res) => {
          const mountains: Mountains[] = res.rows.raw();
          setMountainList(mountains);
          mountains
            .filter(m => m.weather_view === 1)
            .forEach(m =>
              getForeCast(m).then(data => {
                const {cod, message, ...weather} = data;
                console.log(`status: ${cod}, message: ${message}`);
                if (cod === '200') {
                  setWeatherList([
                    ...weatherList,
                    {
                      ...(weather as Forecast5),
                      name: m.name,
                    },
                  ]);
                }
              }),
            );
          if (weatherList.length !== 0) {
            setSelectedDateTime(weatherList[0].list[0].dt);
          }
        },
        (tx, _) =>
          Alert.alert(Const.FAILED_MESSAGE_ACQUISITION, JSON.stringify(tx)),
      ),
    [],
  );

  return (
    <>
      {/* 日時選択 */}
      {weatherList.length !== 0 && (
        <Dropdown
          placeholder="Select forecast datetime"
          data={weatherList[0].list.map(({dt}) => {
            return {
              label: getFormattedDateTime(dt),
              value: String(dt),
            };
          })}
          labelField="label"
          valueField="value"
          value={String(selectedDateTime)}
          onChange={v => setSelectedDateTime(Number(v.value))}
          containerStyle={{backgroundColor: theme.colors.background}}
          activeColor={
            theme.mode === 'dark' ? theme.colors.searchBg : undefined
          }
          placeholderStyle={styles.placeholderStyle}
          renderLeftIcon={() => <Icon name="schedule" color="#86939e" />}
        />
      )}

      {/* 地図表示 */}
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

          {/* 山マーカー */}
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
                description={mountain.kana ?? '-'}
                onPress={() => {
                  setMountainId(mountain.id);
                  navigation.navigate('MountainTabNavigator', {
                    screen: 'MountainDetail',
                    title: mountain.name,
                  });
                }}
              />
            ))}

          {/* 天気表示マーカー */}
          {weatherList
            .map(({name, list, city}) => {
              return {
                name,
                forecast: list.filter(({dt}) => dt === selectedDateTime)?.[0],
                coord: city.coord,
              };
            })
            .filter(({forecast}) => forecast !== undefined)
            .map(({name, forecast, coord}, i) => {
              const {description, icon} = forecast.weather[0];
              return (
                <Marker
                  key={i}
                  coordinate={{
                    latitude: coord.lat,
                    longitude: coord.lon,
                  }}
                  image={{
                    uri: `https://openweathermap.org/img/wn/${icon}@2x.png`,
                    cache: 'force-cache',
                  }}>
                  <Callout
                    tooltip
                    style={{
                      backgroundColor: theme.colors.background,
                      ...styles.callOut,
                    }}>
                    <Text>Weather condition: {description}</Text>
                    <Text>Temperature: {forecast.main.temp} ℃</Text>
                    <Text>Wind speed: {forecast.wind.speed} m/s</Text>
                    <Text>Cloudiness: {forecast.clouds.all} %</Text>
                    <Text>
                      Probability of precipitation: {forecast.pop * 100} %
                    </Text>
                    <Text>Weather view setting: @{name}</Text>
                  </Callout>
                </Marker>
              );
            })}
        </MapView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  callOut: {
    padding: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#86939e',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  },
  selectedStyle: {
    borderRadius: 12,
  },
});

import Config from 'react-native-config';
import {Mountains} from '../models/ClimbingPlan';
import {Forecast5} from '../models/OpenWeatherMap';

const OPEN_WEATHER_MAP_ORIGIN = 'https://api.openweathermap.org';

type InternalParameter = {
  cod: string;
  message: string;
};

/**
 * Call 5 day weather forecast API
 */
export const getForeCast = async (
  coord: Pick<Mountains, 'latitude' | 'longitude'>,
): Promise<InternalParameter & Partial<Forecast5>> => {
  const appid = Config.OPEN_WEATHER_MAP_API_ID;
  const {latitude, longitude} = coord;
  if (latitude !== null && longitude !== null && appid !== undefined) {
    const query = new URLSearchParams({
      appid,
      lat: String(latitude),
      lon: String(longitude),
      units: 'metric',
    });
    const res = await fetch(
      `${OPEN_WEATHER_MAP_ORIGIN}/data/2.5/forecast?${query}`,
    );
    return await res.json();
  } else {
    return {
      cod: '400',
      message: 'Invalid parameter.',
    };
  }
};

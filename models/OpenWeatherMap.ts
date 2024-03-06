// 5 day weather forecast - OpenWeatherMap https://openweathermap.org/forecast5

export type Forecast5 = {
  /** A number of timestamps returned in the API response */
  cnt: number;
  city: {
    /** Geo location */
    coord: {
      /** latitude */
      lat: number;
      /** longitude */
      lon: number;
    };
    /** Shift in seconds from UTC */
    timezone: number;
    /** Sunrise time; Unix; UTC */
    sunrise: number;
    /** Sunset time; Unix; UTC */
    sunset: number;
  };
  list: Forecast5Item[];
};

type Forecast5Item = {
  /** Time of data forecasted, unix, UTC */
  dt: number;
  main: {
    /** Temperature */
    temp: number;
    /**
     * 体感温度
     * @description This temperature parameter accounts for the human perception of weather.
     */
    feels_like: number;
    /**
     * 最低気温
     * @description Minimum temperature at the moment of calculation.
     */
    temp_min: number;
    /**
     * 最高気温
     * @description Maximum temperature at the moment of calculation.
     */
    temp_max: number;
    /**
     * 気圧
     * @description Atmospheric pressure on the sea level by default, hPa
     */
    pressure: number;
    /**
     * 海面気圧
     * @description Atmospheric pressure on the sea level, hPa
     */
    sea_level: number;
    /**
     * 地上気圧
     * @description Atmospheric pressure on the ground level, hPa
     */
    grnd_level: number;
    /** Humidity, % */
    humidity: number;
  };
  weather: Forecast5ItemWeather[];
  clouds: {
    /** Cloudiness, % */
    all: number;
  };
  wind: {
    /** Wind speed, meter/sec */
    speed: number;
    /** Wind direction, degrees (meteorological) */
    deg: number;
    /** Wind gust, meter/sec */
    gust: number;
  };
  /**
   * Average visibility, metres.
   * @description The maximum value of the visibility is 10km
   */
  visibility: number;
  /**
   * Probability of precipitation.
   * @description The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
   */
  pop: number;
  /** Snow volume */
  snow?: {
    /**
     * last 3 hours
     * @description Please note that only mm as units of measurement are available for this parameter
     */
    '3h': number;
  };
  /** Rain volume */
  rain?: {
    /** last 3 hours, mm.
     * @description Please note that only mm as units of measurement are available for this parameter
     */
    '3h': number;
  };
  sys: {
    /** Part of the day (n - night, d - day) */
    pod: 'n' | 'd';
  };
  /** Time of data forecasted, ISO, UTC */
  dt_txt: string;
};

type Forecast5ItemWeather = {
  /**  Weather condition id */
  id: number;
  /** Group of weather parameters */
  main: string;
  /** Weather condition within the group. */
  description: string;
  /** Weather icon id */
  icon: string;
};

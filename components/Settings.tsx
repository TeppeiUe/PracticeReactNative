import {
  DownloadDirectoryPath,
  readFileAssets,
  writeFile,
} from '@dr.pogodin/react-native-fs';
import {Chip, useTheme} from '@rneui/themed';
import {Alert, Platform} from 'react-native';
import Const from '../utils/Const';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigator/RootStackNavigator';

/**
 * 設定コンポーネント
 */
export const Settings = ({}: NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>) => {
  const {theme} = useTheme();

  /** バックアップダウンロード */
  const handleDownloadClick = () => {
    // DownloadDirectoryPath is on Android and Windows only
    if (Platform.OS === 'android') {
      /** 出力日付 */
      const date = ((d: Date) => {
        const yyyy = d.getFullYear();
        const mm = `0${d.getMonth() + 1}`.slice(-2);
        const dd = `0${d.getDate()}`.slice(-2);
        return `${yyyy}${mm}${dd}`;
      })(new Date());

      readFileAssets(`www/${Const.DB_NAME}`, 'base64').then(content =>
        writeFile(
          `${DownloadDirectoryPath}/${date}backup.sqlite3`,
          content,
          'base64',
        ).then(() => Alert.alert('Backup created successfully!')),
      );
    }
  };

  return (
    <>
      <Chip
        icon={{
          name: 'download',
          color: theme.colors.primary,
        }}
        type="outline"
        title="Download Sqlite3"
        onPress={handleDownloadClick}
      />
    </>
  );
};

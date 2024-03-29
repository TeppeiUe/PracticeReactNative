import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PrefecturesProvider} from './hooks/PrefecturesProvider';
import {RootStackNavigator} from './navigator/RootStackNavigator';
import {MountainIdProvider} from './hooks/MountainIdProvider';
import {ThemeProvider, createTheme} from '@rneui/themed';
import {useColorScheme} from 'react-native';

const theme = createTheme({
  darkColors: {
    primary: '#03dac5',
    secondary: '#bb86fc',
    warning: '#cf6679',
  },
  components: {
    CheckBox: {
      textStyle: {
        fontSize: 16,
        color: '#86939e',
      },
      containerStyle: {
        backgroundColor: 'transparent',
      },
    },
    Chip: {
      containerStyle: {
        alignSelf: 'center',
        marginLeft: 'auto',
        marginVertical: 5,
      },
    },
  },
});

export const App = () => {
  theme.mode = useColorScheme() === 'dark' ? 'dark' : 'light';
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <PrefecturesProvider>
          <MountainIdProvider>
            <RootStackNavigator />
          </MountainIdProvider>
        </PrefecturesProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PrefecturesProvider} from './hooks/PrefecturesProvider';
import {RootStackNavigator} from './navigator/RootStackNavigator';

export const App = () => {
  return (
    <SafeAreaProvider>
      <PrefecturesProvider>
        <RootStackNavigator />
      </PrefecturesProvider>
    </SafeAreaProvider>
  );
};

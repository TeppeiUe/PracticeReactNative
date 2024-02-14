import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PrefecturesProvider} from './hooks/PrefecturesProvider';
import {RootStackNavigator} from './navigator/RootStackNavigator';
import {MountainIdProvider} from './hooks/MountainIdProvider';

export const App = () => {
  return (
    <SafeAreaProvider>
      <PrefecturesProvider>
        <MountainIdProvider>
          <RootStackNavigator />
        </MountainIdProvider>
      </PrefecturesProvider>
    </SafeAreaProvider>
  );
};

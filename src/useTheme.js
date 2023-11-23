import {useColorScheme} from 'react-native';
import {MD2DarkTheme,configureFonts, MD2LightTheme} from 'react-native-paper';

const FIREHOSE_RED = '#B71C1C';

export default function useTheme() {
  const colorScheme = useColorScheme();

  const baseTheme = colorScheme === 'dark' ? MD2DarkTheme : MD2LightTheme;
  const fontConfig = {
    default: {
      regular: {
        fontFamily: 'SolaimanLipi',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'SolaimanLipi',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'SolaimanLipi',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'SolaimanLipi',
        fontWeight: 'normal',
      },
    },
  };
//   const fontConfig = {
//     ios: _fontConfig,
//     android: _fontConfig,
//     web : _fontConfig,
// };

  const theme = {
    ...baseTheme,
   fonts: configureFonts(fontConfig),
    colors: {
      ...baseTheme.colors,
      primary: FIREHOSE_RED,
    },
  };

  return theme;
}

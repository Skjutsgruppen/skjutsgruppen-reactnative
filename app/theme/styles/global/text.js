import { StyleSheet } from 'react-native';
import { text } from '@theme/colors';

const TextStyles = StyleSheet.create({
  light: {
    color: text.gray,
  },
  pink: {
    color: text.pink,
  },
  blue: {
    color: text.blue,
  },
  bold: {
    fontWeight: 'bold',
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default TextStyles;

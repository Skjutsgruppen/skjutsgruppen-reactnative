import { StyleSheet } from 'react-native';
import { Colors } from '@theme';

const StartStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginHorizontal: 20,
    marginTop: '15%',
    marginBottom: '5%',
  },
  block: {
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    padding: '8%',
    marginHorizontal: 20,
    marginBottom: '8%',
    elevation: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  label: {
    color: Colors.text.blue,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default StartStyles;

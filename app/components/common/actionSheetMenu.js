import { StyleSheet } from 'react-native';
import { Colors } from '@theme';

const actionSheetMenu = {
  body: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
  },
  buttonBox: {
    height: 50,
    marginTop: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  titleBox: {
    height: 50,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  cancelButtonBox: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 12,
  },
  actionTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.black,
  },
  actionLabel: {
    textAlign: 'center',
    fontSize: 18,
    color: '#007AFF',
  },
  actionItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.98)',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    height: 26,
    resizeMode: 'contain',
    marginRight: 12,
  },
};
export default actionSheetMenu;

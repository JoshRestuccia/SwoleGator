import { Platform, StyleSheet} from "react-native";
import {Colors} from 'react-native/Libraries/NewAppScreen'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  graphContainer:{
    alignItems:'center',
    flex: 1,
    flexDirection:'column',
    justifyContent:'center',
    backgroundColor:'skyblue'
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#eee",
    borderBottomColor: "#ccc",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeaderText: {
    fontWeight: "bold",
  },
  buttonContainer:{
    flex: 0.2,
    alignContent:'center',
    justifyContent:'center',
    backgroundColor: 'skyblue'
  },
  refreshButton: {
    flex: 1,
    margin: 20,
    marginBottom:30,
    justifyContent: 'center',
    backgroundColor: '#0a398a',
    borderRadius: 20
  },
  refreshButtonText: {
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 0.25,
    color: Colors.white,
  },
  item: {
    backgroundColor: "#fff",
    borderBottomColor: "#ccc",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    ...Platform.select({
      ios: { marginLeft: 15, paddingRight: 15, paddingVertical: 15 },
      android: { padding: 15 },
    }),
  },
  itemText: {
    fontSize: 20,
  },
});

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#012E40",
  },
  wrapperHeader: {
    paddingHorizontal: 20,
  },
  headerMain: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flatlistContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  calendarContainer: {
    flex: 2.5,
    marginTop: 15,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#081e27",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  header: {
    flexDirection: "row",
    paddingLeft: 10,
    marginTop: 10,
  },
  plantaoTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    paddingLeft: 10,
  },
  expandIcon: {
    marginLeft: 10,
    marginTop: 5,
  },
  noPlantaoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    alignItems: "center",
  },
  noPlantaoText: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
});

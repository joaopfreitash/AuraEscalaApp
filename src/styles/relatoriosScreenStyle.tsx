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
  headerContainer: {
    marginTop: 20,
  },
  header: {
    width: "100%",
    paddingHorizontal: 10,
  },
  relatorioTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    flex: 0.8,
    justifyContent: "center",
    gap: 15,
  },
  buttonsItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#01354A",
    marginVertical: 5,
    borderRadius: 25,
    width: "100%",
  },
  buttonsText: {
    color: "#fff",
    fontSize: 16,
  },
});

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  containerPai: {
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
  medicosContainer: {
    marginTop: 20,
    flex: 1,
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  medicosTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
  },
  errorMessage: {
    color: "#bf3d3d",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  searchContainerPai: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchBarContainer: {
    display: "flex",
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 40,
    marginBottom: 10,
    color: "white",
  },
  cancelarContainer: {
    marginBottom: 11,
  },
  cancelButton: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
  iconSearch: {
    position: "absolute",
    left: 25,
    top: 11,
  },
  containerPaiFiltros: {
    paddingHorizontal: 10,
    marginTop: 5,
  },
  textStyle: {
    fontSize: 17,
  },
  medicoItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    backgroundColor: "#103d4a",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  medicoAvatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginRight: 10,
  },
  nomePermContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flex: 1.5,
  },
  medicoNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  permissaoMedico: {
    fontSize: 12,
    color: "#bfb9a6",
  },
  quantosPlantoes: {
    flex: 0.6,
    display: "flex",
    flexDirection: "row",
    fontSize: 12,
    color: "#bfb9a6",
    alignItems: "center",
  },
});

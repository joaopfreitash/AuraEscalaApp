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
  plantaoContainer: {
    flex: 1,
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    marginTop: 20,
  },
  headerTitle: {
    display: "flex",
    flexDirection: "column",
  },
  plantaoTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  flatListContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  finalizarPlantaoContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 10,
    opacity: 0.3,
    marginBottom: 10,
  },
  plantaoItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  selectedPlantaoItem: {
    opacity: 0.3,
  },
  checkIconContainer: {
    position: "absolute",
    right: 10,
    top: "25%",
    padding: 5,
  },
  modalContent: {
    backgroundColor: "#012E40",
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginTop: 40,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 35,
    width: "100%",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
  },
  containerPlantaoSelected: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  observacoesContainer: {
    marginTop: 15,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  obsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    width: "100%",
    justifyContent: "center",
  },
  inputText: {
    color: "#ccc",
    fontSize: 15,
  },
  confirmarButton: {
    backgroundColor: "#111827",
    display: "flex",
    width: "100%",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  confirmarButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 24,
  },
  buttonDisabled: {
    backgroundColor: "#ddd",
    opacity: 0.2,
  },
  buttonTextDisabled: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 24,
  },
  noPlantaoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    alignItems: "center",
  },
  noPlantaoText: {
    color: "#bf3d3d",
    fontSize: 16,
    textAlign: "center",
  },
  plantaoSubTitle: {
    fontSize: 12,
    color: "#ffffff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  containerConcluidas: {
    paddingHorizontal: 10,
  },
});

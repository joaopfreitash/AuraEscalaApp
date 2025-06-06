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
  headerFilhoContainer: {
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
  containerConcluidas: {
    paddingHorizontal: 10,
  },
  flatListContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  plantaoTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  plantaoSubTitle: {
    fontSize: 12,
    color: "#ffffff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  plantaoItem: {
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
  mainContainer: {
    flexDirection: "row",
    display: "flex",
    flex: 1,
    marginRight: 10,
    paddingRight: 18,
    borderRightWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  containerIcons: {
    flexDirection: "column",
    alignItems: "center",
    gap: 3.5,
  },
  containerInfos: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
  },
  medicoContainer: {
    display: "flex",
    alignItems: "center",
    flex: 2,
  },
  containerFlex: {
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  plantaoDate: {
    fontSize: 13,
    color: "#59994e",
  },
  plantaoTurno: {
    fontSize: 13,
    color: "#ffffff",
  },
  plantaoMedico: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
    alignSelf: "flex-start",
  },
  plantaoFuncao: {
    alignSelf: "center",
    fontSize: 13,
    color: "#bfb9a6",
  },
  plantaoLocal: {
    fontSize: 13,
    color: "#ffffff",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#59994e",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    zIndex: 999,
  },
  addButtonText: {
    fontSize: 25,
    color: "#030302",
    fontWeight: "bold",
    paddingBottom: 5,
  },
  modalContent: {
    backgroundColor: "#012E40",
    padding: 20,
    alignItems: "center",
    height: "95%",
    position: "absolute",
    bottom: 0,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
  },
  containerDataHora: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  buttonSeletor: {
    borderWidth: 0.5,
    borderColor: "#c1c4c9",
    borderRadius: 12,
    paddingVertical: 12,
    width: 100,
    alignItems: "center",
    marginTop: 20,
  },
  textDateTimePicker: {
    color: "white",
  },
  inputText: {
    fontSize: 17,
  },
  placeholderText: {
    color: "#191a1c",
    fontSize: 13,
  },
  inputLabel: {
    position: "absolute",
    left: 10,
    color: "#ccc",
  },
  filledText: {
    color: "#000",
  },
  iconEdit: {
    position: "absolute",
    right: 10,
    top: "25%",
  },
  containerHora: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  containerMedico: {
    width: "100%",
    height: 50,
  },
  containerFuncao: {
    width: "100%",
    height: 50,
  },
  containerLocal: {
    width: "100%",
    height: 50,
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
  confirmarPlantaoButton: {
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
  confirmarPlantaoText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 24,
  },
  betweenInput: {
    marginTop: 15,
    marginBottom: 15,
  },
  concluidoText: {
    color: "green",
    fontSize: 13,
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
  errorMessage: {
    color: "#bf3d3d",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  dropdown: {
    height: "100%",
    borderColor: "#c1c4c9",
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 12,
    width: "100%",
  },
  dropdownList: {
    borderRadius: 12,
    paddingBottom: 7,
    paddingTop: 7,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 12,
  },
  placeholderStyle: {
    color: "white",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "white",
    fontSize: 16,
  },
  label: {
    position: "absolute",
    backgroundColor: "#012E40",
    left: 22,
    top: -8,
    zIndex: 999,
    fontSize: 14,
  },
  labelFixa: {
    position: "absolute",
    backgroundColor: "#012E40",
    color: "#59994e",
    left: 22,
    top: -8,
    zIndex: 999,
    fontSize: 14,
  },
  labelData: {
    position: "absolute",
    backgroundColor: "#012E40",
    left: 70,
    top: 11,
    zIndex: 999,
    fontSize: 14,
  },
  labelDataFixa: {
    position: "absolute",
    backgroundColor: "#012E40",
    color: "#59994e",
    left: 70,
    top: 11,
    zIndex: 999,
    fontSize: 14,
  },
  labelHora: {
    position: "absolute",
    backgroundColor: "#012E40",
    right: 100,
    top: 11,
    zIndex: 999,
    fontSize: 14,
  },
  labelHoraFixa: {
    position: "absolute",
    backgroundColor: "#012E40",
    color: "#59994e",
    right: 100,
    top: 11,
    zIndex: 999,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContentSpinner: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  confirmButton: {
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
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 24,
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
  },
  popup: {
    position: "absolute",
    bottom: 85,
    right: 20,
    elevation: 5, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  popupText: {
    fontSize: 16,
    color: "#fff",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fundo semi-transparente
    justifyContent: "center",
    alignItems: "center",
  },
  popupButton: {
    backgroundColor: "#081e27",
    display: "flex",
    width: "100%",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
    zIndex: 999,
  },
  scrollContainer: {
    width: "100%",
    flex: 1,
  },
  viewCard: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  trashButton: {
    marginLeft: 15,
    marginTop: 20,
  },
  escalaButton: {
    flexDirection: "row",
    flex: 2,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#081e27",
    display: "flex",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  escalaText: {
    fontSize: 16,
    color: "white",
  },
  escalaContent: {
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonFixa: {
    marginTop: 10,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 20,
    alignItems: "center",
    width: "20%",
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentCalendario: {
    width: "90%",
    maxHeight: "90%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#012E40",
  },
  modalTitleCalendario: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  dropdownEscalaFixa: {
    borderWidth: 0.5,
    borderColor: "#c1c4c9",
    borderRadius: 12,
    paddingVertical: 12,
    width: 100,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  textDropDownCalendario: {
    color: "white",
  },
  modalContentFixa: {
    backgroundColor: "#012E40",
    alignItems: "center",
    height: "95%",
    position: "absolute",
    bottom: 0,
    padding: 20,
  },
  confirmButtonFixa: {
    backgroundColor: "#111827",
    display: "flex",
    width: "100%",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 50,
  },
  textConfirmButtonDisabled: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 24,
  },
  textConfirmButtonEnabled: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 24,
  },
  modalAtencaoContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    maxHeight: 500,
  },
  modalAtencaoTitle: {
    fontSize: 18,
    color: "#bf3d3d",
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalAtencaoMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  selectedItemStyle: {
    borderRadius: 12,
  },
});

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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: "80%",
  },
  headerModal: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    alignItems: "flex-start",
  },
  selecioneContainer: {
    margin: 10,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#111827",
    display: "flex",
    width: "100%",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  inputBoxPickerMes: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: "#d1d8e3",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#191a1c",
    fontSize: 13,
  },
  inputText: {
    fontSize: 17,
  },
  dropDownListContainerMes: {
    maxHeight: 250,
  },
  buttonSeletor: {
    borderColor: "#c1c4c9",
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 12,
    width: "100%",
    marginBottom: 15,
  },
  containerMes: {
    width: "100%",
    height: 50,
    marginBottom: 15,
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
  placeholderStyle: {
    color: "black",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "black",
    fontSize: 16,
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
  selectedItemStyle: {
    borderRadius: 12,
  },
});

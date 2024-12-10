import { StyleSheet } from 'react-native';

export default StyleSheet.create({
containerPai: {
    flex: 1,
    backgroundColor: '#012E40',
  },
  medicosContainer: {
    marginTop: 20,
    flex: 1
  },
  flatListContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  medicosTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  errorMessage: {
    color: "#bf3d3d",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  searchContainerPai:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  searchBarContainer: {
    display: 'flex',
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 40,
    marginBottom: 10,
    color: 'white'
  },
  cancelarContainer: {
    marginBottom: 11,
  },
  cancelButton: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  iconSearch: {
    position: 'absolute',
    left: 25,
    top: 11
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#59994e',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  addButtonText: {
    fontSize: 25,
    color: '#030302',
    fontWeight: 'bold',
    paddingBottom: 5
  },
  modalContent: {
    backgroundColor: '#012E40',
    padding: 20,
    alignItems: 'center',
    height: '88.55%',
    position: 'absolute',
    bottom: 0
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 35,
    width: '100%',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  containerNome: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  inputBox: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#d1d8e3',
  },
  textStyle: {
    fontSize: 17,
  },
  placeholderStyleNome: {
    color: '#191a1c',
    fontSize: 13,
  },
  placeholderStyleEndereco: {
    color: '#191a1c',
    fontSize: 13,
  },
  inputLabel: {
    position: 'absolute',
    left: 10,
    color: '#ccc',
  },
  iconEdit: {
    position: 'absolute',
    right: 10,
    top: '25%',
  },
  containerEndereço: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  confirmarPlantaoButton: {
    backgroundColor: '#111827',
    display: 'flex',
    width: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
    opacity: 0.2
  },
  buttonTextDisabled: {
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  confirmarPlantaoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  hospitalItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#103d4a',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  nomeEnderecoContainer: {
    display: 'flex',
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    flex: 1.5,
  },
  hospitalNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  hospitalEndereco: {
    fontSize: 12,
    color: '#bfb9a6',
  },
  permissaoMedico: {
    fontSize: 12,
    color: '#bfb9a6',
  },
  quantosPlantoes: {
    flex: 0.5,
    display: 'flex',
    flexDirection: 'row',
    fontSize: 12,
    color: '#bfb9a6',
    alignItems: 'center',
  },
  betweenInput: {
    marginTop: 15,
    marginBottom: 15,
  },
});
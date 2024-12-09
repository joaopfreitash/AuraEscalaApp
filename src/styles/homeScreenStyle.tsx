import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012E40',
  },
  flatlistContainer:{
    width: '100%',
    paddingHorizontal: 10,
  },
  calendarContainer: {
    flex: 2.5,
    marginTop: 15,
  },
  listContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  plantaoTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    paddingLeft: 10,
  },
  expandIcon: {
    marginLeft: 10,
  },
  plantaoItem: {
    flexDirection: 'row',
    margin: 5,
    backgroundColor: '#1A4D5C',
    padding: 10,
    borderRadius: 8,
  },
  dataHoraContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 10,
  },
  medicoContainer: {
    flex: 2,
    alignItems: 'center',
  },
  plantaoDate: { fontSize: 13, color: '#59994e' },
  plantaoTurno: { fontSize: 13, color: '#ffffff' },
  plantaoLocal: { fontSize: 13, color: '#ffffff' },
  noPlantaoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center'
  },
  plantaoMedico: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  plantaoFuncao: {
    fontSize: 13,
    color: '#bfb9a6'
  },
  noPlantaoText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  containerIcons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3
  },
  containerInfos: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1.5
  },
  
});

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        position: 'absolute',
        bottom: '50%'
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
      },
      closeButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#012E40',
        borderRadius: 5,
      },
      closeButtonText: {
        color: '#fff',
        fontSize: 16,
      },
});

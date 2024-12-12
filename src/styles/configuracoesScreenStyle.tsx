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
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  userName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
  role: {
    fontSize: 10,
    color: "#fff",
    marginBottom: 25,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderColor: "#fff",
    marginBottom: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#01354A",
    marginVertical: 5,
    borderRadius: 25,
    width: "100%",
  },
  settingText: {
    color: "#fff",
    fontSize: 16,
  },
  sairContainer: {
    paddingHorizontal: 20,
    flex: 0.9,
    justifyContent: "flex-end",
  },
  sairButton: {
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
  },
});

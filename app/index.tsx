import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useUser } from "../contexts/UserContext";

export default function Settings() {
  const { userRole, toggleRole } = useUser();

  const clearAllData = async () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all properties and tenants. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("@properties");
              await AsyncStorage.removeItem("@tenants");
              await AsyncStorage.removeItem("@maintenance_requests");
              await AsyncStorage.removeItem("@rent_payments");
              Alert.alert("Success", "All data has been cleared!");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
              console.error("Error clearing data:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {/* Role Switcher */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Role</Text>
        <Text style={styles.currentRole}>
          Currently: {userRole === 'landlord' ? 'Landlord' : 'Tenant'}
        </Text>
        <Pressable style={styles.roleButton} onPress={toggleRole}>
          <Text style={styles.roleButtonText}>
            Switch to {userRole === 'landlord' ? 'Tenant' : 'Landlord'}
          </Text>
        </Pressable>
      </View>

      {/* Clear Data Button */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <Pressable style={styles.clearButton} onPress={clearAllData}>
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f1f2f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    marginTop: 60,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  currentRole: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  roleButton: {
    backgroundColor: "#6D46C9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  roleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

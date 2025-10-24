// app/landlord_properties_details.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import uuid from "react-native-uuid";
import FormSection from "../components/FormSection";
import ImagePickerSection from "../components/ImagePickerSection";
import LabeledInput from "../components/LabeledInput";
import Modal from "../components/Modal";
import PickerButton from "../components/PickerButton";
import PrimaryButton from "../components/PrimaryButton";
import { Property, Tenant } from "../types/models";

export default function PropertyDetails() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showTenantPicker, setShowTenantPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const scrollRef = useRef<ScrollView>(null);

  // Load tenants for the picker
  useEffect(() => {
    async function loadTenants() {
      const raw = await AsyncStorage.getItem("@tenants");
      if (raw) {
        setTenants(JSON.parse(raw));
      }
    }
    loadTenants();
  }, []);

  // Load property if editing
  useEffect(() => {
    async function loadProperty() {
      if (!id) return;
      const raw = await AsyncStorage.getItem("@properties");
      if (!raw) return;
      const list: Property[] = JSON.parse(raw);
      const property = list.find((p) => p.id === id);
      if (property) {
        setName(property.name);
        setAddress(property.address);
        setTenantId(property.tenantId);
        setImageUri(property.imageUri);
      }
    }
    loadProperty();
  }, [id]);

  const selectedTenant = tenants.find((t) => t.id === tenantId);

  const onSave = async () => {
    if (!name.trim()) {
      // Error haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Required Field", "Please enter a property name before saving.");
      return;
    }

    // Light haptic feedback when starting to save
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      const record: Property = {
        id: isEditing ? id! : String(uuid.v4()),
        name: name.trim(),
        address: address.trim(),
        tenantId,
        imageUri,
      };

      const existing = await AsyncStorage.getItem("@properties");
      const list: Property[] = existing ? JSON.parse(existing) : [];
      
      if (isEditing) {
        const updatedList = list.map((p) => (p.id === id ? record : p));
        await AsyncStorage.setItem("@properties", JSON.stringify(updatedList));
      } else {
        list.push(record);
        await AsyncStorage.setItem("@properties", JSON.stringify(list));
      }

      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Show success alert with haptic
      Alert.alert(
        "Success!",
        isEditing 
          ? "Property updated successfully!" 
          : "Property created successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              if (isEditing) {
                router.replace('/landlord_properties');
              } else {
                router.replace('/landlord_properties');
              }
            }
          }
        ]
      );
    } catch (error) {
      // Error haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        "Error",
        "Failed to save property. Please try again.",
        [{ text: "OK" }]
      );
      console.error("Error saving property:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Permission Required", "Permission to access photos is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.9,
      aspect: [16, 9],
    });
    if (!result.canceled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Permission Required", "Camera permission is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
      aspect: [16, 9],
    });
    if (!result.canceled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Basic Information Section */}
          <FormSection 
            title="Property Information" 
            description="Enter the basic details about this property"
          >
            <LabeledInput
              label="Property Name"
              value={name}
              onChangeText={setName}
              placeholder="Sunset Apartments"
              required
            />
            
            <LabeledInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="123 Main St, City, State 12345"
              description="Include street address, city, state, and zip code"
            />
          </FormSection>

          {/* Tenant Assignment Section */}
          <FormSection 
            title="Tenant Assignment" 
            description="Assign a tenant to this property (optional)"
          >
            <PickerButton
              label="Current Tenant"
              value={selectedTenant?.name || ""}
              placeholder="Select a tenant (optional)"
              onPress={() => setShowTenantPicker(true)}
            />
            
            {tenantId && (
              <Pressable 
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTenantId(null);
                }}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Remove Tenant Assignment</Text>
              </Pressable>
            )}
          </FormSection>

          {/* Property Image Section */}
          <FormSection 
            title="Property Image" 
            description="Add a photo of the property"
          >
            <ImagePickerSection
              imageUri={imageUri}
              onPickLibrary={pickFromLibrary}
              onTakePhoto={takePhoto}
              onClearImage={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setImageUri(null);
              }}
            />
          </FormSection>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={isEditing ? "Update Property" : "Create Property"}
              onPress={onSave}
              loading={isLoading}
              variant="success"
            />
          </View>
        </View>
      </ScrollView>

      {/* Tenant Picker Modal */}
      <Modal
        visible={showTenantPicker}
        onClose={() => setShowTenantPicker(false)}
        title="Select Tenant"
      >
        <FlatList
          data={tenants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tenantItem}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTenantId(item.id);
                setShowTenantPicker(false);
              }}
            >
              <View style={styles.tenantInfo}>
                <Text style={styles.tenantName}>{item.name}</Text>
                <Text style={styles.tenantDetails}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No tenants available. Add tenants first.
              </Text>
            </View>
          }
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scroll: { 
    flex: 1,
  },
  container: { 
    padding: 20,
    paddingBottom: 40,
  },
  clearButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fef2f2",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  clearButtonText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
  tenantItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  tenantDetails: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
});
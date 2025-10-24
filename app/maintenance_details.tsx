// app/maintenance_details.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
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
import { useUser } from "../contexts/UserContext";
import { MaintenanceRequest, Property, Tenant } from "../types/models";

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#16a34a', description: 'Minor issues that can wait' },
  { value: 'medium', label: 'Medium', color: '#d97706', description: 'Standard maintenance needs' },
  { value: 'high', label: 'High', color: '#ea580c', description: 'Important issues requiring attention' },
  { value: 'urgent', label: 'Urgent', color: '#dc2626', description: 'Critical issues needing immediate attention' },
];

export default function MaintenanceDetailsScreen() {
  const router = useRouter();
  const { userRole } = useUser();
  const { id, edit } = useLocalSearchParams<{ id?: string; edit?: string }>();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [propertyId, setPropertyId] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showPropertyPicker, setShowPropertyPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = !!id && edit === "true";
  const canEdit = userRole === 'tenant' && (isEditing || !id);
  const scrollRef = useRef<ScrollView>(null);

  // Load data
  useEffect(() => {
    async function loadData() {
      const [propertiesRaw, tenantsRaw] = await Promise.all([
        AsyncStorage.getItem("@properties"),
        AsyncStorage.getItem("@tenants"),
      ]);
      
      if (propertiesRaw) setProperties(JSON.parse(propertiesRaw));
      if (tenantsRaw) setTenants(JSON.parse(tenantsRaw));
    }
    loadData();
  }, []);

  // Load existing request if editing
  useEffect(() => {
    async function loadRequest() {
      if (!id) return;
      
      const raw = await AsyncStorage.getItem("@maintenance_requests");
      if (!raw) return;
      
      const requests: MaintenanceRequest[] = JSON.parse(raw);
      const request = requests.find((r) => r.id === id);
      
      if (request) {
        setTitle(request.title);
        setDescription(request.description);
        setPriority(request.priority);
        setPropertyId(request.propertyId);
        setImageUri(request.imageUri || null);
      }
    }
    loadRequest();
  }, [id]);

  const selectedProperty = properties.find((p) => p.id === propertyId);
  const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === priority);

  const onSave = async () => {
    if (!title.trim()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Required Field", "Please enter a title for the maintenance request.");
      return;
    }
    
    if (!description.trim()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Required Field", "Please enter a description for the maintenance request.");
      return;
    }

    if (!propertyId) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Required Field", "Please select a property.");
      return;
    }

    // Light haptic feedback when starting to save
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      const existing = await AsyncStorage.getItem("@maintenance_requests");
      const requests: MaintenanceRequest[] = existing ? JSON.parse(existing) : [];

      if (isEditing) {
        // Update existing request
        const updatedRequests = requests.map((req) =>
          req.id === id
            ? {
                ...req,
                title: title.trim(),
                description: description.trim(),
                priority,
                propertyId,
                imageUri,
                updatedAt: new Date().toISOString(),
              }
            : req
        );
        await AsyncStorage.setItem("@maintenance_requests", JSON.stringify(updatedRequests));
      } else {
        // Create new request
        const newRequest: MaintenanceRequest = {
          id: String(uuid.v4()),
          title: title.trim(),
          description: description.trim(),
          priority,
          status: 'pending',
          tenantId: tenants[0]?.id || 'default-tenant',
          propertyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          imageUri,
        };
        
        requests.push(newRequest);
        await AsyncStorage.setItem("@maintenance_requests", JSON.stringify(requests));
      }

      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Show success alert
      Alert.alert(
        "Success!",
        isEditing 
          ? "Maintenance request updated successfully!" 
          : "Maintenance request submitted successfully!",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      // Error haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        "Error",
        "Failed to save maintenance request. Please try again.",
        [{ text: "OK" }]
      );
      console.error("Error saving maintenance request:", error);
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
    });
    if (!result.canceled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setImageUri(result.assets[0].uri);
    }
  };

  if (!canEdit) {
    return (
      <View style={styles.readOnlyContainer}>
        <Text style={styles.readOnlyText}>
          {userRole === 'landlord' 
            ? 'You can only view maintenance requests as a landlord.' 
            : 'You do not have permission to edit this request.'
          }
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
           
          {/* Request Details Section */}
          <FormSection 
            title="Request Details" 
            description="Describe the maintenance issue you're experiencing"
          >
            <LabeledInput
              label="Issue Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Leaky faucet in kitchen"
              required
            />

            <LabeledInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the issue in detail..."
              textarea
              required
              description="Provide as much detail as possible to help with the repair"
            />
          </FormSection>

          {/* Priority and Property Section */}
          <FormSection 
            title="Priority & Location" 
            description="Set the priority level and select the property"
          >
            <PickerButton
              label="Priority Level"
              value={selectedPriority?.label || ""}
              placeholder="Select priority"
              onPress={() => setShowPriorityPicker(true)}
            />

            <PickerButton
              label="Property"
              value={selectedProperty?.name || ""}
              placeholder="Select property"
              onPress={() => setShowPropertyPicker(true)}
            />
          </FormSection>

          {/* Photo Section */}
          <FormSection 
            title="Photo Evidence" 
            description="Add photos to help illustrate the issue"
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
              title={isEditing ? "Update Request" : "Submit Request"}
              onPress={onSave}
              loading={isLoading}
              variant="success"
            />
          </View>
        </View>
      </ScrollView>

      {/* Priority Picker Modal */}
      <Modal
        visible={showPriorityPicker}
        onClose={() => setShowPriorityPicker(false)}
        title="Select Priority"
      >
        {PRIORITY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.optionItem}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPriority(option.value as any);
              setShowPriorityPicker(false);
            }}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <View style={[styles.priorityDot, { backgroundColor: option.color }]} />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Modal>

      {/* Property Picker Modal */}
      <Modal
        visible={showPropertyPicker}
        onClose={() => setShowPropertyPicker(false)}
        title="Select Property"
      >
        {properties.map((property) => (
          <TouchableOpacity
            key={property.id}
            style={styles.optionItem}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPropertyId(property.id);
              setShowPropertyPicker(false);
            }}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{property.name}</Text>
              <Text style={styles.optionDescription}>{property.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  readOnlyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  readOnlyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 20,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 5,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  optionDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
});
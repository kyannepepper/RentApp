// app/landlord_tenants_details.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import uuid from "react-native-uuid";
import FormSection from "../components/FormSection";
import ImagePickerSection from "../components/ImagePickerSection";
import LabeledInput from "../components/LabeledInput";
import PrimaryButton from "../components/PrimaryButton";
import { Tenant } from "../types/models";

export default function TenantDetails() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    async function loadTenant() {
      if (!id) return;
      const raw = await AsyncStorage.getItem("@tenants");
      if (!raw) return;
      const list: Tenant[] = JSON.parse(raw);
      const tenant = list.find((t) => t.id === id);
      if (tenant) {
        setName(tenant.name);
        setNumber(tenant.number);
        setEmail(tenant.email);
        setImageUri(tenant.imageUri);
      }
    }
    loadTenant();
  }, [id]);

  const onSave = async () => {
    if (!name.trim()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Required Field", "Please enter a name before saving.");
      return;
    }

    if (!email.trim()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Required Field", "Please enter an email address before saving.");
      return;
    }

    // Light haptic feedback when starting to save
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      const record: Tenant = {
        id: isEditing ? id! : String(uuid.v4()),
        name: name.trim(),
        number: number.trim(),
        email: email.trim(),
        imageUri,
      };

      const existing = await AsyncStorage.getItem("@tenants");
      const list: Tenant[] = existing ? JSON.parse(existing) : [];
      
      if (isEditing) {
        const updatedList = list.map((t) => (t.id === id ? record : t));
        await AsyncStorage.setItem("@tenants", JSON.stringify(updatedList));
      } else {
        list.push(record);
        await AsyncStorage.setItem("@tenants", JSON.stringify(list));
      }

      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Show success alert with haptic
      Alert.alert(
        "Success!",
        isEditing 
          ? "Tenant updated successfully!" 
          : "Tenant created successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              if (isEditing) {
                router.replace('/landlord_tenants');
              } else {
                router.replace('/landlord_tenants');
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
        "Failed to save tenant. Please try again.",
        [{ text: "OK" }]
      );
      console.error("Error saving tenant:", error);
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
      aspect: [1, 1],
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
      aspect: [1, 1],
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
          {/* Personal Information Section */}
          <FormSection 
            title="Personal Information" 
            description="Enter the tenant's basic contact details"
          >
            <LabeledInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="John Smith"
              required
            />
            
            <LabeledInput
              label="Phone Number"
              value={number}
              onChangeText={setNumber}
              placeholder="(555) 123-4567"
              description="Include area code for better contact"
            />

            <LabeledInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="john.smith@email.com"
              required
              description="Used for important notifications and communication"
            />
          </FormSection>

          {/* Profile Photo Section */}
          <FormSection 
            title="Profile Photo" 
            description="Add a photo of the tenant"
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
              title={isEditing ? "Update Tenant" : "Create Tenant"}
              onPress={onSave}
              loading={isLoading}
              variant="success"
            />
          </View>
        </View>
      </ScrollView>
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
  buttonContainer: {
    marginTop: 20,
  },
});
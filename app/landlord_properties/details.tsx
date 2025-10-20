import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import uuid from "react-native-uuid";
import ImagePickerSection from "../../components/ImagePickerSection";
import LabeledInput from "../../components/LabeledInput";


export default function Details() {

  const [complex, setComplex] = useState("");
  const [property, setProperty] = useState("");
  const [tenant, setTenant] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [rent, setRent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);


  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    async function loadTenant() {
      if (!id) return;
      const raw = await AsyncStorage.getItem("@tenants");
      if (!raw) return;
      const list = JSON.parse(raw);
      const tenant = list.find((t: any) => String(t.id) === String(id));
      if (tenant) {
        setName(tenant.name);
        setNumber(tenant.number);
        setEmail(tenant.email);
        setImageUri(tenant.imageUri);
      }
    }
    loadTenant();
  }, [id]);

  const onSaveNew = async () => {
    if (!name.trim()) {
      alert("Please enter a name before saving.");
      return;
    }
    const record = {
      id: String(uuid.v4()),
      name: name.trim(),
      number: number.trim(),
      email: email.trim(),
      imageUri,
    };
    const existing = await AsyncStorage.getItem("@tenants");
    const list = existing ? JSON.parse(existing) : [];
    list.push(record);
    await AsyncStorage.setItem("@tenants", JSON.stringify(list));
    
  };


  const onSaveEdits = async () => {
    if (!id) return;
    const existing = await AsyncStorage.getItem("@tenants");
    let list = existing ? JSON.parse(existing) : [];
    let updated = false;

    list = list.map((t: any) => {
      if (String(t.id) === String(id)) {
        updated = true;
        return {
          ...t,
          name: name.trim(),
          number: number.trim(),
          email: email.trim(),
          imageUri,
        };
      }
      return t;
    });

    if (!updated) {
      alert("Could not find this item to update.");
      return;
    }

    await AsyncStorage.setItem("@tenants", JSON.stringify(list));
    
  };

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Permission to access photos is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.9,
      aspect: [1, 1],
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      alert("Camera permission is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };


  return (
    <View style={[styles.screen]}>
      <ScrollView ref={scrollRef} style={styles.scroll}>
        <View style={styles.body}>
          <LabeledInput label="Name" value={name} onChangeText={setName} placeholder="John Hanks" />
          
          <LabeledInput
            label="Phone Number"
            value={number}
            onChangeText={setNumber}
            placeholder="(000) 000 - 000"
          />

          <LabeledInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="john@example.com"
          />
          
          <ImagePickerSection
            imageUri={imageUri}
            onPickLibrary={pickFromLibrary}
            onTakePhoto={takePhoto}
            onClearImage={() => setImageUri(null)}
          />

          <Pressable
            onPress={isEditing ? onSaveEdits : onSaveNew}
            style={[styles.saveButton,]}
          >
            <Text style={[styles.saveText, ]}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
    screen: { flex: 1 },
    scroll: { flex: 1 },
    body: { margin: 40 },
    saveButton: {
      marginTop: 20,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 5,
      alignItems: "center",
    },
    saveText: { fontWeight: "600" },
  });
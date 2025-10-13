// app/landlord_properties/edit.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function EditPropertyScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    complex?: string;
    property?: string;
    tenant?: string;
    beds?: string;
    baths?: string;
    sqft?: string;
    rent?: string;
  }>();
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={ () => router.push({
      pathname: "/landlord_properties"})}><Text>Go Back</Text></Pressable>
      <Text style={styles.title}>Property Info</Text>
      <View style={styles.card}>
        <Row label="ID" value={params.id} />
        <Row label="Complex" value={params.complex} />
        <Row label="Property" value={params.property} />
        <Row label="Tenant" value={params.tenant ? params.tenant : "Vacant"} />
        <Row label="Beds" value={params.beds} />
        <Row label="Baths" value={params.baths} />
        <Row label="Sqft" value={params.sqft} />
        <Row label="Rent" value={params.rent} />
      </View>

      {/* Placeholder image preview, if you want to pass it later */}
      {/* <Image source={{ uri: params.imageUrl as string }} style={styles.image} /> */}
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16, backgroundColor: "#f1f2f4", flexGrow: 1, paddingTop: 80 },
  title: { fontSize: 20, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontWeight: "600", color: "#374151" },
  value: { color: "#111827" },
  image: { width: "100%", height: 180, borderRadius: 12 },
});

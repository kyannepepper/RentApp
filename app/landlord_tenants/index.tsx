// app/landlord_properties/index.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import AddButton from "../../components/AddButton";
import PropertyCard, { type TenantCardProps } from "../../components/TenantCard";

const DATA: TenantCardProps[] = [
  {
    id: "apt101",
    imageUrl: "https://picsum.photos/360/240?1",
    complex: "Sunset Apartments",
    tenantName: "Sarah Johnson",
    phone: "435-324-2345",
    email: "example@gmail.com"
  },
  {
    id: "unit202",
    imageUrl: "https://picsum.photos/360/240?2",
    complex: "Maple Heights",
    tenantName: "Jared Gardener",
    phone: "435-324-2345",
    email: "example@gmail.com"
  },
];

export default function LandlordPropertiesScreen() {
  const router = useRouter(); // ✅ move inside the component
  const [search, setSearch] = useState("");
    const goToAdd = () => {
        router.push({pathname: "/landlord_properties/edit"});
        console.log("Navigating to add property screen");
    };
  const filteredData = DATA.filter((item) => {
    const query = search.toLowerCase();
    return (
      (item.tenantName?.toLowerCase().includes(query) ?? false)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Manage Properties</Text>
      </View>

      <View style={styles.searchBox} pointerEvents="box-none">
        <TextInput
          placeholder="Search properties..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => <PropertyCard {...item} />}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No properties found</Text>}
        />
      </View>

      {/* FAB */}
      <AddButton onPress={goToAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f2f4",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
  },
  searchBox: {
    marginTop: 80,
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: { fontSize: 16 },
  title: { position: "absolute", top: 80, width: "85%" },
});

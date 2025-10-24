// app/landlord_tenants/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import AddButton from "../components/AddButton";
import SearchBar from "../components/SearchBar";
import PropertyCard, { type TenantCardProps } from "../components/TenantCard";

export default function LandlordPropertiesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tenants, setTenants] = useState<TenantCardProps[]>([]);

  // Load tenants from AsyncStorage
  const loadTenants = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("@tenants");
      if (raw) {
        const list = JSON.parse(raw);
        // Map your stored tenant data to the TenantCardProps format
        const mapped = list.map((tenant: any) => ({
          id: tenant.id,
          imageUrl: tenant.imageUri || "https://picsum.photos/360/240", // fallback image
          complex: "", // You may need to add this field to your tenant data
          tenantName: tenant.name,
          phone: tenant.number,
          email: tenant.email,
        }));
        setTenants(mapped);
      } else {
        setTenants([]);
      }
    } catch (error) {
      console.error("Error loading tenants:", error);
      setTenants([]);
    }
  }, []);

  // Load tenants when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTenants();
    }, [loadTenants])
  );

  const goToAdd = () => {
    router.push({ pathname: "/landlord_tenants_details" });
  };

  const filteredData = tenants.filter((item) => {
    const query = search.toLowerCase();
    return item.tenantName?.toLowerCase().includes(query) ?? false;
  });

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Manage Tenants</Text>
      </View>

      <SearchBar 
        value={search}
        onChangeText={setSearch}
        placeholder="Search tenants..."
        style={{ marginTop: 80 }}
      />

      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => <PropertyCard {...item} />}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No tenants found
            </Text>
          }
        />
      </View>

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
  title: { 
    position: "absolute", 
    top: 80, 
    width: "85%" 
  },
});
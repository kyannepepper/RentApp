// app/landlord_properties/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import AddButton from "../components/AddButton";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import { Property, Tenant } from "../types/models";

interface PropertyWithTenant extends Property {
  tenant?: Tenant;
}

export default function LandlordPropertiesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState<PropertyWithTenant[]>([]);

  const loadProperties = useCallback(async () => {
    try {
      // Uncomment the next 3 lines to clear all data on app start
      // await AsyncStorage.removeItem("@properties");
      // await AsyncStorage.removeItem("@tenants");
      // return;

      const [propertiesRaw, tenantsRaw] = await Promise.all([
        AsyncStorage.getItem("@properties"),
        AsyncStorage.getItem("@tenants"),
      ]);

      const propertyList: Property[] = propertiesRaw ? JSON.parse(propertiesRaw) : [];
      const tenantList: Tenant[] = tenantsRaw ? JSON.parse(tenantsRaw) : [];

      // Join properties with their tenants
      const propertiesWithTenants = propertyList.map((property) => ({
        ...property,
        tenant: property.tenantId 
          ? tenantList.find((t) => t.id === property.tenantId)
          : undefined,
      }));

      setProperties(propertiesWithTenants);
    } catch (error) {
      console.error("Error loading properties:", error);
      setProperties([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProperties();
    }, [loadProperties])
  );

  const goToAdd = () => {
    router.push({ pathname: "/landlord_properties_details" });
  };

  const filteredData = properties.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query) ||
      item.tenant?.name.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Manage Properties</Text>
      </View>

      <SearchBar 
        value={search}
        onChangeText={setSearch}
        placeholder="Search properties..."
        style={{ marginTop: 80 }}
      />

      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <PropertyCard
              id={item.id}
              imageUrl={item.imageUri || "https://picsum.photos/360/240"}
              complex={item.name}
              address={item.address}
              tenantName={item.tenant?.name}
              phone={item.tenant?.number}
              email={item.tenant?.email}
            />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No properties found
            </Text>
          }
        />
      </View>

      <AddButton onPress={goToAdd}/>
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
// app/maintenance.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddButton from "../components/AddButton";
import MaintenanceRequestCard from "../components/MaintenanceRequestCard";
import SearchBar from "../components/SearchBar";
import { useUser } from "../contexts/UserContext";
import { MaintenanceRequest, Property, Tenant } from "../types/models";

interface MaintenanceRequestWithDetails extends MaintenanceRequest {
  propertyName?: string;
  tenantName?: string;
}

export default function MaintenanceScreen() {
  const router = useRouter();
  const { userRole } = useUser();
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<MaintenanceRequestWithDetails[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [requestsRaw, propertiesRaw, tenantsRaw] = await Promise.all([
        AsyncStorage.getItem("@maintenance_requests"),
        AsyncStorage.getItem("@properties"),
        AsyncStorage.getItem("@tenants"),
      ]);

      const requestsList: MaintenanceRequest[] = requestsRaw ? JSON.parse(requestsRaw) : [];
      const propertiesList: Property[] = propertiesRaw ? JSON.parse(propertiesRaw) : [];
      const tenantsList: Tenant[] = tenantsRaw ? JSON.parse(tenantsRaw) : [];

      setProperties(propertiesList);
      setTenants(tenantsList);

      // Add property and tenant names to requests
      const requestsWithDetails = requestsList.map((request) => {
        const property = propertiesList.find((p) => p.id === request.propertyId);
        const tenant = tenantsList.find((t) => t.id === request.tenantId);
        
        return {
          ...request,
          propertyName: property?.name,
          tenantName: tenant?.name,
        };
      });

      // Filter requests based on user role
      if (userRole === 'tenant') {
        // For tenants, show only their own requests
        // For now, we'll show all requests since we don't have user authentication
        setRequests(requestsWithDetails);
      } else {
        // For landlords, show all requests
        setRequests(requestsWithDetails);
      }
    } catch (error) {
      console.error("Error loading maintenance data:", error);
      setRequests([]);
    }
  }, [userRole]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const goToAdd = () => {
    router.push({ pathname: "/maintenance_details" });
  };

  const canEdit = userRole === 'tenant';

  const filteredData = requests.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.propertyName?.toLowerCase().includes(query) ||
      item.tenantName?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>
          {userRole === 'landlord' ? 'Maintenance Requests' : 'My Maintenance Requests'}
        </Text>
      </View>

      <SearchBar 
        value={search}
        onChangeText={setSearch}
        placeholder="Search requests..."
        style={{ marginTop: 12 }}
      />

      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <MaintenanceRequestCard
              request={item}
              canEdit={canEdit}
              propertyName={item.propertyName}
              tenantName={userRole === 'landlord' ? item.tenantName : undefined}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {search 
                  ? 'No matching requests found'
                  : userRole === 'landlord' 
                    ? 'No maintenance requests yet' 
                    : 'No maintenance requests submitted yet'
                }
              </Text>
              {userRole === 'tenant' && !search && (
                <Text style={styles.emptySubtext}>
                  Tap the + button to submit a request
                </Text>
              )}
            </View>
          }
        />
      </View>

      {userRole === 'tenant' && <AddButton onPress={goToAdd} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f2f4",
    width: "100%",
    alignItems: "center",
    paddingBottom: 90, // so the AddButton doesn't overlap
  },
  title: {
    width: "85%",
    marginBottom: 12,
    marginTop: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});
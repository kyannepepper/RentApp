// app/_layout.tsx
import { Stack, usePathname } from "expo-router";
import NavBar from "../components/NavBar";
import { UserProvider } from "../contexts/UserContext";

function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Only show NavBar on main screens, not on details pages
  const showNavBar = !pathname?.includes('_details');
  
  return showNavBar ? <NavBar /> : null;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="landlord_properties" options={{ title: "Properties" }} />
        <Stack.Screen name="landlord_tenants" options={{ title: "Tenants" }} />
        <Stack.Screen name="pay_rent" options={{ title: "Pay Rent" }} />
        <Stack.Screen name="maintenance" options={{ title: "Maintenance" }} />
        <Stack.Screen name="index" options={{ title: "Settings" }} />
        <Stack.Screen 
          name="maintenance_details" 
          options={{ 
            headerShown: true,
            title: "Maintenance Request",
            presentation: "card",
            headerBackButtonDisplayMode: "minimal",
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="landlord_properties_details" 
          options={{ 
            headerShown: true,
            title: "Property Details",
            presentation: "card",
            headerBackButtonDisplayMode: "minimal",
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="landlord_tenants_details" 
          options={{ 
            headerShown: true,
            title: "Tenant Details",
            presentation: "card",
            headerBackButtonDisplayMode: "minimal",
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
      </Stack>
      <ConditionalNavBar />
    </UserProvider>
  );
}
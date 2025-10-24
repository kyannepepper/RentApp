// components/NavBar.tsx
import { usePathname, useRouter, type Href } from "expo-router";
import { Building2, CreditCard, Settings, User, Wrench } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../contexts/UserContext";

type TabName = "landlord_properties" | "pay_rent" | "tenants" | "maintenance" | "settings";

const ACTIVE = "#6D46C9";
const INACTIVE = "#70757c";

type Props = {
  onPress?: (tab: TabName) => void;
  style?: object;
};

export default function NavBar({ onPress, style }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole } = useUser();

  const landlordRoutes = {
    landlord_properties: "/landlord_properties" as Href,
    tenants: "/landlord_tenants" as Href,
    maintenance: "/maintenance" as Href,
    settings: "/" as Href,
  };

  const tenantRoutes = {
    pay_rent: "/pay_rent" as Href,
    maintenance: "/maintenance" as Href,
    settings: "/" as Href,
  };

  const go = (tab: TabName) => {
    if (onPress) return onPress(tab);
    
    if (userRole === 'landlord') {
      router.replace(landlordRoutes[tab as keyof typeof landlordRoutes]);
    } else {
      router.replace(tenantRoutes[tab as keyof typeof tenantRoutes]);
    }
  };

  const isActive = (routePath: Href) => {
  const pathString = typeof routePath === 'string' ? routePath : routePath.pathname;
  const cleanPath = pathString === "/" ? "/" : pathString.replace(/^\/|\/$/g, ""); // trim slashes
  
  if (cleanPath === "/") {
    return pathname === "/";
  }
  
  return pathname?.includes(cleanPath) || false;
};

  const renderTabs = () => {
    if (userRole === 'landlord') {
      return (
        <>
          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => go("landlord_properties")}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive(landlordRoutes.landlord_properties) }}
          >
            <Building2 
              size={28} 
              color={isActive(landlordRoutes.landlord_properties) ? ACTIVE : INACTIVE} 
              strokeWidth={1.6} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => go("tenants")}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive(landlordRoutes.tenants) }}
          >
            <User 
              size={28} 
              color={isActive(landlordRoutes.tenants) ? ACTIVE : INACTIVE} 
              strokeWidth={1.6} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => go("maintenance")}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive(landlordRoutes.maintenance) }}
          >
            <Wrench 
              size={28} 
              color={isActive(landlordRoutes.maintenance) ? ACTIVE : INACTIVE} 
              strokeWidth={1.6} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => go("settings")}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive(landlordRoutes.settings) }}
          >
            <Settings 
              size={28} 
              color={isActive(landlordRoutes.settings) ? ACTIVE : INACTIVE} 
              strokeWidth={1.6} 
            />
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => go("pay_rent")}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive(tenantRoutes.pay_rent) }}
          >
            <CreditCard 
              size={28} 
              color={isActive(tenantRoutes.pay_rent) ? ACTIVE : INACTIVE} 
              strokeWidth={1.6} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => go("maintenance")}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive(tenantRoutes.maintenance) }}
          >
            <Wrench 
              size={28} 
              color={isActive(tenantRoutes.maintenance) ? ACTIVE : INACTIVE} 
              strokeWidth={1.6} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => go("settings")}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive(tenantRoutes.settings) }}
          >
            <Settings 
              size={28} 
              color={isActive(tenantRoutes.settings) ? ACTIVE : INACTIVE} 
              strokeWidth={1.6} 
            />
          </TouchableOpacity>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.wrapper, style]}>
      <View style={styles.pill}>
        {renderTabs()}
      </View>
    </SafeAreaView>
  );
}

const PILL_HEIGHT = 64;
const RADIUS = PILL_HEIGHT / 2;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  pill: {
    height: PILL_HEIGHT,
    width: "92%",
    maxWidth: 700,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    borderRadius: RADIUS,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    ...(Platform.OS === "android" ? { elevation: 14 } : null),
  },
  tab: {
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
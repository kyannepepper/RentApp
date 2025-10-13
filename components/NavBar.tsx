// components/NavBar.tsx
import { usePathname, useRouter, type Href } from "expo-router";
import { Building2, DollarSign, Settings, User, Wrench } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabName = "landlord_properties" | "finances" | "tenants" | "maintenance" | "settings";

const ACTIVE = "#6D46C9";
const INACTIVE = "#70757c";

type Props = {
  onPress?: (tab: TabName) => void;
  style?: object;
};

export default function NavBar({ onPress, style }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const routes = {
    landlord_properties: "/landlord_properties",
    finances: "/tenant_finances",
    tenants: "/landlord_tenants",
    maintenance: "/maintenance",
    settings: "/settings",
  } as const satisfies Record<TabName, Href>;

  const go = (tab: TabName) => {
    if (onPress) return onPress(tab);
    router.push(routes[tab]);
  };

  const isActive = (href: Href) =>
    // treat subroutes like /landlord_properties/details as active, too
    typeof href === "string" ? pathname?.startsWith(href) : false;

  return (
    <SafeAreaView style={[styles.wrapper, style]}>

      <View style={styles.pill}>

        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => go("landlord_properties")}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive(routes.landlord_properties) }}
        >
          <Building2 size={28} color={isActive(routes.landlord_properties) ? ACTIVE : INACTIVE} strokeWidth={1.6} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => go("finances")}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive(routes.finances) }}
        >
          <DollarSign size={28} color={isActive(routes.finances) ? ACTIVE : INACTIVE} strokeWidth={1.6} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => go("tenants")}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive(routes.tenants) }}
        >
          <User size={28} color={isActive(routes.tenants) ? ACTIVE : INACTIVE} strokeWidth={1.6} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => go("maintenance")}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive(routes.maintenance) }}
        >
          <Wrench size={28} color={isActive(routes.maintenance) ? ACTIVE : INACTIVE} strokeWidth={1.6} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.7}
          onPress={() => go("settings")}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive(routes.settings) }}
        >
          <Settings size={28} color={isActive(routes.settings) ? ACTIVE : INACTIVE} strokeWidth={1.6} />
        </TouchableOpacity>
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

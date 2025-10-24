// components/TenantCard.tsx
import { useRouter } from "expo-router";
import { Mail, Pencil, Phone } from "lucide-react-native";
import { useState } from "react";

import {
    Image,
    LayoutAnimation,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    UIManager,
    View,
} from "react-native";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type TenantCardProps = {
  id: string;
  imageUrl?: string;
  complex?: string;
  unit?: string; // e.g. "Apt 101"
  tenantName?: string | null; // component assumes tenant exists when rendering
  phone?: string | null;
  email?: string | null;
  leaseEnd?: string | null; // e.g. "2025-08-31" or "Aug 31, 2025"
  rent?: number | string; // number (1200) or "$1200/mo"
  defaultExpanded?: boolean;
  style?: object;
};

export default function TenantCard({
  id,
  imageUrl,
  complex,
  unit,
  tenantName,
  phone,
  email,
  leaseEnd,
  rent,
  defaultExpanded = false,
  style,
}: TenantCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  const rentText =
    typeof rent === "number" ? `$${rent.toLocaleString()}/mo` : rent ?? undefined;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((s) => !s);
  };

  const goEdit = (e?: any) => {
    e?.stopPropagation?.();
    router.push({
      pathname: "/landlord_tenants_details",
      params: {
        id: id
      },
    });
  };

  return (
    <Pressable
      android_ripple={{ color: "#eee" }}
      style={[styles.card, style]}
      onPress={toggle}
    >
      {/* Left: avatar */}
      <Image
        source={{ uri: imageUrl ?? "https://via.placeholder.com/150" }}
        style={styles.image}
      />

      {/* Middle: content */}
      <View style={styles.content}>
        {/* Header: complex & unit on the left, edit icon is outside (see right) */}
        <View style={styles.header}>
          
        </View>
         <Text style={styles.tenant} numberOfLines={1}>
          {tenantName ?? "Tenant name"}
        </Text>
        
        {/* Expandable details */}
        {expanded ? (
          <View style={styles.details}>
            <View style={styles.row}>
              <View style={styles.iconText}>
                <Phone size={14} strokeWidth={1.6} />
                <Text style={styles.contactText} numberOfLines={1}>
                  {phone ?? "—"}
                </Text>
              </View>

              <View style={styles.iconText}>
                <Mail size={14} strokeWidth={1.6} />
                <Text style={styles.contactText} numberOfLines={1}>
                  {email ?? "—"}
                </Text>
              </View>
              <View>
                {/* Tenant name */}
       

              </View>
            </View>

          </View>
        ) : (
          <Text style={styles.disclosure}>Tap to show tenant details</Text>
        )}
      </View>

      {/* Right: edit button */}
      <View style={styles.right}>
        <Pressable onPress={goEdit} style={styles.editBtn} hitSlop={8}>
          <Pencil size={16} color={PURPLE} strokeWidth={2} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const IMG_SIZE = 56;
const PURPLE = "#6D46C9";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e8",
  },
  image: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    resizeMode: "cover",
    backgroundColor: "#f3f4f6",
    borderRadius: IMG_SIZE / 2,
    marginRight: 14,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    flexShrink: 1,
  },

  complex: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  unit: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  tenant: {
    marginTop: 8,
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },

  disclosure: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  },

  details: {
    marginTop: 10,
    flexDirection: "column",
    gap: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },

  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 120,
  },

  contactText: {
    fontSize: 13,
    color: "#374151",
    flexShrink: 1,
  },

  pillRow: {
    marginTop: 8,
  },

  detailPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
  },
  detailText: {
    fontSize: 13,
    color: "#374151",
    maxWidth: 180,
  },

  right: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  editBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 999,
  },
});

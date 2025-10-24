// components/PropertyCard.tsx
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

export interface PropertyCardProps {
  id: string;
  imageUrl?: string;
  complex: string;
  address?: string;
  tenantName?: string;
  phone?: string;
  email?: string;
}

export default function PropertyCard({
  id,
  imageUrl,
  complex,
  address,
  tenantName,
  phone,
  email,
}: PropertyCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  };

  const occupied = Boolean(tenantName);

  const goEdit = (e: any) => {
    // prevent the parent Pressable (card) from toggling
    e?.stopPropagation?.();
    router.push({
      pathname: "/landlord_properties_details",
      params: { id },
    });
  };

  return (
    <Pressable
      onPress={toggle}
      android_ripple={{ color: "#eee" }}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${complex}. ${occupied ? `Tenant ${tenantName}` : "Vacant"}. Tap for details`}
    >
      {/* Left: image */}
      <Image 
        source={{ uri: imageUrl || "https://picsum.photos/360/240" }} 
        style={styles.image} 
      />

      {/* Right: content */}
      <View style={styles.right}>
        {/* Header row: names + Edit button */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.complex} numberOfLines={1}>
              {complex}
            </Text>
            {address && (
              <Text style={styles.address} numberOfLines={1}>
                {address}
              </Text>
            )}
          </View>

          {/* Edit button */}
          <Pressable onPress={goEdit} style={styles.editBtn} hitSlop={8}>
            <Pencil size={14} color={PURPLE} strokeWidth={2} />
          </Pressable>
        </View>

        {/* Tenant status line */}
        <Text
          style={[styles.tenant, occupied ? styles.tenantOccupied : styles.tenantVacant]}
          numberOfLines={1}
        >
          {occupied ? `Tenant: ${tenantName}` : "Vacant"}
        </Text>

        {/* Expandable tenant details */}
        {expanded && occupied ? (
          <View style={styles.detailsContainer}>
            {phone && (
              <View style={styles.detailRow}>
                <Phone size={14} color="#58606a" strokeWidth={1.8} />
                <Text style={styles.detailText}>{phone}</Text>
              </View>
            )}
            {email && (
              <View style={styles.detailRow}>
                <Mail size={14} color="#58606a" strokeWidth={1.8} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {email}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.disclosure}>
            {occupied ? "Tap to show tenant details" : "Tap to add tenant"}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const IMG_SIZE = 110;
const PURPLE = "#6D46C9";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginHorizontal: 16,
  },
  image: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    resizeMode: "cover",
  },
  right: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  complex: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  address: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  editBtn: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    margin: -8,
    marginTop: -30,
    borderRadius: 999,
    backgroundColor: "white",
  },
  tenant: {
    marginTop: 6,
    fontSize: 13,
  },
  tenantOccupied: { 
    color: "#1b7f53", 
    fontWeight: "600" 
  },
  tenantVacant: { 
    color: "#9f1d20", 
    fontWeight: "600" 
  },
  detailsContainer: {
    marginTop: 8,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: "#374151",
    flex: 1,
  },
  disclosure: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
});
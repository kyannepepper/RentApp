// components/PropertyCard.tsx
import { useRouter } from "expo-router";
import { Bath, BedDouble, DollarSign, Pencil, Ruler } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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

export type PropertyCardProps = {
  id: string;
  imageUrl: string;
  complex: string;
  property: string; // e.g. "Apt 101"
  tenant?: string | null; // null/undefined => vacant
  beds?: number | string;
  baths?: number | string;
  sqft?: number | string;
  rent?: number | string; // number (1200) or "$1200/mo"
  defaultExpanded?: boolean;
  style?: object;
};

export default function PropertyCard({
  id,
  imageUrl,
  complex,
  property,
  tenant,
  beds,
  baths,
  sqft,
  rent,
  defaultExpanded = false,
  style,
}: PropertyCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (defaultExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [defaultExpanded]);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  };

  const occupied = Boolean(tenant);
  const rentText =
    typeof rent === "number" ? `$${rent.toLocaleString()}/mo` : rent ?? undefined;

  const goEdit = (e: any) => {
    // prevent the parent Pressable (card) from toggling
    e?.stopPropagation?.();
    router.push({
      pathname: "/landlord_properties/edit",
      params: {
        id,
        complex,
        property,
        tenant: tenant ?? "",
        beds: beds?.toString() ?? "",
        baths: baths?.toString() ?? "",
        sqft: sqft?.toString() ?? "",
        rent: rentText ?? "",
      },
    });
  };

  return (
    <Pressable
      onPress={toggle}
      android_ripple={{ color: "#eee" }}
      style={[styles.card, style]}
      accessibilityRole="button"
      accessibilityLabel={`${complex} ${property}. ${occupied ? `Tenant ${tenant}` : "Vacant"}. Tap for details`}
    >
      {/* Left: image */}
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {/* Right: content */}
      <View style={styles.right}>
        {/* Header row: names + Edit button */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.complex} numberOfLines={1}>
              {complex}
            </Text>
            <Text style={styles.property} numberOfLines={1}>
              {property}
            </Text>
          </View>

          {/* Use Pressable so we can stopPropagation */}
          <Pressable onPress={goEdit} style={styles.editBtn} hitSlop={8}>
            <Pencil size={14} color={PURPLE} strokeWidth={2} />
          </Pressable>
        </View>

        {/* Tenant line */}
        <Text
          style={[styles.tenant, occupied ? styles.tenantOccupied : styles.tenantVacant]}
          numberOfLines={1}
        >
          {occupied ? `Tenant: ${tenant}` : "Vacant"}
        </Text>

        {/* Expandable details */}
        {expanded ? (
          <View style={[styles.detailsRow, { marginTop: 8 }]}>
            {beds !== undefined && beds !== "" && (
              <View style={styles.detailPill}>
                <BedDouble size={16} color="#58606a" strokeWidth={1.8} />
                <Text style={styles.detailText}>{beds} bed</Text>
              </View>
            )}
            {baths !== undefined && baths !== "" && (
              <View style={styles.detailPill}>
                <Bath size={16} color="#58606a" strokeWidth={1.8} />
                <Text style={styles.detailText}>{baths} bath</Text>
              </View>
            )}
            {sqft !== undefined && sqft !== "" && (
              <View style={styles.detailPill}>
                <Ruler size={16} color="#58606a" strokeWidth={1.8} />
                <Text style={styles.detailText}>{sqft} sqft</Text>
              </View>
            )}
            {rentText && (
              <View style={styles.detailPill}>
                <DollarSign size={16} color="#58606a" strokeWidth={1.8} />
                <Text style={styles.detailText}>{rentText}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.disclosure}>Tap to show details</Text>
        )}
      </View>
    </Pressable>
  );
}

const IMG_SIZE = 110; // controls the card height
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
    marginVertical: 8,
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
  property: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 2,
  },
  editBtn: {
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    margin: -8,
    marginTop: -30,
    borderRadius: 999,
    backgroundColor: 'white',
  },
  editText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.2,
  },
  tenant: {
    marginTop: 6,
    fontSize: 13,
  },
  tenantOccupied: { color: "#1b7f53", fontWeight: "600" },
  tenantVacant: { color: "#9f1d20", fontWeight: "600" },

  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  detailPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
  },
  detailText: {
    fontSize: 12,
    color: "#374151",
  },
  disclosure: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  },
});

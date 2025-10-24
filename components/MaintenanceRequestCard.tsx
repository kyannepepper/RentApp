// components/MaintenanceRequestCard.tsx
import { useRouter } from "expo-router";
import { Calendar, Edit, MapPin } from "lucide-react-native";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaintenanceRequest } from "../types/models";

interface MaintenanceRequestCardProps {
  request: MaintenanceRequest;
  canEdit?: boolean;
  propertyName?: string;
  tenantName?: string;
}

export default function MaintenanceRequestCard({
  request,
  canEdit = false,
  propertyName,
  tenantName,
}: MaintenanceRequestCardProps) {
  const router = useRouter();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'in_progress': return '#2563eb';
      case 'cancelled': return '#dc2626';
      case 'pending': return '#d97706';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handlePress = () => {
    // Only navigate if user can edit (tenant)
    if (canEdit) {
      router.push({
        pathname: "/maintenance_details",
        params: { id: request.id, edit: "true" },
      });
    }
    // If canEdit is false (landlord), do nothing - card is not clickable
  };

  const CardContent = (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {request.title}
          </Text>
          <View style={styles.actions}>
            {canEdit ? (
              <Edit size={16} color="#6b7280" />
            ) : (
              <View></View>
            )}
          </View>
        </View>
        
        <View style={styles.badges}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) + '20' }]}>
            <Text style={[styles.badgeText, { color: getPriorityColor(request.priority) }]}>
              {request.priority.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) + '20' }]}>
            <Text style={[styles.badgeText, { color: getStatusColor(request.status) }]}>
              {request.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {request.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <MapPin size={14} color="#6b7280" />
          <Text style={styles.infoText} numberOfLines={1}>
            {propertyName || 'Property'}
          </Text>
        </View>
        
        {tenantName && (
          <View style={styles.infoRow}>
            <Text style={styles.infoText} numberOfLines={1}>
              {tenantName}
            </Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Calendar size={14} color="#6b7280" />
          <Text style={styles.infoText}>
            {formatDate(request.createdAt)}
          </Text>
        </View>
      </View>

      {request.imageUri && (
        <Image source={{ uri: request.imageUri }} style={styles.image} />
      )}
    </View>
  );

  // Only wrap in Pressable if canEdit is true (tenant)
  if (canEdit) {
    return (
      <Pressable
        onPress={handlePress}
        android_ripple={{ color: "#eee" }}
      >
        {CardContent}
      </Pressable>
    );
  }

  // For landlords, return card without Pressable wrapper
  return CardContent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  header: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  actions: {
    padding: 4,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#6b7280",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 5,
    marginTop: 8,
    resizeMode: "cover",
  },
});
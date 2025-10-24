// components/PaymentHistoryCard.tsx
import { CheckCircle, Clock, XCircle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RentPayment } from "../types/models";

interface PaymentHistoryCardProps {
  payment: RentPayment;
}

export default function PaymentHistoryCard({ payment }: PaymentHistoryCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#16a34a" />;
      case 'pending':
        return <Clock size={20} color="#d97706" />;
      case 'failed':
        return <XCircle size={20} color="#dc2626" />;
      default:
        return <Clock size={20} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'pending': return '#d97706';
      case 'failed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>${payment.amount.toLocaleString()}</Text>
          <Text style={styles.month}>{formatMonth(payment.month)}</Text>
        </View>
        <View style={styles.statusContainer}>
          {getStatusIcon(payment.status)}
          <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.dateText}>
        Paid on {formatDate(payment.paidAt)}
      </Text>
    </View>
  );
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  amountContainer: {
    flex: 1,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  month: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});

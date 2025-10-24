// app/pay_rent.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import uuid from "react-native-uuid";
import PaymentHistoryCard from "../components/PaymentHistoryCard";
import { RentPayment } from "../types/models";

const MONTHLY_RENT = 1000;

export default function PayRentScreen() {
  const router = useRouter();
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const loadPayments = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("@rent_payments");
      if (raw) {
        const paymentsList: RentPayment[] = JSON.parse(raw);
        // Sort by most recent first
        paymentsList.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
        setPayments(paymentsList);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPayments();
    }, [loadPayments])
  );

  const getLastPaymentDate = () => {
    if (payments.length === 0) return null;
    
    const lastPayment = payments[0]; // Already sorted by most recent
    const date = new Date(lastPayment.paidAt);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handlePayRent = async () => {
    setIsProcessing(true);

    // Trigger haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Play ding sound
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/ding.mp3'),
        { shouldPlay: true }
      );
      // Unload sound after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Error playing sound:", error);
    }

    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const newPayment: RentPayment = {
          id: String(uuid.v4()),
          amount: MONTHLY_RENT,
          month: new Date().toISOString().slice(0, 7), // YYYY-MM format
          paidAt: new Date().toISOString(),
          tenantId: 'default-tenant', // For demo purposes
          propertyId: 'default-property', // For demo purposes
          status: 'completed',
        };

        const existing = await AsyncStorage.getItem("@rent_payments");
        const paymentsList: RentPayment[] = existing ? JSON.parse(existing) : [];
        paymentsList.push(newPayment);
        
        await AsyncStorage.setItem("@rent_payments", JSON.stringify(paymentsList));
        
        // Update local state
        setPayments(prev => [newPayment, ...prev]);
        
        Alert.alert(
          "Payment Successful!",
          `Your rent payment of $${MONTHLY_RENT.toLocaleString()} has been processed successfully.`,
          [
            {
              text: "OK",
            }
          ]
        );
      } catch (error) {
        Alert.alert("Payment Failed", "There was an error processing your payment. Please try again.");
        console.error("Error processing payment:", error);
      } finally {
        setIsProcessing(false);
      }
    }, 2000); // 2 second delay to simulate processing
  };

  const lastPaymentDate = getLastPaymentDate();

  return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={{
      paddingBottom: 130,
      paddingHorizontal: 20,
    }}
  >
    <View style={styles.title}>
      <Text style={styles.titleText}>Pay Rent</Text>
    </View>

    {/* Payment Section */}
    <View style={styles.paymentSection}>
      <Animated.View
        style={[
          styles.rentCard,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
      >
        <Text style={styles.rentLabel}>Monthly Rent</Text>
        <Text style={styles.rentAmount}>${MONTHLY_RENT.toLocaleString()}</Text>

        {lastPaymentDate && (
          <View style={styles.lastPaymentContainer}>
            <Text style={styles.lastPaymentLabel}>Last Payment:</Text>
            <Text style={styles.lastPaymentDate}>{lastPaymentDate}</Text>
          </View>
        )}

        <Pressable
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayRent}
          disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>
            {isProcessing ? "Processing..." : "Pay Rent"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>

    {/* Payment History */}
    <View style={styles.historySection}>
      <Text style={styles.historyTitle}>Payment History</Text>
      {payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No payment history yet</Text>
          <Text style={styles.emptySubtext}>Your rent payments will appear here</Text>
        </View>
      ) : (
        payments.map((item) => (
          <View key={item.id} style={{ marginBottom: 8 }}>
            <PaymentHistoryCard payment={item} />
          </View>
        ))
      )}
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f2f4",
    width: "100%",
    paddingTop: 40,
  },
  title: {
    top: 80,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
  },
  paymentSection: {
    marginTop: 120,
    marginBottom: 20,
  },
  rentCard: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  rentLabel: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  rentAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  lastPaymentContainer: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  lastPaymentLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  lastPaymentDate: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  payButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 5,
    minWidth: 140,
  },
  payButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  historySection: {
    flex: 1,
    paddingHorizontal: 0,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
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
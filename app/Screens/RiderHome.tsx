import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Check, X } from 'phosphor-react-native';
import OrderRequestCard from '../../components/OrderRequestCard';
import { Order, RecentOrder } from '../../types/order';

const NEW_ORDER: Order = {
  id: 'LPG-2842',
  customerName: 'Essandoh Prince Takyi',
  customerPhone: '055 414 4611',
  cylinderSize: 'Small',
  cylinderCount: 1,
  amount: 120,
  tip: 10,
  fillingStationName: 'Total - Osu',
  dropoffAddress: 'Ashaade Quaye St · Adum',
  pickupLocation: { latitude: 5.6037, longitude: -0.187 },
  dropoffLocation: { latitude: 5.61, longitude: -0.18 },
};

const RECENT_ORDERS: RecentOrder[] = [
  { id: '1', customerName: 'Adjoa Amponsah', area: 'Santasi · Small', size: 'Small', amount: 220, status: 'completed', time: 'Today, 8:12am' },
  { id: '2', customerName: 'Kweku Barimah', area: 'Bantama · Small', size: 'Small', amount: 220, status: 'completed', time: 'Today, 7:40am' },
  { id: '3', customerName: 'Adjoa Amponsah', area: 'Santasi · Small', size: 'Small', amount: 220, status: 'cancelled', time: 'Cancelled' },
];

export default function RiderHome({ navigation }) {
  const [pendingOrder, setPendingOrder] = useState<Order | null>(NEW_ORDER);

  const handleAccept = () => {
    if (!pendingOrder) return;
    setPendingOrder(null);
    navigation.navigate('DeliveryTracking', { order: pendingOrder });
  };

  const handleDecline = () => {
    setPendingOrder(null);
  };

  return (
    <ScrollView style={styles.main} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Hello Chris 👋</Text>
          <Text style={styles.subGreeting}>Todays Bookings</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('BatchOrderHome')}>
          <Text style={styles.batchLink}>View Batch Order</Text>
        </TouchableOpacity>
      </View>

      {pendingOrder && (
        <View style={{ gap: 12 }}>
          <Text style={styles.sectionTitle}>New Order!</Text>
          <OrderRequestCard
            order={pendingOrder}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        </View>
      )}

      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {RECENT_ORDERS.map((order) => (
          <View key={order.id} style={styles.recentRow}>
            <View
              style={[
                styles.statusIcon,
                order.status === 'completed' ? styles.statusIconSuccess : styles.statusIconCancel,
              ]}
            >
              {order.status === 'completed' ? (
                <Check size={14} color="#fff" weight="bold" />
              ) : (
                <X size={14} color="#fff" weight="bold" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recentName}>{order.customerName}</Text>
              <Text style={styles.recentMeta}>{order.area}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.recentAmount}>₵ {order.amount}</Text>
              <Text style={styles.recentTime}>{order.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 40,
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
  },
  subGreeting: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2,
  },
  batchLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0085FF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconSuccess: {
    backgroundColor: '#22C55E',
  },
  statusIconCancel: {
    backgroundColor: '#EF4444',
  },
  recentName: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentMeta: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2,
  },
  recentAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  recentTime: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2,
  },
});

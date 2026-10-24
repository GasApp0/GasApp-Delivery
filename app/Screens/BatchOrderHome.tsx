import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowDownIcon } from '../../components/icons/OrderCardIcons';
import OrderQueueRow from '../../components/OrderQueueRow';
import { QueueOrder } from '../../types/order';

const ZONE_ORDERS: QueueOrder[] = [
  {
    id: 'LPG-3001',
    customerName: 'Adjoa Amponsah',
    customerPhone: '024 111 2222',
    area: 'Santasi',
    cylinderSize: 'Small',
    amount: 120,
    tip: 10,
    dropoffLocation: { latitude: 5.615, longitude: -0.179 },
    status: 'queued',
  },
  {
    id: 'LPG-3002',
    customerName: 'Kweku Barimah',
    customerPhone: '024 333 4444',
    area: 'Bantama',
    cylinderSize: 'Medium',
    amount: 80,
    tip: 10,
    dropoffLocation: { latitude: 5.617, longitude: -0.177 },
    status: 'queued',
  },
  {
    id: 'LPG-3003',
    customerName: 'Adjoa Amponsah',
    customerPhone: '024 555 6666',
    area: 'Santasi',
    cylinderSize: 'Small',
    amount: 120,
    tip: 10,
    dropoffLocation: { latitude: 5.619, longitude: -0.182 },
    status: 'queued',
  },
];

export default function BatchOrderHome({ navigation }) {
  const handleStartDelivery = () => {
    navigation.navigate('DeliveryTracking', { orders: ZONE_ORDERS });
  };

  return (
    <View style={styles.main}>
      <View style={styles.headerRow}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.title}>Batch order available</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.subtitleStrong}>{ZONE_ORDERS.length}</Text> orders in your zone · Est.{' '}
            <Text style={styles.subtitleAmount}>GH₵ 84.00</Text>
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {ZONE_ORDERS.length}
            <Text style={styles.countTextMuted}> / 10</Text>
          </Text>
        </View>
      </View>

      <View style={styles.queueSection}>
        <View style={styles.queueHeaderRow}>
          <Text style={styles.queueTitle}>Order Queue</Text>
          <TouchableOpacity style={styles.sortPill}>
            <Text style={styles.sortText}>
              Sort : <Text style={styles.sortTextStrong}>Closest</Text>
            </Text>
            <ArrowDownIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.queueList}>
          {ZONE_ORDERS.map((order, index) => (
            <React.Fragment key={order.id}>
              <OrderQueueRow index={index + 1} order={order} variant="price" />
              {index < ZONE_ORDERS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartDelivery}>
          <Text style={styles.startButtonText}>Start Delivery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingTop: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D1D1D',
  },
  subtitle: {
    fontSize: 10,
    color: '#4F4F4F',
    marginTop: 4,
  },
  subtitleStrong: {
    fontWeight: '500',
    color: '#000',
  },
  subtitleAmount: {
    fontWeight: '600',
    color: '#34C759',
  },
  countBadge: {
    marginLeft: 'auto',
    backgroundColor: '#FAFAFA',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  countTextMuted: {
    fontWeight: '400',
    color: 'rgba(0,0,0,0.6)',
  },
  queueSection: {
    marginTop: 36,
    gap: 12,
  },
  queueHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  queueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 4,
    shadowColor: 'rgba(12,12,13,0.15)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  sortText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
  },
  sortTextStrong: {
    color: '#000',
  },
  queueList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  startButton: {
    backgroundColor: '#34C759',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(12,12,13,0.15)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  startButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});

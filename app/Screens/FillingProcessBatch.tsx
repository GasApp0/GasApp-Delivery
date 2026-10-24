import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackButton from '../../components/BackButton';
import { QueueOrder } from '../../types/order';

export default function FillingProcessBatch({ navigation, route }) {
  const orders: QueueOrder[] = route?.params?.orders ?? [];
  const [filledCount, setFilledCount] = useState(0);

  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);
  const filledAmount = orders.slice(0, filledCount).reduce((sum, o) => sum + o.amount, 0);
  const amountLeft = totalAmount - filledAmount;
  const leftToFill = orders.length - filledCount;
  const isLast = filledCount === orders.length - 1;

  const handleNext = () => {
    if (filledCount >= orders.length - 1) {
      const deliveredOrders: QueueOrder[] = orders.map((o, i) => ({
        ...o,
        status: i === 0 ? 'up_next' : 'queued',
      }));
      navigation.replace('DeliveryTracking', { orders: deliveredOrders, skipToDelivery: true });
      return;
    }
    setFilledCount((prev) => prev + 1);
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Filling Process</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{orders.length}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Left To Fill</Text>
          <Text style={[styles.statValue, styles.statValueBlue]}>{leftToFill}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Amount Left</Text>
          <Text style={[styles.statValue, styles.statValueRed]}>GHS {amountLeft}</Text>
        </View>
      </View>

      <View style={styles.table}>
        {orders.map((order, index) => {
          const isFilled = index < filledCount;
          const isActive = index === filledCount;
          return (
            <View
              key={order.id}
              style={[styles.tableRow, (isFilled) && styles.tableRowDimmed, isActive && styles.tableRowActive]}
            >
              <Text style={styles.cellIndex}>{index + 1}</Text>
              <Text style={styles.cellName} numberOfLines={1}>
                {order.customerName}
              </Text>
              <Text style={styles.cellMeta} numberOfLines={1}>
                {order.area}
              </Text>
              <Text style={styles.cellMeta}>{order.cylinderSize}</Text>
              <Text style={[styles.cellAmount, isFilled && styles.cellAmountStruck]}>GHS {order.amount}</Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{isLast ? 'Complete Filling' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerSpacer: {
    width: 36,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    padding: 12,
    gap: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  statValueBlue: {
    color: '#0085FF',
  },
  statValueRed: {
    color: '#FF383C',
  },
  table: {
    marginTop: 24,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 8,
    gap: 8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  tableRowDimmed: {
    opacity: 0.3,
  },
  tableRowActive: {
    borderColor: '#0085FF',
    borderWidth: 1.5,
  },
  cellIndex: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.4)',
    width: 14,
  },
  cellName: {
    flex: 1.3,
    fontSize: 13,
    color: '#000',
  },
  cellMeta: {
    flex: 1,
    fontSize: 13,
    color: '#000',
  },
  cellAmount: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
  },
  cellAmountStruck: {
    color: '#FF383C',
    textDecorationLine: 'line-through',
  },
  nextButton: {
    marginTop: 'auto',
    marginBottom: 32,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

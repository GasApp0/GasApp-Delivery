import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QueueOrder } from '../types/order';

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  delivered: { bg: '#ECFDF3', border: '#ABEFC6', text: '#067647', label: 'Delivered' },
  up_next: { bg: '#EFF8FF', border: '#B2DDFF', text: '#175CD3', label: 'Up Next' },
  filled: { bg: '#EFF8FF', border: '#B2DDFF', text: '#175CD3', label: 'Filled' },
  queued: { bg: '#F4F4F4', border: 'rgba(0,0,0,0.1)', text: 'rgba(0,0,0,0.5)', label: 'Queued' },
};

interface OrderQueueRowProps {
  index: number;
  order: QueueOrder;
  variant: 'price' | 'status';
}

export default function OrderQueueRow({ index, order, variant }: OrderQueueRowProps) {
  const dimmed = variant === 'status' && (order.status === 'delivered' || order.status === 'filled');
  const badge = STATUS_STYLES[order.status];

  return (
    <View style={[styles.row, dimmed && styles.rowDimmed]}>
      <View style={styles.left}>
        <View style={styles.indexBox}>
          <Text style={styles.indexText}>{index}</Text>
        </View>
        <View>
          <Text style={styles.name}>{order.customerName}</Text>
          <Text style={styles.meta}>
            {order.area} · {order.cylinderSize}
          </Text>
        </View>
      </View>

      {variant === 'price' ? (
        <View style={styles.priceCol}>
          <Text style={styles.price}>¢ {order.amount}</Text>
          <Text style={styles.tip}>+ ₵ {order.tip ?? 0}</Text>
        </View>
      ) : (
        <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowDimmed: {
    opacity: 0.3,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 162.5,
  },
  indexBox: {
    width: 36,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
  meta: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
  tip: {
    fontSize: 12,
    color: '#34C759',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 8,
    paddingRight: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

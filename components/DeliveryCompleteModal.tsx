import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SealCheckDuotoneIcon } from './icons/OrderCardIcons';
import { RiderStats } from '../types/order';

interface DeliveryCompleteModalProps {
  visible: boolean;
  orderId: string;
  customerName: string;
  earned: number;
  stats: RiderStats;
  onDismiss: () => void;
}

export default function DeliveryCompleteModal({
  visible,
  orderId,
  customerName,
  earned,
  stats,
  onDismiss,
}: DeliveryCompleteModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <SealCheckDuotoneIcon />

          <View style={styles.titleGroup}>
            <Text style={styles.title}>Delivery Complete!</Text>
            <Text style={styles.subtitle}>
              <Text style={styles.subtitleStrong}>Order #{orderId}</Text> · {customerName}
            </Text>
          </View>

          <View style={styles.statsBox}>
            <View style={styles.earnedGroup}>
              <Text style={styles.earnedAmount}>+ ₵ {earned}</Text>
              <Text style={styles.earnedLabel}>Earned From This Delivery</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.todayDeliveries}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>¢ {stats.totalEarned}</Text>
                <Text style={styles.statLabel}>Total Earned</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.rating}★</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.gotItButton} onPress={onDismiss}>
              <Text style={styles.gotItText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingTop: 16,
    paddingBottom: 4,
    alignItems: 'center',
    gap: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: 'rgba(12,12,13,0.1)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8,
  },
  titleGroup: {
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
  },
  subtitleStrong: {
    color: 'rgba(0,0,0,0.8)',
  },
  statsBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 24,
    width: 320,
    maxWidth: '100%',
    alignItems: 'center',
  },
  earnedGroup: {
    gap: 8,
    alignItems: 'center',
  },
  earnedAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#34C759',
  },
  earnedLabel: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'flex-start',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
  },
  footer: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    padding: 8,
    width: '100%',
  },
  gotItButton: {
    backgroundColor: '#000',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gotItText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

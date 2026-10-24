import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import OrderRequestCard from './OrderRequestCard';
import { Order } from '../types/order';

interface NewOrderRequestModalProps {
  visible: boolean;
  order: Order | null;
  onAccept: () => void;
  onDecline: () => void;
}

export default function NewOrderRequestModal({ visible, order, onAccept, onDecline }: NewOrderRequestModalProps) {
  if (!order) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>New Order Request</Text>
          <Text style={styles.subtitle}>
            You can queue this for after your current delivery or decline it.
          </Text>

          <OrderRequestCard order={order} onAccept={onAccept} onDecline={onDecline} />
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36,
    gap: 4,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.55)',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
});

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '../types/order';
import {
  ClipboardTextIcon,
  BoxIcon,
  FuelPumpIcon,
  MapPinDuotoneIcon,
  DashedDivider,
} from './icons/OrderCardIcons';

interface OrderRequestCardProps {
  order: Order;
  onAccept: () => void;
  onDecline: () => void;
  onViewLocation?: () => void;
}

export default function OrderRequestCard({
  order,
  onAccept,
  onDecline,
  onViewLocation,
}: OrderRequestCardProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{order.customerName}</Text>
          <Text style={styles.phone}>{order.customerPhone}</Text>
        </View>
        <Text style={styles.tip}>+ ₵ {order.tip ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <ClipboardTextIcon />
            <Text style={styles.orderLabel}>Order</Text>
          </View>
          <View style={styles.rowLeft}>
            <BoxIcon />
            <Text style={styles.cylinderCount}>
              {order.cylinderCount}{' '}
              <Text style={styles.cylinderCountMuted}>
                cylinder{order.cylinderCount > 1 ? 's' : ''}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.detailLeft}>
            <View style={styles.iconBox}>
              <FuelPumpIcon />
            </View>
            <View>
              <Text style={styles.detailLabel}>FILLING STATION</Text>
              <Text style={styles.detailValue}>{order.fillingStationName}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onViewLocation}>
            <Text style={styles.link}>View Location</Text>
          </TouchableOpacity>
        </View>

        <DashedDivider />

        <View style={styles.row}>
          <View style={styles.detailLeft}>
            <View style={styles.iconBox}>
              <MapPinDuotoneIcon />
            </View>
            <View>
              <Text style={styles.detailLabel}>DELIVER TO</Text>
              <Text style={styles.detailValue}>{order.dropoffAddress}</Text>
            </View>
          </View>
        </View>

        <DashedDivider />

        <View style={styles.row}>
          <View style={styles.detailLeft}>
            <View style={[styles.iconBox, styles.cylinderIconBox]}>
              <Image
                source={require('../assets/images/order-card/cylinder.png')}
                style={styles.cylinderImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.sizeLabel}>{order.cylinderSize} Size</Text>
          </View>
          <Text style={styles.amount}>₵ {order.amount}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    paddingTop: 12,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerLeft: {
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  phone: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  tip: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34C759',
  },
  card: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    borderRadius: 24,
    padding: 8,
    gap: 12,
    shadowColor: 'rgba(12,12,13,0.15)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  orderLabel: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
  },
  cylinderCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  cylinderCountMuted: {
    fontWeight: '400',
    color: 'rgba(0,0,0,0.5)',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cylinderIconBox: {
    width: 32,
    height: 32,
  },
  cylinderImage: {
    width: 10,
    height: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    marginTop: 2,
  },
  link: {
    fontSize: 14,
    color: '#0088FF',
    textDecorationLine: 'underline',
  },
  sizeLabel: {
    fontSize: 14,
    color: '#000',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(12,12,13,0.15)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  declineText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF383C',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(12,12,13,0.15)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  acceptText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});

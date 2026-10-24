import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ArrowDownIcon, PhoneCallDuotoneIcon } from './icons/OrderCardIcons';
import StatusTimeline from './StatusTimeline';
import { DeliveryStage, Order } from '../types/order';

interface TrackingOrderCardProps {
  order: Order;
  stage: DeliveryStage;
  steps?: DeliveryStage[];
  showContactRow?: boolean;
  activeProgress?: number;
}

export default function TrackingOrderCard({
  order,
  stage,
  steps,
  showContactRow = false,
  activeProgress,
}: TrackingOrderCardProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${order.customerPhone}`)}>
          <Text style={styles.name}>{order.customerName}</Text>
          <Text style={styles.phone}>{order.customerPhone}</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Text style={styles.tip}>+ ₵ {order.tip ?? 0}</Text>
          <ArrowDownIcon />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sizeRow}>
          <View style={styles.sizeLeft}>
            <View style={styles.cylinderIconBox}>
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

        {showContactRow && (
          <View style={styles.contactRow}>
            <View>
              <Text style={styles.name}>{order.customerName}</Text>
              <Text style={styles.phone}>{order.customerPhone}</Text>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => Linking.openURL(`tel:${order.customerPhone}`)}
            >
              <PhoneCallDuotoneIcon />
            </TouchableOpacity>
          </View>
        )}

        <StatusTimeline
          stage={stage}
          etaMinutes={order.etaMinutes ?? 5}
          steps={steps}
          activeProgress={activeProgress}
        />
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  phone: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 4,
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
    borderRadius: 12,
    padding: 8,
    gap: 12,
    width: '100%',
    shadowColor: 'rgba(12,12,13,0.15)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sizeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cylinderIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cylinderImage: {
    width: 10,
    height: 16,
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 44,
    width: '100%',
  },
  callButton: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

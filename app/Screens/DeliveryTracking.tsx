import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import BackButton from '../../components/BackButton';
import TrackingOrderCard from '../../components/TrackingOrderCard';
import MapLocationMarker from '../../components/MapLocationMarker';
import BikeRiderMarker from '../../components/BikeRiderMarker';
import NewOrderRequestModal from '../../components/NewOrderRequestModal';
import DeliveryCompleteModal from '../../components/DeliveryCompleteModal';
import OrderQueueRow from '../../components/OrderQueueRow';
import { MapPinDuotoneIcon } from '../../components/icons/OrderCardIcons';
import { DeliveryStage, LatLng, Order, QueueOrder } from '../../types/order';
import { fetchRoadRoute } from '../../utils/routing';

// Real journey has three legs:
// 1. Rider goes to the customer to collect the empty cylinder.
// 2. Rider goes to the filling station to fill it.
// 3. Rider returns to the customer to deliver the filled cylinder.
// Leg 1's advancement is simulated here by a fill timer standing in for
// real GPS distance-to-target progress; legs 2-3 still use a manual
// button until GPS-driven auto-transitions are wired up for them too.
type Phase = 'toUserPickup' | 'toStation' | 'toUserDropoff';

const QUEUED_ORDER: Order = {
  id: 'LPG-2901',
  customerName: 'Essandoh Prince Takyi',
  customerPhone: '055 414 4611',
  cylinderSize: 'Small',
  cylinderCount: 1,
  amount: 120,
  tip: 15,
  fillingStationName: 'Total — Adum',
  dropoffAddress: 'Harper Rd · Adum',
  pickupLocation: { latitude: 5.6075, longitude: -0.1875 },
  dropoffLocation: { latitude: 5.613, longitude: -0.181 },
};

const FILLING_STATION = {
  name: 'Total - Osu',
  location: { latitude: 5.6037, longitude: -0.187 } as LatLng,
};

const PHASE_CONFIG: Record<
  Phase,
  { headerTitle: string; steps: DeliveryStage[]; stage: DeliveryStage; showContactRow: boolean; buttonLabel: string | null }
> = {
  toUserPickup: {
    headerTitle: 'Heading to User Location',
    steps: ['arrived', 'filling', 'completed'],
    stage: 'arrived',
    showContactRow: true,
    buttonLabel: null,
  },
  toStation: {
    headerTitle: 'Heading to filling station',
    steps: ['arrived', 'filling', 'completed'],
    stage: 'filling',
    showContactRow: false,
    buttonLabel: 'Filled Up, Heading to Customer',
  },
  toUserDropoff: {
    headerTitle: 'Heading to User Location',
    steps: ['filling', 'completed'],
    stage: 'completed',
    showContactRow: true,
    buttonLabel: 'Complete Delivery',
  },
};

export default function DeliveryTracking({ navigation, route }) {
  const isBatch = Array.isArray(route?.params?.orders);
  const skipToDelivery = !!route?.params?.skipToDelivery;

  const order: Order = route?.params?.order ?? {
    id: 'LPG-2841',
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

  const [phase, setPhase] = useState<Phase>(isBatch ? 'toStation' : 'toUserPickup');
  const [pickupProgress, setPickupProgress] = useState(0);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [queuedOrder, setQueuedOrder] = useState<Order | null>(null);

  const [queue, setQueue] = useState<QueueOrder[]>(() => {
    const incoming: QueueOrder[] = route?.params?.orders ?? [];
    if (incoming.length === 0) return incoming;
    if (incoming.some((o) => o.status === 'up_next')) return incoming;
    return incoming.map((o, i) => ({ ...o, status: i === 0 ? 'up_next' : 'queued' }));
  });
  const [batchDelivering, setBatchDelivering] = useState(skipToDelivery);

  useEffect(() => {
    if (isBatch) return;
    const timer = setTimeout(() => setShowNewOrderModal(true), 8000);
    return () => clearTimeout(timer);
  }, [isBatch]);

  useEffect(() => {
    if (isBatch || phase !== 'toUserPickup') return;
    const interval = setInterval(() => {
      setPickupProgress((prev) => {
        const next = prev + 0.04;
        if (next >= 1) {
          clearInterval(interval);
          setPhase('toStation');
          return 1;
        }
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [phase, isBatch]);

  const upNextOrder = queue.find((o) => o.status === 'up_next') ?? queue[0];
  const allDelivered = isBatch && queue.length > 0 && queue.every((o) => o.status === 'delivered');

  const batchStationOrder: Order = useMemo(
    () => ({
      id: 'BATCH',
      customerName: upNextOrder?.customerName ?? '',
      customerPhone: upNextOrder?.customerPhone ?? '',
      cylinderSize: upNextOrder?.cylinderSize ?? 'Small',
      cylinderCount: queue.length,
      amount: queue.reduce((sum, o) => sum + o.amount, 0),
      tip: queue.reduce((sum, o) => sum + (o.tip ?? 0), 0),
      fillingStationName: FILLING_STATION.name,
      dropoffAddress: '',
      pickupLocation: FILLING_STATION.location,
      dropoffLocation: upNextOrder?.dropoffLocation ?? FILLING_STATION.location,
    }),
    [queue, upNextOrder]
  );

  const activeOrder = isBatch ? batchStationOrder : order;

  const region = useMemo(() => {
    const lat = (activeOrder.pickupLocation.latitude + activeOrder.dropoffLocation.latitude) / 2;
    const lng = (activeOrder.pickupLocation.longitude + activeOrder.dropoffLocation.longitude) / 2;
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: Math.abs(activeOrder.pickupLocation.latitude - activeOrder.dropoffLocation.latitude) * 3 + 0.02,
      longitudeDelta: Math.abs(activeOrder.pickupLocation.longitude - activeOrder.dropoffLocation.longitude) * 3 + 0.02,
    };
  }, [activeOrder]);

  // Stand-in rider position: midpoint of the two waypoints for now, will
  // become the rider's live GPS coordinate once location tracking lands.
  const riderPosition: LatLng = useMemo(
    () => ({
      latitude: (activeOrder.pickupLocation.latitude + activeOrder.dropoffLocation.latitude) / 2,
      longitude: (activeOrder.pickupLocation.longitude + activeOrder.dropoffLocation.longitude) / 2,
    }),
    [activeOrder]
  );

  const stationLocation = isBatch ? FILLING_STATION.location : order.pickupLocation;
  const stationName = isBatch ? FILLING_STATION.name : order.fillingStationName;

  const targetPosition =
    isBatch && batchDelivering
      ? activeOrder.dropoffLocation
      : phase === 'toStation' || isBatch
        ? stationLocation
        : activeOrder.dropoffLocation;
  const routeColor = isBatch ? (batchDelivering ? '#52B922' : '#0085FF') : phase === 'toStation' ? '#0085FF' : '#52B922';

  // Road-snapped path for the rider's active leg and the faint full-trip
  // reference line, fetched from OSRM. Falls back to a straight line
  // (inside fetchRoadRoute) if the request fails.
  const [activeRouteCoords, setActiveRouteCoords] = useState<LatLng[]>([riderPosition, targetPosition]);
  const [referenceRouteCoords, setReferenceRouteCoords] = useState<LatLng[]>([
    stationLocation,
    activeOrder.dropoffLocation,
  ]);

  useEffect(() => {
    let cancelled = false;
    fetchRoadRoute(riderPosition, targetPosition).then((coords) => {
      if (!cancelled) setActiveRouteCoords(coords);
    });
    return () => {
      cancelled = true;
    };
  }, [riderPosition.latitude, riderPosition.longitude, targetPosition.latitude, targetPosition.longitude]);

  useEffect(() => {
    let cancelled = false;
    fetchRoadRoute(stationLocation, activeOrder.dropoffLocation).then((coords) => {
      if (!cancelled) setReferenceRouteCoords(coords);
    });
    return () => {
      cancelled = true;
    };
  }, [
    stationLocation.latitude,
    stationLocation.longitude,
    activeOrder.dropoffLocation.latitude,
    activeOrder.dropoffLocation.longitude,
  ]);

  const handleAcceptQueued = () => {
    setQueuedOrder(QUEUED_ORDER);
    setShowNewOrderModal(false);
  };

  const handleDeclineQueued = () => {
    setShowNewOrderModal(false);
  };

  const handleStartFilling = () => {
    navigation.navigate('FillingProcessBatch', { orders: queue });
  };

  const handleCompleteCurrentDelivery = () => {
    if (!upNextOrder) return;
    setQueue((prev) => {
      const currentIndex = prev.findIndex((o) => o.id === upNextOrder.id);
      const nextQueuedIndex = prev.findIndex((o, i) => i > currentIndex && o.status === 'queued');
      return prev.map((o, i) => {
        if (o.id === upNextOrder.id) return { ...o, status: 'delivered' };
        if (i === nextQueuedIndex) return { ...o, status: 'up_next' };
        return o;
      });
    });
  };

  useEffect(() => {
    if (allDelivered) setShowCompleteModal(true);
  }, [allDelivered]);

  const handlePrimaryAction = () => {
    if (isBatch) {
      if (batchDelivering) {
        handleCompleteCurrentDelivery();
      } else {
        handleStartFilling();
      }
      return;
    }
    if (phase === 'toStation') {
      setPhase('toUserDropoff');
    } else if (phase === 'toUserDropoff') {
      setShowCompleteModal(true);
    }
  };

  const handleCloseComplete = () => {
    setShowCompleteModal(false);
    if (queuedOrder) {
      navigation.replace('DeliveryTracking', { order: queuedOrder });
    } else {
      navigation.navigate('RiderHome');
    }
  };

  const { headerTitle: singleHeaderTitle, steps, stage, showContactRow, buttonLabel: singleButtonLabel } =
    PHASE_CONFIG[phase];

  const headerTitle = isBatch
    ? batchDelivering
      ? 'Heading to User Location'
      : 'Heading to filling station'
    : singleHeaderTitle;

  const batchEarned = queue.reduce((sum, o) => sum + (o.tip ?? 0), 0);
  const batchTotal = queue.reduce((sum, o) => sum + o.amount, 0);

  return (
    <View style={styles.main}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={region}>
        {/* Filling station */}
        <Marker coordinate={stationLocation} anchor={{ x: 0.5, y: 0.75 }}>
          <MapLocationMarker label={stationName} accentColor="#007AFF" />
        </Marker>
        {/* Customer(s) */}
        {isBatch
          ? queue.map((o) => (
              <Marker key={o.id} coordinate={o.dropoffLocation} anchor={{ x: 0.5, y: 0.75 }}>
                <MapLocationMarker
                  label={o.customerName}
                  icon={<MapPinDuotoneIcon />}
                  accentColor={o.status === 'delivered' ? '#A1A1AA' : '#52B922'}
                />
              </Marker>
            ))
          : (
              <Marker coordinate={activeOrder.dropoffLocation} anchor={{ x: 0.5, y: 0.75 }}>
                <MapLocationMarker
                  label={activeOrder.customerName}
                  icon={<MapPinDuotoneIcon />}
                  accentColor="#52B922"
                />
              </Marker>
            )}
        {/* Rider */}
        <Marker coordinate={riderPosition} title="You" anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges>
          <BikeRiderMarker />
        </Marker>

        {/* Overall trip reference: station <-> customer (road-snapped) */}
        <Polyline
          coordinates={referenceRouteCoords}
          strokeColor="rgba(0,0,0,0.15)"
          strokeWidth={2}
          lineDashPattern={[4, 4]}
        />
        {/* Active leg: rider -> current target (road-snapped) */}
        <Polyline
          coordinates={activeRouteCoords}
          strokeColor={routeColor}
          strokeWidth={4}
          lineDashPattern={[8, 6]}
        />
      </MapView>

      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.bottomSheet}>
        {isBatch ? (
          batchDelivering ? (
            <View style={styles.queueCard}>
              <View style={styles.queueHandle} />
              <View style={styles.queueHeaderRow}>
                <Text style={styles.queueTitle}>Order Queue</Text>
              </View>
              <View style={styles.queueList}>
                {queue.map((o, index) => (
                  <React.Fragment key={o.id}>
                    <OrderQueueRow index={index + 1} order={o} variant="status" />
                    {index < queue.length - 1 && <View style={styles.divider} />}
                  </React.Fragment>
                ))}
              </View>
            </View>
          ) : (
            <TrackingOrderCard order={batchStationOrder} stage="filling" steps={['arrived', 'filling', 'completed']} />
          )
        ) : (
          <TrackingOrderCard
            order={order}
            stage={stage}
            steps={steps}
            showContactRow={showContactRow}
            activeProgress={phase === 'toUserPickup' ? pickupProgress : undefined}
          />
        )}

        {(isBatch ? !!upNextOrder : !!singleButtonLabel) && (
          <TouchableOpacity style={styles.completeButton} onPress={handlePrimaryAction}>
            <Text style={styles.completeButtonText}>
              {isBatch
                ? batchDelivering
                  ? 'Complete Delivery'
                  : 'Start Filling'
                : singleButtonLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <NewOrderRequestModal
        visible={showNewOrderModal}
        order={QUEUED_ORDER}
        onAccept={handleAcceptQueued}
        onDecline={handleDeclineQueued}
      />

      <DeliveryCompleteModal
        visible={showCompleteModal}
        orderId={isBatch ? `${queue.length} orders` : order.id}
        customerName={isBatch ? 'Batch delivery' : order.customerName}
        earned={isBatch ? batchEarned : order.tip ?? 10}
        stats={{ todayDeliveries: isBatch ? 3 + queue.length : 3, totalEarned: 470 + (isBatch ? batchTotal : 0), rating: 4.9 }}
        onDismiss={handleCloseComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 36,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  bottomSheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
    gap: 12,
  },
  queueCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    paddingTop: 2,
    paddingBottom: 8,
    gap: 12,
  },
  queueHandle: {
    alignSelf: 'center',
    width: 49,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#F4F4F4',
    marginTop: 8,
  },
  queueHeaderRow: {
    paddingHorizontal: 16,
  },
  queueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  queueList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
    paddingVertical: 8,
    gap: 12,
    shadowColor: 'rgba(12,12,13,0.15)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginHorizontal: 12,
  },
  completeButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PrimaryButton from '@/components/PrimaryButton';
import BackButton from '@/components/BackButton';
import HostelDropDown from '@/components/HostelDropDown'
import LocationDropDown from '@/components/LocationDropDown'
import Table from '@/components/Table';
import TableDelivery from '@/components/TableDelivery'

const { height, width } = Dimensions.get('window');



const FillingProcess = ({navigation}) => {
  const [selectCount, setSelectCount] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const isButtonDisabled = totalBookings > selectCount
  const BASE_CUSTOMER_URL = "https://backend-node-0kx8.onrender.com";
  const ORDER_STATUSES = ["pending", "picked", 'in progress',  "Filling", "filling completed", "completed"];

  const handleSelectedCount = (selectCount, totalCount, price) => {
    setSelectCount(selectCount)
    setTotalBookings(totalCount)
    setTotalPrice(price)
  }

   const updateOrderStatus = useCallback(async (orderId, newStatus) => {
        if (!ORDER_STATUSES.includes(newStatus)) {
          console.error("Invalid status value:", newStatus);
          return;
        }
      
        try {
          const response = await fetch(`${BASE_CUSTOMER_URL}/api/orders/order/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newOrderStatus: newStatus }),
          });
      
          if (!response.ok) {
            const errorData = await response.json(); // Read the response body once
            throw new Error(errorData.message || "Failed to update order status");
          }
      
          const data = await response.json(); // Read the response body once
          console.log('status', data);
      
          setOrders(prevOrders => ({
            data: prevOrders.data.map(order =>
              order._id === orderId ? { ...order, orderStatus: newStatus } : order
            )
          }));
      
        } catch (err) {
          console.error("Error updating order status:", err.message);
        }
      }, []);



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerText}>Cylinder Delivery</Text>
      </View>
    
      <View style={{
        flexDirection : 'row',
        paddingVertical : 12,
        alignItems : 'center'
      }}>
            <HostelDropDown/>
            <LocationDropDown/>
            <Text> 0 <Text style ={{
              color : 'rgba(0, 0, 0, 0.60)'
            }}>/ 4 Delivered</Text> </Text>
      </View>

      <TableDelivery onSelectCountChange={handleSelectedCount} />

      <View style={{
  
      }}>
        <PrimaryButton title = 'Complete Delivery' disabled={isButtonDisabled} onPress={() => navigation.navigate('Home')} />
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 88,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.20)',
    paddingBottom: 8,
    alignSelf: 'stretch',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
  },

});

export default FillingProcess;
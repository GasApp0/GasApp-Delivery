import { Image, StyleSheet, Platform, View, Text, TextInput,FlatList, TouchableOpacity ,ScrollView, Picker  } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import HostelDropDown from '@/components/HostelDropDown'
import LocationDropDown from '@/components/LocationDropDown'
import Table from '@/components/Table';
import PrimaryButton from '@/components/PrimaryButton';



export default function Home({ navigation }) {
  const [selectCount, setSelectCount] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [filteredOrders, setFilterOrders] = useState([])
  const [orders, setOrders] = useState({ data: [] });
  const BASE_CUSTOMER_URL = "https://backend-node-0kx8.onrender.com";
  const ORDER_STATUSES = ["pending", "picked", 'in progress',  "Filling", "filling completed", "completed"];

  const handleSelectedCount = (selectCount, totalCount, price, filteredOrders) => {
    setSelectCount(selectCount);
    setTotalBookings(totalCount);
    setTotalPrice(price);
    setFilterOrders(filteredOrders)
  };

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


  const startFilling = () => {
    if (filteredOrders.length === 0 ){
      console.error('No orders selected')
      return
    }

    try {
      for (const order of filteredOrders) {
         updateOrderStatus(order._id, 'in progress')
      }

      navigation.navigate('FillingProcess', {
      filteredOrders: Array.isArray(filteredOrders) ? filteredOrders : []})

    } catch(err) {
      console.error("Error starting filling process:", err.message);

    }
  }
 
  const isButtonDisabled = totalBookings > selectCount;

  return (
    <View style={styles.main}>
      <View style={styles.contentWrapper}>
        {/* Main content */}
        <View style ={{

          gap : 12,
          // backgroundColor: 'red',
        }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
          
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                  backgroundColor: '#f5f5f5',
                }}
              ></View>
              <View
                style={{
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 16,
                  }}
                >
                  Oi Mandem
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: '#4F4F4F)',
                  }}
                >
                  Tap to view app settings
                </Text>
              </View>
            </View>

            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <Path
                d="M12.02 2.90997C8.71003 2.90997 6.02003 5.59997 6.02003 8.90997V11.8C6.02003 12.41 5.76003 13.34 5.45003 13.86L4.30003 15.77C3.59003 16.95 4.08003 18.26 5.38003 18.7C9.69003 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.28 13.34 18.02 12.41 18.02 11.8V8.90997C18.02 5.60997 15.32 2.90997 12.02 2.90997Z"
                stroke="#828282"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <Path
                d="M13.87 3.2C13.56 3.11 13.24 3.04 12.91 3C11.95 2.88 11.03 2.95 10.17 3.2C10.46 2.46 11.18 1.94 12.02 1.94C12.86 1.94 13.58 2.46 13.87 3.2Z"
                stroke="#828282"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M15.02 19.06C15.02 20.71 13.67 22.06 12.02 22.06C11.2 22.06 10.44 21.72 9.89999 21.18C9.35999 20.64 9.01999 19.88 9.01999 19.06"
                stroke="#828282"
                strokeWidth="2"
                strokeMiterlimit="10"
              />
            </Svg>
          </View>

          <View style={{
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
         gap : 12,
        
      }}>
            <Text style={{
                fontSize : 20,
                fontWeight : '700'
            }}>Today's Bookings</Text>
            <View style={{
                paddingVertical: 8,
                borderRadius : 16,
                backgroundColor : 'black',
                paddingHorizontal: 12
            }}><Text style={{
                color : 'white',
                fontSize : 16
            }}>View Map</Text></View>
      </View>

        <View style={{
          flexDirection: 'row',
          alignItems :'center',
          justifyContent : 'Space-Between',
          zIndex : 1000,
        }}>
            <HostelDropDown/>
            <LocationDropDown/>
            <Text> {selectCount} / {totalBookings} { selectCount > 1 ?  'Cylinder' : 'Cylinders' } </Text>
        </View>    
         
          <Table onSelectCountChange={handleSelectedCount} />
        </View>

    
        <View style={styles.footer}>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>Cost Summary</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>Total Amount to be bought</Text>
          <Text style={styles.price}>GHC {totalPrice}.00</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>Commission</Text>
          <Text>GHC 26.00</Text>
        </View>
        <View style={{ width: 'auto', height: 1, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.10)' }}></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>Total Cost</Text>
          <Text>GHC 346.00</Text>
        </View>
          <PrimaryButton
            title={'Start Filling'}
            onPress={startFilling}
            disabled={isButtonDisabled}
          />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  main: {
    flex: 1, // Ensures the container fills the screen
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingTop: 30,
  },
  contentWrapper: {
    flex: 1, // Allows the main content to take up available space
    justifyContent: 'space-between', // Spreads content and footer

  },
  container: {
    flexDirection: 'column',
    gap: 24,
    padding: 16,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(34, 49, 185, 0.03)',
    borderRadius: 16,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
  },
  col1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrap: {
    gap: 16,
  },
  footer: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    backgroundColor: '#F5F5F5',
    alignSelf: 'stretch',
    gap: 16,
    position: 'static',
    bottom : '0%'
  },
});
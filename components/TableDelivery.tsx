import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Modal, Linking, Button, Dimensions } from 'react-native';

const BASE_CUSTOMER_URL = "https://backend-node-0kx8.onrender.com";
const ORDER_STATUSES = ["pending", "picked", "filling", "filling completed", "completed"];

const StudentModal = ({ student, onClose }) => (
  <View style={styles.modalContent}>
    <Text>Name: {student?.customerName}</Text>
    <Text>Phone: {student?.Phone}</Text>
    <Button title="Call" onPress={() => Linking.openURL(`tel:${student?.Phone}`)} />
    <Button title="WhatsApp" onPress={() => Linking.openURL(`https://wa.me/${student?.Phone}`)} />
    <Button title="Close" onPress={onClose} />
  </View>
);

const TableHeader = () => (
  <View style={styles.headerContainer}>
    {['#', 'Name', 'Hostel', 'Size', 'Price'].map(header => (
      <Text key={header} style={styles.headerText}>{header}</Text>
    ))}
  </View>
);

const Table = ({ onSelectCountChange }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [orders, setOrders] = useState({ data: [] });
  const [riderInfo, setRiderInfo] = useState('');
  const [userID, setUserID] = useState('')

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
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, ridersResponse] = await Promise.all([
          fetch(`${BASE_CUSTOMER_URL}/api/orders/orders`),
          fetch(`${BASE_CUSTOMER_URL}/api/riders/riders`)
        ]);

        if (!ordersResponse.ok || !ridersResponse.ok) 
          throw new Error("Failed to fetch data");

        const ordersData = await ordersResponse.json();
        const ridersData = await ridersResponse.json();
        const uniqueUserID = [...new Set(ordersData.data.map(user => user._id))]
        setUserID(uniqueUserID[0] || '')
        // console.log("riderInfo")


        // console.log(ordersData[0]._id)

        const uniqueRiderSchool = [...new Set(ridersData.data.map(rider => rider.schoolAssigned))];
        setRiderInfo(uniqueRiderSchool[0] || '');
        setOrders({ data: ordersData.data });
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };

    fetchData();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.data.filter(order => order.schoolName === riderInfo);
  }, [orders.data, riderInfo]);

  const totalPrice = useMemo(() => {
    return selectedOrders.reduce((sum, id) => {
      const selectedOrder = filteredOrders.find(order => order._id === id);
      return sum + (selectedOrder ? parseFloat(selectedOrder.orderAmount) : 0);
    }, 0);
  }, [selectedOrders, filteredOrders]);

  useEffect(() => {
    onSelectCountChange(selectedOrders.length, filteredOrders.length, totalPrice, filteredOrders);
  }, [selectedOrders, totalPrice, filteredOrders, onSelectCountChange]);

  const handleSelection = useCallback(async (id) => {
    setSelectedOrders(prev => {
      const newSelectedIds = prev.includes(id) 
        ? prev.filter(selectId => selectId !== id) 
        : [...prev, id];
  
      // Update order status to "completed" when selected
      if (newSelectedIds.includes(id)) {
        updateOrderStatus(id, "completed");
        setOrders(prevOrders => ({
          data: prevOrders.data.map(order => 
            order._id === id ? { ...order, orderStatus: "completed" } : order
          )
        }));
      }
  
      return newSelectedIds;
    });
  }, [updateOrderStatus]);

  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedOrders.includes(item._id);
    return (
      <TouchableOpacity onPress={() => handleSelection(item._id)}>
        <View style={[styles.rowContainer, isSelected && styles.selected]}>
          <Text style={styles.rowText}>{item.orderId}</Text>
          <TouchableOpacity onPress={() => {
            setSelectedStudent(item);
            setModalVisible(true);
          }}>
            <Text style={styles.rowText}>{item.customerName}</Text>
          </TouchableOpacity>
          <Text style={styles.rowText}>{item.hostelName}</Text>
          <Text style={styles.rowText}>{item.size}</Text>
          <Text style={styles.rowText}>{item.orderAmount}</Text>
        </View>
      </TouchableOpacity>
    );
  }, [selectedOrders, handleSelection]);

  return (
    <ScrollView horizontal>
      <View style={[styles.tableContainer, { width: Dimensions.get('window').width }]}>
        <TableHeader />
        <FlatList
          data={filteredOrders}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <StudentModal 
              student={selectedStudent} 
              onClose={() => {
                setModalVisible(false);
                setSelectedStudent(null);
              }} 
            />
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
    width: '161%',
    alignSelf: 'stretch',
    maxHeight: '95%',
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    padding: 9,
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-evenly'
  },
  selected: {
    backgroundColor: 'rgba(244, 244, 244, 1)'
  },
  rowText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Table;
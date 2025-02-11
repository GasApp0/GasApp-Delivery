import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Modal, Linking, Button, Dimensions } from 'react-native';

const Table = ({ onSelectCountChange, totalOrders }) => {
  const [selectBookingID, setSelectBookingID] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectStudent, setSelectedStudent] = useState(null);
  const BASE_CUSTOMER_URL = "https://backend-node-0kx8.onrender.com";
  const [orders, setOrders] = useState({ data: [] });
  const [riderLocation, setRiderLocation] = useState("");
  const [orderLocation, setOrderLocation] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [riderInfo, setRiderInfo] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_CUSTOMER_URL}/api/orders/orders`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();

        const uniqueSchoolName = [...new Set(data.data.map(order => order.schoolName))];
        setSchoolName(uniqueSchoolName);

        setOrders({ data: data.data });
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`${BASE_CUSTOMER_URL}/api/riders/riders`);
        if (!response.ok) throw new Error("Failed to fetch rider location");
        const data = await response.json();

        const uniqueRiderSchool = [...new Set(data.data.map(riderInfo => riderInfo.schoolAssigned))];
        setRiderInfo(uniqueRiderSchool[0] || '');
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchLocation();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.data.filter(order => order.schoolName === riderInfo);
  }, [orders.data, riderInfo])
  console.log(filteredOrders)

  const totalPrice = useMemo(() => {
    return selectBookingID.reduce((sum, id) => {
      const selectedOrder = filteredOrders.find(order => order._id === id);
      return sum + (selectedOrder ? parseFloat(selectedOrder.orderAmount) : 0);
    }, 0);
  }, [selectBookingID, filteredOrders]);

  useEffect(() => {
    onSelectCountChange(selectBookingID.length, filteredOrders.length, totalPrice);
  }, [selectBookingID, totalPrice, filteredOrders]);

  const handleSelection = (id) => {
    setSelectBookingID((prev) =>
      prev.includes(id) ? prev.filter((selectId) => selectId !== id) : [...prev, id]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>#</Text>
      <Text style={styles.headerText}>Name</Text>
      <Text style={styles.headerText}>Hostel</Text>
      <Text style={styles.headerText}>Size</Text>
      <Text style={styles.headerText}>Price</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const isSelected = selectBookingID.includes(item._id);
    return (
      <TouchableOpacity onPress={() => handleSelection(item._id)}>
        <View style={[styles.rowContainer, isSelected && styles.selected]}>
          <Text style={styles.rowText}>{item.orderId}</Text>
          <TouchableOpacity onPress={() => setSelectedStudent(item)}>
            <Text style={styles.rowText}>{item.customerName}</Text>
          </TouchableOpacity>
          <Text style={styles.rowText}>{item.hostelName}</Text>
          <Text style={styles.rowText}>{item.size}</Text>
          <Text style={styles.rowText}>{item.orderAmount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView horizontal>
      <View style={[styles.tableContainer, { width: Dimensions.get('window').width }]}>
        {renderHeader()}
        <FlatList
          data={filteredOrders}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Name: {selectStudent?.customerName}</Text>
              <Text>Phone: {selectStudent?.Phone}</Text>
              <Button title="Call" onPress={() => Linking.openURL(`tel:${selectStudent?.Phone}`)} />
              <Button title="WhatsApp" onPress={() => Linking.openURL(`https://wa.me/${selectStudent?.Phone}`)} />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
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
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-evenly',
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
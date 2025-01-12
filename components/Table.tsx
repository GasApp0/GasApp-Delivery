import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Modal, Linking, Button } from 'react-native';


const data = [
  { id: '1', No: '1', Name: 'Riely Ferguson', Hostel: 'Hall 7', Size: 'Small', Price: 'GHC 35' },
  { id: '2', No: '2', Name: 'lauren Jackson', Hostel: 'Evandy - Newsite', Size: 'Medium', Price: 'GHC 70'},
  { id: '3', No: '3', Name: 'Princess Rashida', Hostel: 'Victory Towers', Size: 'Medium', Price: 'GHC 70' },
  // Add more data as needed
];




const Table = ({onSelectCountChange}) => {
  
  const [selectBookingID, setSelectBookingID] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectStudent, setSelectedStudent] = useState(0)
  const BASE_CUSTOMER_URL = "https://backend-node-0kx8.onrender.com";
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/orders')
        if (!response.ok){
          throw new Error ("Failed To Fetch")
        }

        const data = await response.json()
        setOrders(data)
        console.log("orders")
      }
      catch (err) {
        setError(err.message)
      }
      finally {

      }
    } 

    fetchOrders();

  }, [])
 

  useEffect(() =>{
      const totalPrice = data.reduce((sum, item) => {
      const price = parseFloat(item.Price.replace('GHC', ''))
      return sum + price
    },0)

    setTotalPrice(totalPrice)

    onSelectCountChange(selectBookingID.length, data.length, totalPrice)
  },[selectBookingID])

  const handleSelection = (id) => {
    let updatedSelection;
    if (selectBookingID.includes(id)) {
      updatedSelection = selectBookingID.filter((selectId)=> selectId !== id )
      console.log(orders)

    }
    else {
      updatedSelection = ([...selectBookingID, id])
    }

    setSelectBookingID(updatedSelection)
  }
  
  const handleNamePress = (student) => {
    setSelectedStudent(student)
    setModalVisible(true)
  }

  const handleCall = () => {
    if (selectStudent?.Phone) {
      Linking.openURL(`tel:${selectedStudent.Phone}`)
    }
  }


  const handleWhatsApp = () => {
    if (selectStudent?.Phone) {
      Linking.openURL(`https://wa.me/${selectedStudent.Phone}`)
    }
  }

  const renderHeader = () => {

    return(
      <View style={styles.headerContainer}>
      <Text style={styles.headerNo}>#</Text>
      <Text style={styles.headerName}>Name</Text>
      <Text style={styles.headerHostel}>Hostel</Text>
      <Text style={styles.headerSize}>Size</Text>
      <Text style={styles.headerText}>Price</Text>
    </View>
    )
 
  };

  const renderItem = ({ item }) => {
    
    const isSelect = selectBookingID.includes(item.id)

    return(
      <TouchableOpacity onPress={() => handleSelection(item.id)}>
          <View style={[styles.rowContainer, isSelect && styles.selected]}>
          <Text style={styles.rowNo}>{item.No}</Text>
          <TouchableOpacity onPress={() => handleNamePress(item)}>
              <Text style={styles.rowName}>{item.Name}</Text>
          </TouchableOpacity>
          <Text style={styles.rowHostel}>{item.Hostel}</Text>
          <Text style={styles.rowSize}>{item.Size}</Text>
          <Text style={styles.rowText}>{item.Price}</Text>
        </View>
      </TouchableOpacity>
      
  )};

  return (
    <ScrollView horizontal>
      <View style={styles.tableContainer}>
        {renderHeader()}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType='slide'
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalText}>
                    {selectStudent?.Name}
                  </Text>
                  <Text style={styles.modalPhone}>
                      Phone: {selectStudent?.Phone}
                  </Text>
                  <Button title='Call' onPress={handleCall}/>
                  <Button title='WhatsApp' onPress={handleWhatsApp}/>
                  <Button
                      title='Close'
                      onPress={() => setModalVisible(false)}
                      color= 'red'
                  />
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
    width: '151%',
    alignSelf : 'stretch'
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
    padding : 9,
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
    backgroundColor : 'rgba(244, 244, 244, 1)'
  },
  rowText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  headerNo: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    paddingVertical : 9,
    
  },
  headerName: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 14,
    paddingVertical : 9,
    paddingHorizontal : 6,
    textDecorationStyle : 'double',
    textDecorationColor : 'blue'
  },
  rowName: {
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
    paddingLeft : 8,
    maxWidth : 70,
    textDecorationLine : 'underline'
  
  },
  headerHostel: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 14,
    paddingVertical : 9,
    paddingHorizontal : 6
  },
  headerSize: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 14,
    paddingVertical : 9,
    paddingHorizontal : 6
  },
  rowNo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    maxWidth : 33,
  },
  rowSize: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    paddingLeft : 4,
    
  },
  rowHostel: {
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
    paddingLeft : 28,
    maxWidth : 90,
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
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPhone: {
    fontSize: 16,
    marginBottom: 20,
  },
 
});

export default Table;

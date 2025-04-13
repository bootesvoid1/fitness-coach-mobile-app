import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

const apiUrl = `https://api.nutritionix.com/v1_1/item?upc=`;
const appId = '56cc565f';
const appKey = '949c97c36081a6b1558419808fd5ccf5';

const FoodTracker = () => {
  const [calories, setCalories] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fats, setFats] = useState(0);
  const [foodList, setFoodList] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app needs access to your camera to scan barcodes.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestCameraPermission();
  }, []);

  const handleBarcodeScanned = async (barcode) => {
    console.log('Barcode scanned:', barcode);
    try {
      const response = await axios.get(`${apiUrl}${barcode}&appId=${appId}&appKey=${appKey}`);
      const food = response.data;
      setCalories(calories + food.nf_calories);
      setCarbs(carbs + food.nf_total_carbohydrate);
      setProtein(protein + food.nf_protein);
      setFats(fats + food.nf_total_fat);
      setFoodList([...foodList, food]);
    } catch (error) {
      console.error(error);
    }
    setScanning(false);
  };

  const removeFood = (index) => {
    const food = foodList[index];
    setCalories(calories - food.nf_calories);
    setCarbs(carbs - food.nf_total_carbohydrate);
    setProtein(protein - food.nf_protein);
    setFats(fats - food.nf_total_fat);
    setFoodList(foodList.filter((_, i) => i !== index));
  };

  const startScanning = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (!granted) {
        Alert.alert('Camera permission is required to scan barcodes');
        return;
      }
    }
    setScanning(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubblesContainer}>
        <View style={styles.bubble}><Text style={styles.bubbleText}>Calories: {calories}</Text></View>
        <View style={styles.bubble}><Text style={styles.bubbleText}>Carbs: {carbs}</Text></View>
        <View style={styles.bubble}><Text style={styles.bubbleText}>Protein: {protein}</Text></View>
        <View style={styles.bubble}><Text style={styles.bubbleText}>Fats: {fats}</Text></View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={startScanning}>
        <Text style={styles.addButtonText}>Add Food</Text>
      </TouchableOpacity>
      {scanning && (
        <RNCamera
          style={styles.camera}
          onBarCodeRead={(e) => handleBarcodeScanned(e.data)}
        />
      )}
      <FlatList
        data={foodList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.foodItem}>
            <Text>{item.item_name}</Text>
            <TouchableOpacity onPress={() => removeFood(index)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  bubblesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  bubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  bubbleText: {
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
  },
  removeButton: {
    color: 'red',
  },
});

export default FoodTracker;

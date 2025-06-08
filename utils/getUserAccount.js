import AsyncStorage from '@react-native-async-storage/async-storage';
export async function storeData(idcard) {
  try {
    await AsyncStorage.setItem('idcard', String(idcard));
  } catch (e) {
    console.log('Error storing data', e);
  }
}

export async function getData() {
  try {
    const value = await AsyncStorage.getItem('idcard');
    if (value !== null) {
      console.log('Stored value:', typeof value);
      return value;
    }
  } catch (e) {
    console.log('Error reading value', e);
  }

}

export async function removeData() {
  try {
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage cleared');
  } catch (e) {
    console.error('❌ Error removing keys:', e);
  }
}

export async function medicineBefore(arr) {
  try {
    await AsyncStorage.setItem('eatBefore', JSON.stringify(arr));
  } catch (error) {
    console.error('Error storing eatBefore:', error);
  }
}

export async function medicineAfter(arr) {
  try {
    await AsyncStorage.setItem('eatAfter', JSON.stringify(arr));
  } catch (error) {
    console.error('Error storing eatAfter:', error);
  }

}

export async function getMedicineBefore() {
  try {
    const value = await AsyncStorage.getItem('eatBefore');
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('Error retrieving eatBefore:', error);
  }
}
export async function getMedicineAfter() {
  try {
    const value = await AsyncStorage.getItem('eatAfter');
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('Error retrieving eatAfter:', error);
  }
}
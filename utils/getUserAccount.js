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
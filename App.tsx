import { View } from 'react-native';
import { styles } from './styles';
import { requestForegroundPermissionsAsync as expoRequestForegroundPermissionsAsync, getCurrentPositionAsync, LocationAccuracy, LocationObject, watchPositionAsync } from "expo-location";
import { useEffect, useState, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  async function requestForegroundPermissionsAsync() {
    const { granted } = await expoRequestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);

    }
  }

  useEffect(() => {
    requestForegroundPermissionsAsync()
  }, []);

  useEffect(() => { 
    watchPositionAsync({accuracy: LocationAccuracy.Highest,
    timeInterval:1000,
  distanceInterval:1
}, (response) => {
    setLocation(response);
    mapRef.current?.animateCamera({
      pitch:70,
      center:response.coords
      
    })
});
  }, []);

  return (
    <View style={styles.container}>

      { 
      location && 

      <MapView ref={mapRef}
      style={styles.map}
      initialRegion={{latitude:location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta:0.005}}>

    <Marker coordinate={{latitude:location.coords.latitude,
      longitude: location.coords.longitude}}></Marker>



  </MapView>
      }
    </View>
  );
}

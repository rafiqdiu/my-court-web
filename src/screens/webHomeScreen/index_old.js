import React from 'react';
import { View, Text, StyleSheet, Dimensions,Platform } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';


const source = {
  html: `
  <iframe  src="https://new.bdlawservice.com/"  style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe>`
};
const width = Dimensions.get('window').width;

const HomeScreen = () => {

  const slyde_info= [
  { label: 'Our Fighting Is For Your Justice', value: '1' },
  { label: 'We Prepared To Oppose For You', value: '2' },
  ];
  return (
    <View style={styles.container}>
    { Platform.OS === 'web'?<iframe  src="https://new.bdlawservice.com/" style={{flex:1, width:'100%',height:1200, zIndex:99999 }} ></iframe>:
     <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={[...slyde_info]} 
                scrollAnimationDuration={5000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({item, index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {item.label}
                        </Text>
                    </View>
                )}
            />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
marginTop:0,
padding:0,
width:'100%',height:600
   // alignItems: 'center',
  //  justifyContent: 'center',
   // backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;

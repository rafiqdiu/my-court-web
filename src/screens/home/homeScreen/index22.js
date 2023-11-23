import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const width = Dimensions.get('window').width;

const HomeScreen = () => {

  const slyde_info= [
  { label: 'Our Fighting Is For Your Justice', value: '1' },
  { label: 'We Prepared To Oppose For You', value: '2' },
  ];
  return (
    <View style={styles.container}>
     
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
            />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   // backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;

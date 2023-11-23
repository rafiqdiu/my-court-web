import {StyleSheet,Dimensions,Platform, } from 'react-native';

const windowWidth = Dimensions.get('window').width;
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
  },
  rowJustifyCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowJustifyAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowJustifyBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  rowCenterCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexGrow: {
    flexGrow: 1,
  },
  contentWrapperCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    //fontFamily: 'open-sans-bold',
    fontSize: 18,
    color: '#333111',
  },
  paragraph: {
    // fontFamily: 'open-sans-regular',
    lineHeight: 20,
    marginVertical: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderRadius: 4,
    padding: 8,
    fontSize: 18,
    marginBottom: 5,
  },
  errorText: {
    color: '#ff0000',
    marginBottom: 10,
  },
  authForm: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 30,
    justifyContent: 'center',
    fontFamily:'SolaimanLipi'
  },
  hiddenInput: {
    width: 0,
    height: 0,
  },
  mainContainerMobile: {
    flex:1,
    flexDirection: 'column',
    zIndex:9999,
    fontFamily:'SolaimanLipi'
    
  },
  mainContainer: {
    flex:1,
    flexDirection: 'row',
    fontFamily:'SolaimanLipi'
  },
  mainContainerAdmin: {
    flex:1,
    flexDirection: 'row',
    backgroundColor: "rgb(0, 222, 144)",
    fontFamily:'SolaimanLipi'
  },
  LeftContainer: {
   flex: 1,
   backgroundColor: "#aa88aa" ,
   fontFamily:'SolaimanLipi'
  },
  bodyContainerMobile: {
    fontFamily:'SolaimanLipi',
    flex: Platform.OS === 'web'?11:15
  },
  bodyContainer: {
    fontFamily:'SolaimanLipi',
    flex: 6,
  },
});

export const images = {
  // defaultLogo: require('../assets/img/default-logo.png'),
  //defaultCover: require('../assets/img/default-cover.jpg'),
  //defaultProfile: require('../assets/img/default-profile.png'),
};

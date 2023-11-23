import { useFormikContext, useField } from "formik";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView, } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

const DropDownFormikEdit = ({ ...props }) => {
  const [openProvider, setOpenProvider] = useState(false);
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
   
    <DropDownPicker
      {...field}
      {...props}
      style={{
        ...props.style,
       
        flexDirection: 'row',
        alignItems: 'center',
      //  justifyContent: 'space-between',
        minHeight:responsiveHeight(4.10),
        height:'auto',
       // width: 319,
        //minHeight: 22,
        borderRadius: 2,
        borderWidth: 0,      
        paddingHorizontal: 10,
     //   paddingVertical: 0,       
        backgroundColor: field.value === ""? "#fff":"#FFF"
      }}
      searchPlaceholder="                      এখানে সার্চ করুন..            🔍"
      placeholderStyle={{   color: "#999898",}}
     
     // labelStyle={{height:10}}
      textStyle={{
        fontSize: 13,
        fontFamily:'SolaimanLipi',
       // paddingTop:-10,
       // paddingVertical:-5,
       // marginVertical:-5,
        lineHeight:13
      }}
      // customItemContainerStyle={{
      //   maxHeight:20
      // }}
      selectedItemContainerStyle={{
        maxHeight:'auto',
        paddingVertical:10,
      }}
      
      listItemContainerStyle={{
       // maxHeight:'auto',
        width:'auto',
      paddingVertical:-10, 
      marginVertical:-7,
      }}
      customItemLabelStyle={{
        fontSize:13,
        fontFamily:'SolaimanLipi',
       // height:'auto'
       // paddingTop:-10,
       // paddingVertical:-5,
       // marginVertical:-5,
       // lineHeight:13
      }}
      listItemLabelStyle={{ paddingVertical:-10 }}
     // itemSeparatorStyle ={{ paddingVertical:-10, margin:-10}}
      
     // value={field.value}
     // open={openProvider}
     // setOpen={setOpenProvider}
      // setValue={(val) => {
      //   setFieldValue(field.name, val());
      // }}
    />
  );
};

export default DropDownFormikEdit;
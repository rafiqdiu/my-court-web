import React from 'react';
import {Text} from 'react-native';

export default function ErrorText({children}) {
  return (
    <Text
      style={{
        fontSize: 13,
        //textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#ff0000',
      }}
    >
      {children}
    </Text>
  );
}

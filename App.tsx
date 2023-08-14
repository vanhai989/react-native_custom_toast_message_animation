import React from 'react';
import {
  Button,
  View,
} from 'react-native';

import Toast from 'react-native-toast-message';
import toastConfig, { ToastType } from './src/configToast'


function App(): JSX.Element {

  const showToastMessage = () => {
    Toast.show({
      type: ToastType.success,
      text1: 'You have successfully show toast message'
  });
  }

  return (
      
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title='show toast message' onPress={showToastMessage} />
        <Toast topOffset={0} config={toastConfig} visibilityTime={3000} />
      </View>
  );
}

export default App;

import React from 'react';
import { StyleSheet } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

const LoadingIndicator = ({ loading = false, overlayColor = "rgba(255,255,255,0.4)", speed = 2 }) => {
  return (
    <AnimatedLoader
      source={require("../../assets/animations/loading.json")} 
      visible={loading}
      overlayColor={overlayColor}
      animationStyle={styles.lottie}
      speed={speed}
      loop={true}
    />
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 400,
  },
});

export default LoadingIndicator;

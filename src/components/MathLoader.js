import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const NUM_BLADES = 12;
const ANIMATION_DURATION = 1000;
const DELAY_BETWEEN = ANIMATION_DURATION / NUM_BLADES; // ≈83 мс

const MathLoader = () => {
  // Створюємо масив Animated.Value для кожного "лопатки"
  const animations = useRef(
    [...Array(NUM_BLADES)].map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    animations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * DELAY_BETWEEN),
          Animated.timing(anim, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          // миттєве повернення до початкового значення для повторення циклу
          Animated.timing(anim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [animations]);

  const spinnerSize = Dimensions.get('window').height * 0.05; // Розмір спінера
  const bladeWidth = spinnerSize * 0.074;
  const bladeHeight = spinnerSize * 0.2777;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.spinner, { width: spinnerSize, height: spinnerSize }]}>
        {animations.map((anim, index) => {
          const rotation = index * (360 / NUM_BLADES);
          return (
            <Animated.View
              key={index}
              style={[
                styles.blade,
                {
                  opacity: anim,
                  width: bladeWidth,
                  height: bladeHeight,
                  transform: [
                    { rotate: `${rotation}deg` },
                    { translateY: -spinnerSize / 2 + bladeHeight / 2 },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '10%',
    marginLeft: '7%',
  },
  spinner: {
    position: 'relative',
  },
  blade: {
    position: 'absolute',
    backgroundColor: '#69717d',
    borderRadius: 2,
  },
});

export default MathLoader;
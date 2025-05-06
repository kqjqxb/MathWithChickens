import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import onbMathData from '../components/onbMathData';
import { useNavigation } from '@react-navigation/native';

const fontRammetoOneRegular = 'RammettoOne-Regular';
const fontRanchersRegular = 'Ranchers-Regular';

const MathOnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [thisNathIndexSlide, setThisNathIndexSlide] = useState(0);
  const mathRefSlides = useRef(null);
  const mathHorizontallScrollRef = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

 

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setThisNathIndexSlide(viewableItems[0].index);
    }
  }).current;

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNextMathSlide = () => {
    if (thisNathIndexSlide >= onbMathData.length - 1) {
      navigation.replace('MathWithHomeScreen');
    } else {
      mathRefSlides.current.scrollToIndex({ index: thisNathIndexSlide + 1 });
    }
  };

  const mathItemRender = ({ item }) => (
    <View style={{
      flex: 1,

      alignItems: 'center',

      width: dimensions.width,

      justifyContent: 'space-between',

      height: dimensions.height,
    }}>
      <View style={{
        alignSelf: 'center',
        width: dimensions.width,
        alignItems: 'center',
      }}>
        <Image
          source={item.itemImage}
          style={{
            alignSelf: 'center',
            height: dimensions.height * 0.5,
            width: dimensions.width * 0.8,
            marginTop: -dimensions.height * 0.05,
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            marginTop: -dimensions.height * 0.05,
            fontWeight: 700,
            paddingHorizontal: dimensions.width * 0.05,
            fontFamily: fontRammetoOneRegular,
            fontSize: dimensions.width * 0.06,
          }}>
          {item.mathMainText}
        </Text>

        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontFamily: fontRanchersRegular,
            fontWeight: 700,
            fontSize: dimensions.width * 0.05,
            paddingHorizontal: dimensions.width * 0.05,
            marginTop: dimensions.height * 0.02,
          }}>
          {item.mathSecondaryText}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#86CBDD',
      }}
    >
      <View style={{ display: 'flex' }}>
        <FlatList
          ref={mathRefSlides}
          horizontal
          renderItem={mathItemRender}
          scrollEventThrottle={32}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={viewableItemsChanged}
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          data={onbMathData}
          pagingEnabled
          viewabilityConfig={viewConfig}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: mathHorizontallScrollRef } } }], {
            useNativeDriver: false,
          })}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          handleNextMathSlide();
        }}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          borderColor: '#000',
          borderRadius: dimensions.width * 0.028,
          justifyContent: 'center',
          borderWidth: dimensions.width * 0.0028,
          bottom: dimensions.height * 0.05,
          height: dimensions.height * 0.078,
          backgroundColor: '#FFE066',
          width: dimensions.width * 0.7,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#5C4033',
            fontFamily: fontRanchersRegular,
            fontWeight: 700,
            fontSize: dimensions.width * 0.08,
            textAlign: 'center',
          }}>
          {thisNathIndexSlide >= onbMathData.length - 1 ? 'Start Learning' : 'Next'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MathOnboardingScreen;

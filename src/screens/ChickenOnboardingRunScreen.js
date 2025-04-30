import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import chickenOnboardingImagesData from '../components/chickenOnboardingImagesData';
import { useNavigation } from '@react-navigation/native';

const fontKronaOneRegular = 'KronaOne-Regular';

const fontRammetoOneRegular = 'RammettoOne-Regular';
const fontRanchersRegular = 'Ranchers-Regular';

const ChickenOnboardingRunScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [thisNathIndexSlide, setThisNathIndexSlide] = useState(0);
  const mathRefSlides = useRef(null);
  const mathHorizontallScrollRef = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  const viewableItemsChanged = useRef(({ viewableMathItems }) => {
    if (viewableMathItems && viewableMathItems.length > 0) {
      setThisNathIndexSlide(viewableMathItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNextMathSlide = () => {
    if (thisNathIndexSlide >= chickenOnboardingImagesData.length - 1) {
      navigation.replace('ChickenRunHomeScreen');
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
            marginTop: -dimensions.height * 0.05,
            width: dimensions.width * 0.8,
            height: dimensions.height * 0.5,
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            textAlign: 'center',
            marginTop: -dimensions.height * 0.05,
            fontFamily: fontRammetoOneRegular,
            paddingHorizontal: dimensions.width * 0.05,
            color: 'white',
            fontWeight: 700,
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
          bounces={false}
          horizontal
          scrollEventThrottle={32}
          ref={mathRefSlides}
          renderItem={mathItemRender}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={viewableItemsChanged}
          keyExtractor={(item) => item.id.toString()}
          data={chickenOnboardingImagesData}
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
          alignItems: 'center',
          borderColor: '#000',
          borderRadius: dimensions.width * 0.028,
          justifyContent: 'center',
          borderWidth: dimensions.width * 0.0028,
          height: dimensions.height * 0.078,
          backgroundColor: '#FFE066',
          width: dimensions.width * 0.7,
          position: 'absolute',
          bottom: dimensions.height * 0.05,
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
          {thisNathIndexSlide >= chickenOnboardingImagesData.length - 1 ? 'Start Learning' : 'Next'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChickenOnboardingRunScreen;

import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import chickenOnboardingImagesData from '../components/chickenOnboardingImagesData';
import { useNavigation } from '@react-navigation/native';

const fontKronaOneRegular = 'KronaOne-Regular';

const ChickenOnboardingRunScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [currentIndexOfChickenSlide, setCurrentIndexOfChickenSlide] = useState(0);
  const refOfChicken = useRef(null);
  const ChickenRefHorizontalScrollX = useRef(new Animated.Value(0)).current;
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

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndexOfChickenSlide(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollNextChickenSlide = () => {
    if (currentIndexOfChickenSlide >= chickenOnboardingImagesData.length - 1) {
      navigation.replace('ChickenRunHomeScreen');
    } else {
      refOfChicken.current.scrollToIndex({ index: currentIndexOfChickenSlide + 1 });
    }
  };

  const renderChickenItem = ({ item }) => (
    <View style={{
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      height: dimensions.height,
      width: dimensions.width,
    }}>
      <View style={{
        alignSelf: 'flex-end',
        alignItems: 'center',
        width: dimensions.width,
      }}>
        <Image
          source={item.itemImage}
          style={{
            height: dimensions.height * 0.65,
            alignSelf: 'center',
            marginTop: dimensions.height * 0.1,
            width: dimensions.width * 0.9,
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
      }}
    >
      {/* <LinearGradient
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        colors={['#F88700', '#FE1B2F']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      /> */}
      <View style={{ display: 'flex' }}>
        <FlatList
          horizontal
          scrollEventThrottle={32}
          showsHorizontalScrollIndicator={false}
          ref={refOfChicken}
          onViewableItemsChanged={viewableItemsChanged}
          renderItem={renderChickenItem}
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          data={chickenOnboardingImagesData}
          pagingEnabled
          viewabilityConfig={viewConfig}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: ChickenRefHorizontalScrollX } } }], {
            useNativeDriver: false,
          })}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          scrollNextChickenSlide();
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          borderWidth: dimensions.width * 0.003,
          justifyContent: 'center',
          backgroundColor: '#fff',
          borderRadius: dimensions.width * 0.0616161,
          height: dimensions.height * 0.08,
          width: dimensions.width * 0.8818,
          position: 'absolute',
          bottom: dimensions.height * 0.05,
          borderColor: 'black',
          marginTop: dimensions.height * 0.03,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: 'black',
            fontFamily: fontKronaOneRegular,
            fontWeight: 700,
            paddingHorizontal: dimensions.width * 0.05,
            fontSize: dimensions.width * 0.06,
          }}>
          {currentIndexOfChickenSlide >= chickenOnboardingImagesData.length - 1 ? 'Start' : 'Next'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChickenOnboardingRunScreen;

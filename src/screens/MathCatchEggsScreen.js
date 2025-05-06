import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Animated,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';

import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const colorEggs = [
  {
    id: 1,
    image: require('../assets/images/catchEggImages/egg1.png'),
    itemPoints: 1
  },
  {
    id: 2,
    image: require('../assets/images/catchEggImages/egg2.png'),
    itemPoints: 2
  },
  {
    id: 3,
    image: require('../assets/images/catchEggImages/egg3.png'),
    itemPoints: 3
  },
  {
    id: 4,
    image: require('../assets/images/catchEggImages/egg4.png'),
    itemPoints: 4
  },
  {
    id: 5,
    image: require('../assets/images/catchEggImages/egg5.png'),
    itemPoints: 5
  },
  {
    id: 6,
    image: require('../assets/images/catchEggImages/egg6.png'),
    itemPoints: 6
  },
  {
    id: 7,
    image: require('../assets/images/catchEggImages/egg7.png'),
    itemPoints: 7
  },
  {
    id: 8,
    image: require('../assets/images/catchEggImages/egg8.png'),
    itemPoints: 8
  },
  {
    id: 9,
    image: require('../assets/images/catchEggImages/egg9.png'),
    itemPoints: 9
  },
];

const fontRanchersRegular = 'Ranchers-Regular';

const MathCatchEggsScreen = ({ setSelectedMathWithScreen, vibroMathEnabled }) => {
  const [dimensions] = useState(Dimensions.get('window'));

  const [eggFallingObjects, setEggFallingObjects] = useState([]);

  const [isFallingEggsStarted, setIsFallingEggsStarted] = useState(false);
  const styles = createMathFallingEggsGameStyles(dimensions);
  const [currentSumm, setCurrentSumm] = useState(0);
  const [catchedEggsModalVisible, setCatchedEggsModalVisible] = useState(false);
  const [targetSumm, setTargetSumm] = useState(Math.floor(Math.random() * (500 - 50 + 1)) + 50);

  const dropEggs = () => {
    const eggRandId = Math.floor(Math.random() * colorEggs.length);
    const selectedEggImage = colorEggs[eggRandId];

    const { id: ignored, ...selectedEggImageWithoutId } = selectedEggImage;

    const id = Math.floor(100000 + Math.random() * 900000);

    const randomHorizontalForEgg = Math.random() * (dimensions.width - 40);

    const eggSize = dimensions.height * (0.07 + Math.random() * (0.091 - 0.07));

    const newItem = {
      id,
      x: randomHorizontalForEgg,
      y: new Animated.Value(-dimensions.height * 0.1),
      caught: false,
      eggSize,
      ...selectedEggImageWithoutId,
    };

    setEggFallingObjects((prev) => [...prev, newItem]);

    Animated.timing(newItem.y, {
      toValue: dimensions.height + 50,
      duration: 3400,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        setEggFallingObjects((prev) => prev.filter((f) => f.id !== newItem.id));
      }, 0)
    });
  };

  useEffect(() => {
    let fallingEggsIntervalIdId = null;
    if (!catchedEggsModalVisible) {
      fallingEggsIntervalIdId = setInterval(() => {
        if (!catchedEggsModalVisible) {
          dropEggs();
        }
      }, 300);
    }
    return () => {
      if (fallingEggsIntervalIdId) clearInterval(fallingEggsIntervalIdId);
    };
  }, [catchedEggsModalVisible,]);

  return (
    <SafeAreaView style={{
      height: dimensions.height,
      flex: 1,
      width: dimensions.width,
    }}>
      <Image
        source={require('../assets/images/cathEggsBg.png')}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        resizeMode="cover"
      />

      {!isFallingEggsStarted ? (
        <>
          <View style={{
            width: '95%',
            alignSelf: 'center',
            backgroundColor: "#FFE066",
            borderColor: "black",
            borderWidth: dimensions.width * 0.003,
            borderRadius: dimensions.width * 0.03,
            paddingHorizontal: dimensions.width * 0.03,
            paddingVertical: dimensions.height * 0.02,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            marginTop: Platform.OS === 'android' ? dimensions.height * 0.03 : 0,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              marginBottom: dimensions.height * 0.03,

            }}>
              <Image
                source={require('../assets/images/mathPlayButton.png')}
                style={{
                  width: dimensions.width * 0.3,
                  height: dimensions.height * 0.15,
                  marginRight: dimensions.width * 0.05,
                }}
                resizeMode="contain"
              />
              <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.12 }]}>
                Play Game
              </Text>
            </View>

            <Text style={[styles.ranchesTextStyles, {
              fontSize: dimensions.width * 0.06,
              textAlign: 'left',
              marginBottom: dimensions.height * 0.03,

            }]}>
              Move your chicken left and right to catch eggs with numbers! {'\n'}Add up the numbers to reach the target sum — but don’t go over it! Avoid anvils — catching one means game over!
              {'\n\n'}Tips:
              {'\n   '} • Watch the falling eggs carefully.
              {'\n   '} • Plan your moves to hit the target exactly!
            </Text>

            <TouchableOpacity
              onPress={() => setIsFallingEggsStarted(true)}
              style={[styles.mathCancelConfirmButtons, {
                backgroundColor: '#0AFF05',
              }]}>
              <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.08 }]}>
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <SafeAreaView>
          <View style={{
            width: dimensions.width,
            height: dimensions.height * 0.14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFE066',
            borderWidth: dimensions.width * 0.003,
            borderColor: '#5C4033',
            zIndex: 5555
          }}>
            <View style={{
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRightWidth: dimensions.width * 0.0015,
              height: '100%',
              borderRightColor: '#5C4033',
            }}>
              <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.075 }]}>
                Current summ:
              </Text>

              <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.1 }]}>
                {currentSumm}
              </Text>
            </View>

            <View style={{
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeftWidth: dimensions.width * 0.0015,
              height: '100%',
              borderLeftColor: '#5C4033',
            }}>
              <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.075 }]}>
                Target summ:
              </Text>

              <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.1 }]}>
                {targetSumm}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: dimensions.width,
              height: dimensions.height * 0.88,
              alignSelf: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            {eggFallingObjects.map((item) => (
              <Animated.View
                key={item.id}
                style={{
                  top: item.y,
                  position: 'absolute',
                  left: item.x,
                  zIndex: 50,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setCurrentSumm((prev) => prev + item.itemPoints);
                    if (currentSumm + item.itemPoints >= targetSumm) {
                      setCatchedEggsModalVisible(true);

                      if (vibroMathEnabled) {
                        ReactNativeHapticFeedback.trigger(currentSumm + item.itemPoints === targetSumm ? "impactLight" : "impactMedium", {
                          enableVibrateFallback: true,
                          ignoreAndroidSystemSettings: false,
                        });
                      }
                    }
                    setEggFallingObjects((prev) => prev.filter((f) => f.id !== item.id));
                  }}
                >
                  <Image
                    source={item.image}
                    style={{
                      width: item.eggSize,
                      height: item.eggSize,
                      resizeMode: 'contain',
                      zIndex: 50
                    }}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              setSelectedMathWithScreen('Home');
            }}
            style={{
              backgroundColor: '#FFE066',
              borderRadius: dimensions.width * 0.8,
              width: dimensions.height * 0.1,
              height: dimensions.height * 0.1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: Platform.OS === 'android' ? dimensions.height * 0.104 : dimensions.height * 0.19,
              right: dimensions.width * 0.05,
              zIndex: 5555,
              opacity: catchedEggsModalVisible ? 0 : 1,
            }}
          >
            <Image
              source={require('../assets/icons/goHomeMathIcon.png')}
              style={{
                width: dimensions.height * 0.07,
                height: dimensions.height * 0.07,
                alignSelf: 'center',
              }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={catchedEggsModalVisible}
        onRequestClose={() => {
          setCatchedEggsModalVisible(!catchedEggsModalVisible);
        }}
      >
        <SafeAreaView style={{
          flex: 1,
          width: dimensions.width,
          height: dimensions.height,
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}>
          <View
            style={{
              width: dimensions.width,
              height: dimensions.height,
              position: 'absolute',
              backgroundColor: 'rgba(125, 162, 47, 0.7))',
              zIndex: 0
            }}
          />

          <View style={{
            paddingHorizontal: 0,
            backgroundColor: '#FFE066',
            borderRadius: dimensions.width * 0.03,
            paddingVertical: dimensions.width * 0.07,
            alignItems: 'center',
            justifyContent: 'center',
            width: '91%',
            marginTop: dimensions.height * 0.03,
          }}>
            <Image
              source={currentSumm === targetSumm
                ? require('../assets/images/positiveChicken.png')
                : require('../assets/images/sadChicken.png')
              }
              style={{
                width: dimensions.width * 0.4,
                height: dimensions.height * 0.23,
                alignSelf: 'center',
              }}
              resizeMode='contain'
            />
            <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.08 }]}>
              {currentSumm > targetSumm ? 'Too much! \nTry again!' : 'Great job! \nYou reached the target sum!'}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            position: 'absolute',
            alignSelf: 'center',
            bottom: dimensions.height * 0.05,
          }}>
            <TouchableOpacity
              onPress={() => {
                setCatchedEggsModalVisible(false);
                setCurrentSumm(0);
                setTargetSumm(Math.floor(Math.random() * (500 - 50 + 1)) + 50);
                setEggFallingObjects([]);
              }}
              style={[styles.modalBottomButtons, {
                bottom: dimensions.height * 0.01,
                left: dimensions.width * 0.37,
              }]}
            >
              <Image
                source={require('../assets/icons/settingsIcons/resetMathProgress.png')}
                style={{
                  width: dimensions.height * 0.07,
                  height: dimensions.height * 0.07,
                  alignSelf: 'center',
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedMathWithScreen('Home');
              }}
              style={[styles.modalBottomButtons, {
                bottom: dimensions.height * 0.01,
                right: dimensions.width * 0.05,
              }]}
            >
              <Image
                source={require('../assets/icons/goHomeMathIcon.png')}
                style={{
                  width: dimensions.height * 0.07,
                  height: dimensions.height * 0.07,
                  alignSelf: 'center',
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>

          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const createMathFallingEggsGameStyles = (dimensions) => StyleSheet.create({
  ranchesTextStyles: {
    color: '#5C4033',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: fontRanchersRegular,
  },
  mathCancelConfirmButtons: {
    width: '80%',
    height: dimensions.height * 0.08,
    borderRadius: dimensions.width * 0.03,
    borderWidth: dimensions.width * 0.003,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBottomButtons: {
    backgroundColor: '#FFE066',
    borderRadius: dimensions.width * 0.8,
    width: dimensions.height * 0.1,
    height: dimensions.height * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 5555,
  }
});

export default MathCatchEggsScreen;

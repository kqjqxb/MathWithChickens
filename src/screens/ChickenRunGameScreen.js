import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Modal,
    StyleSheet,
    ImageBackground,
    Animated,
    PanResponder,
    Share
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeftIcon, Bars3Icon } from 'react-native-heroicons/solid';

const fontKronaOneRegular = 'KronaOne-Regular';

const chickenSkinsData = [
    {
        id: 0,
        image: require('../assets/images/chickenSkins/chickenSkin0.png'),
    },
    {
        id: 1,
        image: require('../assets/images/chickenSkins/chickenSkin1.png'),
    },
    {
        id: 2,
        image: require('../assets/images/chickenSkins/chickenSkin2.png'),
    },
    {
        id: 3,
        image: require('../assets/images/chickenSkins/chickenSkin3.png'),
    },
    {
        id: 4,
        image: require('../assets/images/chickenSkins/chickenSkin4.png'),
    },
    {
        id: 5,
        image: require('../assets/images/chickenSkins/chickenSkin5.png'),
    },
    {
        id: 6,
        image: require('../assets/images/chickenSkins/chickenSkin6.png'),
    },
];

const barriers = [
    {
        id: 1,
        image: require('../assets/images/chickenAggImage.png'),
        isEgg: true,
        sizes: [
            { width: 0.1, height: 0.1 },
        ]
    },
    {
        id: 2,
        image: require('../assets/images/roadItems/rock1.png'),
        isEgg: false,
        sizes: [
            { width: 0.2, height: 0.05 },
        ]
    },
    {
        id: 3,
        image: require('../assets/images/roadItems/rock2.png'),
        isEgg: false,
        sizes: [
            { width: 0.2, height: 0.05 },
        ]
    },
    {
        id: 4,
        image: require('../assets/images/roadItems/rock3.png'),
        isEgg: false,
        sizes: [
            { width: 0.15, height: 0.07 },
        ]
    },
    {
        id: 5,
        image: require('../assets/images/roadItems/rock4.png'),
        isEgg: false,
        sizes: [
            { width: 0.14, height: 0.07 },
        ]
    },
    {
        id: 6,
        image: require('../assets/images/roadItems/fox.png'),
        isEgg: false,
        sizes: [
            { width: 0.2, height: 0.2 },
        ]
    },

];

const modalEggsImages = [
    {
        id: 1,
        fullEggImage: require('../assets/images/modalEggImages/fullEgg1.png'),
        emptyEggImage: require('../assets/images/modalEggImages/emptyEgg1.png'),
    },
    {
        id: 2,
        fullEggImage: require('../assets/images/modalEggImages/fullEgg2.png'),
        emptyEggImage: require('../assets/images/modalEggImages/emptyEgg2.png'),
    },
    {
        id: 3,
        fullEggImage: require('../assets/images/modalEggImages/fullEgg3.png'),
        emptyEggImage: require('../assets/images/modalEggImages/emptyEgg3.png'),
    },
]


const ChickenRunGameScreen = ({ setSelectedTimeChroniclesPage, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [eggBalance, setEggBalance] = useState(0);
    const styles = createChickenQuizStyles(dimensions);
    const [isRunGameStarted, setIsRunGameStarted] = useState(false);
    const [currenChickenSkin, setCurrentChickenSkin] = useState(0);

    const [chickenTimeLeft, setChickenTimeLeft] = useState(70);

    const [isChickenGamePaused, setChickenGamePaused] = useState(false);
    const [endChickenGameFinished, setEndChickenGameFinished] = useState(false);
    const [restartChickenTimerCounter, setRestartChickenTimerCounter] = useState(0);
    const [selectedChickenLevel, setSelectedChickenLevel] = useState(1);
    const [eggsCount, setEggsCount] = useState(0);
    const [ownedChickenLevels, setOwnedChickenLevels] = useState([1]);
    const [resumeCountdown, setResumeCountdown] = useState(false);
    const [countdownTime, setCountdownTime] = useState(3);

    const [chickenHorizontalXPos] = useState(new Animated.Value(0));
    const lastRockRef = useRef(null);
    const [chickenRunFallingRocks, setFallingFood] = useState([]);
    const [finishAnim] = useState(new Animated.Value(-dimensions.height));

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderRelease: (evt, gestureState) => {
                const chickenWidth = dimensions.height * 0.16;
                let newChickenX = chickenHorizontalXPos._value;

                if (gestureState.dx < -50) {
                    newChickenX = Math.max(0 - dimensions.width * 0.4, chickenHorizontalXPos._value - dimensions.width * 0.2);
                } else if (gestureState.dx > 50) {
                    newChickenX = Math.min(dimensions.width * 0.8 - chickenWidth, chickenHorizontalXPos._value + dimensions.width * 0.2);
                }

                Animated.spring(chickenHorizontalXPos, {
                    toValue: newChickenX,
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    const tryChickenCollisionOfElements = (item) => {
        if (isChickenGamePaused || endChickenGameFinished) return false;

        const currentChickenY = item.y._value;
        if (currentChickenY > dimensions.height * 0.7) return false;

        const chickenWidth = dimensions.height * 0.16;
        const chickenMargin = 0;
        const chickenLeftPos = chickenHorizontalXPos._value - chickenMargin;
        const chickenRightPos = chickenHorizontalXPos._value + chickenWidth + chickenMargin;
        const chickenCenterItem = item.x - dimensions.width * 0.25;
        return chickenCenterItem >= chickenLeftPos && chickenCenterItem <= chickenRightPos;
    };

    const chickenSpawnBarriers = () => {
        let randChickenBarrierItem = barriers[Math.floor(Math.random() * barriers.length)];
        let safetyBlock = 10;
        while (lastRockRef.current && lastRockRef.current.type === randChickenBarrierItem.type && safetyBlock > 0) {
            randChickenBarrierItem = barriers[Math.floor(Math.random() * barriers.length)];
            safetyBlock--;
        }
        lastRockRef.current = randChickenBarrierItem;

        const randBarrierXHorizontal = Math.random() * (dimensions.width - 40);

        const randomBarrierIndex = Math.floor(Math.random() * barriers.length);
        const chosenBarrierImage = barriers[randomBarrierIndex];
        const { id: ignored, ...chosenImgWithoutId } = chosenBarrierImage;

        const id = Math.floor(100000 + Math.random() * 900000);
        const newItem = {
            ...randChickenBarrierItem,
            x: randBarrierXHorizontal,
            y: new Animated.Value(-200),
            caught: false,
            id,
        };

        setFallingFood((prev) => [...prev, newItem]);

        const chickenVerticalCollisionY = dimensions.height * 0.65;

        const listenerId = newItem.y.addListener(({ value }) => {
            if (!newItem.caught && value >= chickenVerticalCollisionY) {
                if (tryChickenCollisionOfElements(newItem)) {
                    newItem.caught = true;
                    setTimeout(() => {
                        if (newItem.isEgg) {
                            setEggsCount((prev) => prev + 1);
                        } else {
                            setEndChickenGameFinished(true);
                        }
                        setFallingFood((prev) => prev.filter((f) => f.id !== newItem.id));
                    }, 0);
                    newItem.y.removeListener(listenerId);
                }
            }
        });

        Animated.timing(newItem.y, {
            toValue: dimensions.height + 50,
            duration: 4000,
            useNativeDriver: false,
        }).start(() => {
            newItem.y.removeListener(listenerId);
            setTimeout(() => {
                setFallingFood((prev) => prev.filter((f) => f.id !== newItem.id));
            }, 0);
        });
    };

    useEffect(() => {
        const runnedGame = async () => {
            try {
                const newEggBalance = eggBalance + eggsCount;
                await AsyncStorage.setItem('eggBalance', newEggBalance.toString());
                setEggBalance(newEggBalance);
            } catch (error) {
                console.error('Error saving data:', error);
            }
        };
        if (endChickenGameFinished) {
            runnedGame();
        }
    }, [endChickenGameFinished]);

    useEffect(() => {
        if (isChickenGamePaused || endChickenGameFinished) {
            chickenRunFallingRocks.forEach(item => {
                if (item.y && typeof item.y.stopAnimation === 'function') {
                    item.y.stopAnimation();
                }
            });
        }
    }, [isChickenGamePaused, endChickenGameFinished]);

    useEffect(() => {
        if (resumeCountdown && !endChickenGameFinished) {
            const intervalId = setInterval(() => {
                setCountdownTime((prev) => {
                    if (prev === 1) {
                        clearInterval(intervalId);
                        setResumeCountdown(false);
                        setRestartChickenTimerCounter((prev) => prev + 1);
                        return 3; 
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [resumeCountdown, endChickenGameFinished]);

    useEffect(() => {
        const chickenTimerInterval = setInterval(() => {
            setChickenTimeLeft((prev) => {
                if (prev === 0) {
                    clearInterval(chickenTimerInterval);
                    setEndChickenGameFinished(true);
                    return 0;
                }
                return isChickenGamePaused || !isRunGameStarted ? prev : prev - 1;
            });
        }, 1000);
        return () => clearInterval(chickenTimerInterval);
    }, [restartChickenTimerCounter, isChickenGamePaused, isRunGameStarted]);

    useEffect(() => {
        console.log('Owned levels:', ownedChickenLevels);
    }, [ownedChickenLevels]);


    useEffect(() => {
        let chickenTimerIdentif = null;
        if (!isChickenGamePaused && !endChickenGameFinished && isRunGameStarted && !resumeCountdown) {
            chickenTimerIdentif = setInterval(() => {
                if (!isChickenGamePaused && !endChickenGameFinished && isRunGameStarted) {
                    chickenSpawnBarriers();
                }
            }, 1000);
        }
        return () => {
            if (chickenTimerIdentif) clearInterval(chickenTimerIdentif);
        };
    }, [isChickenGamePaused, endChickenGameFinished, isRunGameStarted, resumeCountdown]);

    useEffect(() => {
        const updateOwnedChickenLevels = async () => {
            if (selectedChickenLevel < 5 && endChickenGameFinished && eggsCount >= 3) {
                try {
                    const storedLevels = await AsyncStorage.getItem('ownedChickenLevels');
                    let levels = storedLevels ? JSON.parse(storedLevels) : [1];
                    const newLevel = selectedChickenLevel + 1;
                    if (!levels.includes(newLevel)) {
                        levels.push(newLevel);
                        await AsyncStorage.setItem('ownedChickenLevels', JSON.stringify(levels));
                        setOwnedChickenLevels(levels); 
                    }
                } catch (error) {
                    console.error('Failed to update owned chicken levels of run:', error);
                }
            }
        };

        updateOwnedChickenLevels();
    }, [endChickenGameFinished, selectedChickenLevel]);

    const finishAnimStarted = useRef(false);

    useEffect(() => {
        if (chickenTimeLeft < 5.5 && !finishAnimStarted.current) {
            finishAnimStarted.current = true;
            finishAnim.setValue(-dimensions.height * 0.2);
            Animated.timing(finishAnim, {
                toValue: dimensions.height * 1.2,
                duration: 9000,
                useNativeDriver: false,
            }).start();
        }
    }, [chickenTimeLeft]);

    useEffect(() => {
        finishAnimStarted.current = false;
    }, [endChickenGameFinished])

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedEggBalance = await AsyncStorage.getItem('eggBalance');
                if (storedEggBalance !== null) {
                    setEggBalance(parseInt(storedEggBalance));
                }

                const storedLevels = await AsyncStorage.getItem('ownedChickenLevels');
                let levels = storedLevels ? JSON.parse(storedLevels) : [1];
                if (!storedLevels) {
                    await AsyncStorage.setItem('ownedChickenLevels', JSON.stringify(levels));
                }
                setOwnedChickenLevels(levels);

                const storedCurrentChickenSkin = await AsyncStorage.getItem('currenChickenSkin');
                if (storedCurrentChickenSkin !== null) {
                    setCurrentChickenSkin(parseInt(storedCurrentChickenSkin));
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            }
        };
        loadData();
    }, []);

    

    return (
        <View style={{ width: dimensions.width, height: dimensions.height }}>
            <ImageBackground
                source={!isRunGameStarted
                    ? require('../assets/images/preRunChickenBg.png')
                    : require('../assets/images/gameRoadBg.png')
                }
                style={{ width: dimensions.width, height: dimensions.height }}
                resizeMode='cover'
            >
                {!isRunGameStarted ? (
                    <SafeAreaView style={{ flex: 1 }}>
                        <TouchableOpacity style={{ marginLeft: dimensions.width * 0.0343434, }} onPress={() => {
                            setSelectedTimeChroniclesPage('Home');
                        }}>
                            <ArrowLeftIcon size={dimensions.width * 0.1} color='black' />
                        </TouchableOpacity>
                        <View style={{
                            position: 'absolute',
                            left: dimensions.width * 0.1,
                            top: dimensions.height * 0.1,
                            bottom: dimensions.height * 0.1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            zIndex: 2,
                        }}>
                            {[5, 3, 1].map(level => (
                                <TouchableOpacity activeOpacity={0.8} key={level} style={{ alignItems: 'center', marginTop: dimensions.height * 0.05 }}
                                    onPress={() => {
                                        setIsRunGameStarted(true);
                                        setSelectedChickenLevel(level);
                                    }}
                                    disabled={!ownedChickenLevels.includes(level)}
                                >
                                    <Image
                                        source={require('../assets/images/whiteEgg.png')}
                                        style={{
                                            width: dimensions.width * 0.2,
                                            height: dimensions.height * 0.13,
                                        }}
                                        resizeMode='contain'
                                    />
                                    <Text style={{
                                        position: 'absolute',
                                        top: '30%',
                                        textAlign: 'center',
                                        color: 'black',
                                        fontFamily: fontKronaOneRegular,
                                        fontWeight: '700',
                                        fontSize: dimensions.width * 0.06,
                                    }}>
                                        {ownedChickenLevels.includes(level) ? level : (
                                            <Image
                                                source={require('../assets/images/lockImage.png')}
                                                style={{
                                                    width: dimensions.width * 0.07,
                                                    height: dimensions.height * 0.05,
                                                }}
                                                resizeMode='contain'
                                            />
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{
                            position: 'absolute',
                            right: dimensions.width * 0.15,
                            top: dimensions.height * 0.1,
                            bottom: dimensions.height * 0.1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingVertical: dimensions.height * 0.1,
                            alignSelf: 'flex-end',
                            zIndex: 2,
                        }}>
                            {[4, 2].map(level => (
                                <TouchableOpacity activeOpacity={0.8} key={level} style={{ alignItems: 'center', marginTop: dimensions.height * 0.05 }}
                                    onPress={() => {
                                        setIsRunGameStarted(true);
                                        setSelectedChickenLevel(level);
                                    }}
                                    disabled={!ownedChickenLevels.includes(level)}
                                >
                                    <Image
                                        source={require('../assets/images/whiteEgg.png')}
                                        style={{
                                            width: dimensions.width * 0.2,
                                            height: dimensions.height * 0.13,
                                        }}
                                        resizeMode='contain'
                                    />
                                    <Text style={{
                                        position: 'absolute',
                                        top: '30%',
                                        textAlign: 'center',
                                        color: 'black',
                                        fontFamily: fontKronaOneRegular,
                                        fontWeight: '700',
                                        fontSize: dimensions.width * 0.06,
                                    }}>
                                        {ownedChickenLevels.includes(level) ? level : (
                                            <Image
                                                source={require('../assets/images/lockImage.png')}
                                                style={{
                                                    width: dimensions.width * 0.07,
                                                    height: dimensions.height * 0.05,
                                                }}
                                                resizeMode='contain'
                                            />
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Image
                            source={require('../assets/images/stepsImage.png')}
                            style={{
                                width: dimensions.width * 0.7,
                                height: dimensions.height * 0.4,
                                position: 'absolute',
                                left: '13%',
                                bottom: '15%',
                                zIndex: 1
                            }}
                            resizeMode='contain'
                        />
                    </SafeAreaView>
                ) : (
                    <>
                        {resumeCountdown && (
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 9999,

                            }}>
                                <Text style={{
                                    fontSize: dimensions.width * 0.15,
                                    fontWeight: 'bold',
                                    color: 'black',
                                }}>
                                    {countdownTime}
                                </Text>
                            </View>
                        )}

                        {chickenTimeLeft < 5 && !endChickenGameFinished && (
                            <Animated.Image
                                source={require('../assets/images/finish.png')}
                                style={{
                                    position: 'absolute',
                                    top: finishAnim,
                                    left: 0,
                                    width: dimensions.width,
                                    height: dimensions.height * 0.2,
                                    resizeMode: 'contain',
                                    zIndex: 10000,
                                }}
                                resizeMode='contain'
                            />
                        )}

                        <SafeAreaView style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: dimensions.width * 0.898,
                            alignSelf: 'center',
                            zIndex: 55555
                        }}>
                            <TouchableOpacity style={{
                                backgroundColor: 'white',
                                borderRadius: dimensions.width * 0.0416161,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: dimensions.width * 0.003,
                                borderColor: 'black',
                                width: dimensions.width * 0.12,
                                height: dimensions.width * 0.12,
                            }}
                                activeOpacity={0.8}
                                onPress={() => {
                                    setChickenGamePaused(true);
                                    setChickenGamePaused(true);
                                }}
                            >
                                <Bars3Icon size={dimensions.width * 0.07} color='black' />
                            </TouchableOpacity>

                            <View style={{
                                backgroundColor: 'white',
                                borderRadius: dimensions.width * 0.5,
                                height: dimensions.height * 0.045,
                                width: dimensions.width * 0.25,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: dimensions.width * 0.003,
                                borderColor: 'black',
                                flexDirection: 'row',
                            }}>
                                <Image
                                    source={require('../assets/images/chickenAggImage.png')}
                                    style={{
                                        width: dimensions.width * 0.05,
                                        height: dimensions.height * 0.03,
                                        marginRight: dimensions.width * 0.02,
                                    }}
                                    resizeMode='contain'
                                />
                                <Text
                                    style={{
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: dimensions.width * 0.04,
                                        fontWeight: 500,
                                        alignSelf: 'center',
                                        fontFamily: fontKronaOneRegular,
                                    }}
                                >
                                    {eggsCount}
                                </Text>
                            </View>
                        </SafeAreaView>

                        <View
                            style={{
                                width: dimensions.width,
                                height: dimensions.height,
                                alignSelf: 'center',
                                alignItems: 'center',
                            }}
                            {...panResponder.panHandlers}
                        >
                            {chickenRunFallingRocks.map((item) => (
                                <Animated.View
                                    key={item.id}
                                    style={{
                                        position: 'absolute',
                                        left: item.x,
                                        top: item.y,
                                    }}
                                >
                                    <Image
                                        source={item.image}
                                        style={{
                                            width: dimensions.width * item.sizes[0].width,
                                            height: dimensions.height * item.sizes[0].height,
                                        }}
                                        resizeMode='contain'
                                    />
                                </Animated.View>
                            ))}

                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    bottom: dimensions.height * 0.18,
                                    transform: [{ translateX: chickenHorizontalXPos }],
                                }}
                            >
                                <Image
                                    resizeMode="contain"
                                    source={chickenSkinsData.find((chicken) => chicken.id === currenChickenSkin).image}
                                    style={{
                                        height: dimensions.height * 0.1,
                                        width: dimensions.height * 0.1,
                                    }}
                                />
                            </Animated.View>
                        </View>
                    </>
                )}
            </ImageBackground>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isChickenGamePaused}
                onRequestClose={() => {
                    setChickenGamePaused(!isChickenGamePaused);
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'rgba(0, 35, 87, 0.3)'
                        }}
                    />
                    <BlurView
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        }}
                        blurType="light"
                        blurAmount={7}
                    />



                    <View style={{
                        width: dimensions.width * 0.8,
                        backgroundColor: 'white',
                        borderWidth: dimensions.width * 0.003,
                        borderColor: 'black',
                        borderRadius: dimensions.width * 0.0525252,
                        alignSelf: 'center',
                        paddingHorizontal: dimensions.width * 0.0393939,
                        paddingTop: dimensions.height * 0.019191919,
                        paddingBottom: dimensions.height * 0.07,
                    }}>

                        <Text style={{
                            textAlign: 'center',
                            color: 'black',
                            fontFamily: fontKronaOneRegular,
                            fontWeight: '700',
                            fontSize: dimensions.width * 0.06,
                            marginBottom: dimensions.height * 0.1,
                        }}>
                            Pause
                        </Text>

                        {['Continue', 'Back to menu', 'Settings'].map((button, index) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setChickenGamePaused(false);
                                    if (button === 'Continue') {
                                        setRestartChickenTimerCounter((prev) => prev + 1);
                                        setResumeCountdown(true);
                                        setCountdownTime(3);
                                    } else if (button === 'Back to menu') {
                                        setIsRunGameStarted(false);
                                        setEggsCount(0);
                                        setFallingFood([]);
                                        setRestartChickenTimerCounter((prev) => prev + 1);
                                        setChickenTimeLeft(70);
                                        setResumeCountdown(false);
                                        setCountdownTime(3);
                                    } else setSelectedTimeChroniclesPage('Settings');
                                }}
                                style={[styles.modalButtons, {
                                    borderColor: 'black',
                                }]}
                                key={index}
                            >
                                <Text style={styles.chickenQuizAnswers}>{button}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>


            <Modal
                animationType="fade"
                transparent={true}
                visible={endChickenGameFinished}
                onRequestClose={() => {
                    setEndChickenGameFinished(!endChickenGameFinished);
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'rgba(0, 35, 87, 0.3)'
                        }}
                    />
                    <BlurView
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        }}
                        blurType="light"
                        blurAmount={7}
                    />



                    <View style={{
                        width: dimensions.width * 0.8,
                        backgroundColor: 'white',
                        borderWidth: dimensions.width * 0.003,
                        borderColor: 'black',
                        borderRadius: dimensions.width * 0.0525252,
                        alignSelf: 'center',
                        paddingHorizontal: dimensions.width * 0.0393939,
                        paddingTop: dimensions.height * 0.019191919,
                        paddingBottom: dimensions.height * 0.07,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            position: 'absolute',
                            top: -dimensions.height * 0.111,
                        }}>
                            {modalEggsImages.map((egg, index) => (
                                <Image
                                    source={eggsCount >= index + 1 ? egg.fullEggImage : egg.emptyEggImage}
                                    key={egg.id}
                                    style={{
                                        width: dimensions.width * 0.19,
                                        height: dimensions.height * 0.21,
                                        marginHorizontal: egg.id === 2 ? dimensions.width * 0.03 : 0,
                                        bottom: egg.id === 2 ? dimensions.height * 0.02 : 0,
                                    }}
                                    resizeMode='contain'
                                />
                            ))}
                        </View>
                        <Text style={{
                            textAlign: 'center',
                            color: 'black',
                            fontFamily: fontKronaOneRegular,
                            fontWeight: '700',
                            fontSize: dimensions.width * 0.06,
                            marginTop: dimensions.height * 0.03,
                        }}>
                            {eggsCount < 3 ? 'Game Over' : 'Level complete'}
                        </Text>

                        <Image
                            source={eggsCount < 3
                                ? require('../assets/images/gameOverImage.png')
                                : require('../assets/images/levelCompleteImage.png')
                            }
                            style={{
                                width: dimensions.width * 0.3,
                                height: dimensions.height * 0.2,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                        />

                        <View style={{
                            alignItems: 'center', marginBottom: dimensions.height * 0.02, flexDirection: 'row', justifyContent: 'center',

                        }}>
                            <Text style={{
                                fontSize: dimensions.width * 0.04,
                                fontWeight: '700',
                                fontFamily: fontKronaOneRegular,
                                textAlign: 'center',
                            }}>
                                Your result:
                            </Text>

                            <Image source={require('../assets/images/chickenAggImage.png')} style={{
                                width: dimensions.width * 0.055,
                                height: dimensions.height * 0.05,
                                marginHorizontal: dimensions.width * 0.02,
                            }} resizeMode='contain' />

                            <Text style={{
                                fontSize: dimensions.width * 0.07,
                                fontWeight: '700',
                                fontFamily: fontKronaOneRegular,
                                textAlign: 'center',
                            }}>
                                {eggsCount}
                            </Text>
                        </View>

                        {eggsCount < 3 ? (
                            ['Play again', 'Back to menu'].map((button, index) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (button === 'Play again') {
                                            setRestartChickenTimerCounter((prev) => prev + 1);
                                            setChickenTimeLeft(70);
                                            setEggsCount(0);
                                            setFallingFood([]);
                                        } else setSelectedTimeChroniclesPage('Home');

                                        setEndChickenGameFinished(false);
                                    }}
                                    style={[styles.modalButtons, {
                                        borderColor: 'black',
                                    }]}
                                    key={index}
                                >
                                    <Text style={styles.chickenQuizAnswers}>{button}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            ['Share', 'Next level', 'Back to menu',].map((button, index) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setChickenGamePaused(false);
                                        if (button === 'Share') {
                                            Share.share({
                                                message: `I just completed level ${selectedChickenLevel} in Chicken Run! Can you beat my score of ${eggsCount} eggs?`,
                                            });
                                        } else if (button === 'Next level') {
                                            setSelectedChickenLevel((prev) => prev + 1);
                                            setRestartChickenTimerCounter((prev) => prev + 1);
                                            setChickenTimeLeft(70);
                                            setEggsCount(0);
                                            setFallingFood([]);
                                            setEndChickenGameFinished(false);
                                            setChickenGamePaused(false);
                                        } else setSelectedTimeChroniclesPage('Home');
                                    }}
                                    style={[styles.modalButtons, {
                                        borderColor: 'black',
                                    }]}
                                    key={index}
                                >
                                    <Text style={styles.chickenQuizAnswers}>{button}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </View>
            </Modal>
        </View >
    );
};

const createChickenQuizStyles = (dimensions) => StyleSheet.create({
    chickenQuizAnswers: {
        color: 'black',
        fontSize: dimensions.width * 0.04,
        fontFamily: fontKronaOneRegular,
        textAlign: 'center',
    },
    modalButtons: {
        height: dimensions.height * 0.067,
        borderRadius: dimensions.width * 0.045,
        borderWidth: dimensions.width * 0.002,
        borderColor: 'black',
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: dimensions.height * 0.02,
    },
});

export default ChickenRunGameScreen;

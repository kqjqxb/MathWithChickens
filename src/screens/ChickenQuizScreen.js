import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Share,
    Modal,
    StyleSheet
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

import chickenQuestionsData from '../components/chickenQuestionsData';

const fontKronaOneRegular = 'KronaOne-Regular';

const questionOnboardingData = [
    {
        id: 1,
        image: require('../assets/images/chickenQuizOnboarding1.png'),
    },
    {
        id: 2,
        image: require('../assets/images/chickenQuizOnboarding2.png'),
    },
]


const ChickenQuizScreen = ({ setSelectedMathWithScreen, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [eggBalance, setEggBalance] = useState(0);
    const styles = createChickenQuizStyles(dimensions);

    const [isChickenQuizAvailable, setIsChickenQuizAvailable] = useState(true);

    const [isChickenQuizStarted, setIsChickenQuizStarted] = useState(false);
    const [currentIndexOfChickenSlide, setCurrentIndexOfChickenSlide] = useState(0);
    const [todayChickenQuestionsData, setTodayChickenQuestionsData] = useState([]);
    const [choosenChickenAnswer, setChoosenChickenAnswer] = useState(null);
    const [currentChickenQuizQuestionIndex, setCurrentChickenQuizQuestionIndex] = useState(0);
    const [isChickenAnswerGiven, setIsChickenAnswerGiven] = useState(false);
    const [isChickenAnswerButtonsActive, setIsChickenAnswerButtonsActive] = useState(true);
    const [isChickenQuizFinished, setIsChickenQuizFinished] = useState(false);

    const [timeUntilAvailable, setTimeUntilAvailable] = useState(0);
    const [quizEggs, setQuizEggs] = useState(0);

    const handleChickenToAnswer = () => {
        setIsChickenAnswerGiven(true);
        setIsChickenAnswerButtonsActive(false);

        setTimeout(() => {
            setIsChickenAnswerGiven(false);
            setIsChickenAnswerButtonsActive(true);
            setChoosenChickenAnswer(null);
            if (currentChickenQuizQuestionIndex === todayChickenQuestionsData.length - 1) {
                setIsChickenQuizFinished(true);
            } else setCurrentChickenQuizQuestionIndex(prev => prev + 1);
        }, 2000)

        if (choosenChickenAnswer.isChickenCorrect) setQuizEggs(prev => prev + 5);
    };

    useEffect(() => {
        const generateRandomQuestions = () => {
            const questionsCopy = [...chickenQuestionsData];
            for (let i = questionsCopy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
            }
            return questionsCopy.slice(0, 5);
        };

        const randomQuestions = generateRandomQuestions();
        setTodayChickenQuestionsData(randomQuestions);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedEggBalance = await AsyncStorage.getItem('eggBalance');
                if (storedEggBalance !== null) {
                    setEggBalance(parseInt(storedEggBalance));
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const completeTest = async () => {
            try {
                const newEggBalance = eggBalance + quizEggs;
                await AsyncStorage.setItem('eggBalance', newEggBalance.toString());
                setEggBalance(newEggBalance);
                const currentTime = new Date().toISOString();
                await AsyncStorage.setItem('testCompleted', currentTime);
            } catch (error) {
                console.error('Error saving data after test completion:', error);
            }
        };
        if (isChickenQuizFinished) {
            completeTest();
        }
    }, [isChickenQuizFinished]);

    useEffect(() => {
        const checkQuizAvailability = async () => {
            try {
                const storedTime = await AsyncStorage.getItem('testCompleted');
                if (storedTime) {
                    const testTime = new Date(storedTime);
                    const now = new Date();
                    const diffHours = (now - testTime) / (1000 * 60 * 60);
                    if (diffHours < 24) {
                        setIsChickenQuizAvailable(false);
                        setTimeUntilAvailable(Math.ceil(24 - diffHours));
                    } else {
                        setIsChickenQuizAvailable(true);
                    }
                } else {
                    setIsChickenQuizAvailable(true);
                }
            } catch (error) {
                console.error('Error checking quiz availability:', error);
            }
        };
        checkQuizAvailability();
    }, []);

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            {isChickenQuizAvailable ? (
                <>
                    {!isChickenQuizStarted && !isChickenQuizFinished ? (
                        <>
                            <Image
                                source={questionOnboardingData[currentIndexOfChickenSlide].image}
                                style={{
                                    width: dimensions.width * 0.9,
                                    height: dimensions.height * 0.7,
                                    alignSelf: 'center',
                                    marginTop: dimensions.height * 0.05,
                                }}
                                resizeMode='contain'
                            />

                            <TouchableOpacity
                                onPress={() => {
                                    if (currentIndexOfChickenSlide === 0) {
                                        setCurrentIndexOfChickenSlide(1);
                                    } else setIsChickenQuizStarted(true);
                                }}
                                style={styles.bottomButton}
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
                                    {currentIndexOfChickenSlide >= questionOnboardingData.length - 1 ? 'Start' : 'Next'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : isChickenQuizStarted && !isChickenQuizFinished ? (
                        <>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <TouchableOpacity style={{
                                    alignSelf: 'flex-start',
                                    marginLeft: dimensions.width * 0.0343434,
                                }}
                                    onPress={() => {
                                        setSelectedMathWithScreen('Home');
                                    }}
                                >
                                    <ArrowLeftIcon size={dimensions.width * 0.1} color='black' />
                                </TouchableOpacity>

                                <Text
                                    style={{
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: dimensions.width * 0.065,
                                        fontWeight: 500,
                                        alignSelf: 'center',
                                        fontFamily: fontKronaOneRegular,
                                        marginRight: dimensions.width * 0.14,
                                    }}>
                                    Question {currentChickenQuizQuestionIndex + 1}
                                </Text>
                                <View />
                            </View>

                            <View style={{
                                width: dimensions.width * 0.898,
                                height: dimensions.height * 0.65,
                                alignSelf: 'center',
                                marginTop: dimensions.height * 0.05,
                                backgroundColor: '#fff',
                                borderRadius: dimensions.width * 0.04,
                            }}>
                                <View style={{
                                    alignSelf: 'center',
                                    width: '100%',
                                    height: '30%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            textAlign: 'center',
                                            fontSize: dimensions.width * 0.04,
                                            alignSelf: 'center',
                                            fontFamily: fontKronaOneRegular,
                                        }}>
                                        {todayChickenQuestionsData[currentChickenQuizQuestionIndex].chickenQuestion}
                                    </Text>
                                </View>

                                <View style={{
                                    alignSelf: 'center',
                                    marginTop: -dimensions.height * 0.05,
                                    width: '100%',
                                    height: '70%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {todayChickenQuestionsData[currentChickenQuizQuestionIndex].chickenAnswers.map((option, index) => {
                                        let buttonBackground = '#fff';
                                        if (isChickenAnswerGiven) {
                                            if (option.isChickenCorrect) {
                                                buttonBackground = '#51FF00';
                                            } else if (choosenChickenAnswer && choosenChickenAnswer.chickenAnswer === option.chickenAnswer) {
                                                buttonBackground = '#FF0404';
                                            }
                                        }
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                disabled={!isChickenAnswerButtonsActive}
                                                onPress={() => {
                                                    if (!isChickenAnswerGiven) {
                                                        if (choosenChickenAnswer?.chickenAnswer === option.chickenAnswer) {
                                                            setChoosenChickenAnswer(null);
                                                        } else {
                                                            setChoosenChickenAnswer(option);
                                                        }
                                                    }
                                                }}
                                                style={[styles.chickenAnswerButtonsStyles, {
                                                    backgroundColor: buttonBackground,
                                                    borderColor: 'black',
                                                }]}>
                                                <Text style={styles.chickenQuizAnswers}>{option.chickenAnswer}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>

                            {choosenChickenAnswer && isChickenAnswerButtonsActive && (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleChickenToAnswer();
                                    }}
                                    style={styles.bottomButton}
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
                                        Next
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <>
                            <Text
                                style={{
                                    color: 'black',
                                    textAlign: 'center',
                                    fontSize: dimensions.width * 0.065,
                                    fontWeight: 500,
                                    alignSelf: 'center',
                                    fontFamily: fontKronaOneRegular,
                                }}>
                                The quiz is over!!!
                            </Text>

                            <View style={{
                                width: dimensions.width * 0.8,
                                backgroundColor: 'white',
                                borderRadius: dimensions.width * 0.05,
                                padding: dimensions.width * 0.05,
                                alignSelf: 'center',
                                marginTop: dimensions.height * 0.1,
                            }}>
                                <Image
                                    source={require('../assets/images/successfullyBoughtChicken.png')}
                                    style={{
                                        width: dimensions.width * 0.4,
                                        height: dimensions.height * 0.23,
                                        alignSelf: 'center',
                                    }}
                                    resizeMode='contain'
                                />

                                <View style={{
                                    alignItems: 'center', marginVertical: dimensions.height * 0.02, flexDirection: 'row', justifyContent: 'center',

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
                                        {quizEggs}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedMathWithScreen('Home');
                                }}
                                style={styles.bottomButton}
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
                                    Back to menu
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </>
            ) : (
                <>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: 'black',
                            fontFamily: fontKronaOneRegular,
                            fontWeight: 700,
                            paddingHorizontal: dimensions.width * 0.05,
                            fontSize: dimensions.width * 0.06,
                            marginTop: dimensions.height * 0.3,
                        }}>
                        Quiz is not available, the next attempt will be made in {timeUntilAvailable} hours
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            setSelectedMathWithScreen('Home');
                        }}
                        style={styles.bottomButton}
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
                            Back to menu
                        </Text>
                    </TouchableOpacity>
                </>
            )}



        </SafeAreaView>
    );
};

const createChickenQuizStyles = (dimensions) => StyleSheet.create({
    chickenQuizAnswers: {
        color: 'black',
        fontSize: dimensions.width * 0.04,
        fontFamily: fontKronaOneRegular,
        textAlign: 'center',
    },
    chickenAnswerButtonsStyles: {
        height: dimensions.height * 0.065,
        borderRadius: dimensions.width * 0.04,
        borderWidth: dimensions.width * 0.002,
        borderColor: 'black',
        width: '90%',

        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: dimensions.height * 0.02,
    },
    bottomButton: {
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: dimensions.width * 0.0616161,
        justifyContent: 'center',
        marginTop: dimensions.height * 0.03,
        backgroundColor: '#fff',
        height: dimensions.height * 0.08,
        width: dimensions.width * 0.8818,
        position: 'absolute',
        bottom: dimensions.height * 0.05,
        borderColor: 'black',
        borderWidth: dimensions.width * 0.003,
    }
});

export default ChickenQuizScreen;

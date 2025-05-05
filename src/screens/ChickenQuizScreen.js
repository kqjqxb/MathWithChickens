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
const fontRammetoOneRegular = 'RammettoOne-Regular';
const fontRanchersRegular = 'Ranchers-Regular';

const roadMathEggLevels = [
    {
        id: 1,
        right: '10%',
        top: '13%'
    },
    {
        id: 2,
        right: '30%',
        top: '23%'
    },
    {
        id: 3,
        right: '25%',
        top: '39%'
    },
    {
        id: 4,
        right: '15%',
        top: '55%'
    },
    {
        id: 5,
        right: '32%',
        top: '66%'
    },
    {
        id: 6,
        right: '55%',
        top: '75%'
    },
    {
        id: 7,
        right: '39%',
        top: '86%'
    },
]


const ChickenQuizScreen = ({ setSelectedMathWithScreen, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [eggBalance, setEggBalance] = useState(0);
    const styles = createChickenQuizStyles(dimensions);

    const [mathQuizPreviewModalVisible, setMathQuizPreviewModalVisible] = useState(true);
    const [ownedMathQuizLevels, setOwnedMathQuizLevels] = useState([1]);
    const [selectedMathQuizLevel, setSelectedMathQuizLevel] = useState(1);
    const [positiveMathQuizAnswersAmount, setPositiveMathQuizAnswersAmount] = useState(0);
    const modalStyles = mathModalStyles(dimensions);

    const [isChickenQuizStarted, setIsChickenQuizStarted] = useState(false);
    const [currentIndexOfChickenSlide, setCurrentIndexOfChickenSlide] = useState(0);
    const [todayChickenQuestionsData, setTodayChickenQuestionsData] = useState([]);
    const [choosenChickenAnswer, setChoosenChickenAnswer] = useState(null);
    const [currentChickenQuizQuestionIndex, setCurrentChickenQuizQuestionIndex] = useState(0);
    const [isChickenAnswerGiven, setIsChickenAnswerGiven] = useState(false);
    const [isChickenAnswerButtonsActive, setIsChickenAnswerButtonsActive] = useState(true);
    const [isChickenQuizFinished, setIsChickenQuizFinished] = useState(false);

    const [quizEggs, setQuizEggs] = useState(0);

    useEffect(() => {
        const loadMathLevels = async () => {
            try {
                const storedMathQuizLevels = await AsyncStorage.getItem('ownedMathQuizLevels');
                let mathQuizLevels = storedMathQuizLevels ? JSON.parse(storedMathQuizLevels) : [1];
                if (!storedMathQuizLevels) {
                    await AsyncStorage.setItem('ownedMathQuizLevels', JSON.stringify(mathQuizLevels));
                }
                setOwnedMathQuizLevels(mathQuizLevels);
            } catch (error) {
                console.error('Error loading mathQuizLevels of math quiz:', error);
            }
        };
        loadMathLevels();
    }, []);

    const handleChickenToAnswer = (selectedMathAnswer) => {
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

        if (selectedMathAnswer.isMathCorrectResult) setPositiveMathQuizAnswersAmount(prev => prev + 1);
    };

    useEffect(() => {
        setTodayChickenQuestionsData(chickenQuestionsData.filter(item => item.levelID === selectedMathQuizLevel)[0].questions);
    }, []);

    useEffect(() => {
        const loadMathLevels = async () => {
            try {
                const storedEggBalance = await AsyncStorage.getItem('eggBalance');
                if (storedEggBalance !== null) {
                    setEggBalance(parseInt(storedEggBalance));
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            }
        };
        loadMathLevels();
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
        const updateOwnedChickenLevels = async () => {
            if (selectedMathQuizLevel < 7 && isChickenQuizFinished && positiveMathQuizAnswersAmount === 4 && !ownedMathQuizLevels.includes(selectedMathQuizLevel + 1)) {
                try {
                    const storedMathQuizLevels = await AsyncStorage.getItem('ownedMathQuizLevels');
                    let mathQuizLevels = storedMathQuizLevels ? JSON.parse(storedMathQuizLevels) : [1];
                    const newMathQuizLevel = selectedMathQuizLevel + 1;
                    if (!mathQuizLevels.includes(newMathQuizLevel)) {
                        mathQuizLevels.push(newMathQuizLevel);
                        await AsyncStorage.setItem('ownedMathQuizLevels', JSON.stringify(mathQuizLevels));
                        setOwnedMathQuizLevels(mathQuizLevels);
                    }
                } catch (error) {
                    console.error('Failed to update owned chicken mathQuizLevels of run:', error);
                }
            }
        };

        updateOwnedChickenLevels();
    }, [isChickenQuizFinished]);

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            {!isChickenQuizStarted && !isChickenQuizFinished ? (
                <>
                    <Image
                        source={require('../assets/images/quizRoadBg.png')}
                        style={{
                            position: 'absolute',
                            width: dimensions.width,
                            height: dimensions.height * 0.8,
                            alignSelf: 'center',
                            top: dimensions.height * 0.1,
                            zIndex: -1,
                            borderRadius: dimensions.width * 0.03,
                            borderWidth: dimensions.width * 0.003,
                            borderColor: 'black',
                        }}
                    />

                    {roadMathEggLevels.map((eggLevel, index) => (
                        <TouchableOpacity style={{
                            position: 'absolute',
                            right: eggLevel.right,
                            top: eggLevel.top,
                        }}
                            key={index}
                            onPress={() => {
                                setSelectedMathQuizLevel(eggLevel.id);
                                setIsChickenQuizStarted(true);
                                setCurrentChickenQuizQuestionIndex(0);
                                setIsChickenQuizFinished(false);
                            }}
                            disabled={!ownedMathQuizLevels.includes(eggLevel.id)}
                            activeOpacity={0.7}
                        >
                            {ownedMathQuizLevels.includes(eggLevel.id) && (
                                <Text style={[styles.ranchesTextStyles,
                                {
                                    fontSize: dimensions.width * 0.19,
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    top: '10%',
                                    zIndex: 10,
                                    color: 'black',
                                }]}>
                                    {eggLevel.id}
                                </Text>
                            )}
                            <Image
                                source={ownedMathQuizLevels.includes(eggLevel.id)
                                    ? require('../assets/images/yellowMathEgg.png')
                                    : require('../assets/images/silverMathEgg.png')}
                                style={{
                                    width: dimensions.height * 0.13,
                                    height: dimensions.height * 0.13,
                                }}
                                resizeMode='contain'
                            />

                        </TouchableOpacity>
                    ))}

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
                            bottom: dimensions.height * 0.13,
                            right: dimensions.width * 0.05,
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
                </>
            ) : isChickenQuizStarted && !isChickenQuizFinished ? (
                <>
                    <View style={{
                        width: '100%',
                        height: dimensions.height * 0.65,
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.05,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '95%',
                            marginBottom: dimensions.height * 0.07,
                            backgroundColor: '#FFE066',
                            borderRadius: dimensions.width * 0.03,
                            borderWidth: dimensions.width * 0.003,
                            borderColor: 'black',
                            alignSelf: 'center',
                        }}>
                            <Image
                                source={require('../assets/images/mathQuizButton.png')}
                                style={{
                                    width: dimensions.width * 0.3,
                                    height: dimensions.height * 0.15,

                                }}
                                resizeMode="contain"
                            />
                            <View style={{
                                width: dimensions.width * 0.6,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.1 }]}>
                                    {todayChickenQuestionsData[currentChickenQuizQuestionIndex].mathQuestion}
                                </Text>
                            </View>
                        </View>

                        <View style={{
                            alignSelf: 'center',
                            marginTop: -dimensions.height * 0.05,
                            width: '100%',
                            height: '70%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {todayChickenQuestionsData[currentChickenQuizQuestionIndex].mathAnswers.map((mathAnswer, index) => {
                                let buttonBackground = '#FFE066';
                                if (isChickenAnswerGiven) {
                                    if (mathAnswer.isMathCorrectResult) {
                                        buttonBackground = '#0AFF05';
                                    } else if (choosenChickenAnswer && choosenChickenAnswer.mathAnswer === mathAnswer.mathAnswer) {
                                        buttonBackground = '#FF2828';
                                    }
                                }
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        disabled={!isChickenAnswerButtonsActive}
                                        onPress={() => {
                                            if (!isChickenAnswerGiven) {
                                                setChoosenChickenAnswer(mathAnswer);
                                                handleChickenToAnswer(mathAnswer);
                                                console.log('Selected answer:', mathAnswer);
                                            }
                                        }}
                                        style={[styles.chickenAnswerButtonsStyles, {
                                            backgroundColor: buttonBackground,
                                            borderColor: 'black',
                                            width: '95%',
                                            borderRadius: dimensions.width * 0.03,
                                            borderWidth: dimensions.width * 0.003,
                                            borderColor: 'black',
                                            height: dimensions.height * 0.1,
                                            marginBottom: dimensions.height * 0.02,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }]}>
                                        <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.14 }]}>
                                            {mathAnswer.mathAnswer}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <View style={{
                        width: '95%',
                        backgroundColor: '#FFE066',
                        borderRadius: dimensions.width * 0.03,
                        borderWidth: dimensions.width * 0.003,
                        borderColor: 'black',
                        padding: dimensions.width * 0.04,
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.03,
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


                        <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.1 }]}>
                            Well done!
                        </Text>

                        <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.05, marginTop: dimensions.height * 0.02 }]}>
                        Next level is unlocked! {'\n'}New egg added to game mode!
                        </Text>
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

            <Modal
                animationType="fade"
                transparent={true}
                visible={mathQuizPreviewModalVisible}
                onRequestClose={() => setMathQuizPreviewModalVisible(false)}
            >
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '100%',
                            marginBottom: dimensions.height * 0.03,

                        }}>
                            <Image
                                source={require('../assets/images/mathQuizButton.png')}
                                style={{
                                    width: dimensions.width * 0.3,
                                    height: dimensions.height * 0.15,
                                    marginRight: dimensions.width * 0.05,
                                }}
                                resizeMode="contain"
                            />
                            <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.12 }]}>
                                Math Quiz
                            </Text>
                        </View>

                        <Text style={[styles.ranchesTextStyles, {
                            fontSize: dimensions.width * 0.06,
                            textAlign: 'left',
                            marginBottom: dimensions.height * 0.03,

                        }]}>
                            Solve simple addition problems to help your chicken learn! Choose the correct answer from the options. Complete all questions to unlock a new number and a special egg for the game!
                            {'\n\n'}Tips:
                            {'\n   '} • Think carefully before you choose.
                            {'\n   '} • No rush — take your time to get it right!
                        </Text>

                        <TouchableOpacity
                            onPress={() => setMathQuizPreviewModalVisible(false)}
                            style={[modalStyles.mathCancelConfirmButtons, {
                                backgroundColor: '#0AFF05',
                            }]}>
                            <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.08 }]}>
                                Got it
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


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
    ranchesTextStyles: {
        color: '#5C4033',
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: fontRanchersRegular,
    }
});

const mathModalStyles = (dimensions) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        width: '95%',
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
    },
    mathCancelConfirmButtons: {
        width: dimensions.width * 0.3,
        height: dimensions.height * 0.08,
        borderRadius: dimensions.width * 0.03,
        borderWidth: dimensions.width * 0.003,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ChickenQuizScreen;

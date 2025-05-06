import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Modal,
    StyleSheet,
    Platform
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import mathQuizQuestions from '../components/mathQuizQuestions';

const fontKronaOneRegular = 'KronaOne-Regular';
const fontRanchersRegular = 'Ranchers-Regular';

const roadMathEggLevels = [
    {
        id: 1,
        right: '10%',
        top: '13%',
        image: require('../assets/images/catchEggImages/egg1.png'),
    },
    {
        id: 2,
        right: '30%',
        top: '23%',
        image: require('../assets/images/catchEggImages/egg2.png'),
    },
    {
        id: 3,
        right: '25%',
        top: '39%',
        image: require('../assets/images/catchEggImages/egg3.png'),
    },
    {
        id: 4,
        right: '15%',
        top: '55%',
        image: require('../assets/images/catchEggImages/egg4.png'),
    },
    {
        id: 5,
        right: '32%',
        top: '66%',
        image: require('../assets/images/catchEggImages/egg5.png'),
    },
    {
        id: 6,
        right: '64%',
        top: '73%',
        image: require('../assets/images/catchEggImages/egg6.png'),
    },
    {
        id: 7,
        right: '39%',
        top: Platform.OS === 'android' ? '82%' : '86%',
        image: require('../assets/images/catchEggImages/egg7.png'),
    },
]


const MathQuizPage = ({ setSelectedMathWithScreen, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createMathQuizStyles(dimensions);

    const [mathQuizPreviewModalVisible, setMathQuizPreviewModalVisible] = useState(true);
    const [ownedMathQuizLevels, setOwnedMathQuizLevels] = useState([1]);
    const [selectedMathQuizLevel, setSelectedMathQuizLevel] = useState(1);
    const [positiveMathQuizAnswersAmount, setPositiveMathQuizAnswersAmount] = useState(0);
    const modalStyles = mathModalStyles(dimensions);

    const [isMathQuizWithStarted, setMathQuizWithStarted] = useState(false);
    const [mathQuestionsForLevel, setMathQuestionsForLevel] = useState([]);
    const [selectedMathAnswerWith, setSelectedMathAnswerWith] = useState(null);
    const [curMathQuizWithQuestionInd, setCurMathQuizWithQuestionInd] = useState(0);
    const [isMathQuizAnswered, setMathQuizAnswered] = useState(false);
    const [isMathAnswerButtonPressible, setMathAnswerButtonPressible] = useState(true);
    const [isMathQuizWithFinished, setMathQuizWithFinished] = useState(false);

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

    const handleMathAnswerQuiz = (selectedMathAnswer) => {
        setMathAnswerButtonPressible(false);

        setMathQuizAnswered(true);

        setTimeout(() => {
            setMathAnswerButtonPressible(true);
            setSelectedMathAnswerWith(null);
            setMathQuizAnswered(false);
            if (curMathQuizWithQuestionInd === mathQuestionsForLevel.length - 1) {
                setMathQuizWithFinished(true);
            } else setCurMathQuizWithQuestionInd(prev => prev + 1);
        }, 1000)

        if (selectedMathAnswer.isMathCorrectResult)
            setPositiveMathQuizAnswersAmount(prev => prev + 1);
    };

    useEffect(() => {
        setMathQuestionsForLevel(mathQuizQuestions[selectedMathQuizLevel - 1].questions);
    }, [selectedMathQuizLevel]);

    useEffect(() => {
        const updateMathOwnedLevelsWith = async () => {
            if (selectedMathQuizLevel < 7 && isMathQuizWithFinished && positiveMathQuizAnswersAmount === 4 && !ownedMathQuizLevels.includes(selectedMathQuizLevel + 1)) {
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
                    console.error('Failed to update owned mathQuizLevels:', error);
                }
            }
        };
        updateMathOwnedLevelsWith();
    }, [isMathQuizWithFinished]);

    return (
        <SafeAreaView style={{
            height: dimensions.height,
            width: dimensions.width,
        }}>
            {!isMathQuizWithStarted && !isMathQuizWithFinished ? (
                <>
                    <Image
                        source={require('../assets/images/quizRoadBg.png')}
                        style={{
                            position: 'absolute',
                            width: dimensions.width,
                            height: Platform.OS === 'android' ? dimensions.height * 0.86 : dimensions.height * 0.8,
                            alignSelf: 'center',
                            top: dimensions.height * 0.1,
                            zIndex: 0,
                            borderRadius: dimensions.width * 0.03,
                            borderWidth: dimensions.width * 0.003,
                            borderColor: 'black',
                        }}
                        resizeMode='cover'
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
                                setMathQuizWithStarted(true);
                                setCurMathQuizWithQuestionInd(0);
                                setMathQuizWithFinished(false);
                            }}
                            disabled={!ownedMathQuizLevels.includes(eggLevel.id)}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={ownedMathQuizLevels.includes(eggLevel.id)
                                    ? eggLevel.image
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
            ) : isMathQuizWithStarted && !isMathQuizWithFinished ? (
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
                                    {mathQuestionsForLevel[curMathQuizWithQuestionInd].mathQuestion}
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
                            {mathQuestionsForLevel[curMathQuizWithQuestionInd].mathAnswers.map((mathAnswer, index) => {
                                let buttonBackground = '#FFE066';
                                if (isMathQuizAnswered) {
                                    if (mathAnswer.isMathCorrectResult) {
                                        buttonBackground = '#0AFF05';
                                    } else if (selectedMathAnswerWith && selectedMathAnswerWith.mathAnswer === mathAnswer.mathAnswer) {
                                        buttonBackground = '#FF2828';
                                    }
                                }
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        disabled={!isMathAnswerButtonPressible}
                                        onPress={() => {
                                            if (!isMathQuizAnswered) {
                                                setSelectedMathAnswerWith(mathAnswer);
                                                handleMathAnswerQuiz(mathAnswer);
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

                    <TouchableOpacity
                        onPress={() => {
                            setMathQuizWithStarted(false);
                            setMathQuizWithFinished(false);
                            setCurMathQuizWithQuestionInd(0);
                            setPositiveMathQuizAnswersAmount(0);
                        }}
                        style={{
                            alignSelf: 'center',
                            backgroundColor: '#FFE066',
                            borderRadius: dimensions.width * 0.8,
                            width: dimensions.height * 0.1,
                            height: dimensions.height * 0.1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            bottom: dimensions.height * 0.1,
                        }}>
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
                        paddingBottom: dimensions.height * 0.05,
                    }}>
                        <Image
                            source={positiveMathQuizAnswersAmount === 4
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


                        <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.1 }]}>
                            {positiveMathQuizAnswersAmount === 4 ? 'Well done!' : 'You loose!'}
                        </Text>

                        <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.05, marginTop: dimensions.height * 0.02 }]}>
                            {positiveMathQuizAnswersAmount === 4 ? 'Next level is unlocked! \nNew egg added to game mode!' : `Your result is ${positiveMathQuizAnswersAmount}/4`}
                        </Text>
                    </View>

                    {positiveMathQuizAnswersAmount === 4 && (
                        <View>
                            <Text style={[styles.ranchesTextStyles,
                            {
                                fontSize: dimensions.width * 0.19,
                                position: 'absolute',
                                alignSelf: 'center',
                                top: '25%',
                                zIndex: 10,
                                color: 'black',
                            }]}>
                                {selectedMathQuizLevel < 7 ? selectedMathQuizLevel + 1 : 7}
                            </Text>

                            <Image
                                source={require('../assets/images/yellowMathEgg.png')}
                                style={{
                                    width: dimensions.height * 0.13,
                                    height: dimensions.height * 0.13,
                                    alignSelf: 'center',
                                    marginTop: dimensions.height * 0.03,
                                }}
                                resizeMode='contain'
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={() => {
                            if (positiveMathQuizAnswersAmount === 4) {
                                setMathQuizWithStarted(false);
                                setMathQuizWithFinished(false);
                                setCurMathQuizWithQuestionInd(0);
                                setPositiveMathQuizAnswersAmount(0);
                            } else {
                                setMathQuizWithStarted(true);
                                setMathQuizWithFinished(false);
                                setCurMathQuizWithQuestionInd(0);
                                setPositiveMathQuizAnswersAmount(0);
                            }
                        }}
                        style={{
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.12,
                            backgroundColor: '#FFE066',
                            borderRadius: dimensions.width * 0.8,
                            width: dimensions.height * 0.1,
                            height: dimensions.height * 0.1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Image
                            source={positiveMathQuizAnswersAmount === 4
                                ? require('../assets/icons/goHomeMathIcon.png')
                                : require('../assets/icons/settingsIcons/resetMathProgress.png')
                            }
                            style={{
                                width: dimensions.height * 0.07,
                                height: dimensions.height * 0.07,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>

                    {positiveMathQuizAnswersAmount < 4 && (
                        <TouchableOpacity
                            onPress={() => {
                                setMathQuizWithStarted(false);
                                setMathQuizWithFinished(false);
                                setCurMathQuizWithQuestionInd(0);
                                setPositiveMathQuizAnswersAmount(0);
                            }}
                            style={{
                                alignSelf: 'center',
                                marginTop: dimensions.height * 0.03,
                                backgroundColor: '#FFE066',
                                borderRadius: dimensions.width * 0.8,
                                width: dimensions.height * 0.1,
                                height: dimensions.height * 0.1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
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
                    )}
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

const createMathQuizStyles = (dimensions) => StyleSheet.create({
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
        width: '80%',
        height: dimensions.height * 0.08,
        borderRadius: dimensions.width * 0.03,
        borderWidth: dimensions.width * 0.003,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default MathQuizPage;

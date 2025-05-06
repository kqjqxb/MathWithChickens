import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const MathAchievmentsScreen = ({ setSelectedMathWithScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = mathSettingsStyles(dimensions);
    const [ownedMathQuizLevels, setOwnedMathQuizLevels] = useState([1]);

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

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            <View style={{
                width: dimensions.width * 0.931,
                paddingHorizontal: dimensions.width * 0.05,
                marginTop: dimensions.height * 0.03,
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: '#FFE066',
                borderRadius: dimensions.width * 0.03,
                borderColor: 'black',
                height: dimensions.height * 0.75,
                paddingVertical: dimensions.height * 0.01,
                borderWidth: dimensions.width * 0.003,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    marginBottom: dimensions.height * 0.03,
                }}>
                    <Image
                        source={require('../assets/images/mathAchievmentsButton.png')}
                        style={{
                            width: dimensions.width * 0.3,
                            height: dimensions.height * 0.15,
                            marginRight: dimensions.width * 0.05,
                        }}
                        resizeMode="contain"
                    />
                    <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.1 }]}>
                        Achievments
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: dimensions.height * 0.03,
                    flexWrap: 'wrap',
                }}>
                    {colorEggs.filter((egg) => egg.id < 8).map((egg) => (
                        <View key={egg.id} style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30%',
                            marginTop: dimensions.height * 0.03,
                        }}>
                            <Image
                                source={ownedMathQuizLevels.includes(egg.id) ? egg.image : require('../assets/images/emptySilverEgg.png')}
                                style={{
                                    width: dimensions.height * 0.091,
                                    height: dimensions.height * 0.091,
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={() => {
                        setSelectedMathWithScreen('Home');
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '3%',
                        right: '5%',
                    }}>
                    <Image
                        source={require('../assets/icons/goHomeMathIcon.png')}
                        style={{
                            width: dimensions.height * 0.08,
                            height: dimensions.height * 0.08,
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const mathSettingsStyles = (dimensions) => StyleSheet.create({
    ranchesTextStyles: {
        color: '#5C4033',
        textAlign: 'center',
        alignSelf: 'center',
        fontFamily: fontRanchersRegular,
    }
});

export default MathAchievmentsScreen;

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Share,
    StyleSheet,
    Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

const fontRanchersRegular = 'Ranchers-Regular';

const mathApp = 'https://google.com/';

const MathSettingsWithScreen = ({ setSelectedMathWithScreen, mathWithMusicEnabled, setMathWithMusicEnabled, vibroMathEnabled, setVibroMathEnabled }) => {
    const dimensions = Dimensions.get('window');
    const [volume, setVolume] = useState(0.5);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const styles = mathSettingsStyles(dimensions);
    const modalStyles = mathModalStyles(dimensions);

    useEffect(() => {
        AsyncStorage.getItem('volumeValue')
            .then(value => {
                if (value !== null) {
                    setVolume(parseFloat(value));
                }
            })
            .catch(error => console.error('Error loading volumeValue from AsyncStorage:', error));
    }, []);

    const clearMathAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            RNRestart.Restart();
            console.log('AsyncStorage cleaned');
        } catch (error) {
            console.error('Cleaning AsyncStorage error: ', error);
        }
    };

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            <View style={{
                width: dimensions.width * 0.931,
                height: dimensions.height * 0.75,
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: '#FFE066',
                borderRadius: dimensions.width * 0.03,
                borderWidth: dimensions.width * 0.003,
                borderColor: 'black',
                paddingVertical: dimensions.height * 0.01,
                paddingHorizontal: dimensions.width * 0.05,
                marginTop: dimensions.height * 0.03,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    marginBottom: dimensions.height * 0.03,
                }}>
                    <Image
                        source={require('../assets/images/mathSettingsButton.png')}
                        style={{
                            width: dimensions.width * 0.3,
                            height: dimensions.height * 0.15,
                            marginRight: dimensions.width * 0.05,
                        }}
                        resizeMode="contain"
                    />
                    <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.1 }]}>
                        Settings
                    </Text>
                </View>
                <View style={styles.flexRowStyles}>
                    <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.08 }]}>
                        Vibration
                    </Text>
                    <TouchableOpacity
                        onPress={async () => {
                            const newValue = !vibroMathEnabled;
                            setVibroMathEnabled(newValue);
                            try {
                                await AsyncStorage.setItem('chickenVibroEnabled', newValue.toString());
                            } catch (error) {
                                console.error('Error updating chickenVibroEnabled in AsyncStorage:', error);
                            }
                        }}>
                        <Image
                            source={vibroMathEnabled
                                ? require('../assets/icons/settingsIcons/vibroOn.png')
                                : require('../assets/icons/settingsIcons/vibroOff.png')}
                            style={{
                                width: dimensions.height * 0.06,
                                height: dimensions.height * 0.06,
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.flexRowStyles}>
                    <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.08 }]}>
                        Music
                    </Text>
                    <TouchableOpacity
                        onPress={async () => {
                            const newValue = !mathWithMusicEnabled;
                            setMathWithMusicEnabled(newValue);
                            try {
                                await AsyncStorage.setItem('mathWithMusicEnabled', newValue.toString());
                            } catch (error) {
                                console.error('Error updating mathWithMusicEnabled in AsyncStorage:', error);
                            }
                        }}>
                        <Image
                            source={mathWithMusicEnabled
                                ? require('../assets/icons/settingsIcons/musicOn.png')
                                : require('../assets/icons/settingsIcons/musicOff.png')}
                            style={{
                                width: dimensions.height * 0.06,
                                height: dimensions.height * 0.06,
                                left: !mathWithMusicEnabled ? dimensions.width * 0.02 : 0,
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setIsModalVisible(true);
                    }}
                    style={styles.flexRowStyles}>
                    <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.08 }]}>
                        Reset Progress
                    </Text>
                    <Image
                        source={require('../assets/icons/settingsIcons/resetMathProgress.png')}
                        style={{
                            width: dimensions.height * 0.06,
                            height: dimensions.height * 0.06,
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        Share.share({
                            message: `You can upgrade your math skils with funny chickens!\n${mathApp}`,
                        })
                            .then((result) => console.log(result))
                            .catch((error) => console.log('Error sharing:', error));
                    }}
                    style={styles.flexRowStyles}>
                    <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.08 }]}>
                        Share app
                    </Text>
                    <Image
                        source={require('../assets/icons/settingsIcons/shareMathApp.png')}
                        style={{
                            width: dimensions.height * 0.06,
                            height: dimensions.height * 0.06,
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
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
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalView}>
                        <Image
                            source={require('../assets/images/sadChicken.png')}
                            style={{
                                width: dimensions.width * 0.4,
                                height: dimensions.height * 0.2,
                                marginTop: -dimensions.height * 0.04,
                            }}
                            resizeMode="contain"
                        />
                        <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.06 }]}>
                            Do you want to reset your progress
                        </Text>
                        <View style={[styles.flexRowStyles, { marginTop: dimensions.height * 0.03 }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    clearMathAsyncStorage();
                                    setIsModalVisible(false);
                                }}
                                style={[modalStyles.mathCancelConfirmButtons, {
                                    backgroundColor: '#FF7D05',
                                }]}>
                                <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.08 }]}>
                                    Yes
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                style={[modalStyles.mathCancelConfirmButtons, {
                                    backgroundColor: '#0AFF05',
                                }]}>
                                <Text style={[styles.ranchesTextStyles, { fontSize: dimensions.width * 0.08 }]}>
                                    No
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const mathSettingsStyles = (dimensions) => StyleSheet.create({
    flexRowStyles: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: dimensions.height * 0.01,
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
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        width: '95%',
        backgroundColor: "#FFE066",
        borderColor: "black",
        borderWidth: dimensions.width * 0.003,
        borderRadius: dimensions.width * 0.03,
        padding: 35,
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

export default MathSettingsWithScreen;

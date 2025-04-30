import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Share
} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fontKronaOneRegular = 'KronaOne-Regular';

const ChickenSettingsScreen = ({ setSelectedTimeChroniclesPage, chickenNotifEnabled, setChickenNotifEnabled, chickenVibrationEnabled, setChickenVibrationEnabled }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        AsyncStorage.getItem('volumeValue')
            .then(value => {
                if (value !== null) {
                    setVolume(parseFloat(value));
                }
            })
            .catch(error => console.error('Error loading volumeValue from AsyncStorage:', error));
    }, []);

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            <Text
                style={{
                    color: 'black',
                    textAlign: 'center',
                    fontSize: dimensions.width * 0.065,
                    fontWeight: 500,
                    alignSelf: 'center',
                    fontFamily: fontKronaOneRegular,
                }}>
                Settings
            </Text>

            <View style={{
                width: dimensions.width * 0.898,
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: dimensions.width * 0.05551,
                paddingVertical: dimensions.height * 0.050101,
                paddingHorizontal: dimensions.width * 0.05,
                marginTop: dimensions.height * 0.1,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Text
                        style={{
                            color: 'black',
                            textAlign: 'left',
                            fontSize: dimensions.width * 0.05,
                            fontWeight: 500,
                            fontFamily: fontKronaOneRegular,
                            flex: 1,
                        }}>
                        Notification:
                    </Text>

                    <TouchableOpacity
                        onPress={async () => {
                            const newValue = !chickenNotifEnabled;
                            setChickenNotifEnabled(newValue);
                            try {
                                await AsyncStorage.setItem('chickenNotifEnabled', newValue.toString());
                            } catch (error) {
                                console.error('Error updating chickenNotifEnabled in AsyncStorage:', error);
                            }
                        }}
                        style={{
                            width: dimensions.width * 0.18,
                            height: dimensions.height * 0.034,
                            borderRadius: dimensions.width * 0.525252,
                            borderWidth: dimensions.width * 0.003,
                            borderColor: 'black',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        {!chickenNotifEnabled && (
                            <Text
                                style={{
                                    color: 'black',
                                    textAlign: 'left',
                                    fontSize: dimensions.width * 0.04,
                                    fontWeight: 500,
                                    fontFamily: fontKronaOneRegular,
                                    paddingLeft: dimensions.width * 0.02,
                                }}>
                                on
                            </Text>
                        )}
                        <View style={{
                            width: dimensions.height * 0.034,
                            height: dimensions.height * 0.034,
                            borderRadius: dimensions.width * 0.5,
                            backgroundColor: 'black',
                        }} />

                        {chickenNotifEnabled && (
                            <Text
                                style={{
                                    color: 'black',
                                    textAlign: 'left',
                                    fontSize: dimensions.width * 0.04,
                                    fontWeight: 500,
                                    fontFamily: fontKronaOneRegular,
                                    marginRight: dimensions.width * 0.016,
                                }}>
                                off
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={{
                    marginVertical: dimensions.height * 0.05,
                    width: '100%'
                }}>
                    <Text
                        style={{
                            color: 'black',
                            textAlign: 'left',
                            fontSize: dimensions.width * 0.05,
                            alignSelf: 'flex-start',
                            fontWeight: 500,
                            fontFamily: fontKronaOneRegular,
                            marginVertical: dimensions.height * 0.05,
                        }}>
                        Run difficulty:
                    </Text>

                    <Slider
                        style={{ width: dimensions.width * 0.8, height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={volume}
                        onValueChange={(val) => {
                            setVolume(val);
                        }}
                        onSlidingComplete={async (val) => {
                            try {
                                await AsyncStorage.setItem('volumeValue', val.toString());
                            } catch (error) {
                                console.error('Error updating volume in AsyncStorage:', error);
                            }
                        }}
                        minimumTrackTintColor="#000000"
                        maximumTrackTintColor="#A4A4A4"
                        thumbTintColor="#000000"
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Text
                        style={{
                            color: 'black',
                            textAlign: 'left',
                            fontSize: dimensions.width * 0.05,
                            fontWeight: 500,
                            fontFamily: fontKronaOneRegular,
                            flex: 1,
                        }}>
                        Vibration:
                    </Text>

                    <TouchableOpacity
                        onPress={async () => {
                            const newValue = !chickenVibrationEnabled;
                            setChickenVibrationEnabled(newValue);
                            try {
                                await AsyncStorage.setItem('chickenVibroEnabled', newValue.toString());
                            } catch (error) {
                                console.error('Error updating chickenVibroEnabled in AsyncStorage:', error);
                            }
                        }}
                        style={{
                            width: dimensions.width * 0.18,
                            height: dimensions.height * 0.034,
                            borderRadius: dimensions.width * 0.525252,
                            borderWidth: dimensions.width * 0.003,
                            borderColor: 'black',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        {!chickenVibrationEnabled && (
                            <Text
                                style={{
                                    color: 'black',
                                    textAlign: 'left',
                                    fontSize: dimensions.width * 0.04,
                                    fontWeight: 500,
                                    fontFamily: fontKronaOneRegular,
                                    paddingLeft: dimensions.width * 0.02,
                                }}>
                                on
                            </Text>
                        )}
                        <View style={{
                            width: dimensions.height * 0.034,
                            height: dimensions.height * 0.034,
                            borderRadius: dimensions.width * 0.5,
                            backgroundColor: 'black',
                        }} />

                        {chickenVibrationEnabled && (
                            <Text
                                style={{
                                    color: 'black',
                                    textAlign: 'left',
                                    fontSize: dimensions.width * 0.04,
                                    fontWeight: 500,
                                    fontFamily: fontKronaOneRegular,
                                    marginRight: dimensions.width * 0.016,
                                }}>
                                off
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => {
                    setSelectedTimeChroniclesPage('Home');
                }}
                style={{
                    backgroundColor: 'white',
                    alignSelf: 'center',
                    width: dimensions.width * 0.75,
                    alignItems: 'center',
                    height: dimensions.height * 0.0754,
                    borderRadius: dimensions.width * 0.1111111,
                    borderWidth: dimensions.width * 0.003,
                    borderColor: 'black',
                    marginBottom: dimensions.height * 0.05,
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: dimensions.height * 0.05,
                }}>
                <Text
                    style={{
                        color: 'black',
                        textAlign: 'center',
                        fontSize: dimensions.width * 0.065,
                        fontWeight: 700,
                        alignSelf: 'center',
                        fontFamily: fontKronaOneRegular,
                    }}>
                    Back Home
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ChickenSettingsScreen;

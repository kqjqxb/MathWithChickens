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

const fontKronaOneRegular = 'KronaOne-Regular';

const chickenSkinsData = [
    {
        id: 1,
        name: 'Skin 1',
        image: require('../assets/images/chickenSkins/chickenSkin1.png'),
        itemBackgroundColor: '#B29600',
        price: 100
    },
    {
        id: 2,
        name: 'Skin 2',
        image: require('../assets/images/chickenSkins/chickenSkin2.png'),
        itemBackgroundColor: '#0487A4',
        price: 200
    },
    {
        id: 3,
        name: 'Skin 3',
        image: require('../assets/images/chickenSkins/chickenSkin3.png'),
        itemBackgroundColor: '#6B018E',
        price: 300
    },
    {
        id: 4,
        name: 'Skin 3',
        image: require('../assets/images/chickenSkins/chickenSkin4.png'),
        itemBackgroundColor: '#160058',
        price: 400
    },
    {
        id: 5,
        name: 'Skin 3',
        image: require('../assets/images/chickenSkins/chickenSkin5.png'),
        itemBackgroundColor: '#760152',
        price: 500
    },
    {
        id: 6,
        name: 'Skin 3',
        image: require('../assets/images/chickenSkins/chickenSkin6.png'),
        itemBackgroundColor: '#6BA401',
        price: 600
    },
];

const defaultChickenSkin = {
    id: 0,
    name: 'Skin 1',
    image: require('../assets/images/chickenSkins/chickenSkin0.png'),
    itemBackgroundColor: '#fff',
    price: 100
};

const ChickenSkinsScreen = ({ setSelectedTimeChroniclesPage, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [selectedSkinPage, setSelectedSkinPage] = useState('Skins');
    const [ownedChickenSkins, setOwnedChickenSkins] = useState([]);
    const [buyChickenModalVisible, setBuyChickenModalVisible] = useState(false);
    const [successfullyBoughtChickenModalVisible, setSuccessfullyBoughtChickenModalVisible] = useState(false);
    const [currenChickenSkin, setCurrentChickenSkin] = useState(0);
    const [eggBalance, setEggBalance] = useState(0);
    const [selectedSkinToBuy, setSelectedSkinToBuy] = useState(null);
    const styles = createChickenSkinsStyles(dimensions);

    const filterChickenSkins = () => {
        if (selectedSkinPage === 'My skins') {
            if (ownedChickenSkins.length === 0) return [defaultChickenSkin];
            else return chickenSkinsData.filter((skin) => ownedChickenSkins.includes(skin.id));
        } else {
            return chickenSkinsData;
        }
    };

    const actualChickenSkinsData = filterChickenSkins();

    const handleBuySkin = async () => {
        if (!selectedSkinToBuy) return;
        if (eggBalance >= selectedSkinToBuy.price) {
            const newEggBalance = eggBalance - selectedSkinToBuy.price;
            setEggBalance(newEggBalance);
            const newOwnedChickenSkins = ownedChickenSkins.includes(selectedSkinToBuy.id)
                ? ownedChickenSkins
                : [...ownedChickenSkins, selectedSkinToBuy.id];
            setOwnedChickenSkins(newOwnedChickenSkins);
            setCurrentChickenSkin(selectedSkinToBuy.id);
            try {
                await AsyncStorage.setItem('eggBalance', newEggBalance.toString());
                await AsyncStorage.setItem('currenChickenSkin', selectedSkinToBuy.id.toString());
                await AsyncStorage.setItem('ownedChickenSkins', JSON.stringify(newOwnedChickenSkins));
            } catch (error) {
                console.error('Error updating AsyncStorage:', error);
            }
            setBuyChickenModalVisible(false);
            setTimeout(() => {
                setSuccessfullyBoughtChickenModalVisible(true);
            }, 1000)
            // setTimeout(() => {
            //     setSuccessfullyBoughtChickenModalVisible(false);
            // }, 4000);
        } else {
            console.warn('Not enough egg balance');
        }
        setBuyChickenModalVisible(false);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedEggBalance = await AsyncStorage.getItem('eggBalance');
                if (storedEggBalance !== null) {
                    setEggBalance(parseInt(storedEggBalance));
                }

                const storedCurrentChickenSkin = await AsyncStorage.getItem('currenChickenSkin');
                if (storedCurrentChickenSkin !== null) {
                    setCurrentChickenSkin(parseInt(storedCurrentChickenSkin));
                }

                const storedOwnedSkins = await AsyncStorage.getItem('ownedChickenSkins');
                if (storedOwnedSkins !== null) {
                    setOwnedChickenSkins(JSON.parse(storedOwnedSkins));
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            }
        };
        loadData();
    }, []);

    return (
        <SafeAreaView style={{ width: dimensions.width, height: dimensions.height }}>
            <TouchableOpacity style={{
                alignSelf: 'flex-start',
                marginLeft: dimensions.width * 0.0343434,
            }}
                onPress={() => {
                    setSelectedTimeChroniclesPage('Home');
                }}
            >
                <ArrowLeftIcon size={dimensions.width * 0.1} color='black' />
            </TouchableOpacity>

            <View style={{
                flexDirection: 'row',
                width: dimensions.width * 0.898,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.01,
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: dimensions.width * 0.5,
                backgroundColor: 'white',
                height: dimensions.height * 0.055555,
            }}>
                {['Skins', 'My skins'].map((item, index) => (
                    <TouchableOpacity key={index} style={{
                        width: dimensions.width * 0.444,
                        height: dimensions.height * 0.055555,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: dimensions.width * 0.5,
                        backgroundColor: selectedSkinPage === item ? '#D9D9D9' : 'white',
                        borderWidth: dimensions.width * 0.003,
                        borderColor: selectedSkinPage === item ? 'black' : 'transparent',
                    }}
                        onPress={() => {
                            setSelectedSkinPage(item);
                        }}
                    >
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
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                alignSelf: 'flex-start',
                marginTop: dimensions.height * 0.02,
            }}>
                <Text
                    style={{
                        color: 'black',
                        textAlign: 'center',
                        fontSize: dimensions.width * 0.035,
                        marginLeft: dimensions.width * 0.052,
                        fontWeight: 500,
                        alignSelf: 'center',
                        fontFamily: fontKronaOneRegular,
                    }}
                >
                    Your balance:
                </Text>

                <View style={{
                    backgroundColor: 'white',
                    borderRadius: dimensions.width * 0.5,
                    height: dimensions.height * 0.045,
                    paddingHorizontal: dimensions.width * 0.04,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: dimensions.width * 0.003,
                    borderColor: 'black',
                    flexDirection: 'row',
                    marginLeft: dimensions.width * 0.03,
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
                        {eggBalance ? eggBalance : 0}
                    </Text>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                width: dimensions.width * 0.898,
                alignSelf: 'center',
            }}>
                {actualChickenSkinsData.map((chickenSkin, index) => (
                    <TouchableOpacity key={index} style={{
                        width: dimensions.width * 0.43,
                        height: dimensions.height * 0.2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: dimensions.width * 0.07,
                        backgroundColor: chickenSkin.itemBackgroundColor,
                        marginBottom: dimensions.height * 0.02,
                        borderWidth: dimensions.width * 0.003,
                        borderColor: selectedSkinPage === 'My skins' && currenChickenSkin === chickenSkin.id ? 'black' : 'transparent',
                    }}
                        disabled={(selectedSkinPage === 'My skins' && currenChickenSkin === chickenSkin.id) || (selectedSkinPage === 'Skins' && ownedChickenSkins.includes(chickenSkin.id))}
                        onPress={() => {
                            if (selectedSkinPage === 'My skins') {
                                setCurrentChickenSkin(chickenSkin.id);
                            } else {
                                setSelectedSkinToBuy(chickenSkin);
                                setBuyChickenModalVisible(true);
                            }
                        }}
                    >
                        <Image
                            source={chickenSkin.image}
                            style={{
                                width: dimensions.width * 0.14,
                                height: dimensions.height * 0.12,
                            }}
                            resizeMode='contain'
                        />
                        {selectedSkinPage !== 'My skins' && !ownedChickenSkins.includes(chickenSkin.id) && (
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
                                    {chickenSkin.price}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {buyChickenModalVisible && selectedSkinToBuy && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={buyChickenModalVisible}
                    onRequestClose={() => setBuyChickenModalVisible(false)}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={{
                            width: dimensions.width * 0.8,
                            backgroundColor: 'white',
                            borderRadius: dimensions.width * 0.05,
                            padding: dimensions.width * 0.05,
                        }}>
                            {/* Верхня частина: заголовок та ціна */}
                            <View style={{ alignItems: 'center', marginBottom: dimensions.height * 0.02 }}>
                                <Text style={{
                                    fontSize: dimensions.width * 0.04,
                                    fontWeight: '700',
                                    fontFamily: fontKronaOneRegular,
                                    marginBottom: dimensions.height * 0.005,
                                    textAlign: 'center',
                                }}>
                                    {eggBalance < selectedSkinToBuy.price ? `Not enough eggs! \nYou need  ${selectedSkinToBuy.price - eggBalance} more eggs` : `Are you sure you want to trade ${selectedSkinToBuy.price} eggs for this skin?`}
                                </Text>
                            </View>

                            <View style={{
                                backgroundColor: selectedSkinToBuy.itemBackgroundColor,
                                borderRadius: dimensions.width * 0.05,
                                padding: dimensions.width * 0.05,
                                alignItems: 'center',
                                marginBottom: dimensions.height * 0.03,
                                width: dimensions.width * 0.43,
                                height: dimensions.height * 0.2,
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}>
                                <Image
                                    source={selectedSkinToBuy.image}
                                    style={{
                                        width: dimensions.width * 0.16,
                                        height: dimensions.height * 0.14,
                                    }}
                                    resizeMode='contain'
                                />
                            </View>


                            {eggBalance >= selectedSkinToBuy.price && (
                                <TouchableOpacity
                                    onPress={handleBuySkin}
                                    style={styles.buyModalButtonsStyles}
                                >
                                    <Text style={styles.buyModalButtonsText}>Yes</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                onPress={() => setBuyChickenModalVisible(false)}
                                style={styles.buyModalButtonsStyles}
                            >
                                <Text style={styles.buyModalButtonsText}>{eggBalance >= selectedSkinToBuy.price ? 'No' : 'Close'}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            )}

            <Modal
                transparent={true}
                animationType="fade"
                visible={successfullyBoughtChickenModalVisible}
                onRequestClose={() => setBuyChickenModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        width: dimensions.width * 0.8,
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.05,
                        padding: dimensions.width * 0.05,
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

                        <View style={{ alignItems: 'center', marginVertical: dimensions.height * 0.02 }}>
                            <Text style={{
                                fontSize: dimensions.width * 0.04,
                                fontWeight: '700',
                                fontFamily: fontKronaOneRegular,
                                textAlign: 'center',
                                lineHeight: dimensions.height * 0.03,
                            }}>
                                Congratulations on the exchange!!!  You can now go to “My Skins: and select it
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => setSuccessfullyBoughtChickenModalVisible(false)}
                            style={styles.buyModalButtonsStyles}
                        >
                            <Text style={styles.buyModalButtonsText}>Back</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const createChickenSkinsStyles = (dimensions) => StyleSheet.create({
    buyModalButtonsText: {
        color: 'black',
        fontSize: dimensions.width * 0.04,
        fontFamily: fontKronaOneRegular,
    },
    buyModalButtonsStyles: {
        height: dimensions.height * 0.055555,
        borderRadius: dimensions.width * 0.04,
        borderWidth: dimensions.width * 0.002,
        borderColor: 'black',
        width: dimensions.width * 0.43,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: dimensions.height * 0.02,
    }
});

export default ChickenSkinsScreen;

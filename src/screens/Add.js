import React, {useState} from 'react';
import {
    KeyboardAvoidingView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Platform,
    SafeAreaView, ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import Colors from '../assets/Colors';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import firestore from '@react-native-firebase/firestore';
import {f} from "../../config/config";

import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';

function Add() {

    const [checked, setChecked] = useState('first');
    const [value, setValue] = useState(0);
    const [adTitle, setAdTitle] = useState('');
    const [description, setDescription] = useState('');
    const [rooms, setRooms] = useState('');
    const [floor, setFloor] = useState('');
    const [location, setLocation] = useState('');
    const [age, setAge] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

    const radio_props = [
        {label: 'Kiralık', value: 0},
        {label: 'Satılık', value: 1},
    ];


    function pickImage() {
        ImagePicker.openPicker({
            width: 370,
            height: 300,
            sortOrder: 'none',
            compressImageMaxWidth: 1000,
            mediaType: 'photo',
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            includeExif: true,
        }).then(img => {
            setImage({
                uri: img.path, width: img.width, height: img.height, mime: img.mime,
            });
            setImageUri(img.path);
            setLoading(false);
            setShowImage(true);

        }).catch(e => {
            console.log(e.message);
            e.message !== 'User cancelled image selection' && Alert.alert(e.message ? e.message : e);
        });
        setLoading(false);
    }

    function renderImage(image) {

        return (
            <View style={styles.renderImageView}>
                {showImage ?
                    <Image style={styles.renderedImage} source={image}/>
                    : null}
            </View>
        );
    }

    function renderAsset(image) {
        return renderImage(image);
    }

    function cleanupSingleImage() {

        ImagePicker.cleanSingle(image ? image.uri : null).then(() => {
            setImageUri(null);
            setShowImage(false);
        }).catch(e => {
            console.log(e);
            alert(e);
        });
    }

    function control() {
        setLoading(true);
        setDisableButton(true);

        if (!adTitle || !rooms || !floor || !description || !age || !price || !location || !imageUri) {
            Alert.alert
            (
                'Hata',
                'Lütfen bütün alanları doldurduğunuzdan emin olun.',
                [{
                    text: 'Tamam', onPress: () => {
                        setLoading(false);
                        setDisableButton(false);
                    },
                }],
            );

        }
        else {
            console.log("IMAGE URİ", imageUri)
            uploadImage();

        }
    }


    function uploadImage(mime = 'image/jpg') {
        const imageID = uuid.v4();
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        return new Promise((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
            let uploadBlob = null;
            const imageRef = f.storage().ref('ads/').child(imageID);
            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, {type: `${mime};BASE64`});
                })
                .then((blob) => {
                    uploadBlob = blob;
                    return imageRef.put(blob, {contentType: mime});
                })
                .then(() => {
                    uploadBlob.close();
                    imageRef.getDownloadURL().then((url) => {
                        shareAd(url,imageID);
                    });
                })
                .then((url) => {
                    resolve(url);
                })
                .catch((error) => {
                    setLoading(false)
                    alert(error)
                    reject(error);
                });
        });
    }


    function shareAd(url,imageID) {
        const uid = f.auth().currentUser.uid;
            const newDate = new Date();
            const date = newDate.getTime();
            const docRef = firestore().collection('ads');

            docRef.add({
                age,
                imageLink: url,
                imageID,
                description,
                floor,
                rooms,
                date,
                price,
                location,
                type: value === 0 ? 'Kiralık' : 'Satılık',
                title: adTitle,
                userID:uid,
                isSold:false,
            }).then(function (doc) {
                console.log('Document written with ID:', doc.id);
                Alert.alert(
                    'Başarılı',
                    'İlanınız paylaşıldı',
                    [{text: 'Tamam', onPress: () => reset()}],
                );

            }).catch(function (error) {
                console.log('error', error);
                setLoading(false);
            });
    }

    function reset() {
        setLoading(false);
        setDisableButton(false);
        setImageUri(null);
        setShowImage(false);
        setImage(null);
        setImage(null);
        setPrice();
        setAdTitle();
        setAge();
        setDescription();
        setFloor();
        setLocation();
        setRooms();
    }


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.App}}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'handled'}
            >
                <KeyboardAvoidingView
                    style={styles.container}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 44 : null}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}
                >
                    <Text style={styles.pageTitle}>
                        Yeni {value === 0 ? 'Kiralık' : 'Satılık'} Ev İlanı
                    </Text>
                    <View style={styles.type}>
                        <RadioForm
                            style={{marginVertical: 10}}
                            buttonColor={Colors.Lightblue}
                            labelColor={Colors.Text}
                            selectedButtonColor={Colors.App}
                            selectedLabelColor={Colors.Text}
                            radio_props={radio_props}
                            onPress={(value) => {
                                setValue(value);
                            }}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder={'İlan başlığı'}
                        onSubmitEditing={() => {
                            this.second.focus();
                        }}
                        onChangeText={text => setName(text)}
                        returnKeyType={'next'}
                        blurOnSubmit={false}
                        onChangeText={text => setAdTitle(text)}
                        value={adTitle}
                        returnKeyType={'next'}
                    />
                    <TextInput
                        ref={(input) => {
                            this.second = input;
                        }}
                        onSubmitEditing={() => {
                            this.third.focus();
                        }}
                        multiline
                        maxLength={500}
                        style={styles.descInput}
                        placeholder={'Açıklama'}
                        onChangeText={text => setDescription(text)}
                        value={description}
                        returnKeyType={'next'}
                    />
                    <TextInput
                        ref={(input) => {
                            this.third = input;
                        }}
                        onSubmitEditing={() => {
                            this.fourth.focus();
                        }}
                        style={styles.input}
                        keyboardType={'number-pad'}
                        placeholder={'Bulunduğu kat'}
                        onChangeText={text => setFloor(text)}
                        value={floor}
                        returnKeyType={'next'}
                    />
                    <TextInput
                        ref={(input) => {
                            this.fourth = input;
                        }}
                        onSubmitEditing={() => {
                            this.fifth.focus();
                        }}
                        style={styles.input}
                        keyboardType={'number-pad'}
                        placeholder={'Bina yaşı'}
                        onChangeText={text => setAge(text)}
                        value={age}
                        returnKeyType={'next'}
                    />
                    <TextInput
                        ref={(input) => {
                            this.fifth = input;
                        }}
                        onSubmitEditing={() => {
                            this.sixth.focus();
                        }}
                        style={styles.input}
                        keyboardType={'number-pad'}
                        placeholder={'Oda sayısı'}
                        onChangeText={text => setRooms(text)}
                        value={rooms}
                        returnKeyType={'next'}
                    />
                    <TextInput
                        ref={(input) => {
                            this.sixth = input;
                        }}
                        onSubmitEditing={() => {
                            this.seventh.focus();
                        }}
                        style={styles.input}
                        placeholder={'Konum'}
                        returnKeyType={'next'}
                        onChangeText={text => setLocation(text)}
                        value={location}
                    />
                    <TextInput
                        ref={(input) => {
                            this.seventh = input;
                        }}
                        style={styles.input}
                        returnKeyType={'done'}
                        keyboardType={'number-pad'}
                        placeholder={'Fiyat (₺)'}
                        onChangeText={text => setPrice(text)}
                        value={price}
                    />
                    {showImage ?
                        <View style={{alignItems: 'center'}}>
                            {renderAsset(image)}
                            <TouchableOpacity onPress={() => {
                                cleanupSingleImage();
                            }}>
                                <Text style={styles.removeText}>Fotoğrafı Kaldır</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity
                            onPress={() => {
                                pickImage(true);
                            }}
                            style={styles.imageView}
                        >
                            <EvilIcons name={'camera'} color={'white'} size={90}/>
                            <Text style={styles.imageText}>
                                Görsel eklemek dikkat çekmenizi sağlar
                            </Text>
                        </TouchableOpacity>
                    }

                    <TouchableOpacity
                        disabled={disableButton}
                        onPress={() => control()}
                        style={styles.shareButton}>
                        {
                            loading ?
                                <ActivityIndicator color={'white'} size="small"/>
                                :
                                <Text style={styles.shareText}>Paylaş</Text>
                        }
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pageTitle: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 40,
        marginTop: 40,
    },
    type: {
        marginVertical: 20,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    input: {
        marginBottom: 20,
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        color: Colors.Text,

    },
    descInput: {
        marginBottom: 20,
        backgroundColor: 'white',
        height: 70,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        color: Colors.Text,
    },
    imageView: {
        backgroundColor: Colors.Navy,
        marginTop: 10,
        height: 200,
        width: 300,
        borderRadius: 15,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    imageText: {
        color: '#e5e5e5',
        fontSize: 11,
        textAlign: 'center',
    },
    renderedImage: {
        marginTop: 10,
        height: 200,
        width: 300,
        borderRadius: 15,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    renderImageView: {
        marginTop: 10,
        height: 200,
        width: 300,
        borderRadius: 15,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    removeText: {
        marginTop: 5,
        color: Colors.Lighter,
        marginBottom: 10,
    },


    shareButton: {
        backgroundColor: Colors.Purple,
        paddingHorizontal: 100,
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 20,
        borderRadius: 200,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        marginBottom: 20,
    },
    shareText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default inject('GetStore')(observer(Add));

import React, {useEffect, useState} from 'react';
import {
    Text,
    Dimensions,
    StyleSheet,
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity, Alert,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import Colors from '../assets/Colors';
import {f} from '../../config/config';
import firestore from '@react-native-firebase/firestore';

import GetStore from '../store/GetStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');

function Detail({route, navigation}) {
    const detailData = route.params.data;
    const advertiserID = detailData.data.userID;
    const from = detailData.from;

    const [name, setName] = useState();
    const [loading, setLoading] = useState(true);

    navigation.setOptions(advertiserID === f.auth().currentUser.uid && {
        headerRight: () => (
            <TouchableOpacity
                style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}
                onPress={() =>
                    Alert.alert(
                        'Dikkat',
                        `Bu ilanı silmek istiyor musunuz?`,
                        [
                            {
                                text: 'Vazgeç',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {text: 'Tamam', onPress: () => deleteAd()},
                        ],
                    )}>
                <FontAwesome color={'white'} size={23} name={'trash'}/>
            </TouchableOpacity>
        ),
    },
    );


    function deleteAd() {
        console.log(detailData.id);
        from === 'home' ? GetStore.HomeRefresh = true
            : from === 'filter' ? GetStore.FilterRefresh = true
            : from === 'profile' ? GetStore.ProfileRefresh = true
                : null;
        firestore().collection('ads').doc(detailData.id).delete().then(function () {
            Alert.alert('Bilgi', 'İlan başarıyla silindi', [{text: 'Tamam', onPress: () => navigation.goBack()}]);
            console.log('Document successfully deleted!');
        }).then(function () {
            f.storage().ref('ads/').child(detailData.data.imageID).delete().then(function() {
                console.log("Image successfully deleted")
            }).catch(function(error) {
                console.log("Error occured while deleting Image")
            });
        })
            .catch(function (error) {
            Alert.alert('Hata', error);
            console.error('Error removing document: ', error);
        });
    }

    function getAdvertiser() {
        const docRef = firestore().collection('users').doc(advertiserID);
        docRef.get().then(function (doc) {
            setName(doc.data().name + ' ' + doc.data().surname);
        }).then(function () {
            setLoading(false);
        });
    }


    useEffect(() => {
        getAdvertiser();
    }, []);


    return (
        loading ? <ActivityIndicator size={'large'} style={{marginTop: 30}} color={Colors.App}/>

            :
            <ScrollView style={styles.container}>
                <Text numberOfLines={1} style={styles.nameText}>{name}</Text>

                <ImageBackground style={styles.adImage} source={{uri: detailData.data.imageLink}}>

                </ImageBackground>
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    adImage: {
        backgroundColor: '#fff',
        height: height / 3,
        width,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 5,

        backgroundColor: '#ee6246',
        color: 'black',
    },
});

export default inject('GetStore')(observer(Detail));

import React, {useEffect, useState} from 'react';
import {
    TouchableOpacity,
    Alert,
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView,
    FlatList,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {f} from '../../config/config'


import Colors from '../assets/Colors';
import GetStore from '../store/GetStore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const {width, height} = Dimensions.get('window');

function Profile({navigation}) {

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getUserInfo();
    }, []);


    function getUserInfo() {
        setLoading(true);
        const uid = f.auth().currentUser.uid;
        let db = firestore().collection('users').doc(uid);
        db.get().then(function (doc) {
            if (doc.exists) {
                GetStore.authUser = doc.data();
            }
        }).then(function () {
            getHistoricData();
        }).catch(function (error) {
            console.log(error);
        });
    }

    function getHistoricData() {
        const uid = f.auth().currentUser.uid;
        firestore().collection('ads').where('userID', '==', uid).orderBy('date', 'desc').get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    GetStore.historicData.push({data: doc.data(), id: doc.id});
                    console.log(GetStore.historicData);
                });
            }).then(function () {
            setLoading(false);
            GetStore.ProfileRefresh = false;
        }).catch(function (error) {
            console.log('AAA', error);
            setLoading(false);
        });
    }

    function deleteAd(abc,imageID) {
        GetStore.ProfileRefresh = true;
        firestore().collection('ads').doc(abc).delete().then(function () {
            Alert.alert('Bilgi', 'İlan başarıyla silindi', 'Tamam');
        }).then(function () {
            f.storage().ref('ads/').child(imageID).delete().then(function() {
                console.log("Image successfully deleted")
            }).catch(function(error) {
                console.log("Error occured while deleting Image")
            });
        }).catch(function (error) {
            Alert.alert("Hata", error)
            console.error('Error removing document: ', error);
        });
    }

    function render({item, index}) {
        return (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Detail', {data: item, from:"profile"})}
                    onLongPress={() =>
                    Alert.alert(
                        'Dikkat',
                        `Bu ilanı silmek istiyor musunuz?`,
                        [
                            {
                                text: 'Vazgeç',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {text: 'Tamam', onPress: () => deleteAd(item.id,item.data.imageID)},
                        ],
                    )}
                                  style={styles.postCard}
                >
                    <View style={styles.price}>
                        <Text style={{color: 'white'}}>
                            {item.data.price} ₺
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Image style={styles.adImage} source={{uri: item.data.imageLink}}/>
                        <View style={styles.ad}>
                            <Text style={styles.adTitle} numberOfLines={4}>
                                {item.data.title}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.listFooter}>
                        <View style={styles.location}>
                            <FontAwesome name={'map-marker'} size={17} color={'#fff'}/>
                            <Text style={styles.locationText}> {item.data.location}</Text>
                        </View>
                        <View style={[{backgroundColor: item.data.type === 'Kiralık' ? Colors.Orange : Colors.Green}, styles.type]}>
                            <Text style={{color: 'white'}}>{item.data.type}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
        );
    }

    function HeaderComp() {
        return (
            <View>
                <View style={styles.userCard}>
                    <Image style={styles.profileImage} source={require('../assets/images/user.png')}/>
                    <Text style={styles.profileNameText}>
                        {GetStore.authUser.name} {GetStore.authUser.surname}
                    </Text>
                </View>
                <Text style={styles.titleText}>
                    İlanlarınız
                </Text>
            </View>
        );
    }

    useEffect(() => {
        console.log('here');
        if (GetStore.ProfileRefresh) {
            setLoading(true);
            GetStore.historicData = [];
            getHistoricData();
        }
    }, [GetStore.ProfileRefresh]);


    return (

        <View style={styles.container}>
            {
                loading ?
                    <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color={Colors.App} size="large"/>
                    </View>
                    :

                    <View style={styles.timeLine}>
                        <FlatList
                            ListHeaderComponent={HeaderComp}
                            data={GetStore.historicData}
                            renderItem={render}
                            keyExtractor={(item, index) => index.toString()}
                            refreshing={GetStore.ProfileRefresh}
                            onRefresh={() => GetStore.ProfileRefresh = true}
                        />
                    </View>
            }
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userCard: {
        alignItems: 'center',
        backgroundColor: Colors.App,
        paddingBottom: 30,
        padding: 5,
    },
    timeLine: {
        flex: 1,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    profileNameText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    titleText: {
        margin: 10,
        marginTop: 20,
        marginLeft: 20,
        color: Colors.Navy,
        fontWeight: 'bold',
        fontSize: 28,
    },
    postCard: {
        width: width - 14,
        backgroundColor: '#fff',
        margin: 7,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    row: {
        padding: 20,
        paddingTop: 0,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    listFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        backgroundColor:Colors.Purple,
        padding: 5,
        alignSelf: 'flex-end',
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 5,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        alignSelf: 'flex-end',
        backgroundColor: Colors.Text,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 5,
    },
    type: {
        padding: 5,
        paddingHorizontal: 15,
        alignSelf: 'flex-end',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 5,
    },
    locationText: {
        color: '#fff',
        fontSize: 12,
    },
    adImage: {
        width: 70,
        height: 70,
        borderRadius: 4,
    },
    ad: {
        marginLeft: 10,
    },
    adTitle: {
        marginTop: 10,
        color: Colors.Text,
        marginRight: 50,
        fontWeight: 'bold',
    },
});

export default inject('GetStore')(observer(Profile));

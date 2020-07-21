import React, {useEffect, useState} from 'react';
import {SafeAreaView, FlatList, StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {inject, observer} from 'mobx-react';
import Colors from '../assets/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useScrollToTop} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetStore from '../store/GetStore';

function Home({navigation}) {
    const data = [1, 23, 45, 6, 7, 89, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1];

    const [last, setLast] = useState();
    const [loading, setLoading] = useState(true);

    const ref = React.useRef(null);
    useScrollToTop(ref);

    function getAllAds() {
        firestore().collection('ads').orderBy('date', 'desc').limit(3).get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    GetStore.allAds.push({data: doc.data(), id: doc.id});
                });
                setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);
            }).then(function () {
            GetStore.HomeRefresh = false;
            setLoading(false);
        }).catch(function (error) {
            setLoading(false);
            GetStore.HomeRefresh = false;
        })
    }


    function loadMore() {
        try {
            firestore().collection('ads').orderBy('date', 'desc').startAfter(last).limit(2).get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        GetStore.allAds.push({data: doc.data(), id: doc.id});
                    });
                    setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);
                }).then(function () {
            });
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getAllAds();
    }, []);

    useEffect(() => {
        if (GetStore.HomeRefresh) {
           refresh();
        }
    }, [GetStore.HomeRefresh]);

    async function refresh(){
        GetStore.allAds = [];
        console.log("1111",GetStore.allAds)
        getAllAds();
        console.log("2222",GetStore.allAds)
    }

    function render({item, index}) {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Detail', {data: item,from:"home"})}
                style={styles.list}
            >
                <View style={styles.price}>
                    <Text style={{color: 'white'}}>
                        {item.data.price} ₺
                    </Text>
                </View>
                <View style={styles.row}>
                    <Image style={styles.adImage} source={{uri: item.data.imageLink}}/>
                    <View style={styles.ad}>
                        <Text style={styles.adTitle} numberOfLines={2}>
                            {item.data.title}
                        </Text>
                        <Text style={styles.description} numberOfLines={3}>
                            {item.data.description}
                        </Text>
                    </View>
                </View>

                <View style={styles.listFooter}>
                    <View style={styles.location}>
                        <FontAwesome name={'map-marker'} size={17} color={'#fff'}/>
                        <Text style={styles.locationText}>
                            {item.data.location}
                        </Text>
                    </View>
                    <View style={[{backgroundColor: item.data.type === 'Kiralık' ? Colors.Orange : Colors.Green}, styles.type]}>
                        <Text style={{color: 'white'}}>{item.data.type}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }

    function renderFooter() {
        if (!loading) {
            return null;
        }
        return (
            <View style={{marginBottom: 30}}>
                <ActivityIndicator color={Colors.App} size={'large'}/>
            </View>
        );
    };

    return (
                loading ? <ActivityIndicator size={"large"} style={{marginTop:30}} color={Colors.App}/>
                    :
                    <SafeAreaView style={styles.container}>
                        <FlatList
                            ref={ref}
                            renderItem={render}
                            data={GetStore.allAds}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={renderFooter}
                            onEndReached={() => loadMore()}
                            onEndReachedThreshold={0.1}
                            refreshing={GetStore.HomeRefresh}
                            onRefresh={() => GetStore.HomeRefresh = true}
                        />
                        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Filter')}>
                            <FontAwesome name={'filter'} size={23} color={'black'}/>
                        </TouchableOpacity>
                    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    footerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 300,
        backgroundColor: Colors.App,
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    list: {
        backgroundColor: '#fff',
        margin: 10,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    row: {
        padding: 10,
        paddingTop: 0,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
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
        marginTop: 3,
        color: Colors.Text,
        marginRight: 60,
        fontWeight: 'bold',
    },
    description: {
        marginRight: 60,
        marginTop: 5,
        color: Colors.Text,
        fontSize: 12,
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
    type: {
        padding: 5,
        paddingHorizontal: 15,
        alignSelf: 'flex-end',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 5,
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
    locationText: {
        marginLeft: 5,
        marginRight: 3,
        color: '#fff',
        fontSize: 12,
    },
});

export default inject('GetStore')(observer(Home));

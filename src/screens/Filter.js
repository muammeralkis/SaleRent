import React, {useEffect, useState} from 'react';
import {
    Alert,
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator, FlatList, Image, SafeAreaView,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import GetStore from '../store/GetStore';
import Colors from '../assets/Colors';
import RNPickerSelect from 'react-native-picker-select';
import {firestore} from '../../config/config';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


function Filter({navigation}) {
    const types = [{label: 'Kiralık', value: 'Kiralık'}, {label: 'Satılık', value: 'Satılık'}];
    const [type, setType] = useState();
    const [location, setLocation] = useState();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [showInputs, setShowInputs] = useState(GetStore.filterData.length <= 0);
    const [last, setLast] = useState();
    const [empty, setEmpty] = useState();

    navigation.setOptions(GetStore.filterData.length >= 0 ? {
            headerRight: () => (
                <TouchableOpacity
                    style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => resetData()}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                        Sıfırla
                    </Text>
                </TouchableOpacity>
            ),
        }
        :
        {
            headerRight: () => null,
        },
    );

    function resetData() {
        GetStore.filterData = [];
        setType();
        setLocation();
        setShowInputs(true);
    }

    let docRef;

    function getFilterData() {
        setButtonLoading(true);
        setDisableButton(true);


        if (type && location) {
            docRef = firestore.collection('ads')
                .where('type', '==', type)
                .where('location', '>=', location.charAt(0).toUpperCase() + location.slice(1))
                .limit(1);
        } else if (type && !location) {

            docRef = firestore.collection('ads')
                .where('type', '==', type);

        } else if (location && !type) {

            docRef = firestore.collection('ads')
                .where('location', '>=', location.charAt(0).toUpperCase() + location.slice(1))
                .limit(1);
        } else {
            Alert.alert(
                'Hata',
                'Lütfen en az bir filtre seçeneği belirleyin',
                [{
                    text: 'Tamam', onPress: () => {
                        setButtonLoading(false);
                        setDisableButton(false);
                    },
                }],
            );
            return;
        }
        docRef.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                GetStore.filterData.push({data: doc.data(), id: doc.id});
                setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);
            });
        }).then(function () {
            if (GetStore.filterData.length <= 0) {
                setEmpty('Seçtiğiniz kriterlere uygun sonuç bulunamadı');
            }
            GetStore.filterData.length <= 0 ? setEmpty('Seçtiğiniz kriterlere uygun sonuç bulunamadı.') : setEmpty();
            putDataToRender();
        }).catch(function (error) {
            console.log('1111', error);
            putDataToRender();
        });

    }

    function loadMore() {
        if (type && location) {
            docRef = firestore.collection('ads')
                .where('type', '==', type)
                .where('location', '>=', location.charAt(0).toUpperCase() + location.slice(1))
                .where('location', '<=', location.charAt(0).toUpperCase() + location.slice(1) + '\uf8ff')
                .limit(1);
        } else if (type && !location) {

            docRef = firestore.collection('ads')
                .where('type', '==', type);

        } else if (location && !type) {

            docRef = firestore.collection('ads')
                .where('location', '>=', location.charAt(0).toUpperCase() + location.slice(1))
                .where('location', '<=', location.charAt(0).toUpperCase() + location.slice(1) + '\uf8ff')
                .limit(1);
        }
        try {
            docRef.startAfter(last).get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        GetStore.filterData.push({data: doc.data(), id: doc.id});
                    });
                    setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);
                }).then(function () {

            });
        } catch (e) {
            console.log('2222', e);
        }
    }

    useEffect(() => {
        if (GetStore.FilterRefresh) {
            GetStore.filterData = [];
            getFilterData();
        }
    }, [GetStore.FilterRefresh]);

    function putDataToRender() {
        GetStore.FilterRefresh = false;
        setButtonLoading(false);
        setDisableButton(false);
        setShowInputs(false);
        console.log(GetStore.filterData);

    }

    function renderFooter() {
        if (!buttonLoading || GetStore.FilterRefresh) {
            return null;
        }
        return (
            <View style={{marginBottom: 30}}>
                <ActivityIndicator color={Colors.App} size={'large'}/>
            </View>
        );
    };


    function render({item, index}) {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Detail', {data: item, from: 'filter'})}
                style={styles.list}
            >
                <View
                    style={styles.price}>
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

    return (
        <SafeAreaView style={styles.container}>
            {
                showInputs ?
                    <View>
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            placeholder={{label: 'Tür seçiniz', value: null}}
                            onValueChange={(value) => setType(value)}
                            items={types}
                            value={type}
                            doneText={'Bitti'}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder={'Konum'}
                            returnKeyType={'go'}
                            onChangeText={text => setLocation(text)}
                            value={location}
                        />
                        <TouchableOpacity
                            disabled={disableButton}
                            onPress={() => getFilterData()}
                            style={styles.filterButton}>
                            {
                                buttonLoading ?
                                    <ActivityIndicator color={'white'} size="small"/>
                                    :
                                    <Text style={styles.filterText}>Filtrele</Text>
                            }
                        </TouchableOpacity>
                    </View>
                    :
                    <View>
                        <FlatList
                            data={GetStore.filterData}
                            renderItem={render}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.9}
                            ListFooterComponent={renderFooter}
                            refreshing={GetStore.FilterRefresh}
                            onRefresh={() => GetStore.FilterRefresh = true}
                        />
                        <Text style={styles.emptyText}>
                            {empty}
                        </Text>
                    </View>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        marginVertical: 10,
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        color: Colors.Text,

    },

    filterButton: {
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
        marginTop: 10,
        marginBottom: 20,
    },
    filterText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
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
    emptyText: {
        color: Colors.Text,
        marginTop: 20,
        marginHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 16,
    },
});


const pickerSelectStyles = StyleSheet.create({

    inputIOS: {
        marginTop: 20,
        fontSize: 16,
        marginRight: 20,
        marginLeft: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        color: Colors.Text,
        paddingRight: 30,
        shadowColor: '#000',
        shadowOffset: {height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    inputAndroid: {
        marginTop: 20,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: 'white',
        elevation: 7,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 120,
        color: Colors.Text,
        paddingRight: 30, // to ensure the text is never behind the icon
    },

});

export default inject('GetStore')(observer(Filter));

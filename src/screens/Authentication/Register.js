import React, {useEffect, useState} from 'react';
import {
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    NativeModules,
    StatusBarIOS, ScrollView, ActivityIndicator,
} from 'react-native';
import {inject, observer} from 'mobx-react';
import Colors from '../../assets/Colors';
import {f, firestore} from '../../../config/config';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';


function Register({navigation}) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [pass, setPass] = useState('');

    const [hidePass, setHidePass] = useState(true);


    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [loading, setLoading] = useState(false);
    const {StatusBarManager} = NativeModules;


    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBarManager.getHeight((statusBarFrameData) => {
                setStatusBarHeight(statusBarFrameData.height);
            });
            StatusBarIOS.addListener('statusBarFrameWillChange', (statusBarData) => {
                setStatusBarHeight(statusBarData.frame.height);

            });
        }
    });

    function createUser() {
        setLoading(true);
        if (name.length < 3) {
            Alert.alert('Hata', 'İsim bu kadar kısa olamaz', [{text: 'Tamam', onPress: () => setLoading(false)}]);
        }
        //SOYAD UZUNLUK
        else if (surname.length < 3) {
            Alert.alert('Hata', 'Soyisim bu kadar kısa olamaz', [{text: 'Tamam', onPress: () => setLoading(false)}]);
        }
        else if (city.length < 3) {
            Alert.alert('Hata', 'Şehir ismi bu kadar kısa olamaz', [{text: 'Tamam', onPress: () => setLoading(false)}]);
        }

        else {
            const userRef = firestore.collection('users');
            f.auth().createUserWithEmailAndPassword(email, pass)
                .then(function (user) {
                    const uid = user.user.uid;
                    userRef.doc(uid).set({
                        name,
                        surname,
                        email,
                        city,
                        password: pass,
                    });

                }).then(function () {
                setLoading(false);
                Alert.alert('Başarılı', 'Hesabınıza yönlendiriliyorsunuz...', 'Tamam');
            }).catch(function (error) {
                if (error.code === 'auth/invalid-email') {
                    Alert.alert(
                        'Hata',
                        'Geçersiz e-posta adresi',
                        [{text: 'Tamam', onPress: () => setLoading(false)}],
                    );
                } else if (error.code === 'auth/email-already-in-use') {
                    Alert.alert(
                        'Hata',
                        'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor',
                        [{text: 'Tamam', onPress: () => setLoading(false)}],
                    );
                } else if (error.code === 'auth/weak-password') {
                    Alert.alert(
                        'Hata',
                        'Parola en az 6 karakterden oluşmalıdır ',
                        [{text: 'Tamam', onPress: () => setLoading(false)}],
                    );
                } else if (error.code === 'auth/network-request-failed') {
                    Alert.alert(
                        'Hata',
                        'Bağlantı Hatası',
                        [{text: 'Tamam', onPress: () => setLoading(false)}],
                    );
                } else {
                    Alert.alert(
                        'Hata',
                        'Bir şeyler yolunda değil besbelli. bkz: Nilipek.',
                        [{text: 'Tamam', onPress: () => setLoading(false)}],
                    );
                }
            });
        }
    }


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.App}}>
            <ScrollView
            keyboardShouldPersistTaps={"handle"}
            >

                <KeyboardAvoidingView style={{flex: 1, marginTop: 10, backgroundColor: Colors.App}}
                                      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : null}
                                      behavior={(Platform.OS === 'ios') ? 'padding' : null}
                >

                    <View style={styles.title}>
                        <Text style={styles.titleText}>
                            Üye Ol
                        </Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setName(text)}
                            value={name}
                            placeholder={'İsim'}
                            onSubmitEditing={() => {
                                this.second.focus();
                            }}
                            returnKeyType={'next'}
                            blurOnSubmit={false}
                            placeholderTextColor={Colors.Grey}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            ref={(input) => {
                                this.second = input;
                            }}
                            style={styles.input}
                            onChangeText={text => setSurname(text)}
                            value={surname}
                            placeholder={'Soyisim'}
                            onSubmitEditing={() => {
                                this.third.focus();
                            }}
                            returnKeyType={'next'}
                            blurOnSubmit={false}
                            placeholderTextColor={Colors.Grey}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            ref={(input) => {
                                this.third = input;
                            }}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                            style={styles.input}
                            onChangeText={text => setEmail(text)}
                            value={email}
                            placeholder={'E-posta'}
                            onSubmitEditing={() => {
                                this.fourth.focus();
                            }}
                            returnKeyType={'next'}
                            blurOnSubmit={false}
                            placeholderTextColor={Colors.Grey}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            ref={(input) => {
                                this.fourth = input;
                            }}
                            style={styles.input}
                            onChangeText={text => setCity(text)}
                            value={city}
                            placeholder={'Şehir'}
                            onSubmitEditing={() => {
                                this.fifth.focus();
                            }}
                            returnKeyType={'next'}
                            blurOnSubmit={false}
                            placeholderTextColor={Colors.Grey}
                        />
                    </View>
                    <View style={styles.passInputView}>
                        <TextInput
                            ref={(input) => {
                                this.fifth = input;
                            }}
                            onSubmitEditing={() => {
                                createUser(email,pass)
                            }}
                            returnKeyType={'go'}
                            blurOnSubmit={true}
                            autoCapitalize={'none'}
                            style={styles.passInput}
                            onChangeText={text => setPass(text)}
                            value={pass}
                            placeholder={'Parola'}
                            secureTextEntry={hidePass}
                            placeholderTextColor={Colors.Grey}
                        />
                        <TouchableOpacity
                            onPress={() => setHidePass(!hidePass)}
                            style={styles.hidePass}
                        >
                            {hidePass ?
                                <Ionicons name={'ios-eye'} size={24} color={Colors.Grey}/>
                                :
                                <Ionicons name={'ios-eye-off'} size={24} color={Colors.Grey}/>
                            }
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity
                        onPress={() => createUser(email, pass)}
                        style={styles.signUp}>
                        {
                            loading === true ?
                                <ActivityIndicator color={'white'} size="small"/>
                                :
                                <Text style={styles.signUpText}>Onayla</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> {navigation.goBack()}} style={styles.goLogin}>
                        <Text style={styles.goLoginText}>Hesabın mı var?</Text>
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
    title: {
        paddingBottom: 50,
        paddingTop: 10,
        marginHorizontal: 20,
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.Navy,
    },
    inputView: {
        marginBottom: 20,
    },
    input: {
        padding: 15,
        marginHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'grey',
        color: Colors.Text,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    passInputView: {
        marginHorizontal: 10,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        borderRadius: 10,
    },
    passInput: {
        padding: 15,
        borderColor: 'grey',
        color: Colors.Text,
        flex: 1,
    },
    hidePass: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 7,
    },
    signUp: {
        backgroundColor: Colors.Purple,
        paddingHorizontal: 100,
        paddingVertical: 10,
        borderRadius: 200,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    signUpText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    goLogin:{
        alignSelf: 'center',
    },
    goLoginText:{
        color:"white",
    }
});

export default inject('GetStore')(observer(Register));

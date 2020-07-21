import React, {useState, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView, TouchableOpacity,
    TextInput,
    ActivityIndicator,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    NativeModules,
    StatusBarIOS,
    Alert,
} from 'react-native';
import Colors from '../../assets/Colors';
import {auth} from '../../../config/config';
import Ionicons from 'react-native-vector-icons/Ionicons';


function Loading({navigation}) {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [hidePass, setHidePass] = useState(true);
    const [loading, setLoading] = useState(false);

    const [statusBarHeight, setStatusBarHeight] = useState(0);
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

    async function loginUser(email, pass) {
        setLoading(true);
        try {
            await auth.signInWithEmailAndPassword(email, pass);
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                Alert.alert(
                    'Hata',
                    'Geçersiz e-posta adresi',
                    [{text: 'Tamam', onPress: () => setLoading(false)}],
                );
            } else if (error.code === 'auth/wrong-password') {
                Alert.alert(
                    'Hata',
                    'Parola hatalı',
                    [{text: 'Tamam', onPress: () => setLoading(false)}],
                );
            } else if (error.code === 'auth/user-disabled') {
                Alert.alert(
                    'Hata',
                    'Bu hesaba erişim engellendi!',
                    [{text: 'Tamam', onPress: () => setLoading(false)}],
                );
            } else if (error.code === 'auth/user-not-found') {
                Alert.alert(
                    'Hata',
                    'Bu e-posta adresi bir hesaba ait görünmüyor',
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
        }
    }

    return (
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: Colors.App}}
                              keyboardVerticalOffset={Platform.OS === 'ios' ? 44 : null}
                              behavior={(Platform.OS === 'ios') ? 'padding' : null}
        >
            <ScrollView
                style={{backgroundColor: Colors.App}}
                contentContainerStyle={{flex: 1}}
                keyboardShouldPersistTaps={'handle'}
            >
                <SafeAreaView style={styles.container}>

                    <Text style={styles.appName}>SaleRent</Text>
                    <View style={styles.form}>
                        <View style={styles.inputView}>
                            <TextInput
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                                style={styles.input}
                                onChangeText={text => setEmail(text)}
                                value={email}
                                placeholder={'E-posta'}
                                onSubmitEditing={() => {
                                    this.second.focus();
                                }}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                placeholderTextColor={Colors.Grey}
                            />
                        </View>
                        <View style={styles.passInputView}>
                            <TextInput
                                ref={(input) => {
                                    this.second = input;
                                }}
                                onSubmitEditing={() => {
                                    loginUser(email, pass);
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
                                    <Ionicons name={'ios-eye-off'} size={20} color={Colors.Grey}/>
                                }
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => loginUser(email, pass)}
                            style={styles.login}>
                            {
                                loading === true ?
                                    <ActivityIndicator color={'white'} size="small"/>
                                    :
                                    <Text style={styles.loginText}>Giriş Yap</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.signup}>
                            <Text style={styles.signupText}>Hemen Üye Ol</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.App,
    },
    appName: {
        color: 'white',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 30,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
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
    login: {
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
    },
    loginText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    signup: {
        borderColor: 'white',
        borderWidth: 1,
        paddingHorizontal: 70,
        paddingVertical: 10,
        marginTop: 30,
        borderRadius: 200,
        alignSelf: 'center',
    },
    signupText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default Loading;


//required imports
import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();


//screens
import Register from './screens/Authentication/Register';
import Loading from './screens/Authentication/Loading';
import Login from './screens/Authentication/Login';
import Home from './screens/Home';
import Add from './screens/Add';
import Profile from './screens/Profile';
import Filter from './screens/Filter';
import CustomDrawerContent from './components/CustomDrawerContent';
import Settings from './screens/Settings';
import Detail from './screens/Detail';


//assets
import Colors from './assets/Colors';

//icon Libraries
import FontAwesome from 'react-native-vector-icons/FontAwesome';


//firebase
import {f} from '../config/config';
import AntDesign from 'react-native-vector-icons/AntDesign';


function HomeStack() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen component={Home} name="Home"
                          options={({navigation, route}) => ({
                              title: 'SaleRent',
                              headerStyle: {
                                  backgroundColor: Colors.App,
                              },
                              headerBackTitleVisible: false,
                              headerTintColor: 'white',
                              headerTitleAlign: 'center',
                              headerTitleStyle: {
                                  fontWeight: 'bold',
                              },
                          })}
            />
            <Stack.Screen component={Filter} name="Filter"
                          options={({navigation, route}) => ({
                              title: 'SaleRent',
                              headerStyle: {
                                  backgroundColor: Colors.App,
                              },
                              headerBackTitleVisible: false,
                              headerTintColor: 'white',
                              headerTitleAlign: 'center',
                              headerTitleStyle: {
                                  fontWeight: 'bold',
                              },
                          })}
            />
            <Stack.Screen component={Detail} name="Detail"
                          options={({navigation, route}) => ({
                              title: 'SaleRent',
                              headerStyle: {
                                  backgroundColor: Colors.App,
                                  shadowColor: 'transparent',
                                  elevation: 0,
                              },
                              headerBackTitleVisible: false,
                              headerTintColor: 'white',
                              headerTitleAlign: 'center',
                              headerTitleStyle: {
                                  fontWeight: 'bold',
                              },
                          })}
            />
        </Stack.Navigator>
    );
}

function AddStack() {
    return (
        <Stack.Navigator initialRouteName="Add">
            <Stack.Screen component={Add} name="Add"
                          options={({navigation, route}) => ({
                              title: 'SaleRent',
                              headerShown: false,
                              headerStyle: {
                                  backgroundColor: Colors.App,
                              },
                              headerBackTitleVisible: false,
                              headerTintColor: '#fff',
                              headerTitleAlign: 'center',
                              headerTitleStyle: {
                                  fontWeight: 'bold',
                              },
                          })}
            />
        </Stack.Navigator>
    );
}

function ProfileDrawer({navigation}) {

    return (
        <Drawer.Navigator
            drawerStyle={{backgroundColor:Colors.App}}
            drawerPosition={'right'}
            drawerType={'slide'}
            initialRouteName="ProfileStack"
            backBehavior={'history'}
            edgeWidth={1000}
            drawerContent={props => <CustomDrawerContent {...props} />}
        >

            <Drawer.Screen options={{title:"Profil"}} component={ProfileStack} name='Profile'
            />
        </Drawer.Navigator>
    );
}

function ProfileStack({navigation}) {
    return (
        <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen component={Profile} name="Profile"
                          options={({navigation}) => ({

                              headerStyle: {
                                  backgroundColor: Colors.App,
                                  shadowColor: 'transparent',
                                  elevation: 0,
                              },
                              headerTitle: '',
                              headerBackTitleVisible: false,
                              headerTintColor: 'white',

                              headerRight: () => (
                                  <TouchableOpacity
                                      style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}
                                      onPress={() => {
                                          navigation.openDrawer();
                                      }}
                                  >
                                      <AntDesign name="bars" color={"#fff"} size={26}/>
                                  </TouchableOpacity>
                              ),
                          })}
            />
            <Stack.Screen component={Detail} name="Detail"
                          options={({navigation, route}) => ({
                              title: 'SaleRent',
                              headerStyle: {
                                  backgroundColor: Colors.App,
                                  shadowColor: 'transparent',
                                  elevation: 0,
                              },
                              headerBackTitleVisible: false,
                              headerTintColor: 'white',
                              headerTitleAlign: 'center',
                              headerTitleStyle: {
                                  fontWeight: 'bold',
                              },
                          })}
            />
            <Stack.Screen component={Settings} name="Settings"
                          options={({navigation, route}) => ({
                              headerStyle: {
                                  backgroundColor: Colors.App,
                                  shadowColor: 'transparent',
                                  elevation: 0,
                              },
                              headerTitle: '',
                              headerBackTitleVisible: false,
                              headerTintColor: 'white',
                          })}
            />
        </Stack.Navigator>
    );
}


const Router: () => React$Node = () => {
    const [logged, setLogged] = useState('');
    useEffect(() => {
        f.auth().onAuthStateChanged(user => {
            if (user) {
                setLogged(true);
            } else {
                setLogged(false);

            }

        });
    });

    return (
        <NavigationContainer>
            {
                logged === '' ? <Loading/> :
                    !logged ?
                        <Stack.Navigator initialRouteName="Login">
                            <Stack.Screen component={Login} name="Login"
                                          options={{
                                              headerShown: false,

                                          }}/>
                            <Stack.Screen component={Register} name="Register"
                                          options={({navigation, route}) => ({
                                              title: 'SaleRent',
                                              headerStyle: {
                                                  backgroundColor: Colors.App,
                                                  shadowColor: 'transparent',
                                                  elevation: 0,
                                              },
                                              headerBackTitleVisible: false,
                                              headerTintColor: '#fff',
                                              headerTitleAlign: 'center',
                                              headerTitleStyle: {
                                                  fontWeight: 'bold',
                                              },
                                          })}
                            />
                        </Stack.Navigator>
                        :
                        <>
                            <Tab.Navigator
                                initialRouteName="Home"
                                activeColor={Colors.App}
                                inactiveColor='#767474'
                                barStyle={{backgroundColor: '#fff'}}
                            >
                                <Tab.Screen name="Home" component={HomeStack}
                                            options={{
                                                tabBarLabel: 'Anasayfa',
                                                tabBarIcon: ({color}) => (
                                                    <FontAwesome name="home" color={color}
                                                                 size={26}/>
                                                ),
                                            }}
                                />

                                <Tab.Screen name="Add" component={AddStack}
                                            options={{
                                                headerShown: false,
                                                tabBarVisible: false,
                                                tabBarLabel: 'İlan Ver',
                                                tabBarIcon: ({color}) => (
                                                    <FontAwesome name="plus-circle" color={color}
                                                                 size={26}/>
                                                ),
                                            }}
                                />
                                <Tab.Screen name="Profile" component={ProfileDrawer}
                                            options={{
                                                tabBarLabel: 'Profil',
                                                tabBarIcon: ({color}) => (
                                                    <FontAwesome name="user" color={color}
                                                                 size={26}/>
                                                ),
                                            }}
                                />

                            </Tab.Navigator>
                        </>

            }
        </NavigationContainer>
    );
};
export default Router;

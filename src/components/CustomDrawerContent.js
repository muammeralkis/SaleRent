import {DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import Colors from "../assets/Colors";
import {f} from "../../config/config";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from 'react-native-vector-icons/AntDesign';
import {View} from 'react-native';

function CustomDrawerContent(props) {

    function signOut() {
        f.auth().signOut().then(function () {
        }).catch(function (error) {
            ("error")
        });
    }

    return (
        <DrawerContentScrollView contentContainerStyle={{flex:1,justifyContent:'space-between'}} style={{flex: 1,}} {...props}>
            <View>
            <DrawerItemList itemStyle={{backgroundColor:'white'}} {...props} />

            <DrawerItem
                style={{backgroundColor:'white',}}
                onPress={() => {
                    props.navigation.navigate('Settings')
                }}
                icon={({focused, color, size}) => <FontAwesome color={color} size={20}
                                                               name={focused ? 'home' : 'gear'}/>}

                label={"Ayarlar"}
                activeBackgroundColor={Colors.Lightblue}
            />
            </View>
            <DrawerItem
                style={{backgroundColor:'white',marginBottom:30}}
                onPress={() => {
                    signOut()
                }}
                icon={({focused, color, size}) => <AntDesign color={"red"} size={20}
                                                               name={'logout'}/>}

                label={"Çıkış yap"}
                activeBackgroundColor={Colors.Lightblue}
                inactiveTintColor={"red"}
            />

        </DrawerContentScrollView>)
}

export default CustomDrawerContent;

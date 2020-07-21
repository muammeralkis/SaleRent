import React from 'react';
import {StatusBar,YellowBox,StyleSheet,View,Text} from 'react-native';
import {inject, observer} from "mobx-react";
import Colors from '../assets/Colors';

function Filter() {
    return(
        <View style={styles.container}>
            <Text style={{color:Colors.Text, fontWeight:'bold',fontSize:25}}>Yakında...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default inject( "GetStore")(observer(Filter));

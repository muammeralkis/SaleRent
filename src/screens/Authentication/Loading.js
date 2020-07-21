import React,{useState,useEffect} from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Image, Text,
} from 'react-native';
import Colors from "../../assets/Colors";


function Loading() {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                SaleRent
            </Text>
            <ActivityIndicator color={Colors.App} size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center'
    },
    title:{
        fontSize:30,
        fontWeight:'bold',
        color:Colors.App,
        marginBottom:10,
    }
});

export default Loading;


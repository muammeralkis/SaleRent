import {Platform} from 'react-native';

export default{
    App: Platform.OS === "ios" ? "#ff6347" : '#ff785d',
    Text:"#5d5d5d",
    Lightblue:"#9fbbff",
    Blue:'#004CFE',
    Navy:'#093351',
    Primary:"#003bc6",
    Red:'#D52725',
    Purple:Platform.OS ==='ios' ? "#5840BA" : "#5e57f6",
    Lighter:"#e8e8e8",
    Green:"#529c1f",
    Light:'#dadada',
    Orange:'orange',
    Grey:'grey'
}

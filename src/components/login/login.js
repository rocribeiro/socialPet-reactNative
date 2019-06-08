import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { View,Text,TouchableOpacity,Alert } from 'react-native';
import {
    LoginManager,
    AccessToken,
    GraphRequestManager,
    GraphRequest
  } from 'react-native-fbsdk';
export default class camera extends Component{
_fbAuth(){
    var that = this;
    LoginManager.logInWithReadPermissions(['public_profile','email']).then(function(result){
        if(result.isCancelled){
            alert("Login Cancelado!");
        }else{
            AccessToken.getCurrentAccessToken().then(
                (data) =>{
                    let acessToken = data.accessToken;
                    const responseInfoCallback = (error,result)=>{
                        setTimeout(()=>{
                            if(error){
                                Alert.alert('Error'+ error.toString());
                            }else{
                                //erro
                                if(result.email == undefined){
                                    Alert.alert('Error'+ 'Necessario email valido');
                                }else{//sucesso
                                    Alert.alert('Nome:'+result.name + '\nemail'+result.email);
                                }
                               
                            }
                        },200)
                    }
                    const infoRequest = new GraphRequest(
                        '/me',
                        {
                            accessToken:acessToken,
                            parameters:{
                                fields:{
                                    string: 'email,name,first_name,middle_name,last_name'
                                }
                            }
                        },
                        responseInfoCallback
                    );
                    new GraphRequestManager().addRequest(infoRequest).start();
                })
            }   
        },function(error){
            alert('erro:'+ error)
        })
    }
  render() {
    return(
        <View>
            <TouchableOpacity onPress={this._fbAuth.bind(this)}>
                <Text>FB login</Text>
            </TouchableOpacity>
        </View>
    );
  }
}

import React, { Component } from "react";
import { Modal, Text, TouchableHighlight, View, Alert,TextInput,Image } from "react-native";
import MapView from "react-native-maps";
import { Marker } from 'react-native-maps';
import axios from 'react-native-axios'

import {
  Container,
  TypeTitle,
  TypeDescription,
  RequestButton,
  RequestButtonText,
  TextModal
} from "../../css/styles";

export default class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      region: null,
      pets: [],
      modalVisible: false,
      dono:{
        nome:null,
        email:null
      },
      petModal:{
        nome:null,
        descricao:null,
        raca:null
      }
    };
  }
  

  setModalVisible(visible,nome,descricao,raca) {
    this.setState({ modalVisible: visible });
    this.setState({ 
      petModal:{
        nome,
        descricao,
        raca
      }
     });

  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001
          }
        });
      }, //sucesso
      () => { }, //erro
      {
        timeout: 2000,//tempo em que vai ficar tentando pegar a location caso n'ao consiga vai retornar erro.
        enableHighAccuracy: true,//serve para pegar a location via gps pois e melhor mais detalhada
        maximumAge: 1000 //cache para quardar a location do usuario
      }
    );

    axios.get('http://192.168.43.134:8080/pet/')
      .then(response => this.setState({ pets: response.data }));
  }
  render() {
    const { region } = this.state;
    //const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} region={region} showsUserLocation loadingEnabled>
          {this.state.pets.map(pet => (
            <MapView.Marker
              coordinate={{
                latitude: pet.latitudePerdido,
                longitude: pet.longitudePerdido
              }}
              key={pet.id}
              onPress={() => { this.setModalVisible(true,pet.nome,pet.descricao,pet.raca) }}
            />
          ))}
        </MapView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}>
          <View style={{marginTop: 22}}>
            <View>
            <Image style={{height: '40%', width: '40%',justifyContent: 'center',alignItems: 'center'}} source={require('../../img/download.jpg')} />
              <TypeTitle>Nome do Pet:</TypeTitle>
              <TextModal>{this.state.petModal.nome}</TextModal>
              <TypeTitle>Descrição:</TypeTitle>
              <TextModal>{this.state.petModal.descricao}</TextModal>
              <TypeTitle>Raça</TypeTitle>
              <TextModal>{this.state.petModal.raca}</TextModal>
              <TypeTitle>Contato</TypeTitle>
              <TextModal>Email:{this.state.dono.email} </TextModal>
              <TextModal>Celular: 99289-8366</TextModal>
              <TextModal>Falar com: Rodrigo</TextModal>
              <RequestButton onPress={() => {this.setModalVisible(!this.state.modalVisible);}}>
              <RequestButtonText style={{color:'#000000'}}>Sair</RequestButtonText>
              </RequestButton>
            </View>
          </View>
        </Modal>
        <Container>
          <TypeTitle>Perdi Meu Pet</TypeTitle>
          <RequestButton onPress={() => this.props.navigation.navigate("Cadastro")}>
              <Image style={{height: '112%', width: '30%'}} source={require('../../img/petAlert.png')} />
          </RequestButton>
        </Container>
      </View>
    );
  }
}


import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';

var api = {
  axiosApi: null,
  context: null,
  tempToken: null,

  setContext: function (con) {
    this.context = con;
  },

  init: function () {
    this.axiosApi = axios.create({
      baseURL: 'https://api.mediterraneoguarulhos.com.br/',
    });
  },

  handleReturn: function (response, onSuccess, onError) {
    if (typeof response.data === 'string') {
      onSuccess(response.data);
    } else if (response.data.message !== undefined) {
      onError(response.data.message);
    } else if (onSuccess !== undefined) {
      onSuccess(response.data);
    }
  },

  handleError: function (error, onError) {
    let errorMessage;
    if (error.response == undefined) {
      if (error.message !== undefined) errorMessage = error.message;
      else errorMessage = 'Houve um erro ao processar esta informação';
    } else if (error.response.status == 401)
      errorMessage = 'A sessão expirou. Faça o login novamente. ';
    else if (error.response.status == 500) {
      errorMessage = 'Erro ao obter as informações do servidor. ';
      if (
        error.response.data != null &&
        error.response.data.ExceptionMessage != null
      )
        errorMessage += error.response.data.ExceptionMessage;
    } else if (
      error.response.data != null &&
      error.response.data.error_description != null
    )
      errorMessage = error.response.data.error_description;
    else if (error.response.data != null && error.response.data.Message != null)
      errorMessage = error.response.data.Message;
    else errorMessage = 'Houve um erro ao processar esta informação';

    if (error.response !== undefined && error.response.status == 401) {
      this.context.signOut();
    }

    if (onError == undefined)
      // ToastAndroid.show(errorMessage, ToastAndroid.LONG)
      console.log('   [API] ' + errorMessage);
    else onError(errorMessage);
  },

  getToken: function (username, password, onSuccess, onError) {
    var reqData =
      'username=' + username + '&password=' + password + '&grant_type=password';

    this.axiosApi
      .post('/token', reqData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then(response =>
        api.handleReturn(
          response,
          async data => {
            this.access_token = data.access_token;
            await AsyncStorage.setItem('token', this.access_token);
            onSuccess(data);
          },
          onError,
        ),
      )

      .catch(error => api.handleError(error, onError));
  },

  apiGet: async function (url, Parameters, onSuccess, onError) {
    let token = await AsyncStorage.getItem('token');

    this.axiosApi
      .get(
        url,

        {
          headers: {
            authorization: 'bearer ' + token,
          },
          params: Parameters,
        },
      )
      .then(response => api.handleReturn(response, onSuccess, onError))

      .catch(error => api.handleError(error, onError));
  },

  apiPost: async function (url, Parameters, onSuccess, onError, contentType) {
    let token;
    if (this.tempToken !== null) {
      token = this.tempToken;
      this.tempToken = null;
    } else token = await AsyncStorage.getItem('token');

    let headers = { authorization: 'bearer ' + token };

    switch (contentType) {
      case 'form-data':
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'multipart/form-data';
        break;

      case 'text':
        headers['Content-Type'] = 'text/plain';
        break;
      case 'json':
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
        break;
    }

    this.axiosApi
      .post(url, Parameters, {
        headers: headers,
      })
      .then(response => api.handleReturn(response, onSuccess, onError))

      .catch(error => api.handleError(error, onError));
  },

  consultaProcesso: function (onSuccess, onError){
    this.apiGet('/Juridico/ProcessosConsulta', {}, onSuccess, onError);
  },
  consultaDetalhada: function (pi, onSuccess, onError){
    this.apiGet('/Juridico/ProcessoDetalhado', {pi}, onSuccess, onError);
  }
}
api.init();

export default api;
import React from 'react';
import {StatusBar,View,Text} from 'react-native';
import Router from './src/Router';
import store from './src/store'
import {Provider} from 'mobx-react';

const App: () => React$Node = () => {
    console.disableYellowBox = true;

    return (
      <>

        <Provider {...store}>
          <StatusBar backgroundColor={"#ee6246"} barStyle="dark-content" />
          <Router/>
        </Provider>
      </>
  );
};


export default App;

import App from 'next/app'
import React from 'react'
import {Provider} from 'react-redux'
import {createWrapper} from 'next-redux-wrapper'
import store from '../store/store'
import 'antd/dist/antd.css';
import 'semantic-ui-css/semantic.min.css'
import './scss/main.scss'
import 'react-input-range/lib/css/index.css'
import MainBody from './components/MainBody'
import NextNProgress from "nextjs-progressbar";


class MyApp extends App {

  

  render(){
    const {Component,pageProps} = this.props;
    return(
      <Provider store={store}>
          <NextNProgress color="#fe696a" />
          <MainBody>
            <Component {...pageProps}></Component>
          </MainBody>
      </Provider>
      
    )
  }
}


const makestore = () => store;
const wrapper = createWrapper(makestore);

export default wrapper.withRedux(MyApp);

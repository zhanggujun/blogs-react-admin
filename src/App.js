import React, { Component } from 'react';
import style from './App.styl';
import Contents from './route/route';
import MenuSlider from './components/MenuSlider/MenuSlider';
import routes from './route/config';
import PropTypes from 'prop-types';
class App extends Component {
  state = {
    key: sessionStorage.getItem('key') ? sessionStorage.getItem('key') : '/home/index'
  };
  static childContextTypes = {
    onChangeUrl: PropTypes.func
  };
  getChildContext () {
    return {
      onChangeUrl: (url) =>{
        this.setState({key:url});
      }
    }
  }
  render() {
    return [
      <div key="header" className={`${style.header} scrollBar`}></div>,
      <div key="nav" className={style.nav}>
        <MenuSlider 
          menus={routes.menu} 
          defaultActive={this.state.key} 
          uniqueOpened
          onSelect={this.onSelect.bind(this)}
          className="el-admin-tree"/>
      </div>,
      <div key="section" className={style.section}>
        <div className={`${style.content} scrollBar`}>
          <div className={style.container}>
            <Contents active={this.state.key} onChangeUrl={this.onChangeUrl.bind(this)}/>
          </div>
        </div>
      </div>
    ];
  }
  componentWillMount(){
    const {pathname} = this.props.location;
    // console.log(pathname);
    if (pathname === '/home') {
      this.props.history.replace('/home/index');
      sessionStorage.setItem('key','/home/index');
      this.setState({key:'/home/index'});
    }
  }
  onChangeUrl(key){
    console.log(key);
  }
  onSelect(key){
    this.setState({key});
    sessionStorage.setItem('key',key);
  }
}

export default App;

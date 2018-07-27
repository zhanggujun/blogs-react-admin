import React from 'react';
import ReactDOM from 'react-dom';
import './index.styl';
import App from './App';
import 'element-theme-default';
import registerServiceWorker from './registerServiceWorker';
import Loadable from 'react-loadable';
import {
  // BrowserRouter,
  HashRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Loading from './components/globalLoading/globalLoading';
const Login = Loadable({
  loader:()=>import('./pages/login/login'),
  loading:Loading,
});
const NotFind = Loadable({
  loader:()=>import('./pages/404/404'),
  loading:Loading,
});
ReactDOM.render(
  <HashRouter>
    <div className="sectionBox">
      <Switch>
        <Route path='/' exact render={()=><Redirect to="/home/index"/>}/>
        <Route path='/home' component={App}/>
        <Route path='/login' component={Login}/>
        <Route exact component={NotFind}/>
      </Switch>
    </div>
  </HashRouter>, document.getElementById('box'));
registerServiceWorker();

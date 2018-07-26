import React from 'react';
import ReactDOM from 'react-dom';
import './index.styl';
import App from './App';
import 'element-theme-default';
import registerServiceWorker from './registerServiceWorker';
// import Content from './route/route';
import {
  // BrowserRouter,
  HashRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import login from './pages/login/login';
import NotFind from './pages/404/404';

ReactDOM.render(
  <HashRouter>
    <div className="sectionBox">
      <Switch>
        <Route path='/' exact render={()=><Redirect to="/home/index"/>}/>
        <Route path='/home' component={App}/>
        <Route path='/login' component={login}/>
        <Route exact component={NotFind}/>
      </Switch>
    </div>
  </HashRouter>, document.getElementById('box'));
registerServiceWorker();

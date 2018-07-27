import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import AllComponents from '../template/template';
import Config from './config';
// <Route key="index" exact path="/home/index" component={AllComponents.HomeIndex}/>
// <Route key="page1" exact path="/home/article/page1" component={AllComponents.ArticleAdd}/>
// <Route key="page2" exact path="/home/article/page2" component={AllComponents.ArticleList}/>

export default class Contents extends React.Component {
  render() {
    // console.log(this.props);
    return (
      <Switch>
        {
          Object.keys(Config).map(key =>
            Config[key].map(r => {
              const route = r => {
                const Component = AllComponents[r.component];
                return (
                  <Route
                    key={r.route || r.key}
                    exact
                    path={r.route || r.key}
                    component={Component}
                  />
                )
              };
              return r.component ? route(r) : r.subs.map(r => route(r));
            })
          )
        }
        <Route exact path="/home/article/add/:id" component={AllComponents['ArticleAdd']}/>
        <Route render={() => <Redirect to="/404" />} />
      </Switch>
    )
  }
}
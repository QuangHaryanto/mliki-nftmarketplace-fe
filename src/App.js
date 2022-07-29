import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter
} from "react-router-dom";
import { Provider } from 'react-redux'
import {Store} from './redux/Store'
import VVHeaderVW from './UI/header/VVHeaderVW';
import VVFooterVW from './UI/footer/VVFooterVW';
import {publicRoutes} from './router/router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      windowHeight : (window.innerHeight - 300)
    }
  }

  render() {
    return (
      <Provider store={Store}>
        <Router history={HashRouter}>
        <VVHeaderVW />
        <main className="main" style={{minHeight : this.state.windowHeight}}>
            
            <Switch>
            {publicRoutes.map((route, i) => (
                <Route 
                  path={`/#/${route.path}`}
                  exact={route.exact}
                  render={props => (
                    <route.component {...props} routes={route.routes} />
                  )}
                />
            ))} 
          </Switch>
          
        </main>
        <VVFooterVW />
        <ToastContainer />
        </Router>
      </Provider>

    );
  }
}


export default App;

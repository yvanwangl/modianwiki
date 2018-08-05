import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import Login from './containers/login/components/Login';
import Registor from './containers/login/components/Registor';
import Home from './containers/home/Home';
import './App.css';
const { registor } = require('./system.config');

export interface AppProps {
    history: object;
}

export interface AppState {
    drawerOpen: boolean;
}

class App extends React.Component<object & RouteComponentProps<object>, AppState> {

    constructor(props: object & RouteComponentProps<object>) {
        super(props);
    }

    render() {
        return (
            <div>
                <header className='App-header'>
                    <h1>摩点 wiki</h1>
                </header>
                <main className='App-content'>
                    <Switch>
                        <Route path="/login" component={Login} />
                        {registor && <Route path="/registor" component={Registor} />}
                        <Route path="/" component={Home} />
                    </Switch>
                </main>
            </div>
        );
    }
}

export default withRouter(App) as any;
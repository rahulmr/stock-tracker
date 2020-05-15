import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard.Connect';

import Layout1 from './layout/layout_1';


class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/" render={(props) => <Layout1 {...props} />} />
                            <Route exact path="/dashboard" render={(props) => <Dashboard {...props} />} />
                        </Switch>
                    </div>
                </Router>
        </div>
        );
    }
}

export default App;

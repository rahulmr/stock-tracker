import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard.Connect';
import SubComponent from './components/subComponent/subComponent.Connect';

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
                            <Route exact path="/" render={(props) => <Dashboard {...props} />} />
                            <Route exact path="/dashboard" render={(props) => <Layout1 {...props} />} />\
                            <Route exact path="/qb" render={(props) => <SubComponent {...props} screenType={'QueryBuilder'} />} />
                        </Switch>
                    </div>
                </Router>
        </div>
        );
    }
}

export default App;

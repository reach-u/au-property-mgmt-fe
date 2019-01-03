import React, {Component, Fragment} from 'react';
import {observer} from 'mobx-react';
import './registry/registry.scss';
import Autocomplete from '../components/AutoComplete';
import PropertyListView from "./PropertyListView";

class Registry extends Component {
    constructor(props) {
        super(props);
          this.state = {
            loaded: false
          };
    }

    render() {
        const {realEstateStore} = this.props;

        return (
            <Fragment>
                <div className="registry-container">
                    <Autocomplete store={realEstateStore} className="registry-search"/>
                    <PropertyListView
                        {...this.props}
                        estates={this.props.realEstateStore.estates}
                        dataAvailable={this.props.realEstateStore.dataAvailable}
                        loaded={this.state.loaded}/>
                </div>
            </Fragment>
        );
    }

    componentDidMount() {
        const query = new URL(document.location).searchParams.get('q');
        if (query || query === '') {
            this.props.realEstateStore.setQuery(query);
            this.props.realEstateStore.fetchEstates(query);
        } else {
            this.props.history.push('/search');
        }

        setTimeout(() => this.setState({loaded: true}), 1);
    }
}

export default observer(Registry);

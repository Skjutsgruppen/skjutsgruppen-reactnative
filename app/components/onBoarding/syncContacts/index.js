import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import Info from '@components/onBoarding/syncContacts/info';
import Relation from '@components/onBoarding/syncContacts/relation';
import Sync from '@components/onBoarding/syncContacts/sync';
import PropTypes from 'prop-types';

class SyncContacts extends Component {
  state = {
    activeState: 1,
  }

  onNextInfo = () => {
    this.setState({ activeState: 2 });
  }

  onNextRelation = () => {
    this.setState({ activeState: 3 });
  }

  sync = () => {
    this.props.onNext();
  };

  render() {
    const { activeState } = this.state;
    return (
      <ScrollView >
        {
          (activeState === 1) && <Info onNext={this.onNextInfo} />
        }
        {
          (activeState === 2) && <Relation onNext={this.onNextRelation} />
        }
        {
          (activeState === 3) && <Sync onSync={this.sync} />
        }
      </ScrollView>
    );
  }
}

SyncContacts.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default SyncContacts;

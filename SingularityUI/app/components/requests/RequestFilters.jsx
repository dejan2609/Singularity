import React from 'react';
import Utils from '../../utils';
import { Link } from 'react-router';

import { Row, Col, Nav, NavItem, Glyphicon, Button } from 'react-bootstrap';

export default class RequestFilters extends React.Component {

  static propTypes = {
    displayRequestTypeFilters: React.PropTypes.bool
  };

  static REQUEST_STATES = [
    {
      displayVal: 'Request status'
    },
    {
      filterVal: 'all',
      displayVal: 'All'
    },
    {
      filterVal: 'active',
      displayVal: 'Active'
    },
    {
      filterVal: 'cooldown',
      displayVal: 'Cooldown'
    },
    {
      filterVal: 'paused',
      displayVal: 'Paused'
    },
    {
      filterVal: 'pending',
      displayVal: 'Pending'
    },
    {
      filterVal: 'cleaning',
      displayVal: 'Cleaning'
    },
    {
      displayVal: 'Deploy status'
    },
    {
      filterVal: 'activeDeploy',
      displayVal: 'Active Deploy'
    },
    {
      filterVal: 'noDeploy',
      displayVal: 'No Deploy'
    },
    {
      displayVal: 'Resource usage'
    },
    {
      filterVal: 'overUtilizedCpu',
      displayVal: 'Over-utilized CPU'
    },
    {
      filterVal: 'underUtilizedCpu',
      displayVal: 'Under-utilized CPU'
    },
    {
      filterVal: 'underUtilizedMem',
      displayVal: 'Under-utilized Memory'
    }
  ];

  static REQUEST_TYPES = ['SERVICE', 'WORKER', 'SCHEDULED', 'ON_DEMAND', 'RUN_ONCE'];

  handleStatusSelect(selectedKey) {
    this.props.onFilterChange(_.extend({}, this.props.filter, {state: RequestFilters.REQUEST_STATES[selectedKey].filterVal}));
  }

  handleSearchChange(event) {
    this.props.onFilterChange(_.extend({}, this.props.filter, {searchFilter: event.target.value}));
  }

  toggleRequestType(requestType) {
    let selected = this.props.filter.subFilter;
    if (selected.length === RequestFilters.REQUEST_TYPES.length) {
      selected = [requestType];
    } else if (_.isEmpty(_.without(selected, requestType))) {
      selected = RequestFilters.REQUEST_TYPES;
    } else if (_.contains(selected, requestType)) {
      selected = _.without(selected, requestType);
    } else {
      selected.push(requestType);
    }
    this.props.onFilterChange(_.extend({}, this.props.filter, {subFilter: selected}));
  }

  clearSearch() {
    this.props.onFilterChange(_.extend({}, this.props.filter, {searchFilter: ''}));
  }

  renderStatusFilter() {
    const selectedIndex = _.findIndex(RequestFilters.REQUEST_STATES, (requestState) => requestState.filterVal === this.props.filter.state);
    const navItems = RequestFilters.REQUEST_STATES.map((requestState, index) => (
      requestState.filterVal ?
        <NavItem
          key={index}
          eventKey={index}
          title={requestState.tip}
          active={index === selectedIndex}
          onClick={() => this.handleStatusSelect(index)}>
          &emsp;{requestState.displayVal}
        </NavItem> :
        <NavItem key={index} disabled={true}>
          {requestState.displayVal}
        </NavItem>
    ));

    return (
      <Nav bsStyle="pills" className="table-nav-pills" stacked={true} activeKey={selectedIndex}>
        {navItems}
      </Nav>
    );
  }

  renderSearchInput() {
    return (
      <div>
        <input
          type="search"
          ref="search"
          className="big-search-box"
          placeholder="Filter requests"
          value={this.props.filter.searchFilter}
          onChange={(...args) => this.handleSearchChange(...args)}
          maxLength="128"
        />
        <div className="remove-button" onClick={() => this.clearSearch()}></div>
      </div>
    );
  }

  renderRequestTypeFilter() {
    const filterItems = this.props.displayRequestTypeFilters && RequestFilters.REQUEST_TYPES.map((requestType, index) => {
      return (
        <li key={index} className={_.contains(this.props.filter.subFilter, requestType) ? 'active' : ''}>
          <a onClick={() => this.toggleRequestType(requestType)}>
            <Glyphicon glyph="ok" /> {Utils.humanizeText(requestType)}
          </a>
        </li>
      );
    });

    return (
      <div className="requests-filter-container">
        <ul className="nav nav-pills nav-pills-multi-select">
          {filterItems}
        </ul>
      </div>
    );
  }

  render() {
    const newRequestButton = !config.hideNewRequestButton && (
      <Row>
        <Col className="text-right" md={12}>
          <Link to={'requests/new'}>
            <Button bsStyle="success" block={true}>
              <Glyphicon glyph="plus" /> New Request
            </Button>
          </Link>
        </Col>
      </Row>
    );

    return (
      <Row className="clearfix">
        <Col className="tab-col" sm={4} md={2}>
          {newRequestButton}
          <Row>
            <Col md={12}>
              {this.renderStatusFilter()}
            </Col>
          </Row>
        </Col>
        <Col sm={8} md={10}>
          <div className="row">
            <div className="col-md-12">
              {this.renderSearchInput()}
            </div>
            <div className="col-md-12">
              {this.renderRequestTypeFilter()}
            </div>
          </div>
          {this.props.children}
        </Col>
      </Row>
    );
  }
}

RequestFilters.propTypes = {
  onFilterChange: React.PropTypes.func.isRequired,
  filter: React.PropTypes.shape({
    state: React.PropTypes.string.isRequired,
    subFilter: React.PropTypes.array.isRequired,
    searchFilter: React.PropTypes.string.isRequired
  }).isRequired,
  children: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.arrayOf(React.PropTypes.node)])
};

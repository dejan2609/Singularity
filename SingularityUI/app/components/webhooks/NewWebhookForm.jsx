import React, {PropTypes} from 'react';
import Utils from '../../utils';
import classNames from 'classnames';
import TextFormGroup from '../common/formItems/formGroups/TextFormGroup';

const NewWebhookForm = React.createClass({
  propTypes: {
    setType: PropTypes.func.isRequired,
    setUri: PropTypes.func.isRequired,
    getErrors: PropTypes.func.isRequired,
    webhookTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    validateUri: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      selected: '',
      uri: ''
    };
  },

  select(selected) {
    this.setState({selected});
    this.props.setType(selected);
  },

  updateUri(event) {
    this.setState({uri: event.target.value});
    this.props.setUri(event.target.value);
  },

  buttons() {
    return this.props.webhookTypes.map((type, key) => (
      <button
        key = {key}
        data-type = {type}
        className = {classNames({btn: true, 'btn-default': true, active: this.state.selected === type})}
        onClick = {(event) => {
          event.preventDefault();
          this.select(type);
        }}
      >
        {Utils.humanizeText(type)}
      </button>
    ));
  },

  alert() {
    const errors = this.props.getErrors();
    if (errors && errors.length > 0) {
      return (
        <div className="alert alert-danger">{errors.map((error, key) => <li key={key}>{error}</li>)}</div>
      );
    }
    return null;
  },

  render() {
    return (
      <div>
        {this.alert()}
        <h3> New Webhook </h3>
        <div className="form-group">
          <label>Type</label>
          <br />
          {this.buttons()}
        </div>
        <TextFormGroup
          id="uri"
          onChange={event => this.updateUri(event)}
          value={this.state.uri}
          label="URI"
          required={true}
          feedback={this.state.uri && this.props.validateUri(this.state.uri) && 'SUCCESS' || 'ERROR'}
        />
      </div>
    );
  }
});

export default NewWebhookForm;
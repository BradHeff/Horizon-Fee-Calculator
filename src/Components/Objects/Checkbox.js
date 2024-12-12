import React, { Component } from "react";

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = { total: 0 };
    this.handleChange = this.handleChange.bind(this);
  }

  getTitle() {
    return this.props.config.title || "";
  }

  getOptions() {
    return this.props.config.options
      ? Object.entries(this.props.config.options)
      : [];
  }

  handleChange(e) {
    const updateValue = parseInt(e.target.value, 10);
    const newTotal = e.target.checked
      ? this.state.total + updateValue
      : this.state.total - updateValue;

    this.setState({ total: newTotal });
    this.props.onUpdate(newTotal, this.props.unique);
  }

  render() {
    return (
      <div className="row form-group mt-3">
        <h3 className="title mb-3 text-center">{this.getTitle()}</h3>
        {this.getOptions().map(([optionName, optionValue]) => (
          <div className="checkbox-style" key={optionName}>
            <input
              type="checkbox"
              className="form-check-input mr-3"
              onClick={this.handleChange}
              name={this.props.unique}
              value={optionValue}
            />
            <label className="me-2">&nbsp;{optionName}</label>
          </div>
        ))}
      </div>
    );
  }
}

export default Checkbox;

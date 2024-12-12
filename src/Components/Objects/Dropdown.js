import React, { Component } from "react";

class Dropdown extends Component {
  constructor(props) {
    super(props);
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

  getDefault() {
    return this.props.config.default || "";
  }

  handleChange(e) {
    this.props.onUpdate(parseInt(e.target.value, 10), this.props.unique);
  }

  render() {
    return (
      <div className="form-row align-items-center select-style-2">
        <h3 className="title mt-3 text-center">{this.getTitle()}</h3>
        <div className="select-position">
          <select defaultValue={this.getDefault()} onChange={this.handleChange}>
            {this.getOptions().map(([optionName, optionValue]) => (
              <option key={optionName} value={optionValue}>
                {optionName}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default Dropdown;

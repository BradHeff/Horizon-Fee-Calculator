import React from "react";
import Components from "../Objects/Components.js";

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.updateTotal = this.updateTotal.bind(this);
    this.config = require("../../assets/elements-config.json");

    const elementDefaults = this.config.elements.map(this.getElementDefault);
    const total = this.calculateTotal(elementDefaults);
    this.state = { elements: elementDefaults, total: total };
  }

  getElementDefault(element) {
    if (element["type"].toLowerCase() === "slider") {
      return element["default"] * element["conversionRate"];
    } else {
      return element["options"][element.default] || 0;
    }
  }

  calculateTotal(stateElements) {
    const INITIAL_VALUE = 0;
    return Object.entries(stateElements)
      .map(([name, value]) => value)
      .reduce((acc, value) => acc + value, INITIAL_VALUE);
  }

  updateTotal(newValue, caller) {
    const newStateElements = Object.assign(this.state.elements, {
      [caller]: newValue,
    });
    const newTotal = this.calculateTotal(newStateElements);
    this.setState({ elements: newStateElements, total: newTotal });
  }

  render() {
    return (
      <div className="section section-lg">
        <div className="container h-100">
          <div className="row align-items-center justify-content-center h-100">
            <CalculatorCard
              title="Horizon Fee Calculator"
              elements={this.config.elements}
              onUpdate={this.updateTotal}
            />
            <OutcomeCard total={this.state.total} />
          </div>
        </div>
      </div>
    );
  }
}

const CalculatorCard = ({ title, elements, onUpdate }) => (
  <div className="col-12 col-md-8 col-lg-6">
    <div className="card shadow-lg p-4">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {elements.map((configElement, i) => {
          const ElementTag = Components[configElement.type];
          if (!ElementTag) {
            console.error(
              `Component for type "${configElement.type}" not found.`
            );
            return null;
          }
          return (
            <ElementTag
              key={i}
              unique={i}
              config={configElement}
              onUpdate={onUpdate}
              className="mb-3"
            />
          );
        })}
      </div>
    </div>
  </div>
);

const OutcomeCard = ({ total }) => (
  <div className="col-12 col-md-8 col-lg-6">
    <div className="card shadow-lg p-4">
      <div className="card-body">
        <h2 className="card-title">Fee Outcome</h2>
        <div id="totalBox" className="form-group">
          {total}
        </div>
      </div>
    </div>
  </div>
);

export default Calculator;

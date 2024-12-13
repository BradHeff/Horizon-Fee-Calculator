import React from "react";
import Components from "../Objects/Components.js";
import { formatDollars } from "../Objects/Currancy.js";

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.updateTotal = this.updateTotal.bind(this);
    this.config = require("../../assets/elements-config.json");

    const elementDefaults = this.config.elements.map(this.getElementDefault);
    const total = this.calculateTotal(elementDefaults);
    this.state = {
      elements: elementDefaults,
      total: total,
      additionalOptions: {},
      concessionCardSelected: false,
    };
  }

  getElementDefault(element) {
    if (element["type"].toLowerCase() === "dropdown") {
      return element["options"][element.default] || 0;
    } else if (element["type"].toLowerCase() === "slider") {
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

  applyConcessionDiscount(value, numChildren) {
    const concessionRates = [1620, 1215, 810, 0]; // Based on "2025 School Card Tuition Fee"
    console.log(concessionRates[numChildren]);
    return concessionRates[numChildren] || value;
  }

  updateTotal(newValue, caller, additionalOption = null) {
    const newStateElements = { ...this.state.elements, [caller]: newValue };
    const newAdditionalOptions = { ...this.state.additionalOptions };

    // if (additionalOption) {
    //   newAdditionalOptions[caller] = additionalOption;
    // }

    console.log(newStateElements["1"]);

    const concessionCardSelected = newStateElements["1"] === 1 ? true : false;

    const numChildren = parseInt(this.config.elements[0].options["0"], 10);

    // Calculate base child fees
    const baseChildFees = this.config.elements[0].options["0"] || 0;

    console.log(concessionCardSelected);

    const newChildFees =
      concessionCardSelected === true
        ? this.applyConcessionDiscount(baseChildFees, numChildren)
        : baseChildFees;

    // Adjust bus fees
    const busFees =
      newStateElements["1"] === 250 ? this.applyBusFees(numChildren) : 0;

    const newTotal =
      this.calculateTotal(newStateElements) - newChildFees + busFees;

    this.setState({
      elements: newStateElements,
      total: newTotal,
      additionalOptions: newAdditionalOptions,
      concessionCardSelected: concessionCardSelected,
    });
  }

  applyBusFees(numChildren) {
    const busRates = [250, 150, 100, 0];
    console.log(busRates[numChildren]);
    return busRates[numChildren];
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
            <div key={i}>
              <ElementTag
                unique={i}
                config={configElement}
                onUpdate={(value) => onUpdate(value, i)}
                className="mb-3"
              />
            </div>
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
          {formatDollars(total)}
        </div>
      </div>
    </div>
  </div>
);

export default Calculator;

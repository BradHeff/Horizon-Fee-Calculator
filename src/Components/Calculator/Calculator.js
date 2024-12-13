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
    const concessionRates = [1275, 2230, 2870, 0]; // Based on "2025 School Card Tuition Fee"
    return (
      concessionRates[Math.min(numChildren - 1, concessionRates.length - 1)] ||
      value
    );
  }

  updateTotal(newValue, caller, additionalOption = null) {
    const newStateElements = { ...this.state.elements, [caller]: newValue };
    const newAdditionalOptions = { ...this.state.additionalOptions };

    if (additionalOption) {
      newAdditionalOptions[caller] = additionalOption;
    }

    const concessionCardSelected =
      newAdditionalOptions["Extras"]?.includes("Concession");

    // Determine the number of children from the dropdown
    const numChildren = parseInt(this.config.elements[0].options["0"], 10);

    // Calculate base child fees
    const baseChildFees = this.config.elements[0].options["0"] || 0;

    console.log("price of base child fees: $", baseChildFees);
    // Adjust child fees if "Concession Card" is selected
    const childFees = concessionCardSelected
      ? this.applyConcessionDiscount(baseChildFees, numChildren)
      : baseChildFees;
    console.log("price of child fees: $", childFees);
    // Adjust bus fees
    const busFees = newAdditionalOptions["Extras"]?.includes("Bus Fee")
      ? this.applyBusFees(numChildren)
      : 0;

    // Recalculate the total
    const newTotal =
      this.calculateTotal(newStateElements) - childFees + busFees;

    // Update state
    this.setState({
      elements: newStateElements,
      total: newTotal,
      additionalOptions: newAdditionalOptions,
      concessionCardSelected: concessionCardSelected,
    });
  }

  applyBusFees(numChildren) {
    const busRates = [250, 150, 100, 0];
    return busRates[Math.min(numChildren - 1, busRates.length - 1)];
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

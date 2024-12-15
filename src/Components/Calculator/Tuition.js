import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import FooterStyle from "../../Styles/StyleFooter.js";
import { formatDollars } from "../Objects/Currancy.js";
const standardCosts = {
  foundation: [2550, 1910, 1275],
  year1: [2550, 1910, 1275],
  year2: [2550, 1910, 1275],
  year3: [2550, 1910, 1275],
  year4: [2800, 2100, 1400],
  year5: [2800, 2100, 1400],
  year6: [2800, 2100, 1400],
  year7: [3080, 2310, 1540],
  year8: [3080, 2310, 1540],
  year9: [3080, 2310, 1540],
  year10: [3240, 2430, 1620],
  year11: [3240, 2430, 1620],
  year12: [3240, 2430, 1620],
};

const concessionFee = {
  foundation: [1275, 955, 640],
  year1: [1275, 955, 640],
  year2: [1275, 955, 640],
  year3: [1275, 955, 640],
  year4: [1400, 1050, 700],
  year5: [1400, 1050, 700],
  year6: [1400, 1050, 700],
  year7: [1540, 1155, 770],
  year8: [1540, 1155, 770],
  year9: [1540, 1155, 770],
  year10: [1620, 1215, 810],
  year11: [1620, 1215, 810],
  year12: [1620, 1215, 810],
};

const busFee = {
  child1: 250,
  child2: 150,
  child3: 100,
};

const yearLevels = [
  "foundation",
  "year1",
  "year2",
  "year3",
  "year4",
  "year5",
  "year6",
  "year7",
  "year8",
  "year9",
  "year10",
  "year11",
  "year12",
];

function YearLevelSelector({ onSelect, index }) {
  return (
    <div className="select-style-2">
      <div className="select-position">
        <select onChange={(e) => onSelect(e.target.value, index)}>
          <option value="">Select Year Level</option>
          {yearLevels.map((year) => (
            <option key={year} value={year}>
              {year.charAt(0).toUpperCase() + year.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Tuition() {
  const [children, setChildren] = useState([""]);
  const [hasConcessionCard, setHasConcessionCard] = useState(false);
  const [hasBusFee, setHasBusFee] = useState(false);
  const [total, setTotal] = useState(0);

  const addChild = () => {
    if (children.length < 3) {
      setChildren([...children, ""]);
    }
  };

  const updateChildYear = (year, index) => {
    const newChildren = [...children];
    newChildren[index] = year;
    setChildren(newChildren);
    calculateTotal(newChildren, hasConcessionCard, hasBusFee);
  };

  const calculateTotal = (childrenYears, concession, bus) => {
    let newTotal = 0;
    childrenYears.forEach((year, index) => {
      if (year) {
        const costs = concession ? concessionFee[year] : standardCosts[year];
        newTotal += costs[index] || 0;
      }
    });

    if (bus) {
      newTotal += busFee.child1;
      if (childrenYears.length > 1) newTotal += busFee.child2;
      if (childrenYears.length > 2) newTotal += busFee.child3;
    }

    setTotal(newTotal);
  };

  const handleConcessionChange = (e) => {
    setHasConcessionCard(e.target.checked);
    calculateTotal(children, e.target.checked, hasBusFee);
  };

  const handleBusFeeChange = (e) => {
    setHasBusFee(e.target.checked);
    calculateTotal(children, hasConcessionCard, e.target.checked);
  };

  const animatedProps = useSpring({
    total: total,
    from: { total: 0 },
  });

  return (
    <div className="section section-lg">
      <div className="container h-100">
        <div className="row align-items-center justify-content-center h-100">
          <div className="col-12 col-md-6">
            <div className="card shadow-lg p-4">
              <div className="card-body">
                <h3 className="title text-center">Horizon Fee Calculator</h3>
                <div className="row align-items-center justify-content-center mt-20">
                  <div className="col-8">
                    {children.map((child, index) => (
                      <div key={index}>
                        <YearLevelSelector
                          onSelect={(year) => updateChildYear(year, index)}
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="col-4">
                    {children.length < 3 && (
                      <button
                        className="btn success-btn-outline btn-hover py-2 px-4 mr-20 mb-30"
                        onClick={addChild}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
                <div className="row align-items-center justify-content-center">
                  <div className="col-6">
                    <div className="checkbox-style">
                      <input
                        type="checkbox"
                        className="form-check-input mr-3"
                        checked={hasConcessionCard}
                        onChange={handleConcessionChange}
                      />
                      <label className="me-2">&nbsp;Concession Card</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="checkbox-style">
                      <input
                        type="checkbox"
                        className="form-check-input mr-3"
                        checked={hasBusFee}
                        onChange={handleBusFeeChange}
                      />
                      <label className="me-2">&nbsp;Bus Fee</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card shadow-lg p-4">
              <div className="card-body total">
                <h3 className="title text-center">Fee Outcome</h3>
                <div
                  className="text-bold"
                  style={{ fontFamily: "var(--head-font)", fontSize: "20px" }}
                >
                  Total Cost:&nbsp;
                  <span className="text-success">
                    <animated.span>
                      {animatedProps.total.to((val) =>
                        formatDollars(val.toFixed(2))
                      )}
                    </animated.span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterStyle />
    </div>
  );
}

export default Tuition;

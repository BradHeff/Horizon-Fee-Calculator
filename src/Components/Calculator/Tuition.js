import React, { useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import FooterStyle from "../../Styles/StyleFooter.js";
import { formatDollars } from "../Objects/Currancy.js";

// Add this constant near the top of the file, with other constants
const getClearLevy = (yearLevel) => {
  if (["foundation", "year1", "year2", "year3"].includes(yearLevel)) {
    return 100;
  } else if (["year4", "year5", "year6"].includes(yearLevel)) {
    return 250;
  } else {
    return 500;
  }
};

const standardCosts = {
  foundation: [2550, 1910, 1275, 0],
  year1: [2550, 1910, 1275, 0],
  year2: [2550, 1910, 1275, 0],
  year3: [2550, 1910, 1275, 0],
  year4: [2800, 2100, 1400, 0],
  year5: [2800, 2100, 1400, 0],
  year6: [2800, 2100, 1400, 0],
  year7: [3080, 2310, 1540, 0],
  year8: [3080, 2310, 1540, 0],
  year9: [3080, 2310, 1540, 0],
  year10: [3240, 2430, 1620, 0],
  year11: [3240, 2430, 1620, 0],
  year12: [3240, 2430, 1620, 0],
};

const concessionFee = {
  foundation: [1275, 955, 640, 0],
  year1: [1275, 955, 640, 0],
  year2: [1275, 955, 640, 0],
  year3: [1275, 955, 640, 0],
  year4: [1400, 1050, 700, 0],
  year5: [1400, 1050, 700, 0],
  year6: [1400, 1050, 700, 0],
  year7: [1540, 1155, 770, 0],
  year8: [1540, 1155, 770, 0],
  year9: [1540, 1155, 770, 0],
  year10: [1620, 1215, 810, 0],
  year11: [1620, 1215, 810, 0],
  year12: [1620, 1215, 810, 0],
};

const busFee = {
  child1: 250,
  child2: 150,
  child3: 100,
  child4: 0, // Fourth child and beyond are free
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
  const totalRef = useRef(null);
  const [showDropdowns, setShowDropdowns] = useState([true, false, false]);
  const [sortedChildren, setSortedChildren] = useState([]);

  const addChild = () => {
    setChildren([...children, ""]);
    setShowDropdowns((prevState) => {
      const newState = [...prevState, false];
      return newState;
    });
    // Use setTimeout to delay the animation
    setTimeout(() => {
      setShowDropdowns((prevState) => {
        const newState = [...prevState];
        newState[children.length] = true;
        return newState;
      });
    }, 50);
  };

  const updateChildYear = (year, index) => {
    const newChildren = [...children];
    newChildren[index] = year;
    setChildren(newChildren);
    const sorted = calculateTotal(newChildren, hasConcessionCard, hasBusFee);
    setSortedChildren(sorted);
  };

  const calculateTotal = (childrenYears, concession, bus) => {
    let newTotal = 0;
    // Sort children by age (assuming year12 is oldest, foundation is youngest)
    const sortedChildren = [...childrenYears]
      .filter(Boolean)
      .sort((a, b) => yearLevels.indexOf(b) - yearLevels.indexOf(a));

    sortedChildren.forEach((year, index) => {
      if (index < 3) {
        // Only charge tuition fees for first three children
        const costs = concession ? concessionFee[year] : standardCosts[year];
        newTotal += costs[Math.min(index, 2)] || 0;
      }

      // Always charge CLEAR levy for all children
      newTotal += getClearLevy(year);
      // Add bus fee if applicable
      if (bus) {
        if (index === 0) newTotal += busFee.child1;
        else if (index === 1) newTotal += busFee.child2;
        else if (index === 2) newTotal += busFee.child3;
        // Fourth child and beyond are free for bus fee, so no need to add anything
      }
    });

    setTotal(newTotal);
    return sortedChildren; // Return the sorted children array
  };

  const handleConcessionChange = (e) => {
    setHasConcessionCard(e.target.checked);
    calculateTotal(children, e.target.checked, hasBusFee);
  };

  const handleBusFeeChange = (e) => {
    setHasBusFee(e.target.checked);
    calculateTotal(children, hasConcessionCard, e.target.checked);
  };
  const resetCalculator = () => {
    setChildren([]);
    setHasConcessionCard(false);
    setHasBusFee(false);
    setTotal(0);
  };
  const getOrdinalSuffix = (i) => {
    const j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
  };
  const animatedProps = useSpring({
    total: total,
    from: { total: 0 },
    onRest: () => {
      if (totalRef.current) {
        totalRef.current.classList.add("pop-effect");
        setTimeout(() => {
          if (totalRef.current) {
            totalRef.current.classList.remove("pop-effect");
          }
        }, 300);
      }
    },
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
                      <div
                        key={index}
                        className={`dropdown-container ${
                          showDropdowns[index] ? "show" : ""
                        }`}
                      >
                        <YearLevelSelector
                          onSelect={(year) => updateChildYear(year, index)}
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="col-4">
                    <button
                      className="btn success-btn-outline btn-hover py-2 px-4 mr-20 mb-30"
                      onClick={addChild}
                    >
                      + Add
                    </button>
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
                <div className="row align-items-center justify-content-center mt-30">
                  <div className="col-12">
                    <button
                      className="btn btn-danger btn-hover py-2 px-4"
                      onClick={resetCalculator}
                    >
                      Reset Calculator
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card shadow-lg p-4">
              <div className="card-body total">
                <h3 className="title text-center">Fee Outcome</h3>
                <div className="row align-items-center justify-content-center">
                  <div className="col-12">
                    <div
                      className="text-bold"
                      style={{
                        fontFamily: "var(--head-font)",
                        fontSize: "20px",
                      }}
                    >
                      Total Cost:&nbsp;
                      <span className="text-success" ref={totalRef}>
                        <animated.span>
                          {animatedProps.total.to((val) =>
                            formatDollars(val.toFixed(2))
                          )}
                        </animated.span>
                      </span>
                    </div>
                  </div>
                  <div className="col-12 table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Fee Type</th>
                          {sortedChildren.map((_, index) => (
                            <th key={index} scope="col">
                              {index === 0
                                ? "1st Child (Oldest)"
                                : `${index + 1}${getOrdinalSuffix(
                                    index + 1
                                  )} Child`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Year Level</th>
                          {sortedChildren.map((child, index) => (
                            <td key={index}>
                              {child ? child.toUpperCase() : "-"}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th scope="row">School Fees</th>
                          {sortedChildren.map((child, index) => (
                            <td key={index}>
                              <animated.span>
                                {animatedProps.total.to(() =>
                                  formatDollars(
                                    child && index < 3
                                      ? hasConcessionCard
                                        ? concessionFee[child][
                                            Math.min(index, 2)
                                          ]
                                        : standardCosts[child][
                                            Math.min(index, 2)
                                          ]
                                      : 0
                                  )
                                )}
                              </animated.span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th scope="row">CLEAR Levy</th>
                          {sortedChildren.map((child, index) => (
                            <td key={index}>
                              <animated.span>
                                {animatedProps.total.to(() =>
                                  formatDollars(child ? getClearLevy(child) : 0)
                                )}
                              </animated.span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th scope="row">Bus Fees</th>
                          {sortedChildren.map((_, index) => (
                            <td key={index}>
                              <animated.span>
                                {animatedProps.total.to(() =>
                                  formatDollars(
                                    hasBusFee
                                      ? index === 0
                                        ? busFee.child1
                                        : index === 1
                                        ? busFee.child2
                                        : index === 2
                                        ? busFee.child3
                                        : 0
                                      : 0
                                  )
                                )}
                              </animated.span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th scope="row">Discount</th>
                          <td>-</td>
                          {sortedChildren.slice(1).map((child, index) => (
                            <td key={index}>
                              <animated.span>
                                {animatedProps.total.to(() =>
                                  formatDollars(
                                    child
                                      ? hasConcessionCard
                                        ? concessionFee[child][0] -
                                          concessionFee[child][
                                            Math.min(index + 1, 2)
                                          ]
                                        : standardCosts[child][0] -
                                          standardCosts[child][
                                            Math.min(index + 1, 2)
                                          ]
                                      : 0
                                  )
                                )}
                              </animated.span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="table-secondary">
                          <th scope="row">Total</th>
                          <td>
                            <animated.span>
                              {animatedProps.total.to((val) =>
                                formatDollars(val.toFixed(2))
                              )}
                            </animated.span>
                          </td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
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

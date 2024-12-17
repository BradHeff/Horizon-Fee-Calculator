const FeeOutcomeTable = ({
  getClearLevy,
  sortedChildren,
  getOrdinalSuffix,
  formatDollars,
  hasConcessionCard,
  concessionFee,
  concessionFeeClare,
  hasBusFee,
  busFee,
  standardCosts,
  standardCostsClare,
  animatedProps,
  totalRef,
  campus,
  animated,
}) => {
  return (
    <div className="col-12 col-md-7">
      <div className="card shadow-lg p-4">
        <div className="card-body total">
          <h3 className="title text-center mb-3">
            <span className="text-success" style={{ fontWeight: 700 }}>
              {campus === 0 ? "Balaklava" : "Clare"}
            </span>{" "}
            Fee Outcome
          </h3>
          <h5 className="text-center m-0 p-0 mb-3">
            The calculator will automatically sort your children from{" "}
            <span>{`Oldest -> Youngest`}</span>
          </h5>
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
                          : `${index + 1}${getOrdinalSuffix(index + 1)} Child`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Year Level</th>
                    {sortedChildren.length > 0 ? (
                      sortedChildren.map((child, index) => (
                        <td key={index}>{child ? child.toUpperCase() : "-"}</td>
                      ))
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                  <tr>
                    <th scope="row">School Fees</th>
                    {sortedChildren.length > 0 ? (
                      sortedChildren.map((child, index) => (
                        <td key={index}>
                          <animated.span>
                            {animatedProps.total.to(() =>
                              formatDollars(
                                child && index < 3
                                  ? hasConcessionCard
                                    ? (campus === 0
                                        ? concessionFee
                                        : concessionFeeClare)[child][
                                        Math.min(index, 2)
                                      ]
                                    : (campus === 0
                                        ? standardCosts
                                        : standardCostsClare)[child][
                                        Math.min(index, 2)
                                      ]
                                  : 0
                              )
                            )}
                          </animated.span>
                        </td>
                      ))
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                  <tr>
                    <th scope="row">CLEAR Levy</th>
                    {sortedChildren.length > 0 ? (
                      sortedChildren.map((child, index) => (
                        <td key={index}>
                          <animated.span>
                            {animatedProps.total.to(() =>
                              formatDollars(
                                child && index < 3 ? getClearLevy(child) : 0
                              )
                            )}
                          </animated.span>
                        </td>
                      ))
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                  <tr>
                    <th scope="row">Bus Fees</th>
                    {sortedChildren.length > 0 ? (
                      sortedChildren.map((_, index) => (
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
                      ))
                    ) : (
                      <td>-</td>
                    )}
                  </tr>
                  <tr>
                    <th scope="row">Discount</th>
                    <td>-</td>
                    {sortedChildren.length > 0 ? (
                      sortedChildren.slice(1).map((child, index) => (
                        <td key={index}>
                          <animated.span>
                            {animatedProps.total.to(() =>
                              formatDollars(
                                child
                                  ? hasConcessionCard
                                    ? (campus === 0
                                        ? concessionFee
                                        : concessionFeeClare)[child][0] -
                                      (campus === 0
                                        ? concessionFee
                                        : concessionFeeClare)[child][
                                        Math.min(index + 1, 2)
                                      ]
                                    : (campus === 0
                                        ? standardCosts
                                        : standardCostsClare)[child][0] -
                                      (campus === 0
                                        ? standardCosts
                                        : standardCostsClare)[child][
                                        Math.min(index + 1, 2)
                                      ]
                                  : 0
                              )
                            )}
                          </animated.span>
                        </td>
                      ))
                    ) : (
                      <td>-</td>
                    )}
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
  );
};
export default FeeOutcomeTable;

const CalculatorControls = ({
  YearLevelSelector,
  children,
  showDropdowns,
  newDropdowns,
  hasConcessionCard,
  updateChildYear,
  addChild,
  handleConcessionChange,
  handleBusFeeChange,
  hasBusFee,
  resetCalculator,
}) => {
  return (
    <div className="col-12 col-md-5">
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
                    isNew={newDropdowns[index]}
                    value={child}
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
          <div className="row align-items-center justify-content-around">
            <div className="col-10 col-md-7">
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
            <div className="col-10 col-md-5 mt-2">
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
  );
};
export default CalculatorControls;

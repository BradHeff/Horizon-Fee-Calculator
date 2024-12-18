const StaffDiscount = ({ isStaffDiscount, handleStaffDiscountChange }) => {
  return (
    <div className="col-12 mt-4">
      <div className="card shadow-lg p-4">
        <div className="card-body">
          <h3 className="title text-center mb-3">Staff Discount</h3>
          <p className="text-center mb-3">
            This toggle is for Horizon Christian School Staff discounting only.
            Staff members receive a 10% discount on standard fees.
          </p>
          <div className="d-flex justify-content-center align-items-center">
            <span className="me-3">Staff Discount:</span>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="staffDiscountSwitch"
                checked={isStaffDiscount}
                onChange={handleStaffDiscountChange}
              />
              <label className="form-check-label" htmlFor="staffDiscountSwitch">
                {isStaffDiscount ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDiscount;

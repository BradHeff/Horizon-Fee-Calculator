import React from "react";

const Loading = (props) => {
  return (
    <div
      className="v-modal v-modal--inset v-modal--fixed modal-loader"
      style={{ zIndex: 1000 }}
    >
      <div className="v-modal--overlay v-modal--absolute v-modal--inset"></div>
      <div
        role="dialog"
        aria-modal={true}
        tabIndex={-1}
        className="v-modal__container v-modal--absolute v-modal--inset v-modal--outline-none"
      >
        <div
          className="v-modal__content overflow-visible"
          style={{ marginRight: "0px", marginBottom: "0px" }}
        >
          <div className="modal-window__spinner d-flex flex-column align-items-center">
            <div className="loader">
              <div className="face">
                <div className="circle"></div>
              </div>
              <div className="face">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

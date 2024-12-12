import React from "react";

const StyleWhiteTilt = (props) => {
  return (
    <div className={`custom-shape-divider-bottom-Tilt${props.left===true?'-Left':''} z-index`}>
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className={`${props.add===true?'shape-fill-purple':props.white===true?'shape-fill-white':'shape-fill-grey'}`}></path>
      </svg>
    </div>
  );
}

export default StyleWhiteTilt;

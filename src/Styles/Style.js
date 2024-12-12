import React from "react";

const Style = (props) => {
  return (
    <div className="custom-shape-divider-bottom z-index">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M602.45,3.86h0S572.9,116.24,281.94,120H923C632,116.24,602.45,3.86,602.45,3.86Z" className={`${props.add===true?'shape-fill-purple':props.white===true?'shape-fill-white':'shape-fill-grey'}`}></path>
        </svg>
    </div>
  );
}

export default Style;

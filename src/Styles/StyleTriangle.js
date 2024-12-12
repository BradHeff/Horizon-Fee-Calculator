import React from "react";

const StyleTriangle = (props) => {
  return (
    <div className="custom-shape-divider-bottom-Triangle z-index">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M1200 0L0 0 892.25 114.72 1200 0z" className={`${props.add===true?'shape-fill-purple':props.white===true?'shape-fill-white':'shape-fill-grey'}`}></path>
      </svg>
    </div>
  );
}

export default StyleTriangle;

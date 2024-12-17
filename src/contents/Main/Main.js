import React from "react";
import B2t from "../../Components/B2t/B2t";
import Tuition from "../../Components/Calculator/Tuition";

const Main = (props) => {
  return (
    <div className="main-wrapper" id="home">
      <B2t show={props.show} />
      <Tuition campus={props.campus} onSetCampus={props.onSetCampus} />
    </div>
  );
};

export default Main;

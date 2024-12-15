import React from "react";
import B2t from "../../Components/B2t/B2t";
import Tuition from "../../Components/Calculator/Tuition";

const Main = (props) => {
  return (
    <div className="main-wrapper">
      <B2t show={props.show} />
      <Tuition />
      {/*<Intro id='home'/>*/}
      {/*<Features shape='tilt' left={true} color='white' size='sm' id='features' foot={false} add={true} white={false} />*/}
    </div>
  );
};

export default Main;

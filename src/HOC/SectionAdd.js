import React from 'react';
import Style from '../Styles/Style';
import StyleFooter from '../Styles/StyleFooter';
import StyleFooterTriangle from '../Styles/StyleFooterTriangle';
import StyleTriangle from '../Styles/StyleTriangle';
import StyleFooterTilt from '../Styles/StyleFooterTilt';
import StyleTilt from '../Styles/StyleTilt';

const SectionAdd = (props) => {
  return (
    <div className={`section section-${props.size} ${props.color}-bg`} id={props.id}>
        <div className='container'>
            {props.children}
        </div>
        {
          props.shape==='normal'?
            !props.foot?
              <Style add={props.add} white={props.white} />
            :
              <StyleFooter/>
          :
            props.shape==='tilt'?
              !props.foot?
                <StyleTilt add={props.add} white={props.white} left={props.left}/>
              :
                <StyleFooterTilt add={props.add} white={props.white} left={props.left}/>
            :
              !props.foot?
                <StyleTriangle add={props.add} white={props.white} />
              :
                <StyleFooterTriangle/>
        }
    </div>
  );
}

export default SectionAdd;
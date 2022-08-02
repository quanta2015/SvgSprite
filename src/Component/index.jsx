import React from "react";
// import sprite from '../../svg/sprite_suo24.svg'


const Svg = ({id, size, color, sprite}) => {

  return (
   <svg className="m-svg" fill={color} width={size} height={size} viewBox="0 0 24 24">
       <use xlinkHref={`${sprite}#${id}`} />
   </svg>
  )

}


export default Svg;
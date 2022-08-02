import React from 'react';
// import sprite from '../../svg/sprite_suo24.svg'

const Svg = ({
  id, size, color, sprite,
}) => (
  <svg className="m-svg" fill={color} width={'100%'} height={'100%'} viewBox={`0 0 ${size} ${size}`}>
       <use xlinkHref={`${sprite}#${id}`} />
  </svg>
);

export default Svg;



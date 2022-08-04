import React from 'react';

const Svg = ({
  id, size='100%', color='#eee', sprite,
}) => (
  <svg className="m-svg" fill={color} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
       <use xlinkHref={`${sprite}#${id}`} />
  </svg>
);

export default Svg;



// import sprite from './svg/sprite_suo24.svg'
// module.exports = function ({id, size, color}) {

//   retrun (
//     <svg className="m-svg" fill={color} width={size} height={size} viewBox="0 0 24 24">
//       <use xlinkHref={`${sprite}#${id}`} />
//     </svg>
//   )
// }


import sprite from './svg/sprite_suo24.svg'

import React from "react";


export default Svg = ({id, size, color,sprite}) => {


  return (
   <svg className="m-svg" fill={color} width={size} height={size} viewBox="0 0 24 24">
       <use xlinkHref={`${sprite}#${id}`} />
   </svg>
  )

}
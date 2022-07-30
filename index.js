
exports.Svg = ({id, size, color}) => (
   <svg className="m-svg" fill={color} width={size} height={size} viewBox="0 0 24 24">
       <use xlinkHref={`${sprite}#${id}`} />
   </svg>
);


exports.txt = 'aaaaaa'
import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg";

const MinusCircle = (props) => (
<Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
    <Path d="M16 12H8" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={props.strokeWidth} />
</Svg>
);

export default MinusCircle;
import * as React from "react"
import Svg, { Path } from "react-native-svg";

const Hotel = (props) => (
<Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
    <Path d="M3 4V20C3 20.9428 3 21.4142 3.29289 21.7071C3.58579 22 4.05719 22 5 22H19C19.9428 22 20.4142 22 20.7071 21.7071C21 21.4142 21 20.9428 21 20V4" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10.5 8V9.5M10.5 11V9.5M13.5 8V9.5M13.5 11V9.5M10.5 9.5H13.5" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 22L14 17.9999C14 16.8954 13.1046 15.9999 12 15.9999C10.8954 15.9999 10 16.8954 10 17.9999V22" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 4H8C8.6399 2.82727 10.1897 2 12 2C13.8103 2 15.3601 2.82727 16 4H22" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 8H7M6 12H7M6 16H7" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 8H18M17 12H18M17 16H18" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
</Svg>
);

export default Hotel;
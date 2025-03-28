import * as React from "react"
import Svg, { Path } from "react-native-svg";

const Bed = (props) => (
<Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
    <Path d="M22 12H15C14.3509 12 13.7193 11.7895 13.2 11.4L10.8 9.6C10.2807 9.21053 9.64911 9 9 9H2" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 9V11C3 14.7712 3 16.6569 4.17157 17.8284C5.34315 19 7.22876 19 11 19H14C16.8089 19 18.2134 19 19.2223 18.3259C19.659 18.034 20.034 17.659 20.3259 17.2223C21 16.2134 21 14.8089 21 12" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 19V21M6 19V21" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 9V4.5C5 3.67157 5.67157 3 6.5 3C7.32843 3 8 3.67157 8 4.5V5" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
</Svg>
);

export default Bed;
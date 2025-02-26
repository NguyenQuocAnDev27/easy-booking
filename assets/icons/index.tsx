import { theme } from "@/constants/theme";
import Search from "./Search";
import ArrowLeft from "./ArrowLeft";
import User from "./User";
import Lock from "./Lock";
import Mail from "./Mail";
import FilterHorizontal from "./FilterHorizontal";
import Call from "./Call";
import Edit from "./Edit";
import Camera from "./Camera";
import Home from "./Home";
import Heart from "./Heart";
import Calendar from "./Calendar";
import Location from "./Location";
import Star from "./Star";
import MultiUser from "./MultiUser";
import Diamond from "./Diamond";
import Bed from "./Bed";
import Bath from "./Bath";
import Sparkles from "./Sparkles";
import Share from "./Share";
import Hotel from "./Hotel";
import DollarCircle from "./DollarCircle";
import MinusCircle from "./MinusCircle";
import PlusCircle from "./PlusCircle";
import Logout from "./Logout";

// Define an object that maps icon names to components
const icons = {
  search: Search,
  arrowLeft: ArrowLeft,
  user: User,
  lock: Lock,
  mail: Mail,
  filterHoz: FilterHorizontal,
  call: Call,
  camera: Camera,
  edit: Edit,
  home: Home,
  heart: Heart,
  calendar: Calendar,
  location: Location,
  star: Star,
  multiUser: MultiUser,
  diamond: Diamond,
  bed: Bed,
  bath: Bath,
  sparkles: Sparkles,
  share: Share,
  hotel: Hotel,
  dollarCircle: DollarCircle,
  minusCircle: MinusCircle,
  plusCircle: PlusCircle,
  logout: Logout,
} as const;

// Define the type for valid icon names
type IconName = keyof typeof icons;

// Define the props for the Icon component
interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}

// Create the Icon component with TypeScript
const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  strokeWidth = 1.9,
  color = theme.colors.textLight,
  fill = "none",
  ...props
}) => {
  const IconComponent = icons[name];

  // Ensure the icon exists before rendering
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found.`);
    return null;
  }

  return (
    <IconComponent
      height={size}
      width={size}
      strokeWidth={strokeWidth}
      color={color}
      fill={fill}
      {...props}
    />
  );
};

export default Icon;

// Icon compatibility layer - maps @expo/vector-icons to react-icons
import * as Io from 'react-icons/io';
import * as IoIos from 'react-icons/io';
import * as IoMd from 'react-icons/io';
import * as Md from 'react-icons/md';

// Mapping of common Ionicons to react-icons equivalents
const iconMap: Record<string, any> = {
  // Stars
  'star': Io.IoIosStar,
  'star-outline': Io.IoIosStarOutline,

  // Navigation
  'home': Io.IoIosHome,
  'home-outline': Io.IoIosHomeOutline,
  'arrow-back': Io.IoIosArrowBack,
  'arrow-forward': Io.IoIosArrowForward,
  'close': Io.IoIosClose,
  'close-circle': Io.IoIosCloseCircle,
  'chevron-forward': Io.IoIosArrowForward,
  'chevron-back': Io.IoIosArrowBack,
  'add': Io.IoIosAdd,

  // Search/Browse
  'search': Io.IoIosSearch,
  'search-outline': Io.IoIosSearch,

  // Settings
  'settings': Io.IoIosSettings,
  'settings-outline': Io.IoIosSettings,

  // People/Contacts
  'people': Io.IoIosPeople,
  'people-outline': Io.IoIosPeopleOutline,
  'person': Io.IoIosPerson,
  'person-outline': Io.IoIosPersonOutline,
  'people-outline': Io.IoIosPeopleOutline,

  // Call/Contact
  'call': Io.IoIosCall,
  'call-outline': Io.IoIosCall,
  'mail': Io.IoIosMail,
  'mail-outline': Io.IoIosMailUnread,
  'mail-unread': Io.IoIosMailUnread,

  // Actions
  'create': Io.IoIosCreate,
  'pencil': Io.IoIosCreate,
  'pencil-outline': Io.IoIosCreate,
  'trash': Io.IoIosTrash,
  'trash-outline': Io.IoIosTrash,
  'copy': Io.IoIosCopy,
  'copy-outline': Io.IoIosCopy,
  'create-outline': Io.IoIosCreate,
  'checkmark': Io.IoIosCheckmark,
  'checkmark-circle': Io.IoIosCheckmarkCircle,
  'close-circle': Io.IoIosCloseCircle,
  'close-circle-outline': Io.IoIosCloseCircleOutline,

  // Info/Help
  'information-circle': Io.IoIosInformationCircle,
  'information-circle-outline': Io.IoIosInformationCircleOutline,
  'alert': Io.IoIosAlert,
  'alert-circle': Io.IoIosAlert,
  'help-circle': Io.IoIosHelpCircle,
  'help-circle-outline': Io.IoIosHelpCircleOutline,

  // Misc
  'time': Io.IoIosTime,
  'time-outline': Io.IoIosTimer,
  'calendar': Io.IoIosCalendar,
  'calendar-outline': Io.IoIosCalendar,
  'document': Io.IoIosDocument,
  'document-outline': Io.IoIosDocument,
  'document-text': Io.IoIosDocument,
  'document-text-outline': Io.IoIosDocument,
  'bulb': Io.IoIosBulb,
  'bulb-outline': Io.IoIosBulb,
  'lock-closed': Io.IoIosLock,
  'lock-closed-outline': Io.IoIosLock,
  'lock-open': Io.IoIosUnlock,
  'cloud-download': Io.IoIosCloudDownload,
  'cloud-download-outline': Io.IoIosCloudDownload,
  'finger-print': Md.MdFingerprint,
  'fingerprint': Md.MdFingerprint,

  // Brand
  'logo-linkedin': Io.IoLogoLinkedin,

  // Default fallback
  'default': Io.IoIosHelpCircle,
};

// React Native's Ionicons passes the icon name as a prop, not as a component
export const Ionicons: React.FC<any> = ({ name, size = 24, color = '#000', style, ...props }) => {
  // Try direct match first
  let IconComponent = iconMap[name];

  // Try with ios- prefix if not found
  if (!IconComponent && !name.startsWith('ios-')) {
    IconComponent = iconMap[`ios-${name}`];
  }

  // Fallback to default
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in mapping, using default`);
    IconComponent = iconMap['default'];
  }

  return <IconComponent size={size} color={color} style={style} {...props} />;
};

// Named exports for common icons
export {
  IoIosStar,
  IoIosStarOutline,
  IoIosHome,
  IoIosAdd,
  IoIosSearch,
  IoIosSettings,
  IoIosPeople,
  IoIosPerson,
  IoIosArrowBack,
  IoIosArrowForward,
} from 'react-icons/io';

export { MdFingerprint } from 'react-icons/md';

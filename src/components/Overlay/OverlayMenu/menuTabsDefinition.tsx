import type { ReactNode } from 'react';
import { BsImageFill, BsLayersFill } from 'react-icons/bs';
import { FaInfoCircle, FaCloudDownloadAlt, FaCog } from 'react-icons/fa';

export type MenuTabId = 'frames' | 'canvas' | 'layers' | 'download' | 'settings' | 'about';

export const menuTabsDefinition: {
  id: MenuTabId;
  label: string;
  icon: ReactNode;
}[] = [
  {
    id: 'frames',
    label: 'My Frames',
    icon: <BsImageFill />,
  },
  {
    id: 'canvas',
    label: 'Canvas',
    icon: <BsImageFill />,
  },
  {
    id: 'download',
    label: 'Download',
    icon: <FaCloudDownloadAlt />,
  },
  {
    id: 'layers',
    label: 'Layers',
    icon: <BsLayersFill />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <FaCog />,
  },
  {
    id: 'about',
    label: 'About',
    icon: <FaInfoCircle />,
  },
];

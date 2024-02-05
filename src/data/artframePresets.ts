export type FrameSelectItem = {
  label: string;
  width: number;
  height: number;
};

const artframePresets = {
  SIX_INCH_HD: {
    label: '6.0″ HD',
    width: 1448,
    height: 1072,
  },
  NINE_POINT_SEVEN_INCH: {
    label: '9.7″',
    width: 1200,
    height: 825,
  },
  THIRTEEN_POINT_THREE_INCH: {
    label: '13.3″',
    width: 1600,
    height: 1200,
  },
  THIRTYONE_POINT_TWO_INCH: {
    label: '31.2″',
    width: 2560,
    height: 1440,
  },
} satisfies Record<string, FrameSelectItem>;

export const orientationPresets = {
  LANDSCAPE: 'Landscape',
  PORTRAIT: 'Portrait',
} satisfies Record<string, string>;

export default artframePresets;

const sizePresets = {
  artframeLandscape: {
    label: 'ArtFrame (Landscape)',
    types: {
      '6inch': {
        label: '6.0″ HD',
        width: 1448,
        height: 1072,
      },
      '9.7inch': {
        label: '9,7″',
        width: 1200,
        height: 825,
      },
      '13.3inch': {
        label: '13,3″',
        width: 1600,
        height: 1200,
      },
    },
  },
  artframePortrait: {
    label: 'ArtFrame (Portrait)',
    types: {
      '6inch': {
        label: '6.0″ HD',
        width: 1072,
        height: 1448,
      },
      '9.7inch': {
        label: '9,7″',
        width: 825,
        height: 1200,
      },
      '13.3inch': {
        label: '13,3″',
        width: 1200,
        height: 1600,
      },
    },
  },
} satisfies Record<
  string,
  {
    label: string;
    types: Record<
      string,
      {
        label: string;
        width: number;
        height: number;
      }
    >;
  }
>;

export default sizePresets;

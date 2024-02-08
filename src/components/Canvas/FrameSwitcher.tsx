import { Select } from '@mantine/core';

import artframePresets from '~/data/artframePresets';
import useCanvasWorkingSize from '~/store/useCanvasWorkingSize';
import useFrames from '~/store/useFrames';

type Props = {
  onSelect: () => void;
};
export const FramesSwitcher: React.FC<Props> = ({ onSelect }) => {
  const frames = useFrames((state) => state.frames);
  const setCurrentFrame = useFrames((state) => state.setCurrentFrame);
  const currentFrame = useFrames((state) => state.currentFrame);
  const setCanvasWorkingWidth = useCanvasWorkingSize((state) => state.setCanvasWorkingWidth);
  const setCanvasWorkingHeight = useCanvasWorkingSize((state) => state.setCanvasWorkingHeight);

  const getFramePresetOptions = () =>
    frames.map((frame) => ({
      value: frame.id,
      label: frame.name,
    }));

  return (
    <Select
      mb={'sm'}
      variant="default"
      size="sm"
      label="Select ArtFrame"
      placeholder="Search presets"
      data={getFramePresetOptions()}
      value={currentFrame?.id || null}
      searchable
      maxDropdownHeight={400}
      nothingFound="No results found"
      onChange={(item) => {
        const frame = frames.find((frame) => frame.id === item);

        if (!frame) {
          console.error(`No Frame with id ${item} found.`);
          return;
        }
        setCurrentFrame(frame);

        const preset = artframePresets[frame?.variant];
        const width = frame.orientation === 'PORTRAIT' ? preset.height : preset.width;
        const height = frame.orientation === 'PORTRAIT' ? preset.width : preset.height;

        setCanvasWorkingWidth(width);
        setCanvasWorkingHeight(height);
        onSelect();
      }}
    />
  );
};

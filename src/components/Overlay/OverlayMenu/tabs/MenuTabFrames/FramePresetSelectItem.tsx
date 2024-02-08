import { Group, Text } from '@mantine/core';
import React, { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { FaImage } from 'react-icons/fa';

export interface FramePresetOption {
  label: string;
  width: number;
  height: number;
}

type Props = FramePresetOption & ComponentPropsWithoutRef<'div'>;

const common = {
  size: 16,
};

const FrameSizePresetSelectItem = forwardRef<HTMLDivElement, Props>(({ label, width, height, ...rest }: Props, ref) => (
  <div ref={ref} {...rest}>
    <Group noWrap>
      <div>
        <FaImage {...common} />
      </div>
      <div>
        <Text size="sm">{label}</Text>
        <Text size="xs" opacity={0.65}>
          {`${width} x ${height} px`}
        </Text>
      </div>
    </Group>
  </div>
));

FrameSizePresetSelectItem.displayName = 'FrameSizePresetSelectItem';

export default FrameSizePresetSelectItem;

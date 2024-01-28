import { Group, Text } from '@mantine/core';
import React, { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { BiLandscape } from 'react-icons/bi';
import { FaQuestion } from 'react-icons/fa';
import { MdOutlinePortrait } from 'react-icons/md';

function getSocialIcon(platformSlug: string) {
  const common = {
    size: 16,
  };

  switch (platformSlug) {
    case 'artframeLandscape':
      return <BiLandscape {...common} />;
    case 'artframePortrait':
      return <MdOutlinePortrait {...common} />;
    default:
      return <FaQuestion {...common} />;
  }
}

export interface SizePresetOption {
  platformSlug: string;
  value: `${string}-${string}`; // instagram-post
  label: string;
  width: number;
  height: number;
}

type Props = SizePresetOption & ComponentPropsWithoutRef<'div'>;

const SizePresetSelectItem = forwardRef<HTMLDivElement, Props>(({ platformSlug, label, width, height, ...rest }: Props, ref) => (
  <div ref={ref} {...rest}>
    <Group noWrap>
      <div>{getSocialIcon(platformSlug)}</div>
      <div>
        <Text size="sm">{label}</Text>
        <Text size="xs" opacity={0.65}>
          {`${width} x ${height} px`}
        </Text>
      </div>
    </Group>
  </div>
));

SizePresetSelectItem.displayName = 'SizePresetSelectItem';

export default SizePresetSelectItem;

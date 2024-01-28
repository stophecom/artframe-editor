import { ActionIcon, Button, Tooltip } from '@mantine/core';
import React from 'react';
import { FaArrowRight, FaPlus, FaMinus } from 'react-icons/fa';
import { IoLocateSharp } from 'react-icons/io5';
import styled from 'styled-components';

import CanvasPreview from '~/components/CanvasPreview';
import { CANVAS_PREVIEW_UNIQUE_ID } from '~/config/globalElementIds';
import useCanvasContext from '~/context/useCanvasContext';
import useZoom from '~/store/useZoom';
import theme from '~/theme';

// Hidden as a workaround. Eventually we could show a brief dialog with the preview.
const CanvasWrapper = styled.div`
  width: 200px;
  visibility: hidden;
`;

const Wrapper = styled.div`
  pointer-events: auto;
  display: grid;
  row-gap: ${theme.variables.overlayItemsGutter};
  grid-template-rows: min-content min-content min-content;
`;

const Ul = styled.ul`
  pointer-events: auto;
  width: 100%;
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, auto));
  align-items: center;
  grid-gap: ${theme.variables.overlayItemsGutter};

  & > li {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const downloadCanvas = async () => {
  const canvas = document.getElementById(CANVAS_PREVIEW_UNIQUE_ID) as HTMLCanvasElement;
  const image = canvas.toDataURL();

  // Send image to API
  const response = await fetch('/api/images', {
    method: 'POST',
    body: JSON.stringify(image),
  });

  console.log(response);
};

export default function OverlayZoom() {
  const { setCenter } = useCanvasContext();

  const zoom = useZoom((state) => state.zoom);
  const incrementZoom = useZoom((state) => state.incrementZoom);
  const decrementZoom = useZoom((state) => state.decrementZoom);

  return (
    <Wrapper>
      <CanvasWrapper>
        <CanvasPreview />
      </CanvasWrapper>
      <Button
        variant="default"
        onClick={() => {
          downloadCanvas();
        }}
        leftIcon={<FaArrowRight />}
      >
        Send to ArtFrame
      </Button>

      <Ul>
        <li>
          <Tooltip position="top" label="Reset position" offset={8}>
            <ActionIcon
              size="xl"
              variant="default"
              onClick={() => {
                setCenter();
              }}
            >
              <IoLocateSharp />
            </ActionIcon>
          </Tooltip>
        </li>
        <li>
          <Tooltip position="top" label="Decrement zoom" offset={8}>
            <ActionIcon
              size="xl"
              variant="default"
              onClick={() => {
                decrementZoom(5);
              }}
            >
              <FaMinus />
            </ActionIcon>
          </Tooltip>
        </li>
        <li>
          <Tooltip position="top" label="Set default zoom" offset={8}>
            <ActionIcon
              sx={{ width: '70px' }}
              size="xl"
              variant="default"
              onClick={() => {
                setCenter();
              }}
            >
              {`${Math.trunc(Math.abs(zoom))}%`}
            </ActionIcon>
          </Tooltip>
        </li>
        <li>
          <Tooltip position="top" label="Increment zoom" offset={8}>
            <ActionIcon
              size="xl"
              variant="default"
              onClick={() => {
                incrementZoom(5);
              }}
            >
              <FaPlus />
            </ActionIcon>
          </Tooltip>
        </li>
      </Ul>
    </Wrapper>
  );
}

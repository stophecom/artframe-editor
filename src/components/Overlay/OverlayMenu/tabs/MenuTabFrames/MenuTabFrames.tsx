import { NumberInput, Select } from '@mantine/core';
import React from 'react';
import { RxHeight, RxWidth } from 'react-icons/rx';
import styled from 'styled-components';

import useCanvasContext from '~/context/useCanvasContext';
import useCanvasWorkingSize from '~/store/useCanvasWorkingSize';
import useDefaultParams from '~/store/useDefaultParams';
import useFrames from '~/store/useFrames';
import theme from '~/theme';
import getSizePresetDataFromSlug from '~/utils/getSizePresetDataFromSlug';
import getSizePresetOptions from '~/utils/getSizePresetOptions';

import SizePresetSelectItem from './SizePresetSelectItem';
import { H4 } from '../../commonTabComponents';

const CanvasSizeGridDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0.75rem;
  margin-bottom: 0.5rem;

  ${theme.medias.gteMedium} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const PresetDiv = styled.div`
  margin-bottom: 1rem;
`;

const data = getSizePresetOptions();

export default function MenuTabCanvas() {
  const { setCenter } = useCanvasContext();

  const defaultParams = useDefaultParams((state) => state.defaultParams);
  const setDefaultParams = useDefaultParams((state) => state.setDefaultParams);

  const canvasWorkingSize = useCanvasWorkingSize((state) => state.canvasWorkingSize);
  const setCanvasWorkingWidth = useCanvasWorkingSize((state) => state.setCanvasWorkingWidth);
  const setCanvasWorkingHeight = useCanvasWorkingSize((state) => state.setCanvasWorkingHeight);

  const frames = useFrames((state) => state.frames);

  return (
    <>
      <H4>My Frames</H4>

      {frames.map((frame) => (
        <div key={frame.id}>
          <div>{frame.id}</div>
          <div>{frame.name}</div>
          <div>{frame.description}</div>
          <div>{frame.orientation}</div>
          <div>{frame?.owner?.name}</div>
          <div>{frame.variant}</div>
          <div>{frame.endpointId}</div>
          <div>{frame.username}</div>
          <div>{frame.password}</div>
        </div>
      ))}

      <PresetDiv>
        <Select
          variant="default"
          size="sm"
          label="Presets"
          placeholder="Search presets"
          itemComponent={SizePresetSelectItem}
          data={data}
          searchable
          value={defaultParams.sizePreset}
          maxDropdownHeight={400}
          nothingFound="No results found"
          filter={(value, item) => !!item.label?.toLowerCase().includes(value.toLowerCase().trim())}
          onChange={(value) => {
            const sizePresetData = getSizePresetDataFromSlug(value);
            if (sizePresetData) {
              setCanvasWorkingWidth(sizePresetData.width);
              setCanvasWorkingHeight(sizePresetData.height);
              setDefaultParams({
                sizePreset: value,
              });
              setCenter();
            }
          }}
        />
      </PresetDiv>

      <CanvasSizeGridDiv>
        <NumberInput
          label="Width"
          disabled
          min={0}
          max={5000}
          value={canvasWorkingSize.width}
          onChange={(value) => {
            if (value && value !== canvasWorkingSize.width) {
              setCanvasWorkingWidth(value);
              setDefaultParams({
                sizePreset: null,
              });
              setCenter();
            }
          }}
          icon={<RxWidth />}
          rightSection="px"
          rightSectionWidth={40}
        />
        <NumberInput
          label="Height"
          disabled
          min={0}
          max={5000}
          value={canvasWorkingSize.height}
          onChange={(value) => {
            if (value && value !== canvasWorkingSize.height) {
              setCanvasWorkingHeight(value);
              setDefaultParams({
                sizePreset: null,
              });
              setCenter();
            }
          }}
          icon={<RxHeight />}
          rightSection="px"
          rightSectionWidth={40}
        />
      </CanvasSizeGridDiv>
    </>
  );
}

import { Paper, TextInput, Select, SegmentedControl, Button, Group, LoadingOverlay, Title, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import styled from 'styled-components';

import artframePresets, { FrameSelectItem } from '~/data/artframePresets';
import { createId } from '~/utils/getCuid';

import FrameSizePresetSelectItem from './FramePresetSelectItem';
import { FramesAccordion } from './FramesAccordion';

type FrameSelectItemOption = FrameSelectItem & { value: string };

function getFramePresetOptions(): FrameSelectItemOption[] {
  const options: FrameSelectItemOption[] = [];

  Object.entries(artframePresets).forEach(([variant, values]) => {
    options.push({
      value: `${variant}`,
      label: `ArtFrame ${values.label}`,
      width: values.width,
      height: values.height,
    });
  });

  return options;
}

const SegmentedControlWrapper = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
`;

const SegmentedControlLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`;

export default function MenuTabFrames() {
  const [loading, { open, close }] = useDisclosure();

  const form = useForm({
    initialValues: {
      name: 'Frame 1',
      description: '',
      variant: 'SIX_INCH_HD',
      orientation: 'LANDSCAPE',
    },

    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
    },
  });

  return (
    <>
      <Box mb={'xs'}>
        <Title order={3}>My Frames</Title>
      </Box>
      <FramesAccordion />

      <Title mb="sm" order={4}>
        Add Frame
      </Title>

      <Paper shadow="md" withBorder p="xl" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} />
        <form
          onSubmit={form.onSubmit(async (values) => {
            const username = createId();
            const password = createId();
            const endpointId = createId();

            try {
              open();
              const body = { ...values, username, password, endpointId };

              await fetch('/api/frames', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
              });
            } catch (error) {
              console.error(error);
            } finally {
              close();
            }
          })}
        >
          <Select
            variant="default"
            size="sm"
            label="ArtFrame"
            placeholder="Search presets"
            itemComponent={FrameSizePresetSelectItem}
            data={getFramePresetOptions()}
            searchable
            maxDropdownHeight={400}
            nothingFound="No results found"
            filter={(value, item) => !!item.label?.toLowerCase().includes(value.toLowerCase().trim())}
            {...form.getInputProps('variant')}
          />

          <SegmentedControlWrapper>
            <SegmentedControlLabel>Orientation</SegmentedControlLabel>
            <SegmentedControl
              data={[
                { label: 'Landscape', value: 'LANDSCAPE' },
                { label: 'Portrait', value: 'PORTRAIT' },
              ]}
              {...form.getInputProps('orientation')}
            />
          </SegmentedControlWrapper>
          <TextInput withAsterisk label="Name" placeholder="Frame 1" {...form.getInputProps('name')} />
          <TextInput label="Description" placeholder="Frame in living room." {...form.getInputProps('description')} />

          <Group align="flex-end" mt="md">
            <Button type="submit" loading={loading}>
              Add frame
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
}

import {
  Paper,
  TextInput,
  Select,
  SegmentedControl,
  Button,
  Group,
  LoadingOverlay,
  Accordion,
  Title,
  Box,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import styled from 'styled-components';

import ButtonCopy from '~/components/CopyButton';
import { BASE_PATH, HOST } from '~/config/constants';
import artframePresets, { orientationPresets, FrameSelectItem } from '~/data/artframePresets';
import useFrames from '~/store/useFrames';
import { createId } from '~/utils/getCuid';

import FrameSizePresetSelectItem from './FramePresetSelectItem';

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

const FrameHeading = styled.h5`
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
`;

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
  const frames = useFrames((state) => state.frames);
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
      <Accordion chevronPosition="right" variant="contained" mb={'xl'}>
        {frames.map(({ id, name, description, orientation, variant, password, username, endpointId }) => {
          const endpointURL = `${HOST}${username}:${password}@${BASE_PATH}/${endpointId}/`;
          return (
            <Accordion.Item value={id} key={id}>
              <Accordion.Control>
                <FrameHeading>{name}</FrameHeading>
                <div>
                  <small>
                    ArtFrame {artframePresets[variant].label} ({orientationPresets[orientation]})
                  </small>
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                <Box mb={3} p={4} fz={'sm'} fs={'italic'}>
                  {description}
                </Box>
                <Divider></Divider>
                <Box mb={3} p={4}>
                  <TextInput
                    mb={'sm'}
                    disabled
                    label="Endpoint URL"
                    value={endpointURL}
                    rightSection={<ButtonCopy value={endpointURL} />}
                  />
                  <Button mr={'xs'} loading={loading} variant="filled" size="xs">
                    Edit Frame
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        open();
                        await fetch(`/api/frames/delete/${id}`, {
                          method: 'DELETE',
                        });
                      } catch (error) {
                        console.error(error);
                      } finally {
                        close();
                      }
                    }}
                    loading={loading}
                    variant="filled"
                    color="red"
                    size="xs"
                  >
                    Remove Frame
                  </Button>
                </Box>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>

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

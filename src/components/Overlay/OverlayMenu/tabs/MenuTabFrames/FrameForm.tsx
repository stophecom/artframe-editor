import { TextInput, Input, Select, SegmentedControl, Button, LoadingOverlay, Box, Flex } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { pick } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { Frame } from '~/config/types';
import artframePresets, { FrameSelectItem } from '~/data/artframePresets';
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

type FormValues = Pick<Frame, 'name' | 'description' | 'variant' | 'orientation'>;

interface Props {
  frame?: Pick<Frame, 'id'> & FormValues;
  onSubmit: () => void;
}
export const FrameForm: React.FC<Props> = ({ frame, onSubmit }) => {
  const [loading, { open, close }] = useDisclosure();
  const router = useRouter();
  const isEditMode = !!frame;

  const form = useForm<FormValues>({
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

  useEffect(() => {
    const values = pick(frame, ['name', 'description', 'orientation', 'variant']);
    form.setValues(values);
    // form.resetDirty(values);
  }, [frame]);

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} />
        <form
          onSubmit={form.onSubmit(async (values) => {
            try {
              open();
              if (isEditMode) {
                await fetch(`/api/frames/${frame.id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...values }),
                });
              } else {
                const username = createId();
                const password = createId();
                const endpointId = createId();

                const requestBody = { ...values, username, password, endpointId };

                await fetch('/api/frames', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(requestBody),
                });
              }
            } catch (error) {
              console.error(error);
            } finally {
              // Triggers re-evaluating getServerSideProps to refresh frames
              router.replace(router.asPath);
              close();
              onSubmit();
            }
          })}
        >
          <TextInput mb={'sm'} withAsterisk label="Name" placeholder="Frame 1" {...form.getInputProps('name')} />
          <Select
            mb={'sm'}
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

          <Input.Wrapper label="Orientation" mb={'sm'}>
            <div>
              <SegmentedControl
                data={[
                  { label: 'Landscape', value: 'LANDSCAPE' },
                  { label: 'Portrait', value: 'PORTRAIT' },
                ]}
                {...form.getInputProps('orientation')}
              />
            </div>
          </Input.Wrapper>

          <TextInput label="Description" placeholder="Frame in living room." {...form.getInputProps('description')} />

          <Flex gap="sm" justify="flex-end" mt="md">
            {isEditMode && (
              <Button variant="outline" onClick={onSubmit}>
                Cancel
              </Button>
            )}

            <Button type="submit" loading={loading}>
              {isEditMode ? 'Save' : 'Add frame'}
            </Button>
          </Flex>
        </form>
      </Box>
    </>
  );
};

export default FrameForm;

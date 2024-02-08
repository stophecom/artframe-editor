import { Paper, Title, Box } from '@mantine/core';
import React from 'react';

import FrameForm from './FrameForm';
import { FramesAccordion } from './FramesAccordion';

export default function MenuTabFrames() {
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
        <FrameForm onSubmit={() => console.log('Saved')} />
      </Paper>
    </>
  );
}

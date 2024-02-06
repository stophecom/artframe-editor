import { TextInput, Button, Accordion, Box, Divider, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import styled from 'styled-components';

import ButtonCopy from '~/components/CopyButton';
import { BASE_PATH, HOST } from '~/config/constants';
import artframePresets, { orientationPresets } from '~/data/artframePresets';
import useFrames from '~/store/useFrames';

const FrameHeading = styled.h5`
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
`;

export const FramesAccordion = () => {
  const [loading, { open, close }] = useDisclosure();
  const frames = useFrames((state) => state.frames);

  return (
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
                <Grid justify="space-between">
                  <Grid.Col span={'auto'}>
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
                      variant="outline"
                      color="red"
                      size="xs"
                      leftIcon={<FaRegTrashAlt />}
                    >
                      Remove
                    </Button>
                  </Grid.Col>
                  <Grid.Col span="content">
                    <Button variant="filled" size="xs" leftIcon={<FaEdit />}>
                      Edit
                    </Button>
                  </Grid.Col>
                </Grid>
              </Box>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

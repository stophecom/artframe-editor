import { TextInput, Input, Button, Accordion, Box, Divider, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import styled from 'styled-components';

import ButtonCopy from '~/components/CopyButton';
import { BASE_PATH, HOST } from '~/config/constants';
import artframePresets, { orientationPresets } from '~/data/artframePresets';
import useFrames from '~/store/useFrames';

import FrameForm from './FrameForm';

const FrameHeading = styled.h5`
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
`;

export const FramesAccordion = () => {
  const [loading, { open, close }] = useDisclosure();

  const frames = useFrames((state) => state.frames);
  const router = useRouter();

  type EditItem = string | null;
  const [editItem, setEditItem] = useState<EditItem>(null);

  return (
    <Accordion chevronPosition="right" variant="contained" mb={'xl'}>
      {frames.map(({ id, name, description, orientation, variant, password, username, endpointId }) => {
        const endpointURL = `${HOST}${username}:${password}@${BASE_PATH}/${endpointId}/`;
        return (
          <Accordion.Item value={id} key={id}>
            <Accordion.Control disabled={editItem === id} onClick={() => setEditItem(null)}>
              {editItem === id ? (
                <></>
              ) : (
                <>
                  <FrameHeading>{name}</FrameHeading>
                  <div>
                    <small>
                      ArtFrame {artframePresets[variant].label} ({orientationPresets[orientation]})
                    </small>
                  </div>
                </>
              )}
            </Accordion.Control>
            <Accordion.Panel>
              {editItem === id ? (
                <FrameForm onSubmit={() => setEditItem(null)} frame={{ id, name, description, orientation, variant }} />
              ) : (
                <>
                  <Box mb={3} p={4} fz={'sm'} fs={'italic'}>
                    {description}
                  </Box>
                  <Divider></Divider>
                  <Box mb={3} p={4}>
                    <Input.Wrapper label="Endpoint URL" mb={'sm'} description={'Copy and past this to your ArtFrame.'}>
                      <TextInput mt={'xs'} mb={'sm'} value={endpointURL} rightSection={<ButtonCopy value={endpointURL} />} />
                    </Input.Wrapper>
                    <Grid justify="space-between">
                      <Grid.Col span={'auto'}>
                        <Button
                          onClick={async () => {
                            try {
                              open();
                              await fetch(`/api/frames/${id}`, {
                                method: 'DELETE',
                              });
                            } catch (error) {
                              console.error(error);
                            } finally {
                              // Triggers re-evaluating getServerSideProps to refresh frames
                              router.replace(router.asPath);
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
                        <Button onClick={() => setEditItem(id)} variant="filled" size="xs" leftIcon={<FaEdit />}>
                          Edit
                        </Button>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

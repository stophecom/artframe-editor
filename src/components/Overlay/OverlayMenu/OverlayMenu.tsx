import { ActionIcon, Menu, Tooltip } from '@mantine/core';
import React from 'react';
import { FaBars } from 'react-icons/fa';
import styled from 'styled-components';

import Header from '~/components/Header';
import useModalContext from '~/context/useModalContext';
import useActiveObjectId from '~/store/useActiveObjectId';

import { menuTabsDefinition } from './menuTabsDefinition';

const WrapperDiv = styled.div`
  pointer-events: auto;
  background: white;
`;

export default function OverlayMenu() {
  const { openMenuModal } = useModalContext();

  const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);

  return (
    <WrapperDiv>
      <Header />
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <Tooltip position="bottom-end" label="Open menu" offset={16}>
            <ActionIcon title="Settings" variant="default" size="xl">
              <FaBars />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          {menuTabsDefinition.map((tab) => (
            <Menu.Item
              key={tab.id}
              icon={tab.icon}
              onClick={() => {
                setActiveObjectId(null);
                openMenuModal(tab.id);
              }}
            >
              {tab.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </WrapperDiv>
  );
}

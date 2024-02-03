import { ActionIcon, Menu, Tooltip } from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { FaBars } from 'react-icons/fa';
import { MdOutlineLogout, MdPerson } from 'react-icons/md';
import styled from 'styled-components';

import useModalContext from '~/context/useModalContext';
import useActiveObjectId from '~/store/useActiveObjectId';

import { menuTabsDefinition } from './menuTabsDefinition';

const WrapperDiv = styled.div`
  display: grid;
  grid-template-columns: min-content min-content;
  grid-gap: 0.5rem;
  pointer-events: auto;
`;

export default function OverlayMenu() {
  const { openMenuModal } = useModalContext();

  const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);

  const { data: session } = useSession();

  return (
    <WrapperDiv>
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <Tooltip position="bottom-end" label="Open menu" offset={16}>
            <ActionIcon title="Profile" variant="default" size="xl">
              <MdPerson />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          {session ? (
            <Menu.Item icon={<MdPerson />}>{session?.user?.name}</Menu.Item>
          ) : (
            <Menu.Item component="a" href="/api/auth/signin" icon={<MdPerson />}>
              Log in
            </Menu.Item>
          )}
          {session && (
            <Menu.Item onClick={() => signOut()} icon={<MdOutlineLogout />}>
              Log out
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
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

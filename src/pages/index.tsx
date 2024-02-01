import type { GetStaticProps } from 'next';
import React from 'react';
import styled from 'styled-components';

import Header, { FrameProps } from '~/components/Header';
import PageSEO from '~/components/PageSEO';
import AppLayout from '~/layouts/AppLayout';
import theme from '~/theme';

import prisma from '../../lib/prisma';

const HeaderBar = styled.div`
  position: fixed;
  background-color: var(--color-bgPrimary);
  border: 0.0625rem solid var(--color-borderPrimary);
  color: var(--color-textPrimary);
  border-radius: 0.25rem;
  padding: 0.25rem;
  top: ${theme.variables.overlayGutter};
  left: ${theme.variables.overlayGutter};
  right: ${theme.variables.overlayGutter};
  height: ${theme.variables.headerHeight};
  z-index: ${theme.layers.overlay};
`;

type Props = {
  frames: FrameProps[];
};

const Page: React.FC<Props> = (props) => {
  return (
    <>
      <HeaderBar>
        <Header frames={props.frames} />
      </HeaderBar>
      <PageSEO />
      <AppLayout />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const frames = await prisma.frame.findMany({
    include: {
      owner: {
        select: { name: true },
      },
    },
  });
  return {
    props: { frames },
    revalidate: 10,
  };
};

export default Page;

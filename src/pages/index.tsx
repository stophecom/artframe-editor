import type { GetStaticProps } from 'next';
import React from 'react';

import PageSEO from '~/components/PageSEO';
import { useStoreSync } from '~/hooks/useStoreSync';
import AppLayout from '~/layouts/AppLayout';
import useFrames from '~/store/useFrames';
import type { FramesState } from '~/store/useFrames';

import prisma from '../../lib/prisma';

type PageIndexProps = FramesState;

const Page: React.FC<PageIndexProps> = ({ frames }) => {
  const counterStore = useStoreSync(useFrames, { frames })();
  console.log(counterStore.frames);

  return (
    <>
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

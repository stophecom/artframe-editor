import type { GetServerSideProps } from 'next';
import React, { useEffect } from 'react';

import PageSEO from '~/components/PageSEO';
import AppLayout from '~/layouts/AppLayout';
import useFrames from '~/store/useFrames';
import type { State } from '~/store/useFrames';

import prisma from '../../lib/prisma';

type PageIndexProps = State;

const Page: React.FC<PageIndexProps> = ({ frames }) => {
  const setFrames = useFrames((state) => state.setFrames);

  useEffect(() => {
    // We update the store whenever getServerSideProps re-evaluates
    setFrames(frames);
  }, [frames]);

  return (
    <>
      <PageSEO />
      <AppLayout />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const frames = await prisma.frame.findMany({
    include: {
      owner: {
        select: { name: true },
      },
      images: {
        select: { url: true },
      },
    },
  });
  return {
    props: { frames },
  };
};

export default Page;

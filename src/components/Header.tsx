import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import styled from 'styled-components';

export const Grid = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export type FrameProps = {
  id: string;
  name?: string;
  description?: string;
  owner: {
    name: string;
    email: string;
  } | null;
  variant: string;
  orientation: boolean;
};

type HeaderProps = {
  frames: FrameProps[];
};

const Header: React.FC<HeaderProps> = ({ frames }) => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="left">
      <Link href="/" className="bold" data-active={isActive('/')} legacyBehavior>
        Home
      </Link>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin" data-active={isActive('/signup')}>
          Log in
        </Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        {frames.map((frame) => (
          <div key={frame.id}>
            {frame.variant}
            {frame.id}
          </div>
        ))}
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session?.user?.name} ({session?.user?.email})
        </p>
        <Link href="/create" legacyBehavior>
          <button>
            <a>New Frame</a>
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
      </div>
    );
  }

  return (
    <Grid>
      {left}
      {right}
    </Grid>
  );
};

export default Header;

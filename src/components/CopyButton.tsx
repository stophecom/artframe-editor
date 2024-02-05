import { CopyButton, ActionIcon, Tooltip, rem } from '@mantine/core';
import { FaRegCopy, FaCheck } from 'react-icons/fa';

interface Props {
  value: string;
}

export const ButtonCopy: React.FC<Props> = ({ value }) => {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
          <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
            {copied ? <FaCheck style={{ width: rem(16) }} /> : <FaRegCopy style={{ width: rem(16) }} />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export default ButtonCopy;

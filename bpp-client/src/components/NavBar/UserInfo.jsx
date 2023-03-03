import React from 'react';
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  createStyles
} from '@mantine/core';
import PropTypes from 'prop-types';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
    }
  }
}));

export function UserInfo({
  role, email
}) {
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar src={`https://avatars.dicebear.com/api/initials/${email}.svg`} radius="xl" size={40} />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {role}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

      </Group>
    </UnstyledButton>
  );
}

UserInfo.propTypes = {
  role: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};

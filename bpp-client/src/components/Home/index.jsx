import React from 'react';
import {
  createStyles, Title, Center
} from '@mantine/core';
import '@lottiefiles/lottie-player';
import { BECKN_HOST_URL } from '../../config';
import { useAuth } from '../../hooks/useAuth';

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5
  },

  title: {
    margin: '10px 0'
  },

  paper: {
    cursor: 'pointer'
  },

  animation: {
    width: '80%',
    maxWidth: '800px',
    height: '400px'
  },

  link: {
    ...theme.fn.focusStyles(),
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    width: '100%',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  }
}));

export function Homepage() {
  const { classes } = useStyles();
  const {user} = useAuth();

  return (
    <div className={classes.root}>

      <Title className={classes.title} order={4}>
        Welcome,
        {' '}
        {user.role}
        {' @ '}
        {window.location.hostname.split(BECKN_HOST_URL)[0]}
        !
      </Title>

      <p>
        E-Scholar is a web application that allows you to create and manage scholarships.
      </p>

      <Center>
        <div className={classes.animation}>
          <lottie-player
            autoplay
            loop
            mode="normal"
            src="https://assets3.lottiefiles.com/packages/lf20_wncqbx3a.json"
          />
        </div>
      </Center>
    </div>
  );
}

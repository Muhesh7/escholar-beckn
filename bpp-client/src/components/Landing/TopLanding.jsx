import React from 'react';
import {
  createStyles,
  Container,
  Title,
  Button,
  Group,
  Text
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0
    }
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28
    }
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1
    }
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none'
    }
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: '4px 12px'
  },

  dots: {
    position: 'absolute',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],

    '@media (max-width: 755px)': {
      display: 'none'
    }
  }
}));


export function TopLanding() {
  const navigate = useNavigate();
  const { classes } = useStyles();

  const { login } = useAuth();
  return (
    <div>
      <Container my={50}>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              A
              {' '}
              <span className={classes.highlight}>modern</span>
              {' '}
              solution
              {' '}
              <br />
              {' '}
              for your scholarships
            </Title>
            <Text color="dimmed" mt="md">
              E-Scholar is a certificate provider that allows you to create and manage your own scholarships.
            </Text>
            <Group mt={30}>
              <Button radius="xl" size="md" className={classes.control} onClick={() => {
                if (window.location.hostname === 'portal.beckn.muhesh.studio') {
                  navigate('/create')
                } else {
                  login();
                }
              }}>
                {window.location.hostname === 'portal.beckn.muhesh.studio' ?
                  'Create a Scholarship Provider Account'
                  : 'Dashboard'
                }
              </Button>
            </Group>
          </div>
          <div className={classes.image}>
            <lottie-player
              autoplay
              loop
              mode="normal"
              src="https://assets10.lottiefiles.com/packages/lf20_gmspxrnd.json"

            />
          </div>
        </div>
      </Container>
    </div>
  );
}

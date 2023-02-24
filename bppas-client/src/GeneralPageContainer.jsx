import React, { useState } from 'react';
import {
  AppShell,
  useMantineTheme, ScrollArea
} from '@mantine/core';
import PropTypes from 'prop-types';
import { HeaderNav } from './components/Header';

export function GeneralPageContainer({ child }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1]
        }
      }}
      navbarOffsetBreakpoint="xs"
      header={
        <HeaderNav opened={opened} setOpened={setOpened} />
      }
    >
      <ScrollArea style={{ height: window.innerHeight - 120 }}>
        {child}
      </ScrollArea>
    </AppShell>
  );
}

GeneralPageContainer.propTypes = {
  child: PropTypes.element.isRequired
};
import React from 'react';
import { ThemeProvider } from "./ThemeProvider";
import { GeneralPageContainer } from './GeneralPageContainer';
import { FormPart } from './components/FormPart';
import { NotificationsProvider } from '@mantine/notifications';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <GeneralPageContainer child={
          <FormPart/>
        }/>
      </NotificationsProvider>
    </ThemeProvider>
  );
}

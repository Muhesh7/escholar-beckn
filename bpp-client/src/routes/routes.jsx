import React from 'react';

import { GeneralPageContainer } from '../containers/GeneralPageContainer';
import { AuthPageContainer } from '../containers/AuthPageContainer';
import { LandingPageContainer } from '../containers/LandingPageContainer';
import { CreatePageContainer } from '../containers/CreatePageContainer';

import { Homepage } from '../components/Home';
// import { Search } from '../components/bap-search';

export const publicRoutes = [
  {
    url: '/',
    component: <LandingPageContainer />,
    name: 'LandingPageContainer'
  },
  {
    url: '/create',
    component: <CreatePageContainer />,
    name: 'CreatePageContainer'
  },
  {
    url: '/home',
    component: <GeneralPageContainer child={<Homepage />} />,
    name: 'HomePageContainer',
    label: 'home'
  }
];

export const privateRoutes = [
];
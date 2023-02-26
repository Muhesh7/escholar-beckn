import React from 'react';

import { GeneralPageContainer } from '../containers/GeneralPageContainer';
import { AuthPageContainer } from '../containers/AuthPageContainer';
import { LandingPageContainer } from '../containers/LandingPageContainer';
import { CreatePageContainer } from '../containers/CreatePageContainer';

import { Homepage } from '../components/Home';
import { Search } from '../components/bap-search';

export const publicRoutes = [
  {
    url: '/auth',
    component: <AuthPageContainer />,
    name: 'AuthPageContainer'
  },
  {
    url: '/',
    component: <LandingPageContainer />,
    name: 'LandingPageContainer'
  },
  {
    url: '/create',
    component: <CreatePageContainer />,
    name: 'CreatePageContainer'
  }
];

export const privateRoutes = [
  {
    url: '/home',
    component: <GeneralPageContainer child={<Homepage />} />,
    name: 'HomePageContainer',
    label: 'home'
  },
  {
    url: '/search',
    component: <GeneralPageContainer child={<Search />} />,
    name: 'SearchPageContainer',
    label: 'search'
  },
];
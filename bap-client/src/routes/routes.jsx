import React from 'react';

import { GeneralPageContainer } from '../containers/GeneralPageContainer';
import { AuthPageContainer } from '../containers/AuthPageContainer';
import { LandingPageContainer } from '../containers/LandingPageContainer';

import { Homepage } from '../components/Home';
import { Search } from '../components/bap-search';
import { FormViewer } from '../components/FormViewer';
import { ProcessWorkflow } from '../components/ProcessWorkflow';
import { DisplayForms } from '../components/DisplayForms';
import { VerifyPageContainer } from '../containers/VerifyPageContainer';

import {
  getApprovedDocsRequest,
  getRejectedDocsRequest,
  getProcessingDocsRequest
} from '../utils/requests';

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
    url: '/verify',
    component: <VerifyPageContainer />,
    name: 'VerifyPageContainer'
  },
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
  {
    url: '/form-view',
    component: <GeneralPageContainer child={<FormViewer />} />,
    name: 'FormViewPageContainer',
    label: 'form-view'
  },
  {
    url: '/viewCertificate/:docid',
    component: <GeneralPageContainer child={<ProcessWorkflow viewOnly />} />,
    name: 'Process Workflow',
    label: 'viewCertificate'
  },
  {
    url: '/showapproved',
    component: <GeneralPageContainer
      child={(
        <DisplayForms
          formsRequest={getApprovedDocsRequest}
          name="Show Approved"
        />
      )}
    />,
    name: 'Show Approved',
    label: 'showApproved'
  },
  {
    url: '/showrejected',
    component: <GeneralPageContainer
      child={(
        <DisplayForms
          formsRequest={getRejectedDocsRequest}
          name="Show Rejected"
        />
      )}
    />,
    name: 'Show Rejected',
    label: 'showRejected'
  },
  {
    url: '/showpending',
    component: <GeneralPageContainer child={(
      <DisplayForms
        formsRequest={getProcessingDocsRequest}
        name="Show Pending"
      />
    )}
    />,
    name: 'Show Pending',
    label: 'showPending'
  },
];
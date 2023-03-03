import React from 'react';

import { GeneralPageContainer } from '../containers/GeneralPageContainer';
import { LandingPageContainer } from '../containers/LandingPageContainer';
import { CreatePageContainer } from '../containers/CreatePageContainer';

import { Homepage } from '../components/Home';
import { Formbuilder } from '../components/FormBuilder';
import { Workflow } from '../components/Workflow';
import { ListWorkFlow } from '../components/ListWorkflow';
import { ListForms } from '../components/ListForms';
import { DisplayForms } from '../components/DisplayForms';
import { ProcessWorkflow } from '../components/ProcessWorkflow';

import {
  getApproveDocRequest
} from '../utils/requests';

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
    url: '/formbuilder',
    component: <GeneralPageContainer child={<ListForms />} />,
    name: 'FormBuilderContainer',
    label: 'formBuilder'
  },
  {
    url: '/formbuilder/:formId',
    component: <GeneralPageContainer child={<Formbuilder />} />,
    name: 'FormBuilderContainer',
    label: 'formBuilder'
  },
  {
    url: '/formbuilder/create',
    component: <GeneralPageContainer child={<Formbuilder />} />,
    name: 'FormBuilderContainer',
    label: 'formBuilder'
  },
  {
    url: '/workflow',
    component: <GeneralPageContainer child={<ListWorkFlow />} />,
    name: 'ListWorkFlowContainer',
    label: 'workflow'
  },
  {
    url: '/workflow/:id',
    component: <GeneralPageContainer child={<Workflow />} />,
    name: 'WorkflowContainer',
    label: 'workflow'
  },
  {
    url: '/workflow/create',
    component: <GeneralPageContainer child={<Workflow />} />,
    name: 'WorkflowContainer',
    label: 'workflow'
  },
  {
    url: '/certificatesForApproval',
    component: <GeneralPageContainer child={(
      <DisplayForms
        formsRequest={getApproveDocRequest}
        name="Check Documents"
        approval
      />
    )}
    />,
    name: 'Process Workflow',
    label: 'documentsForApproval'
  },
  {
    url: '/certificatesForApproval/:docid',
    component: <GeneralPageContainer child={<ProcessWorkflow />} />,
    name: 'Process Workflow',
    label: 'documentsForApproval'
  },
];
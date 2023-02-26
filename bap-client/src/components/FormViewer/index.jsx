import { showNotification } from '@mantine/notifications';
import {
  Container, Title, Center, Modal, createStyles, useMantineTheme, TextInput, Button,
} from '@mantine/core';
import React, { useState, useEffect, useRef } from 'react';
import { FormGenerator } from 'react-forms-builder-135';
import { createPDF } from '../../utils/pdf';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

const styles = createStyles((theme) => ({
  root: {
    position: 'relative'
  },

  input: {
    height: 'auto',
    paddingTop: 18
  },

  label: {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1
  },

  btn: {
    borderRadius: '50%',
    width: 60,
    height: 60
  }
}));

export function FormViewer() {
  const [formData, setFormData] = useState({});
  const [formName, setFormName] = useState('');
  const [formResponseData, setFormResponseData] = useState('');
  const [formId, setFormId] = useState('');
  const [opened, setOpened] = useState(false);
  const { classes } = styles();
  const [fileName, setFileName] = useState('');
  const { user } = useAuth();

  const getForm = async () => {
    try {
      const response = location.state;
      console.log("responses",response.data.form);
      if (response.data && response.data.form) {
        setFormData(JSON.parse(response.data.form.data));
        setFormName(response.data.form.name);
        setFormId(response.data.form.id);
      } else {
        showNotification({
          color: 'red',
          title: 'No such certificate',
          message: response.data.message
        });
      }
    } catch (error) {
      showNotification({
        color: 'red',
        title: 'Registration failed',
        message: error.message
      });
    }
  };

  const ref = useRef();

  const theme = useMantineTheme();

  const location = useLocation();

  useEffect(() => {
    getForm();
  }, [location]);


  const handleDrawerClose = async () => {
    // await request(() => saveFormResponseRequest(formId, formResponseData));
    createPDF(ref.current, fileName, user.email, formId, formResponseData, location.state.data.context);
    setFileName('');
    setOpened(false);
  };

  return (
    <>
      <Container my={50}>
        <div
          ref={ref}
        >
          <Center mt={10}>
            <Title>{formName}</Title>
          </Center>
          <FormGenerator
            formData={formData}
            onSubmit={(data) => { setFormResponseData(data); setOpened(true); }}
            responseData={formResponseData}
          />
        </div>
      </Container>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.85}
        overlayBlur={3}
        size="lg"
        centered
      >
        <div>
          <TextInput
            label="File Name"
            placeholder="What is the name of the file you want to create?"
            classNames={classes}
            onChange={(event) => setFileName(event.target.value)}
            value={fileName}
          />

          <Center>
            <Button m={20} onClick={handleDrawerClose}>
              Download
            </Button>
          </Center>
        </div>
      </Modal>
    </>
  );
}
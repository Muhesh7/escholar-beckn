import React, { useRef, useState } from "react";
import {
  Text,
  Group,
  Button,
  createStyles,
  Container,
  Center,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { verifyRequest } from "../utils/requests";

import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons";
import { useTranslation } from "react-i18next";
import { useLoading } from "../hooks/useLoading";
import { HeaderNav } from '../components/Header';

export function VerifyPageContainer() {
  const useStyles = createStyles((theme) => ({
    wrapper: {
      position: "relative",
      margin: "auto",
      marginTop: "200px",
    },
  
    dropzone: {
      borderWidth: 1,
      paddingBottom: 50,
    },
  
    icon: {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[4],
    },
  
    control: {
      position: "absolute",
      width: 250,
      left: "calc(50% - 125px)",
      bottom: -20,
    },
  
    root: {
      position: "relative",
    },
  
    input: {
      height: "auto",
      paddingTop: 18,
    },
  
    label: {
      position: "absolute",
      pointerEvents: "none",
      fontSize: theme.fontSizes.xs,
      paddingLeft: theme.spacing.sm,
      paddingTop: theme.spacing.sm / 2,
      zIndex: 1,
    },
  
    btn: {
      borderRadius: "50%",
      width: 60,
      height: 60,
    },
  }));

  const { classes, theme } = useStyles();
  const openRef = useRef(null);
  const { t } = useTranslation();

  const { request } = useLoading();

  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    try {
        if (!file) {
            showNotification({
                color: "red",
                title: "Error while uploading file",
                message: "Please select a file",
            });
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const response = await request(() => verifyRequest(formData));
        if (response.status === 200) {
            if (response.data.valid === true && response.data.trusted === true) {
                showNotification({
                    color: "green",
                    title: "File is valid and trusted",
                    message: "File is valid and trusted",
                });
            } else if (response.data.valid === true && response.data.trusted === false) {
                showNotification({
                    color: "yellow",
                    title: "File is valid but not trusted",
                    message: "File is valid but not trusted",
                });
            } else if (response.data.valid === false && response.data.trusted === false) {
                showNotification({
                    color: "red",
                    title: "File is not valid and not trusted",
                    message: "File is not valid and not trusted",
                });
            }
        } else {
            showNotification({
                color: "red",
                title: "Error while uploading file",
                message: response.data.message,
            });
        }
    } catch (error) {
        showNotification({
            color: "red",
            title: "Error while uploading file",
            message:
            error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
  };

  return (
    <div>
      <HeaderNav opened={false} setOpened={() => {}} />
      <Container my={50}>
      <div className={classes.wrapper}>
        <Dropzone
          openRef={openRef}
          onDrop={(files) => {
            setFile(files[0]);
          }}
          className={classes.dropzone}
          radius="md"
          accept={[MIME_TYPES.pdf]}
          maxSize={30 * 1024 ** 2}
        >
          <div style={{ pointerEvents: "none" }}>
            <Group position="center">
              <Dropzone.Accept>
                <IconDownload
                  size={50}
                  color={theme.colors[theme.primaryColor][6]}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload
                  size={50}
                  color={
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[0]
                      : theme.black
                  }
                  stroke={1.5}
                />
              </Dropzone.Idle>
            </Group>

            <Text align="center" weight={700} size="lg" mt="xl">
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
              <Dropzone.Idle>{t("uploadFile")}</Dropzone.Idle>
            </Text>
            <Text align="center" size="sm" mt="xs" color="dimmed">
              Drag&apos;n&apos;drop file here to upload. We can accept only{" "}
              <i>.pdf</i> files that are less than 30mb in size.
            </Text>
          </div>
        </Dropzone>

        <Button
          className={classes.control}
          size="md"
          radius="xl"
          onClick={() => openRef.current()}
        >
          {t("uploadFile")}
        </Button>
      </div>
      <Center my={50}>
        <Button size="md" variant="outline" onClick={uploadFile}>
          {t("submit")}
        </Button>
      </Center>
    </Container>
    </div>
  );
}
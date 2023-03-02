import React from "react";
import {
  createStyles,
  TextInput,
  Container,
  Title,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { BECKN_HOST_URL } from "../../config";
import { registerRequest } from "../../utils/requests";
import { useLoading } from "../../hooks/useLoading";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    marginBottom: theme.spacing.md,
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
}));

export function FormPart() {
  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      department: "",
      organisation: "",
      city: "",
      email: "",
    },

    validate: {
      department: (value) => {
        if (!value) return "Department is required";
        // Check space in department name
        if (value.includes(" ")) return "Department name should not contain spaces";
      },
      organisation: (value) => {
        if (!value) return "Organisation is required";
        // Check space in organisation name
        if (value.includes(" ")) return "Organisation name should not contain spaces";
      },
      city: (value) => {
        if (!value) return "City is required";
      },
      email: (value) => {
        if (!value) return "Email is required";
        if (!value.includes("@")) return "Email is not valid";
      },
    },
  });

  const { request } = useLoading()

  const handleSubmit = async (values) => {
    try {
      const res = await request(() => registerRequest(values))

      if (res.status === 201) {
        showNotification({
          title: "Success",
          message: "Provider created successfully",
          color: "green",
        });
        window.location.href = "https://" + values.department + "-" + values.organisation + BECKN_HOST_URL;
      } else if (res.status === 409) {
        showNotification({
          title: "Error",
          message: "Provider already exists",
          color: "red",
        });
      }
    } catch (err) {
      if (err.response) {
        showNotification({
          title: "Error",
          message: err.response.data.message,
          color: "red",
        });
      } else {
        showNotification({
          title: "Error",
          message: "Provider creation failed",
          color: "red",
        });
      }
    }
  };

  return (
    <Container>
      <Title align="center" m={20}>
        Scholarship Provider Platform
      </Title>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          label="Department"
          placeholder="Name of the department"
          classNames={classes}
          withAsterisk
          {...form.getInputProps("department")}
        />
        <TextInput
          label="Organisation"
          placeholder="Name of the organisation"
          classNames={classes}
          withAsterisk
          {...form.getInputProps("organisation")}
        />

        <TextInput
          label="City"
          placeholder="Name of the city"
          classNames={classes}
          withAsterisk
          {...form.getInputProps("city")}
        />

        <TextInput
          label="Email"
          placeholder="Email address"
          classNames={classes}
          withAsterisk
          {...form.getInputProps("email")}
        />

        <Group position="center" mt="md">
          <Button type="submit" color={"teal"}>
            Create
          </Button>
        </Group>
      </form>
    </Container>
  );
}

import React from "react";
import {
    createStyles,
    TextInput,
    Container,
    Title,
    Group,
    Button,
    Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { REGISTER_URL } from "../../config";

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
            name: "",
            code: "",
            gender: "",
        },
    });

    const handleSubmit = (values) => {
        // axios
        //   .post(REGISTER_URL, values)
        //   .then((res) => {
        //     showNotification({
        //       title: "Success",
        //       message: "Provider created successfully",
        //       color: "green",
        //     });
        //   })
        //   .catch((err) => {
        //     showNotification({
        //       title: "Error",
        //       message: "Provider creation failed",
        //       color: "red",
        //     });
        //   });
    };

    return (
        <Container>
            <Title align="center" m={20}>
                Scholarship Provider Search
            </Title>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <TextInput
                    label="Name"
                    placeholder="Name of the scholarship provider"
                    classNames={classes}
                    {...form.getInputProps("name")}
                />
                <TextInput
                    label="Code"
                    placeholder="Code of the scholarship provider"
                    classNames={classes}
                    {...form.getInputProps("code")}
                />

                <Select
                    label="Gender"
                    data={[
                        "Male",
                        "Female",
                        "Other"
                    ]}
                    placeholder="Gender of the scholarship getter"
                    classNames={classes}
                />


                <Group position="center" mt="md">
                    <Button type="submit" color={"teal"}>
                        Search
                    </Button>
                </Group>
            </form>
        </Container>
    );
}

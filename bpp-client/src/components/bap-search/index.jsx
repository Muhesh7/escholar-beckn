import React, {useEffect} from "react";
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
import { useLoading } from "../../hooks/useLoading";
import { searchRequest } from "../../utils/requests";
import { showNotification } from "@mantine/notifications";
import { socket } from '../../socket';

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

export function Search() {
    const { classes } = useStyles();

    const form = useForm({
        initialValues: {
            name: "",
            code: "",
            gender: "",
        },
    });

    useEffect(() => {
        socket.on('connect', () => {
          console.log('connected to server');
        });
        socket.on('disconnect', () => {
          console.log('disconnected from server');
        });
        socket.on('onSearch', (data) => {
          console.log(data);
        });
    
        return () => {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('custom event');
        };
      }, []);

    const { request } = useLoading();

    const handleSubmit = async (values) => {
        try {
            const response = await request(()=>searchRequest(values));
            console.log(response);
            if (response.status === 200) {
                showNotification({
                    type: "success",
                    title: "Search successful",
                    message: response.data,

                });
            } else {
                showNotification({
                    color: "red",
                    title: "Search failed",
                    message: response.data
                });
            }
        } catch (error) {
            console.log(error);
            showNotification({
                color: "red",
                title: "Search failed",
                
            });
        }

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
                    {...form.getInputProps("gender")}
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

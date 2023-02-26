import React, { useEffect, useState } from "react";
import {
    createStyles,
    TextInput,
    Container,
    Title,
    Group,
    Button,
    Select,
    Text,
    Accordion,
    Badge,
    Card,
    Box
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLoading } from "../../hooks/useLoading";
import { searchRequest, selectRequest} from "../../utils/requests";
import { showNotification } from "@mantine/notifications";
import { socket } from '../../socket';
import { IconSearch } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
    root: {
        position: "relative",
        marginBottom: theme.spacing.md,
    },

    input: {
        height: "auto",
    },

    label: {
        position: "absolute",
        pointerEvents: "none",
        fontSize: theme.fontSizes.xs,
        paddingLeft: theme.spacing.sm,
        paddingTop: theme.spacing.sm / 2,
        zIndex: 1,
    },
    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: theme.radius.md,
        height: 50,
        width: '100%',
        transition: 'box-shadow 150ms ease, transform 100ms ease',
        boxShadow: theme.shadows.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
        '&:hover': {
            boxShadow: `${theme.shadows.xl} !important`,
            transform: 'scale(1.05)'
        }
    }
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

    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected to server');
        });
        socket.on('disconnect', () => {
            console.log('disconnected from server');
        });
        socket.on('onSearch', (data) => {
            console.log(data);
            setResults((results) => [...results, data.response]);
        });

        socket.on('onSelect', (data) => {
            console.log(data);
            navigate('/form-view', {state: data});
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
            setResults([]);
            const response = await request(() => searchRequest(values));
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

    const selectionRequest = async (id, context) => {
        try {
            console.log(context);
            const response = await request(() => selectRequest({item_id:id, ...context}));
            console.log(response);
            if (response.status === 200) {
                showNotification({
                    type: "success",
                    title: "Selection successful",
                    message: response.data,

                });
            } else {
                showNotification({
                    color: "red",
                    title: "Selection failed",
                    message: response.data
                });
            }
        } catch (error) {
            console.log(error);
            showNotification({
                color: "red",
                title: "Selection failed",

            });
        }
    };


    return (
        <Container>
            <Title align="center" m={20} mb={40}>
                Scholarship Provider Search
            </Title>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                }}>
                    <TextInput
                        sx={{ flex: 3, mr: 20 }}
                        // label="Name"
                        placeholder="Search by scholarship"
                        classNames={classes}
                        {...form.getInputProps("name")}
                        icon={<IconSearch size={14} />}
                    />
                     <Select
                        sx={{ flex: 1, mr: 20 }}
                        placeholder="Course"
                        classNames={classes}
                        data={[
                            "UG",
                            "PG",
                            "SCHOOL"
                        ]}
                        {...form.getInputProps("code")}
                    />

                    <Select
                        sx={{ flex: 1, mr: 20 }}
                        // label="Gender"
                        data={[
                            "Male",
                            "Female",
                            "Other"
                        ]}
                        placeholder="Gender"
                        classNames={classes}
                        {...form.getInputProps("gender")}
                    />
   
                    <Button sx={{ 
                        display: 'flex',
                        marginTop: -15,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} type="submit" color={"teal"}>
                        Search
                    </Button>
                </Box>
            </form>
            <Accordion
             transitionDuration={500} my={35} mx={10}>
                {
                    results.map((item) => (
                        <Accordion.Item my={15} value={item.id} key={item.id}>
                            <Accordion.Control>{item.id}</Accordion.Control>
                            <Accordion.Panel>{item.items.map((it) => (
                                <Card m={10} shadow="sm" p="lg" radius="md" withBorder key={it.id}>
                                    <Group position="apart" mt="md" mb="xs">
                                        <Text weight={500}>{it.descriptor.name}</Text>
                                        <Badge color="pink" variant="light">
                                            For Scholarship
                                        </Badge>
                                    </Group>

                                    <Text size="sm" color="dimmed">
                                        {it.descriptor.long_desc}
                                    </Text>

                                    <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={()=>
                                        selectionRequest(it.id, item.context)
                                    }>
                                        Select the scholarship
                                    </Button>
                                </Card>
                            ))}</Accordion.Panel>
                        </Accordion.Item>
                    ))


                }
            </Accordion>

        </Container>
    );
}

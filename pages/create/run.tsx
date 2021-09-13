import { Button, Container, Form } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import React, { useEffect, useState } from "react";
import { collection, doc, addDoc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebaseClient";
import { useRouter } from "next/router";

export default function CreateTestCase() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitEnabled, setSubmitEnabled] = useState(false);

    const validate = (newTitle?: string) => {
        setSubmitEnabled(newTitle != '');
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitEnabled(false);

        const docRef = await addDoc(collection(db, 'runs'), {
            title,
            description,
            status: 'active'
        });

        setSubmitEnabled(true);

        router.push(`/runs/${docRef.id}`);

        console.log('added')
    }
    return (
        <>
            <NavBar />
            <Container style={{ padding: '10px' }}>
                <h1>Create Run</h1>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Run Title</Form.Label>
                        <Form.Control type="text" placeholder="e.g. v2.14.2+57 or 06/12/2020" value={title} onChange={(event) => { setTitle(event.target.value); validate(event.target.value); }} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" placeholder="" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} />
                    </Form.Group>


                    <Button variant="primary" type="submit" disabled={!submitEnabled}>
                        Add
                    </Button>

                </Form>
            </Container>
        </>
    )
}

export { };
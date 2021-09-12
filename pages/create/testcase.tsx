import { Button, Container, Form } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { Typeahead } from 'react-bootstrap-typeahead';
import React, { useEffect, useState } from "react";
import { collection, doc, addDoc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebaseClient";
import { useRouter } from "next/router";

export default function CreateTestCase() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [section, setSection] = useState('');
    const [newSection, setNewSection] = useState(false);
    const [description, setDescription] = useState('');
    const [submitEnabled, setSubmitEnabled] = useState(false);

    const [allSections, setAllSections] = useState(['']);

    useEffect(() => {
        getDocs(collection(db, 'sections')).then(snapshot => {
            setAllSections(snapshot.docs.map(doc => doc.data().name));
        });
    }, []);

    const validate = (newTitle?: string) => {
        setSubmitEnabled(newTitle != '');
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitEnabled(false);
        
        if (newSection) {
            await setDoc(doc(db, 'sections', section), {name: section});
        }

        const docRef = await addDoc(collection(db, 'testcases'), {
            title,
            description,
            section: section || ''
        });

        setSubmitEnabled(true);

        router.push(`/testcases/${docRef.id}`);

        console.log('added')
    }
    return (
        <>
            <NavBar />
            <Container style={{ padding: '10px' }}>
                <h1>Create Test Case</h1>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Test Case Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" value={title} onChange={(event) => { setTitle(event.target.value); validate(event.target.value); }} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="section">
                        <Form.Label>Section</Form.Label>
                        <Typeahead
                            allowNew
                            id="section-dropdown"
                            newSelectionPrefix="Add a new section: "
                            options={allSections}
                            placeholder="Select a section"
                            onChange={(selected: Array<{ label: string } | string>) => {
                                if (typeof selected[0] === 'object') {
                                    setSection(selected[0].label);
                                    setNewSection(true);
                                    return;
                                };
                                setSection(selected[0])
                            }}
                        />
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
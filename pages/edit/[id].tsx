import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useRouter } from 'next/router';
import { collection, doc, getDoc, getDocs, setDoc } from "@firebase/firestore";
import NavBar from "../../components/NavBar";
import { db } from "../../utils/firebaseClient";
import { TestCase } from "../../utils/interfaces/testcase";
import { Typeahead } from "react-bootstrap-typeahead";
import { updateDoc } from "firebase/firestore";

export default function EditTestCase() {
    const [loadingPrefill, setLoadingPrefill] = useState(true);

    const [title, setTitle] = useState('');
    const [section, setSection] = useState('');
    const [newSection, setNewSection] = useState(false);
    const [description, setDescription] = useState('');
    const [submitEnabled, setSubmitEnabled] = useState(true);

    const [allSections, setAllSections] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);

    const [initialSection, setIntitalSection] = useState('');


    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {console.log('new section is', section)}, [section]);

    useEffect(() => {
        if (router.query.id) {
            getDoc(doc(db, 'testcases', id as string)).then(docSnap => {
                if (docSnap.exists()) {
                    const { title, description, section } = docSnap.data();

                    setTitle(title);
                    setDescription(description);
                    setIntitalSection(section);
                    setLoadingPrefill(false);
                }

                getDocs(collection(db, 'sections')).then(snapshot => {
                    setAllSections(snapshot.docs.map(doc => doc.data().name));
                    setLoading(false);
                });
            });
        }
    }, [router.query]);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setSubmitEnabled(false);
        if (newSection) {
            await setDoc(doc(db, 'sections', section), { name: section });
        }

        await updateDoc(doc(db, 'testcases', id as string), {
            title: title,
            description: description,
            section: section
        });

        setSubmitEnabled(true);

        router.push(`/testcases/${id}`);
    };

    const validate = (newTitle?: string) => {
        setSubmitEnabled(newTitle != '');
    }

    return (
        <>
            <NavBar />
            <Container style={{ padding: '10px' }}>
                {!loading && <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Test Case Title</Form.Label>
                        <Form.Control disabled={loadingPrefill} type="text" placeholder="Enter title" value={title} onChange={(event) => { setTitle(event.target.value); validate(event.target.value); }} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control disabled={loadingPrefill} as="textarea" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="section">
                        <Form.Label>Section</Form.Label>
                        <Typeahead
                            disabled={loadingPrefill}
                            allowNew
                            id="section-dropdown"
                            newSelectionPrefix="Add a new section: "
                            options={allSections}
                            placeholder="Select a section"
                            defaultSelected={[initialSection]}
                            onChange={(selected: Array<{ label: string } | string>) => {
                                console.log('onchange called', selected);
                                if (selected.length > 0) {
                                    if (typeof selected[0] === 'object') {
                                        setSection(selected[0].label);

                                        setNewSection(true);
                                    } else {
                                        setSection(selected[0]);
                                        setNewSection(false);
                                        console.log('called setsection')
                                    }
                                } else {
                                    setNewSection(false);
                                    setSection('');
                                }
                                // if (selected[0]) {
                                //     if (typeof selected[0] === 'object') {
                                //         setSection(selected[0].label);
                                //         setNewSection(true);
                                //     } else {
                                //         console.log(selected[0])
                                //         setSection(selected[0]);
                                //         setNewSection(false);
                                //     }
                                // } else {
                                //     setSection('');
                                // }
                            }}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={!submitEnabled}>
                        Add
                    </Button>
                </Form>}
            </Container>
        </>
    )
}

export { };
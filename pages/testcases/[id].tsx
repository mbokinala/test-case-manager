import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { useRouter } from 'next/router';
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../utils/firebaseClient";

export default function CreateTestCase() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [section, setSection] = useState('');
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (router.query.id) {
            console.log(router.query)

            getDoc(doc(db, 'testcases', id as string)).then(docSnap => {
                if (docSnap.exists()) {
                    const { title, description, section } = docSnap.data();

                    setTitle(title);
                    setDescription(description);
                    setSection(section);
                }
            });
        }
    }, [router.query]);

    return (
        <>
            <NavBar />
            <Container style={{ padding: '10px' }}>
                <Row>
                    <Col><h1>{title}</h1></Col>
                    <Col><div className="float-end"><Button variant="secondary">Edit</Button> <Button variant="primary" onClick={() => router.push('/create/testcase')}>New Test Case</Button></div></Col>
                </Row>
                <p>{description}</p>
                <br /><br />
                {section ? <span><strong>Section: </strong><a href={`/sections/${section}`}>{section}</a></span> : <></>}
            </Container>
        </>
    )
}

export { };
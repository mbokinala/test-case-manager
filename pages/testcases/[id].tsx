import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { useRouter } from 'next/router';
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../utils/firebaseClient";
import { TestCase } from "../../utils/interfaces/testcase";
import { EditButton } from "../../components/EditButton";
import Link from "next/link";

export default function TestCaseDetails() {
    const [testcase, setTestcase] = useState<TestCase>();
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (router.query.id) {
            console.log(router.query)

            getDoc(doc(db, 'testcases', id as string)).then(docSnap => {
                if (docSnap.exists()) {
                    const { title, description, section } = docSnap.data();

                    setTestcase({ id: docSnap.id, title, description, section });
                }
            });
        }
    }, [router.query]);

    return (
        <>
            <NavBar />
            <Container style={{ padding: '10px' }}>
                {testcase ?
                    <>
                        <Row>
                            <Col><h1>{testcase.title}</h1></Col>
                            <Col><div className="float-end"><EditButton id={testcase.id} /> <Link href='/create/testcase'><Button variant="primary">New Test Case</Button></Link></div></Col>
                        </Row>
                        <p>{testcase.description}</p>
                        <br /><br />
                        <span><strong>Section: </strong><Link href={`/section/${testcase.section}`}><a>{testcase.section}</a></Link></span>
                    </> : <></>
                }
            </Container>
        </>
    )
}

export { };
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { useRouter } from 'next/router';
import { doc, getDoc, getDocs } from "@firebase/firestore";
import { db } from "../../utils/firebaseClient";
import { TestCase } from "../../utils/interfaces/testcase";
import { collection } from "firebase/firestore";
import { TestCaseCard } from "../../components/TestCaseCard";

export default function CreateTestCase() {
    const [testCases, setTestCases] = useState<TestCase[]>([]);

    useEffect(() => {
        getDocs((collection(db, 'testcases'))).then(querySnap => {
            setTestCases(querySnap.docs.map(doc => ({ id: doc.id, title: doc.data().title, description: doc.data().description, section: doc.data().section })))
        });
    }, []);
    return (
        <>
            <NavBar />
            <Container style={{ padding: '10px', width: '70%' }}>
                {/* {testCases.map(testCase => <TestCaseCard testcase={testCase} />)}
                 */}
                <Table striped bordered>
                    <thead>
                        <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testCases.map(testCase => (<tr>
                            <td>x</td>
                            <td><a href={`/testcases/${testCase.id}`}>{testCase.title}</a></td>
                            <td><Button variant="secondary">Edit</Button></td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export { };
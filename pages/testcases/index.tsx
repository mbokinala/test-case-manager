import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, Row, Table } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { useRouter } from 'next/router';
import { doc, getDoc, getDocs } from "@firebase/firestore";
import { db } from "../../utils/firebaseClient";
import { TestCase } from "../../utils/interfaces/testcase";
import { collection } from "firebase/firestore";
import { TestCaseCard } from "../../components/TestCaseCard";
import { EditButton } from "../../components/EditButton";
import Link from "next/link";

export default function AllTestCases() {
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [selectedTestcases, setSelectedTestcases] = useState<string[]>([]);

    useEffect(() => {
        getDocs((collection(db, 'testcases'))).then(querySnap => {
            setTestCases(querySnap.docs.map(doc => ({ id: doc.id, title: doc.data().title, description: doc.data().description, section: doc.data().section })))
        });
    }, []);
    return (
        <>
            <NavBar />
            {/* <Button variant="primary" onClick={() => {alert(selectedTestcases)}}>assa</Button> */}
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
                        {testCases.sort((a, b) => a.title.localeCompare(b.title)).map(testCase => (<tr key={testCase.id}>
                            <td><FormCheck type='checkbox' value={testCase.id} onChange={(event) => {
                                if (event.target.checked) setSelectedTestcases([...selectedTestcases, testCase.id])
                                else setSelectedTestcases(selectedTestcases.filter(id => testCase.id != id));
                            }}></FormCheck></td>
                            <td><Link href={`/testcases/${testCase.id}`}><a>{testCase.title}</a></Link></td>
                            <td><EditButton id={testCase.id} /></td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export { };
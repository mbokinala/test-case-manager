import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, Row, Table } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { useRouter } from 'next/router';
import { doc, getDoc, getDocs } from "@firebase/firestore";
import { db } from "../../utils/firebaseClient";
import { collection } from "firebase/firestore";
import { TestCaseCard } from "../../components/TestCaseCard";
import { EditButton } from "../../components/EditButton";
import Link from "next/link";
import { Run } from "../../utils/interfaces/run";

export default function AllRuns() {
    const [runs, setRuns] = useState<Run[]>([]);
    const [selectedTestcases, setSelectedTestcases] = useState<string[]>([]);

    useEffect(() => {
        getDocs((collection(db, 'runs'))).then(querySnap => {
            setRuns(querySnap.docs.map(doc => ({ id: doc.id, title: doc.data().title, description: doc.data().description, status: doc.data().status, completedCases: [], uncompletedCases: []})))
        });
    }, []);
    return (
        <>
            <NavBar />
            {/* <Button variant="primary" onClick={() => {alert(selectedTestcases)}}>assa</Button> */}
            <Container style={{ padding: '10px', width: '70%' }}>
                <h1>All Runs</h1>
                {/* {testCases.map(testCase => <TestCaseCard testcase={testCase} />)}
                 */}
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {runs.sort((a, b) => a.title.localeCompare(b.title)).map(run => (<tr key={run.id}>
                            <td><FormCheck type='checkbox' value={run.id} onChange={(event) => {
                                if (event.target.checked) setSelectedTestcases([...selectedTestcases, run.id])
                                else setSelectedTestcases(selectedTestcases.filter(id => run.id != id));
                            }}></FormCheck></td>
                            <td><Link href={`/runs/${run.id}`}><a>{run.title}</a></Link></td>
                            <td>{run.status}</td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export { };
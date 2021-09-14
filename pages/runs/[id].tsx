import React, { useEffect, useState } from "react";
import { Col, Container, Form, FormCheck, Row, Table } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { useRouter } from 'next/router';
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { db } from "../../utils/firebaseClient";
import Link from "next/link";
import { Run } from "../../utils/interfaces/run";
import { RunCase } from "../../utils/interfaces/runcase";
import { getTestCase } from "../../utils/db";
import { TestCase } from "../../utils/interfaces/testcase";

export default function TestCaseDetails() {
    const [run, setRun] = useState<Run>();
    const [uncompletedCases, setUncompletedCases] = useState<TestCase[]>();
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            if (router.query.id) {
                console.log(router.query)

                let docSnap = await getDoc(doc(db, 'runs', id as string));

                if (docSnap.exists()) {
                    const { title, description, status } = docSnap.data();

                    let completedCasesQuerySnapshot = await getDocs(collection(db, 'runs', id as string, 'completedCases'));
                    let completedCases: RunCase[];

                    if (completedCasesQuerySnapshot.empty) completedCases = [];
                    else {
                        let requests: Promise<RunCase>[] = [];
                        requests = completedCasesQuerySnapshot.docs.map<Promise<RunCase>>(doc => (new Promise((resolve, reject) => {
                            getTestCase(doc.data().testcaseId).then(testcase => resolve({ id: doc.id, testcase, status: doc.data().status }));
                        })));

                        completedCases = await Promise.all(requests);
                    }

                    let allCasesQuerySnap = await getDocs((collection(db, 'testcases')));
                    let allTestcases: TestCase[] = allCasesQuerySnap.docs.map<TestCase>(doc => ({ id: doc.id, title: doc.data().title, description: doc.data().description, section: doc.data().section }));

                    // uncompleted cases are the cases which aren't part of completed cases
                    setUncompletedCases(allTestcases.filter(testCase => (completedCases.findIndex(runcase => runcase.testcase.id == testCase.id) == -1)));

                    setRun({ id: docSnap.id, title, description, status, completedCases, uncompletedCases: [] });
                }
            }
        }

        fetchData();
    }, [router.query]);


    useEffect(() => {
        console.log(run);
    }, [run]);

    const statusStyle = (status: string) => {
        let backgroundColor = '';
        let color = '';

        switch (status) {
            case 'pass': {
                backgroundColor = '#90ee90';
                color = '#006400';
                break;
            }

            case 'fail': {
                backgroundColor = '#FF7F7F';
                color = '#8B0000';
                break;
            }

            case 'n/a': {
                backgroundColor = '#D3D3D3';
                color = '#898989';
                break;
            }
        }

        return { backgroundColor, color };
    }

    const handleStatusChange = async (testcaseId: string, newStatus: string) => {
        if(!newStatus) return;

        let newRun = Object.assign({}, run);

        let completedCaseIndex = run!.completedCases.findIndex(runcase => runcase.testcase.id == testcaseId);
        if (completedCaseIndex != -1) {
            // the changed test case is in completedCases
            let newCompletedCases = run!.completedCases.slice();

            newCompletedCases[completedCaseIndex].status = newStatus;

            newRun.completedCases = newCompletedCases;

            setRun(newRun);

            updateDoc(doc(db, 'runs', run!.id, 'completedCases', run!.completedCases[completedCaseIndex].id), {
                status: newStatus
            });
        } else {
            // TODO: for uncompleted tasks, move them to completed and update status
            let allTestCasesIndex = uncompletedCases!.findIndex(testcase => testcase.id == testcaseId);
            let newCompletedCases = run!.completedCases.slice();
            let newUncompletedCases = uncompletedCases!.slice();

            let docRef = await addDoc(collection(db, 'runs', run!.id, 'completedCases'), {
                status: newStatus,
                testcaseId
            })

            newCompletedCases.push({ id: docRef.id, testcase: (uncompletedCases!)[allTestCasesIndex], status: newStatus });
            newRun.completedCases = newCompletedCases;

            newUncompletedCases = uncompletedCases!.filter(testCase => (newCompletedCases.findIndex(runcase => runcase.testcase.id == testCase.id) == -1));
            setUncompletedCases(newUncompletedCases);


            setRun(newRun);
        }
    }

    return (
        <>
            <NavBar />
            <Container style={{ padding: '10px' }}>
                {run ?
                    <>
                        <Row>
                            <Col><h1>Run {run.title}</h1></Col>
                            <Col><div className="float-end"><p>Completion: {run.completedCases.length} / {uncompletedCases?.length || 0 + run.completedCases.length} ({Math.round((run.completedCases.length / (uncompletedCases?.length || 0 + run.completedCases.length) * 100))}%)</p></div></Col>
                        </Row>
                        <p>{run.description}</p>
                        <br /><br />
                        {/* <span><strong>Section: </strong><Link href={`/section/${testcase.section}`}><a>{testcase.section}</a></Link></span> */}

                        <h2>Completed Test Cases</h2>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Title</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {run.completedCases.sort((a, b) => a.testcase.title.localeCompare(b.testcase.title)).map(runCase => (<tr key={runCase.testcase.id}>
                                    <td><FormCheck type='checkbox' value={runCase.testcase.id}></FormCheck></td>
                                    <td><Link href={`/testcases/${runCase.testcase.id}`}><a>{runCase.testcase.title}</a></Link></td>
                                    <td>
                                        <Form.Control as="select" value={runCase.status} style={statusStyle(runCase.status)} onChange={(event) => handleStatusChange(runCase.testcase.id, event.target.value)}>
                                            <option value="fail">Fail</option>
                                            <option value="pass">Pass</option>
                                            <option value="n/a">N/A</option>
                                            <option hidden>Untested</option> {/* for alignment */}
                                        </Form.Control>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </Table>
                        <h2>Uncompleted Test Cases</h2>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Title</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uncompletedCases!.sort((a, b) => a.title.localeCompare(b.title)).map(testcase => (<tr key={testcase.id}>
                                    <td><FormCheck type='checkbox' value={testcase.id}></FormCheck></td>
                                    <td><Link href={`/testcases/${testcase.id}`}><a>{testcase.title}</a></Link></td>
                                    <td>
                                        <Form.Control as="select" onChange={(event) => handleStatusChange(testcase.id, event.target.value)}>
                                            <option>Untested</option>

                                            <option value="fail">Fail</option>
                                            <option value="pass">Pass</option>
                                            <option value="n/a">N/A</option>
                                        </Form.Control>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </Table>
                    </> : <></>
                }
            </Container>
        </>
    )
}

export { };
import React from "react";
import { Card, Button } from "react-bootstrap";
import { TestCase } from "../utils/interfaces/testcase";
import { EditButton } from "./EditButton";

interface TestCaseCardProps {
    testcase: TestCase
}

export const TestCaseCard: React.FC<TestCaseCardProps> = ({testcase}: TestCaseCardProps) => {
    return (
        <Card style={{margin: '5px'}}>
            <Card.Body>
                <Card.Title>{testcase.title}</Card.Title>
                <Card.Text>{testcase.description}</Card.Text>
                <EditButton id={testcase.id} />
            </Card.Body>
        </Card>
    )
}
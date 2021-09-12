import { TestCase } from "./testcase";

export interface RunCase {
    id: string,
    testcase: TestCase,
    status: string
}
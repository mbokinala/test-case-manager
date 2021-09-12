import { RunCase } from "./runcase";

export interface Run {
    id: string,
    title: string,
    description: string,
    status: string,
    completedCases: RunCase[],
    uncompletedCases: RunCase[]
}
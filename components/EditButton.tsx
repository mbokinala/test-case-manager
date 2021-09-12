import React from "react";
import { Button } from "react-bootstrap";

export function EditButton({id}: {id: string}) {
    return <Button variant="secondary" href={`/edit/${id}`}>Edit</Button>
}
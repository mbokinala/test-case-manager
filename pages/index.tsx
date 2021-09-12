import { NextPage } from "next"
import Link from 'next/link'
import React from "react"
import NavBar from "../components/NavBar"

const Home: NextPage = () => {
  return (
    <>
      <NavBar />
      <Link href="/create/testcase">
        <a>Create a testcase</a>
      </Link>
      <br></br>
      <Link href="/testcases">
        <a>View all testcases</a>
      </Link>
    </>
  )
}

export default Home

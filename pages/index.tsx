import { NextPage } from "next"
import React from "react"
import NavBar from "../components/NavBar"

const Home: NextPage = () => {
  return (
    <>
      <NavBar />
      <a href="/create/testcase">Create a testcase</a>
      <a href="/testcases">View all testcases</a>
    </>
  )
}

export default Home

import { NextPage } from "next"
import Link from 'next/link'
import React, { useState } from "react"
import NavBar from "../components/NavBar"

import { signIn, signOut, useSession } from "next-auth/client"

const Home: NextPage = () => {
  return (
    <>
      <NavBar />
      <Link href="/create/testcase">
        <a style={{ margin: '20px' }}>Create a testcase</a>
      </Link>
      <br></br>
      <Link href="/testcases">
        <a style={{ margin: '20px' }}>View all testcases</a>
      </Link>
    </>
  )
}

export default Home

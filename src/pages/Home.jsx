import React from 'react'
import UserResults from '../component/users/UserResults'
import UserSearch from '../component/users/UserSearch'
function Home() {
  return (
    <div>
      <UserSearch/>
      <UserResults/>
    </div>
  )
}

export default Home

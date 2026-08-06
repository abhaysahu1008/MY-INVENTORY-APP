import Link from 'next/link'
import React from 'react'

const OwnerPage = () => {
  return (
    <div>
      <div>
        <Link href={"/add-company"}>
          <button>Add company</button>
        </Link>

      </div>
    </div>
  )
}

export default OwnerPage

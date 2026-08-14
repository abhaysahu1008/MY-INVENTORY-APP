import { useSearchParams } from 'next/navigation';
import React from 'react'

const AddInventory = () => {


  return (
    <div>
      <form>
        <input type="text" placeholder='item name' />
        <input type="number" placeholder='quantity' />
        <select name="" id="">
          <option value=""></option>
          <option value=""></option>
          <option value=""></option>
        </select>
      </form>
    </div>
  )
}

export default AddInventory

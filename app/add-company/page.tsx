import React from 'react'

const AddCompanyForm = () => {

  async function handleSubmit(formData: FormData) {
    const result = await createCompany(formData);

  }

  return (
    <div>
      <form action={handleSubmit}>
        <input type="text" />
        <input type="text" />
        <input type="text" />
      </form>
    </div>
  )
}

export default AddCompanyForm

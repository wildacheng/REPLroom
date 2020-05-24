import axios from 'axios'

export const sendEmail = (data) => {
  return async () => {
    try {
      await axios.post('/api/sendEmail', {
        firstName: data.firstName,
        email: data.email,
        url: data.url,
      })
    } catch (error) {
      console.error(error)
    }
  }
}

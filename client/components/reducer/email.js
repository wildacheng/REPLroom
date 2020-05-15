import axios from 'axios'

export const sendEmail = (data) => {
  return async () => {
    try {
      await axios.post('/api/sendEmail', {
        firstName: data.firstName,
        email: data.email,
        url: data.url,
        roomId: data.roomId,
      })
    } catch (error) {
      console.error(error)
    }
  }
}

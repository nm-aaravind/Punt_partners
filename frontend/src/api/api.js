import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const convertAudio = async (data) => {
    try {
        const formData = new FormData();
        formData.append('audio', data);
        const response = await axios.post(`${API_BASE_URL}/api/textTranslate`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        })
        if (response.status !== 200) {
            throw Error(response.data.message)
        }
        console.log(response, "Got this as response")
    } catch (error) {
        console.log(error.response)
        throw Error(error.response.data.message)
    }
}
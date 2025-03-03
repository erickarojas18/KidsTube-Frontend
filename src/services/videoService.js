import axios from 'axios';

const API_URL = 'http://localhost:5000/api/videos';

export const getVideos = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createVideo = async (video) => {
    const response = await axios.post(API_URL, video);
    return response.data;
};

export const updateVideo = async (id, video) => {
    const response = await axios.put(`${API_URL}/${id}`, video);
    return response.data;
};

export const deleteVideo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

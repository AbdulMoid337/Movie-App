import axios from "axios";

const instance = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YmRkMzA3NTVhZTM2NDg1MjEzOTFmOThjZWYxNjdiZSIsIm5iZiI6MTcyNzg2NTUyOS4xNjYzMjgsInN1YiI6IjY2ZmMzOTMyZDgwNjQxNjViZGYxYTcyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DSdZ5a53nBcYaAEJfmoVU5zHxfWXUznpNAt7zhTHW5k'
    }
});

export default instance;

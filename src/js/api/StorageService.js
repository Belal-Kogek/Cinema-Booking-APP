export default class StorageService {
    constructor(){
    }
    saveSeats(movieTitle, seatsArray){
        localStorage.setItem(movieTitle, JSON.stringify(seatsArray));
    }
    getSeats(movieTitle){
        const savedSeats = localStorage.getItem(movieTitle);
        return savedSeats ? JSON.parse(savedSeats) : [];
    }
}
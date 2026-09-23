 export default class Movie {
    constructor (apiData) {
        this.id = apiData.id ;
        this.title =apiData.title;
        this.poster =`https://image.tmdb.org/t/p/w500${apiData.poster_path}`;
        this.rating =apiData.vote_average.toFixed(1);
        this.overview =apiData.overview
        this.price = 150;
    }

}
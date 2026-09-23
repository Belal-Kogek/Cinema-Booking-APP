export default class MovieGrid {
    constructor(containerId, onMovieClick) {
        this.container = document.getElementById(containerId);
        this.onMovieClick = onMovieClick;
    }
    render(movies) {
        this.container.innerHTML = '';

        movies.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add('movie-card'); 
            card.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" >
                <h3>${movie.title}</h3>
                <div class="details">
                    <span><i class="fa-solid fa-star" style="color: rgb(255, 212, 59);"></i>
                    ${movie.rating}</span>
                    <span><i class="fa-regular fa-money-bill-1" style="color: rgb(99, 230, 190);"></i>
                    ${movie.price} EGP</span>
                   
                </div>
            `;
            card.addEventListener('click',(e) =>{
                this.onMovieClick(movie);
            } )
            this.container.appendChild(card);
        });
    }
}
import TMDBService from "./api/TMDBService.js";
import Movie from "./models/Movie.js";
import MovieGrid from "./components/MovieGrid.js";
import SeatMap from "./components/SeatMap.js";
import StorageService from "./api/StorageService.js";

/* ================= Mobile Menu Toggle ================= */
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinksContainer = document.getElementById('nav-links');

mobileMenuBtn.addEventListener('click', () => {
    // السطر ده بيبدل الكلاس: لو موجود يشيله، ولو مش موجود يحطه (عشان يفتح ويقفل)
    navLinksContainer.classList.toggle('active-menu');
});

// (اختياري) عشان لما تدوس على أي لينك في الموبايل، القائمة تقفل لوحدها
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinksContainer.classList.remove('active-menu');
    });
});
/*=============================*/ 
const checkbox = document.getElementById("checkbox")
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("light-mode")
})
/* ========================================================
   1. الإعدادات والمتغيرات العامة
   ======================================================== */
const cinemaLayout = [
    "RRRRRRRR",      
    "RRRRRRRR",      
    "_VVVVVV_",      
    "L_L_L_L"       
];
let currentMovieTitle = ''; 

/* ========================================================
   2. جلب عناصر الـ DOM
   ======================================================== */
const ticketsCountEl = document.getElementById('tickets-count');
const totalPriceEl = document.getElementById('total-price');
const gridSection = document.getElementById('movie-grid-hidden');
const bookingSection = document.getElementById('booking-section');
const bookingTitle = document.getElementById('booking-title');
const backBtn = document.getElementById('back-btn');
const backBtnn = document.getElementById('back-btnn');
const trailerContainer = document.getElementById('trailer-container');
const heroSection =document.getElementsByClassName('hero-section')
const overViem = document.getElementById('movie-overview');
const movieRating =document.getElementById('movie-rating');
const checkoutBtn = document.getElementById('checkout-btn');
/* ========================================================
   3.اServices
 
   ======================================================== */
const apiService = new TMDBService();
const storage_service = new StorageService(); // نزلناها هنا من آخر الملف

/* ========================================================
   4. Components
   ======================================================== */
const seatmap = new SeatMap ('seat-map-container', (selectedSeats) => {
    let finalPrice = 0; 
    selectedSeats.forEach(seat => {
        if (seat.dataset.type === 'regular'){
            finalPrice += 100;
        }
        else if (seat.dataset.type === 'vip'){
            finalPrice += 200;
        }
        else {
            finalPrice += 300;
        }
     });
     
     ticketsCountEl.innerText = selectedSeats.size;
     totalPriceEl.innerText = finalPrice;

     
});

const movieGrid = new MovieGrid('movie-grid', async (selectedMovie) => { 
    currentMovieTitle = selectedMovie.title; 
    bookingTitle.innerText = `${selectedMovie.title}`;
    overViem.innerText = `${selectedMovie.overview}`;
    movieRating.innerText =`${selectedMovie.rating}`
    gridSection.classList.add('hidden');
    bookingSection.classList.remove('hidden');
    
    const savedSeats = storage_service.getSeats(currentMovieTitle);
    seatmap.render(cinemaLayout, savedSeats);
    // ================= دمج فيديو اليوتيوب =================
    // بنفضي الحاوية الأول عشان لو كان فيها فيديو لفيلم قديم
    trailerContainer.innerHTML = '<p style="color: white; text-align: center;">جاري تحميل الإعلان الترويجي... 🎬</p>';
    
    const trailerKey = await apiService.fetchMovieTrailer(selectedMovie.id);
    
    if (trailerKey) {
        // لو لقينا مفتاح، بنبني الـ iframe بتاع يوتيوب
        trailerContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${trailerKey}?autoplay=0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    } else {
        // لو مفيش تريلر رسمي للفيلم ده
        trailerContainer.innerHTML = '<p style="color: white; text-align: center;">لا يتوفر إعلان ترويجي لهذا الفيلم حالياً 🎬</p>';
    }
    // ============================================================
   
});

/* ========================================================
   5. Event Listeners
   ======================================================== */
backBtn.addEventListener('click', () => {
    bookingSection.classList.add('hidden');
    gridSection.classList.remove('hidden');
    trailerContainer.innerHTML = '';
});
backBtnn.addEventListener('click', () => {
    bookingSection.classList.add('hidden');
    gridSection.classList.remove('hidden');
    trailerContainer.innerHTML = '';
});

checkoutBtn.addEventListener('click', function() {
    const selectedSeats = document.querySelectorAll('.seat.selected');

    if (selectedSeats.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sorry !',
            text: 'Please select at least one ticket! ',
         
        });
        return;
    }

    selectedSeats.forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('booked');
    });

    const allSeats = document.querySelectorAll('.seat');
    const bookedSeats = document.querySelectorAll('.seat.booked');
    const seatsIndexes = [...bookedSeats].map(seat => [...allSeats].indexOf(seat));
    storage_service.saveSeats(currentMovieTitle, seatsIndexes);

    document.getElementById('tickets-count').textContent = '0';
    document.getElementById('total-price').textContent = '0';

    Swal.fire({
        icon: 'success',
        title: 'Enjoy !',
        text: 'Booking Successful! Enjoy your movie ',
    });
});
/* ========================================================
   6. Initialization
   ======================================================== */
const rawMovies = await apiService.fetchPopularMovies();
const cleanMovies = rawMovies.map(rawMovie => new Movie(rawMovie));
movieGrid.render(cleanMovies);
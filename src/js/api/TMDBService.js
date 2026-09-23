
export default class TMDBService {
    constructor () {
        this.apiKey = API_KEY;
        this.baseUrl = 'https://api.themoviedb.org/3';
    }
    async fetchPopularMovies () {
        const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`;
        try {
    const res = await fetch(url);
    const data =await res.json();
    return data.results;
} catch (error) {
    console.error('Error:', error);
}
    }
   async fetchMovieTrailer(movieId) {
        // بنجهز الرابط اللي هيروح يجيب الفيديوهات الخاصة بالفيلم ده
        const url = `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}&language=en-US`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            
            // بندور جوه النتيجة على فيديو يكون مرفوع على يوتيوب ونوعه "Trailer" رسمي
            const trailer = data.results.find(
                video => video.site === 'YouTube' && video.type === 'Trailer'
            );

            // لو لقيناه، هنرجع الـ Key بتاعه، لو ملقيناش هنشوف أي فيديو تاني متاح
            if (trailer) {
                return trailer.key;
            } else if (data.results.length > 0 && data.results[0].site === 'YouTube') {
                return data.results[0].key;
            }
            
            // لو الفيلم ملوش أي فيديوهات خالص
            return null; 
            
        } catch (error) {
            console.error('Error fetching trailer:', error);
            return null;
        }
    }

}

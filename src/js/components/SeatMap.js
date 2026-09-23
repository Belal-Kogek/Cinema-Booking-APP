export default class SeatMap {
    constructor(containerId, onSelectionChange) {
        this.selectedSeats = new Set();
        this.onSelectionChange = onSelectionChange;
        this.container = document.getElementById(containerId);
    }

    // غيرنا اسم المتغير لـ bookedSeats عشان يكون منطقي أكتر
    render(layoutArray, bookedSeats = []) {
        this.container.innerHTML = ''; 
        this.selectedSeats.clear();
        let currentSeatIndex = 0;

        layoutArray.forEach(rowString => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('seat-row');

            for (let i = 0; i < rowString.length; i++) {
                const seatType = rowString[i]; 

                if (seatType === '_') {
                    const emptySpace = document.createElement('div');
                    emptySpace.style.width = '35px'; 
                    rowDiv.appendChild(emptySpace);
                    continue; 
                }

                const seat = document.createElement('div');
                seat.classList.add('seat'); 

                // تحديد شكل الكرسي ونوعه بناءً على الحرف
                if (seatType === 'V') {
                    seat.classList.add('vip');
                    seat.dataset.type = 'vip'; 
                } else if (seatType === 'L') {
                    seat.classList.add('love');
                    seat.dataset.type = 'love'; 
                } else {
                    seat.dataset.type = 'regular';
                }

                // التعديل الأول: الكراسي اللي جاية من التخزين تبقى محجوزة (Booked) مش مختارة
                // عشان ماتتحسبش في فاتورة اليوزر الجديد وتبقى مقفولة
                if (bookedSeats && bookedSeats.includes(currentSeatIndex)) {
                    seat.classList.add('booked');
                }

                currentSeatIndex++;

                // التعديل التاني: هنضيف الحدث للكراسي اللي مش محجوزة، وشيلنا التكرار
                if (!seat.classList.contains('booked')) {
                    seat.addEventListener('click', () => {
                        seat.classList.toggle('selected');

                        if (seat.classList.contains('selected')) {
                            this.selectedSeats.add(seat);
                        } else {
                            this.selectedSeats.delete(seat);
                        }

                        // ابعت الخزنة للمدير بعد أي تعديل
                        this.onSelectionChange(this.selectedSeats);
                    });
                }

                rowDiv.appendChild(seat);
            }

            this.container.appendChild(rowDiv);
        });
        
        // تحديث الفاتورة أول ما الصفحة تفتح
        if (this.onSelectionChange) {
            this.onSelectionChange(this.selectedSeats);
        }
    }
}
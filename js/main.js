// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    
    const icon = themeToggle.querySelector('.theme-toggle__icon');
    icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    
    localStorage.setItem('theme', newTheme);
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    const icon = themeToggle.querySelector('.theme-toggle__icon');
    icon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ===== Burger Menu =====
const burgerBtn = document.getElementById('burgerBtn');
const navList = document.querySelector('.nav__list');

if (burgerBtn && navList) {
    burgerBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        burgerBtn.classList.toggle('active');
    });
}

// ===== Slider =====
const track = document.getElementById('sliderTrack');
const slides = document.querySelectorAll('.slider__slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

// Преобразуем NodeList в массив (ВАЖНО!)
const slidesArray = Array.from(slides);

let currentIndex = 0;
const totalSlides = slidesArray.length;

// ===== Filter Functionality =====
const filterBtns = document.querySelectorAll('.filter__btn');

// Категории для каждого коктейля
const cocktailCategories = [
    'sour',      // Безысходность
    'bitter',    // Саморазрушение
    'sour',      // Детские травмы
    'bitter',    // Кладбище самокатов
    'sour',      // Ресентимент
    'sweet'      // ЗППП
];

let currentFilter = 'all';

// Функция фильтрации
function filterCocktails(filter) {
    slidesArray.forEach((slide, index) => {
        const category = cocktailCategories[index];
        
        if (filter === 'all' || category === filter) {
            slide.style.display = '';      // показываем
        } else {
            slide.style.display = 'none';   // скрываем
        }
    });
    
    // Находим ПЕРВЫЙ видимый слайд
    const firstVisibleIndex = slidesArray.findIndex(slide => slide.style.display !== 'none');
    
    // Устанавливаем currentIndex на первый видимый слайд
    currentIndex = firstVisibleIndex >= 0 ? firstVisibleIndex : 0;
    
    // Сбрасываем transform на 0%
    if (track) {
        track.style.transform = 'translateX(0%)';
    }
    
    // Обновляем точки
    updateDotsAfterFilter();
}

// Обновление точек после фильтрации
function updateDotsAfterFilter() {
    if (!dotsContainer) return;
    
    const visibleSlides = slidesArray.filter(slide => slide.style.display !== 'none');
    const visibleCount = visibleSlides.length;
    
    dotsContainer.innerHTML = '';
    for (let i = 0; i < visibleCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            const realIndex = slidesArray.findIndex(slide => slide === visibleSlides[i]);
            goToSlide(realIndex);
        });
        dotsContainer.appendChild(dot);
    }
}

// Вешаем обработчики на кнопки фильтра
if (filterBtns.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.dataset.filter;
            filterCocktails(currentFilter);
        });
    });
}

// Функция создания точек
function createDots() {
    if (!dotsContainer) return;
    
    const visibleSlides = slidesArray.filter(slide => slide.style.display !== 'none');
    const visibleCount = visibleSlides.length;
    
    dotsContainer.innerHTML = '';
    for (let i = 0; i < visibleCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
            const realIndex = slidesArray.findIndex(slide => slide === visibleSlides[i]);
            goToSlide(realIndex);
        });
        dotsContainer.appendChild(dot);
    }
}

// Обновление активной точки
function updateDots() {
    const visibleSlides = slidesArray.filter(slide => slide.style.display !== 'none');
    const visibleIndex = visibleSlides.findIndex(slide => slide === slidesArray[currentIndex]);
    
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === visibleIndex);
    });
}
// Переход к слайду
function goToSlide(index) {
    // Защита от некорректного индекса
    if (index < 0) index = 0;
    if (index >= slidesArray.length) index = slidesArray.length - 1;
    
    // Дополнительная проверка: если слайд скрыт, ищем ближайший видимый
    if (slidesArray[index].style.display === 'none') {
        // Ищем следующий видимый
        for (let i = 0; i < slidesArray.length; i++) {
            if (slidesArray[i].style.display !== 'none') {
                index = i;
                break;
            }
        }
    }
    
    currentIndex = index;
    
    // Вычисляем процент сдвига (только для видимых слайдов?)
    // ВАЖНО: transform всегда считается от полной ширины, но нам нужен сдвиг по порядку
    const visibleIndices = [];
    slidesArray.forEach((slide, i) => {
        if (slide.style.display !== 'none') {
            visibleIndices.push(i);
        }
    });
    
    // Находим позицию текущего слайда среди видимых
    const positionInVisible = visibleIndices.findIndex(i => i === currentIndex);
    
    // Сдвигаем на процент относительно видимых слайдов
    if (track && visibleIndices.length > 0) {
        const percent = -(positionInVisible * 100);
        track.style.transform = `translateX(${percent}%)`;
    }
    
    updateDots();
}
// Следующий слайд
function nextSlide() {
    // Находим следующий видимый слайд
    let nextIndex = currentIndex + 1;
    while (nextIndex < slidesArray.length && slidesArray[nextIndex].style.display === 'none') {
        nextIndex++;
    }
    
    // Если дошли до конца, идем в начало
    if (nextIndex >= slidesArray.length) {
        for (let i = 0; i < slidesArray.length; i++) {
            if (slidesArray[i].style.display !== 'none') {
                nextIndex = i;
                break;
            }
        }
    }
    
    // Если нашли валидный индекс, переходим
    if (nextIndex !== currentIndex) {
        goToSlide(nextIndex);
    }
}

// Предыдущий слайд
function prevSlide() {
    // Находим предыдущий видимый слайд
    let prevIndex = currentIndex - 1;
    while (prevIndex >= 0 && slidesArray[prevIndex].style.display === 'none') {
        prevIndex--;
    }
    
    // Если дошли до начала, идем в конец
    if (prevIndex < 0) {
        for (let i = slidesArray.length - 1; i >= 0; i--) {
            if (slidesArray[i].style.display !== 'none') {
                prevIndex = i;
                break;
            }
        }
    }
    
    // Если нашли валидный индекс, переходим
    if (prevIndex !== currentIndex) {
        goToSlide(prevIndex);
    }
}

// ===== Touch Swipe для мобильных устройств =====
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            prevSlide();
        } else {
            nextSlide();
        }
    }
}

// Автопрокрутка
let autoInterval = setInterval(nextSlide, 8000);

// Останавливаем автопрокрутку при наведении
const sliderContainer = document.querySelector('.slider');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoInterval);
    });
    sliderContainer.addEventListener('mouseleave', () => {
        autoInterval = setInterval(nextSlide, 8000);
    });
    
    // Добавляем свайп для мобилок
    sliderContainer.addEventListener('touchstart', handleTouchStart, false);
    sliderContainer.addEventListener('touchend', handleTouchEnd, false);
}

// Кнопки
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

// Запускаем создание точек
createDots();

// ===== Order Form =====
const orderForm = document.getElementById('orderForm');
const formSuccess = document.getElementById('formSuccess');

if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userName = document.getElementById('userName')?.value.trim();
        const userPhone = document.getElementById('userPhone')?.value.trim();

        if (!userName) {
            alert('Введите имя');
            return;
        }
        if (!userPhone || userPhone.length < 10) {
            alert('Введите корректный номер телефона');
            return;
        }

        if (formSuccess) {
            formSuccess.style.display = 'block';
            orderForm.reset();
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 3000);
        }
        
        console.log('Заявка:', { name: userName, phone: userPhone });
    });
}

// ===== Scroll Animation on Load =====
window.addEventListener('load', () => {
    const statsItems = document.querySelectorAll('.stats__item');
    statsItems.forEach((item, i) => {
        item.style.setProperty('--i', i);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const cardsContainer = document.querySelector('.cards-container');
    const cards = document.querySelectorAll('.card');
    
    const cardsWrapper = document.createElement('div');
    cardsWrapper.className = 'cards-wrapper';
    
    cards.forEach(card => {
        cardsWrapper.appendChild(card);
    });
    
    cardsContainer.appendChild(cardsWrapper);
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'carousel-controls';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-button prev';
    prevButton.innerHTML = '&larr;';
    prevButton.setAttribute('aria-label', 'Slide anterior');
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-button next';
    nextButton.innerHTML = '&rarr;';
    nextButton.setAttribute('aria-label', 'Próximo slide');
    
    controlsDiv.appendChild(prevButton);
    controlsDiv.appendChild(nextButton);
    cardsContainer.appendChild(controlsDiv);
    
    const indicatorsDiv = document.createElement('div');
    indicatorsDiv.className = 'carousel-indicators';
    
    const numSlides = Math.ceil(cards.length / getCardsPerView());
    for (let i = 0; i < numSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = i === 0 ? 'indicator active' : 'indicator';
        indicator.setAttribute('data-index', i);
        indicatorsDiv.appendChild(indicator);
    }
    
    cardsContainer.appendChild(indicatorsDiv);
    
    let currentIndex = 0;
    updateCarousel();
    
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextButton.addEventListener('click', () => {
        const maxIndex = Math.ceil(cards.length / getCardsPerView()) - 1;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    document.querySelectorAll('.indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            currentIndex = index;
            updateCarousel();
        });
    });
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCarousel();

            const numSlides = Math.ceil(cards.length / getCardsPerView());
            const indicators = document.querySelectorAll('.indicator');
            
            while (indicators.length > numSlides) {
                indicatorsDiv.removeChild(indicatorsDiv.lastChild);
            }
            
            while (indicators.length < numSlides) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                indicator.setAttribute('data-index', indicators.length);
                indicator.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    currentIndex = index;
                    updateCarousel();
                });
                indicatorsDiv.appendChild(indicator);
            }
            
            const maxIndex = Math.ceil(cards.length / getCardsPerView()) - 1;
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
                updateCarousel();
            }
        }, 200);
    });
    
    function getCardsPerView() {
        if (window.innerWidth >= 992) {
            return 3;
        } else if (window.innerWidth >= 768) {
            return 2;
        } else {
            return 1;
        }
    }
    
    function updateCarousel() {
        const cardsPerView = getCardsPerView();
        const cardWidth = cards[0].offsetWidth + 
                          parseInt(window.getComputedStyle(cards[0]).marginLeft) + 
                          parseInt(window.getComputedStyle(cards[0]).marginRight);
        
        cardsWrapper.style.transform = `translateX(-${currentIndex * cardsPerView * cardWidth}px)`;
        
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        const maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
        prevButton.disabled = currentIndex === 0;
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.disabled = currentIndex === maxIndex;
        nextButton.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
    }
});
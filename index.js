// JavaScript para o site da psicóloga Samy
document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar avaliações
    async function loadReviews() {
        try {
            const response = await fetch('reviews.json');
            if (!response.ok) {
                throw new Error('Não foi possível carregar as avaliações');
            }
            const data = await response.json();
            
            // Filtrar avaliações que têm texto (para exibir apenas avaliações com comentários)
            const reviewsWithText = data.reviews.filter(review => review.text && review.text.trim() !== '');
            
            initReviewsCarousel(reviewsWithText);
        } catch (error) {
            console.error('Erro ao carregar avaliações:', error);
            const fallbackReviews = [
                {
                    author: "Eloisa Alves",
                    rating: 5,
                    text: "Queria parabenizar e agradecer a minha psicóloga Samy por estar me ajudando, ja sinto muita evolução desde quando comecei a terapia. Ela é exemplar, paciente, sempre disposta ajudar, compreensiva, com atendimento humanizado e muito precisa nas suas falas. Super recomendo ♥️",
                    date: "6 meses atrás",
                    photo: "https://lh3.googleusercontent.com/a/ACg8ocL-default-user-photo"
                },
                {
                    author: "Raissa Rodrigues",
                    rating: 5,
                    text: "Sou paciente da samy e ela é uma profissional incrível. Muito atenciosa com seus pacientes. Não deixo essa terapeuta tão cedo na vida. A melhor que eu conheci.",
                    date: "6 meses atrás",
                    photo: "https://lh3.googleusercontent.com/a/ACg8ocL-default-user-photo"
                },
                {
                    author: "Rosana Palheta",
                    rating: 5,
                    text: "Excelente profissional, atenciosa, prestativa e super responsável com seus pacientes. Super indico para todos os meus amigos e conhecidos",
                    date: "6 meses atrás",
                    photo: "https://lh3.googleusercontent.com/a/ACg8ocL-default-user-photo"
                }
            ];
            initReviewsCarousel(fallbackReviews);
        }
    }

    // Função para inicializar o carrossel de avaliações
    function initReviewsCarousel(reviews) {
        const avaliacoesWrapper = document.querySelector('.avaliacoes-wrapper');
        if (!avaliacoesWrapper) return;

        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'reviews-slider';
        
        // Criar cards de avaliação
        reviews.forEach(review => {
            const reviewCard = createReviewCard(review);
            sliderContainer.appendChild(reviewCard);
        });
        
        avaliacoesWrapper.appendChild(sliderContainer);
        
        // Criar indicadores
        const indicadoresContainer = document.querySelector('.avaliacoes-indicadores');
        const reviewsPerView = getReviewsPerView();
        const numSlides = Math.ceil(reviews.length / reviewsPerView);
        
        for (let i = 0; i < numSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = i === 0 ? 'indicator active' : 'indicator';
            indicator.setAttribute('data-index', i);
            indicator.addEventListener('click', function() {
                currentIndex = parseInt(this.getAttribute('data-index'));
                updateReviewsCarousel();
            });
            indicadoresContainer.appendChild(indicator);
        }
        
        // Configurar navegação
        const prevButton = document.querySelector('.prev-review');
        const nextButton = document.querySelector('.next-review');
        
        let currentIndex = 0;
        
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateReviewsCarousel();
            }
        });
        
        nextButton.addEventListener('click', () => {
            const maxIndex = Math.ceil(reviews.length / getReviewsPerView()) - 1;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateReviewsCarousel();
            }
        });
        
        // Atualizar o carrossel inicialmente
        updateReviewsCarousel();
        
        // Ajustar ao redimensionar a janela
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const reviewsPerView = getReviewsPerView();
                const numSlides = Math.ceil(reviews.length / reviewsPerView);
                
                // Atualizar indicadores
                indicadoresContainer.innerHTML = '';
                for (let i = 0; i < numSlides; i++) {
                    const indicator = document.createElement('div');
                    indicator.className = i === currentIndex ? 'indicator active' : 'indicator';
                    indicator.setAttribute('data-index', i);
                    indicator.addEventListener('click', function() {
                        currentIndex = parseInt(this.getAttribute('data-index'));
                        updateReviewsCarousel();
                    });
                    indicadoresContainer.appendChild(indicator);
                }
                
                // Verificar se o índice atual é válido
                const maxIndex = Math.ceil(reviews.length / reviewsPerView) - 1;
                if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                }
                
                updateReviewsCarousel();
            }, 200);
        });
        
        function updateReviewsCarousel() {
            const reviewsPerView = getReviewsPerView();
            const reviewCards = document.querySelectorAll('.review-card');
            
            if (reviewCards.length === 0) return;
            
            const cardWidth = reviewCards[0].offsetWidth + 
                              parseInt(window.getComputedStyle(reviewCards[0]).marginLeft) + 
                              parseInt(window.getComputedStyle(reviewCards[0]).marginRight);
            
            sliderContainer.style.transform = `translateX(-${currentIndex * reviewsPerView * cardWidth}px)`;
            
            // Atualizar indicadores
            document.querySelectorAll('.avaliacoes-indicadores .indicator').forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            // Atualizar estados dos botões
            const maxIndex = Math.ceil(reviews.length / reviewsPerView) - 1;
            prevButton.disabled = currentIndex === 0;
            prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextButton.disabled = currentIndex === maxIndex;
            nextButton.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
        }
    }

    // Função para criar um card de avaliação
    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        // Cabeçalho da avaliação
        const header = document.createElement('div');
        header.className = 'review-header';
        
        // Foto do avaliador
        const photo = document.createElement('img');
        photo.className = 'reviewer-photo';
        photo.src = review.photo || './images/default-user.png';
        photo.alt = `Foto de ${review.author}`;
        photo.onerror = function() {
            this.src = './images/default-user.png';
        };
        
        // Informações do avaliador
        const info = document.createElement('div');
        info.className = 'reviewer-info';
        
        const name = document.createElement('div');
        name.className = 'reviewer-name';
        name.textContent = review.author;
        
        const date = document.createElement('div');
        date.className = 'review-date';
        date.textContent = review.date;
        
        info.appendChild(name);
        info.appendChild(date);
        
        header.appendChild(photo);
        header.appendChild(info);
        
        // Estrelas
        const stars = document.createElement('div');
        stars.className = 'review-stars';
        
        // Criar estrelas baseadas na avaliação
        let starsHTML = '';
        for (let i = 0; i < review.rating; i++) {
            starsHTML += '★';
        }
        for (let i = review.rating; i < 5; i++) {
            starsHTML += '☆';
        }
        stars.textContent = starsHTML;
        
        // Conteúdo da avaliação
        const content = document.createElement('div');
        content.className = 'review-content';
        content.textContent = review.text;
        
        // Montar o card
        card.appendChild(header);
        card.appendChild(stars);
        card.appendChild(content);
        
        return card;
    }

    // Função para determinar quantas avaliações exibir por visualização
    function getReviewsPerView() {
        if (window.innerWidth >= 992) {
            return 3;
        } else if (window.innerWidth >= 768) {
            return 2;
        } else {
            return 1;
        }
    }

    // Iniciar o carregamento das avaliações
    loadReviews();
});
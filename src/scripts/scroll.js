const container = document.querySelector('.snap-container');
const sections = document.querySelectorAll('.screen-section');
const dots = document.querySelectorAll('.dot');
const backToTopBtn = document.getElementById('back-to-top');

if (container) {
    let currentIndex = 0;
    let isScrolling = false;

    const isMobile = () => window.innerWidth <= 768;

    const updateView = (index = 0) => {
        if (sections[index]) {
            sections[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    container.addEventListener('wheel', (event) => {
        if (event instanceof WheelEvent) {
            if (isMobile()) return; 

            event.preventDefault(); 

            if (isScrolling) return;

            const direction = event.deltaY > 0 ? 1 : -1;
            const nextIndex = Math.min(
                Math.max(currentIndex + direction, 0),
                sections.length - 1
            );

            if (nextIndex === currentIndex) return;

            isScrolling = true;
            currentIndex = nextIndex;
            updateView(currentIndex);

            setTimeout(() => {
                isScrolling = false;
            }, 300);
        }
    }, { passive: false });

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                currentIndex = index;
                
                dots.forEach(d => d.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (isScrolling) return;

            const indexStr = dot.getAttribute('data-index');
            if (!indexStr) return;
            const targetIndex = parseInt(indexStr);

            if (targetIndex !== currentIndex) {
                isScrolling = true;
                currentIndex = targetIndex;
                updateView(currentIndex);

                setTimeout(() => {
                    isScrolling = false;
                }, 300);
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            if (isScrolling) return;
            isScrolling = true;
            currentIndex = 0;
            updateView(currentIndex);
            setTimeout(() => { isScrolling = false; }, 1000);
        });
    }
}
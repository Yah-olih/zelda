document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    const ptr = document.getElementById('pull-to-refresh');
    const spinner = ptr?.querySelector('.spinner-icon');

    let startY = 0;
    let currentY = 0;
    let pulling = false;
    let refreshing = false;

    const threshold = 100;


    function resetPull() {
        if (!ptr) return;

        ptr.style.transform = 'translateX(-50%) translateY(0)';
        ptr.style.opacity = '0';
        ptr.classList.remove('refreshing');

        startY = 0;
        currentY = 0;
        pulling = false;
    }


    function onTouchStart(event) {
        if (refreshing || !event.touches?.length) return;

        if (window.scrollY > 0) {
            startY = 0;
            return;
        }

        startY = event.touches[0].clientY;
        currentY = startY;
        pulling = false;
    }


    function onTouchMove(event) {
        if (!startY || refreshing || !event.touches?.length) {
            return;
        }

        currentY = event.touches[0].clientY;

        const diff = currentY - startY;

        if (window.scrollY > 0) {
            resetPull();
            return;
        }

        if (diff <= 0) {
            if (pulling) {
                resetPull();
            }

            return;
        }

        if (diff < 10) {
            return;
        }


        pulling = true;

        const distance = Math.min(diff * 0.5, 70);

        const opacity = Math.min(
            diff / threshold,
            1
        );


        if (ptr) {
            ptr.style.transform =
                `translateX(-50%) translateY(${distance}px)`;

            ptr.style.opacity = opacity;
        }
    }


    function onTouchEnd() {

        if (!startY || refreshing) {
            resetPull();
            return;
        }

        const diff = currentY - startY;

        if (
            pulling &&
            diff >= threshold &&
            window.scrollY <= 0
        ) {

            refreshing = true;

            if (ptr) {
                ptr.style.transform =
                    'translateX(-50%) translateY(70px)';

                ptr.style.opacity = '1';

                ptr.classList.add('refreshing');
            }

            if (spinner) {
                spinner.style.transform = '';
            }

            setTimeout(() => {
                window.location.reload();
            }, 500);


            return;
        }


        resetPull();
    }


    window.addEventListener(
        'touchstart',
        onTouchStart,
        { passive: true }
    );

    window.addEventListener(
        'touchmove',
        onTouchMove,
        { passive: true }
    );

    window.addEventListener(
        'touchend',
        onTouchEnd,
        { passive: true }
    );

    window.addEventListener(
        'touchcancel',
        resetPull,
        { passive: true }
    );

    if (typeof AOS !== 'undefined') {

        AOS.init({
            duration: 700,
            once: true,
            offset: 0
        });

    }

});
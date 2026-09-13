document.addEventListener('DOMContentLoaded', () => {
    const ptr = document.getElementById('pull-to-refresh');
    const spinner = ptr ? ptr.querySelector('.spinner-icon') : null;

    if (!ptr || !spinner) return;

    let startY = 0;
    let currentY = 0;
    let pulling = false;
    const threshold = 80; // Distância necessária em px para atualizar

    const onStart = (e) => {
        // Ativa apenas se a página estiver no topo absoluto
        if (window.scrollY === 0) {
            startY = e.touches ? e.touches[0].pageY : e.pageY;
            pulling = true;
        }
    };

    const onMove = (e) => {
        if (!pulling) return;

        currentY = e.touches ? e.touches[0].pageY : e.pageY;
        const diff = currentY - startY;

        // SE o usuário estiver puxando para BAIXO no TOPO da página
        if (diff > 0 && window.scrollY === 0) {
            // Bloqueia o scroll nativo APENAS enquanto puxa para atualizar
            if (e.cancelable) {
                e.preventDefault();
            }

            const pullDistance = Math.min(diff * 0.4, 80);

            ptr.style.top = `${pullDistance - 50}px`;
            ptr.style.opacity = Math.min(diff / threshold, 1);

            spinner.style.transform = `rotate(${diff * 2}deg)`;
        } else {
            // Se o usuário mover para cima, devolve o controle total da tela para a rolagem padrão
            pulling = false;
            ptr.style.top = '-60px';
            ptr.style.opacity = '0';
        }
    };

    const onEnd = () => {
        if (!pulling) return;
        pulling = false;

        const diff = currentY - startY;

        if (diff >= threshold && window.scrollY === 0) {
            ptr.style.top = '20px';
            ptr.classList.add('refreshing');
            spinner.style.transform = '';

            setTimeout(() => {
                window.location.reload();
            }, 600);
        } else {
            ptr.style.top = '-60px';
            ptr.style.opacity = '0';
        }

        startY = 0;
        currentY = 0;
    };

    // Adiciona os eventos escutando de forma passiva onde permitido para não travar o scroll da tela
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');

    // Toggle do menu ao clicar no botão hambúrguer
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o clique no botão feche o menu imediatamente
            navMenu.classList.toggle('active');
        });
    }

    // 1. Fecha o menu ao clicar em qualquer link (ex: Serviços)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });

    // 2. Fecha o menu ao clicar em qualquer lugar FORA dele
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            // Se o clique NÃO foi dentro do nav e NEM no botão hambúrguer
            if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        }
    });

    // 3. Fecha o menu ao ROLAR a página
    window.addEventListener('scroll', () => {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }, { passive: true });
});
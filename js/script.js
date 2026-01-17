document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initFavorites();
    initScrollAnimations();
    initCarouselEnhancements();
});

async function initCountdown() {
    const el = document.getElementById('f1-countdown');
    if (!el) return;
    try {
        const res = await fetch('https://api.openf1.org/v1/sessions');
        const data = await res.json();
        const next = data
            .filter(s => new Date(s.date_start) > new Date())
            .sort((a, b) => new Date(a.date_start) - new Date(b.date_start))[0];

        if (!next) return;

        const update = () => {
            const diff = new Date(next.date_start) - new Date();
            if (diff <= 0) {
                el.innerHTML = `🏁 <strong>${next.location} GP</strong> is live!`;
                return;
            }
            const d = Math.floor(diff / 864e5);
            const h = Math.floor((diff % 864e5) / 36e5);
            const m = Math.floor((diff % 36e5) / 6e4);
            el.innerHTML = `Next: <strong>${next.country_name} GP</strong> in ${d}d ${h}h ${m}m`;
        };
        setInterval(update, 60000);
        update();
    } catch (e) {
        el.innerText = "Forza Ferrari • Since 1950";
    }
}

function initFavorites() {
    let favs = JSON.parse(localStorage.getItem('ferrari_favs')) || [];
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const id = btn.dataset.id;
        if (favs.includes(id)) btn.classList.add('active');
        btn.onclick = () => {
            favs.includes(id) ? favs = favs.filter(f => f !== id) : favs.push(id);
            btn.classList.toggle('active');
            localStorage.setItem('ferrari_favs', JSON.stringify(favs));
        };
    });
}

function initScrollAnimations() {
    const obs = new IntersectionObserver(ents => {
        ents.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('reveal-visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.timeline-card, .driver-card, .race-card, .stat-box, .stat-card').forEach(el => {
        el.classList.add('reveal-hidden');
        obs.observe(el);
    });
}

function initCarouselEnhancements() {
    document.querySelectorAll('.drivers-scroll, .race-carousel').forEach(slider => {
        let isDown = false, startX, scrollLeft;
        const stop = () => { isDown = false; slider.classList.remove('active-drag'); };
        
        slider.onmousedown = (e) => {
            isDown = true;
            slider.classList.add('active-drag');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };
        slider.onmouseleave = stop;
        slider.onmouseup = stop;
        slider.onmousemove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            slider.scrollLeft = scrollLeft - (e.pageX - slider.offsetLeft - startX) * 2;
        };
    });
}
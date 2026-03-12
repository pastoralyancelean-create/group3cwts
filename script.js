window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1200);
});

const EMAILJS_PUBLIC_KEY = 'r-OZq0GDLQ9hb2B51';
const EMAILJS_SERVICE_ID = 'service_jrpotlg';
const EMAILJS_TEMPLATE_ID = 'template_iuqcskk';

(function () {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

const slidesEl = document.getElementById('slides');
const slides = Array.from(document.querySelectorAll('.slide'));
let idx = 0;

function render() {
    slidesEl.style.transform = `translateX(${-idx * 100}%)`;
    slides.forEach((s, i) => {
        if (i === idx) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
    location.hash = `slide-${idx + 1}`;
}

document.getElementById('prev').addEventListener('click', () => {
    if (idx > 0) {
        idx--;
        render();
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (idx < slides.length - 1) {
        idx++;
        render();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' && idx < slides.length - 1) {
        idx++;
        render();
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
        idx--;
        render();
    }
});

const h = location.hash.match(/slide-(\d+)/);
if (h) {
    const n = parseInt(h[1], 10) - 1;
    if (n >= 0 && n < slides.length) {
        idx = n;
    }
}

render();

let startX = null;
slidesEl.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].clientX;
});
slidesEl.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 50 && idx > 0) {
        idx--;
    } else if (dx < -50 && idx < slides.length - 1) {
        idx++;
    }
    render();
    startX = null;
});

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    const submitBtn = contactForm.querySelector('.submit-btn');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';

        const name = document.getElementById('name').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        if (typeof emailjs === 'undefined') {
            showFallback(name, subject, message);
            return;
        }

        const templateParams = {
            name: name,
            title: subject,
            message: message,
            email: 'pastoralyancelean@gmail.com',
            time: new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Manila',
                dateStyle: 'medium',
                timeStyle: 'short'
            })
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams).then(function (response) {
            formMessage.textContent = '✓ Message sent successfully! We will get back to you soon.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, function (error) {
            showFallback(name, subject, message);
        });
    });

    function showFallback(name, subject, message) {
        const emailBody = `Name: ${name}%0D%0A%0D%0ASubject: ${subject}%0D%0A%0D%0AMessage:%0D%0A${message}`;
        const mailtoLink = `mailto:pastoralyancelean@gmail.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;

        formMessage.innerHTML = `<p>Unable to send.</p><p><a href="${mailtoLink}" style="color: #f59e0b; text-decoration: underline;">Click here to send via your email client</a></p>`;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';

        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';

        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 2000);
    }
}

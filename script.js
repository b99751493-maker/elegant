// ELEGANT frontend prototype. Form submissions are saved locally and are NOT sent to the learning centre.

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

// Toast feedback
const toast = $('#toast');
let toastTimer;
function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3800);
}

// Mobile navigation
const menuToggle = $('#menuToggle');
const navLinks = $('#primaryNav');
function closeMenu() {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Menyuni ochish');
    document.body.classList.remove('menu-open');
}
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Menyuni ochish' : 'Menyuni yopish');
        navLinks.classList.toggle('open', !isOpen);
        document.body.classList.toggle('menu-open', !isOpen);
    });
    $$('#primaryNav a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
        if (window.innerWidth > 720) closeMenu();
    });
}

// Course data used by the detail dialog. Descriptions are sample copy until confirmed by the centre.
const courseDetails = {
    'Ingliz tili': {
        category: 'TILLAR',
        intro: 'Ingliz tilini muntazam mashq qilish orqali tushunish, gapirish va yozish ko‘nikmalarini rivojlantirishga qaratilgan namunaviy yo‘nalish.',
        topics: ['Kundalik muloqot uchun so‘z boyligini kengaytirish', 'Grammatika va gap tuzish asoslari', 'Tinglab tushunish va talaffuz ustida ishlash', 'O‘qish va yozish mashqlari'],
        audience: 'Ingliz tilini endi boshlayotgan yoki mavjud bilimlarini mustahkamlashni istayotgan o‘rganuvchilar uchun mos bo‘lishi mumkin.',
        next: 'Boshlang‘ich darajangiz va maqsadingizni ayting. Yakuniy guruh va dastur markaz bilan tasdiqlanadi.'
    },
    'IELTS tayyorgarligi': {
        category: 'EXAM PREP',
        intro: 'IELTS imtihonining tuzilishini tushunish, vazifalar bilan ishlash va to‘rtta asosiy ko‘nikma ustida mashq qilish uchun namunaviy yo‘nalish.',
        topics: ['Listening topshiriqlarini bajarish strategiyalari', 'Reading matnlarini tahlil qilish', 'Writing javoblarini tuzish va yaxshilash', 'Speaking savollariga tizimli javob berish'],
        audience: 'Imtihonga tayyorlanmoqchi bo‘lgan va til darajasini maqsadli rivojlantirishni istagan o‘rganuvchilar uchun.',
        next: 'Agar bilsangiz, hozirgi darajangiz va kerakli natijangizni ko‘rsating. Aniq talablar ustoz bilan muhokama qilinadi.'
    },
    'Matematika': {
        category: 'LOGIC & NUMBERS',
        intro: 'Mavzularni tushunish, mantiqiy fikrlash va masalalarni turli usulda yechish ko‘nikmalarini mustahkamlash uchun namunaviy yo‘nalish.',
        topics: ['Asosiy tushuncha va formulalarni qayta ko‘rib chiqish', 'Masalani bosqichlarga ajratib yechish', 'Mantiqiy fikrlash va hisoblash', 'Mustaqil mashq qilish strategiyalari'],
        audience: 'Maktabdagi mavzularni mustahkamlash yoki keyingi bosqichga tayyorlanishni xohlaydigan o‘quvchilar uchun.',
        next: 'Qaysi sinf yoki mavzular bo‘yicha yordam kerakligini arizada yozing. Dastur markaz bilan kelishiladi.'
    },
    'Dasturlash asoslari': {
        category: 'DIGITAL SKILLS',
        intro: 'Kompyuterda muammolarni mantiqiy yechish, algoritmlar va kod yozish asoslarini o‘rganish uchun namunaviy boshlang‘ich yo‘nalish.',
        topics: ['Algoritmik fikrlash va muammoni qismlarga ajratish', 'Dasturlashning boshlang‘ich tushunchalari', 'Koddagi xatolarni topish va tuzatish', 'Kichik amaliy loyihani rejalash'],
        audience: 'Dasturlashga qiziqadigan, raqamli ko‘nikmalarni boshlamoqchi bo‘lgan o‘rganuvchilar uchun.',
        next: 'Kompyuter bilan ishlash tajribangiz va qiziqishingizni ayting. Qaysi texnologiya o‘qitilishi markaz bilan tasdiqlanishi kerak.'
    }
};

const courseChoice = $('#courseChoice');
const trialSection = $('#trial');
const detailDialog = $('#courseDetailDialog');
let activeCourse = '';

function selectCourse(courseName) {
    if (!courseChoice) return;
    const exists = Array.from(courseChoice.options).some((option) => option.value === courseName);
    if (exists) courseChoice.value = courseName;
    const note = $('#studentGoal');
    if (note && !note.value.trim() && courseName !== 'Hali tanlamadim — maslahat kerak') {
        note.value = `${courseName} yo‘nalishi haqida batafsil ma’lumot olishni xohlayman.`;
    }
}

function openCourseDetails(courseName) {
    const detail = courseDetails[courseName] || { category: 'KASBIY YO‘NALISH', intro: `${courseName} bo‘yicha kurs dasturi va qabul shartlarini ELEGANT markazi bilan aniqlashtiring.`, topics: ['Asosiy tushunchalar bilan tanishish', 'Amaliy ko‘nikmalarni rivojlantirish', 'Ustoz bilan keyingi bosqichni belgilash'], audience: 'Ushbu yo‘nalishga qiziqqan va kasbiy ko‘nikmalarini rivojlantirmoqchi bo‘lganlar uchun.', next: 'Ariza qoldiring yoki markazga qo‘ng‘iroq qilib davomiylik, jadval va narxni tasdiqlang.' };
    if (!detail || !detailDialog) {
        selectCourse(courseName);
        trialSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast(`${courseName} tanlandi. Ariza formasini to‘ldirishingiz mumkin.`);
        return;
    }

    activeCourse = courseName;
    $('#courseDetailCategory').textContent = detail.category;
    $('#courseDetailTitle').textContent = courseName;
    $('#courseDetailIntro').textContent = detail.intro;
    $('#courseDetailAudience').textContent = detail.audience;
    $('#courseDetailNext').textContent = detail.next;

    const topics = $('#courseDetailTopics');
    topics.replaceChildren();
    detail.topics.forEach((topic) => {
        const li = document.createElement('li');
        li.textContent = topic;
        topics.appendChild(li);
    });

    if (typeof detailDialog.showModal === 'function') {
        detailDialog.showModal();
    } else {
        selectCourse(courseName);
        trialSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Kurs haqida batafsil ma’lumot uchun ariza formasidan foydalaning.');
    }
}

$$('.course-select').forEach((button) => {
    button.addEventListener('click', () => openCourseDetails(button.dataset.course));
});

$('#closeCourseDialog')?.addEventListener('click', () => detailDialog?.close());
detailDialog?.addEventListener('click', (event) => {
    if (event.target === detailDialog) detailDialog.close();
});
$('#courseDetailApply')?.addEventListener('click', () => {
    if (activeCourse) selectCourse(activeCourse);
    detailDialog?.close();
    trialSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => $('#studentName')?.focus({ preventScroll: true }), 450);
    showToast('Kurs tanlandi. Ariza ma’lumotlarini to‘ldiring.');
});
$('#courseDetailAdvice')?.addEventListener('click', () => {
    detailDialog?.close();
    $('#advice')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Course category filters
const filterButtons = $$('.filter-button');
const courseCards = $$('.course-card');
const courseCount = $('#courseCount');
function filterCourses(category) {
    let visibleCount = 0;
    courseCards.forEach((card) => {
        const visible = category === 'all' || card.dataset.category === category;
        card.classList.toggle('hidden', !visible);
        if (visible) visibleCount++;
    });
    if (courseCount) courseCount.textContent = `${visibleCount} ta yo‘nalish namunasi`;
}
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((item) => {
            const active = item === button;
            item.classList.toggle('active', active);
            item.setAttribute('aria-pressed', String(active));
        });
        filterCourses(button.dataset.filter);
    });
});

// Interactive course adviser
const recommendationButton = $('#recommendationButton');
const recommendationResult = $('#recommendationResult');
const recommendationTitle = $('#recommendationTitle');
const recommendationText = $('#recommendationText');
let recommendedCourse = 'Hali tanlamadim — maslahat kerak';

if (recommendationButton) {
    recommendationButton.addEventListener('click', () => {
        const goal = $('#adviceGoal')?.value || 'unsure';
        const level = $('#adviceLevel')?.value || 'beginner';
        const age = $('#adviceAge')?.value || 'teen';
        const goalMap = {
            english: 'Ingliz tili',
            ielts: 'IELTS tayyorgarligi',
            profession: 'Pazandachilik',
            digital: 'Kompyuter operatori',
            unsure: 'Hali tanlamadim — maslahat kerak'
        };
        recommendedCourse = goalMap[goal] || goalMap.unsure;
        const reasons = {
            english: 'Tilni bosqichma-bosqich rivojlantirish, kundalik muloqot va asosiy ko‘nikmalar ustida ishlash uchun.',
            ielts: 'Imtihon tuzilishini o‘rganish va Listening, Reading, Writing hamda Speaking bo‘yicha reja tuzish uchun.',
            profession: 'Kasbiy ko‘nikmalarni amaliy mashg‘ulotlar orqali rivojlantirish uchun.',
            digital: 'Kompyuter va ofis dasturlari bilan ishlashni o‘rganish uchun.',
            unsure: 'Avval qiziqishlaringizni aniqlashtirib, markaz tasdiqlagan mavjud kurslarni solishtirish foydali bo‘ladi.'
        };
        const levelNotes = {
            beginner: 'Boshlang‘ich bosqichdan boshlashni xohlayotganingiz hisobga olindi.',
            continuing: 'Oldingi bilimlaringizni mustahkamlash yoki davom ettirish muhim bo‘lishi mumkin.',
            advanced: 'Mavjud bilimlaringizni chuqurlashtirish va aniq maqsad belgilashga e’tibor bering.'
        };
        const ageLabels = { teen: 'maktab o‘quvchisi', student: 'talaba', adult: 'katta yoshdagi o‘rganuvchi' };
        recommendationTitle.textContent = recommendedCourse;
        recommendationText.textContent = `${reasons[goal]} ${levelNotes[level]} So‘rov ${ageLabels[age]} uchun berildi. Bu avtomatik demo tavsiyasi, yakuniy tanlovni ustoz bilan muhokama qiling.`;
        recommendationResult.hidden = false;
        recommendationResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

$('#applyRecommendation')?.addEventListener('click', () => {
    selectCourse(recommendedCourse);
    if ($('#studentLevel')) {
        const level = $('#adviceLevel')?.value;
        $('#studentLevel').value = level === 'beginner' ? 'Boshlang‘ich' : level === 'continuing' ? 'O‘rta' : 'Yuqori';
    }
    trialSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('Tavsiya tanlandi. Arizada ma’lumotlarni tekshiring.');
});

// Form feedback and local demo persistence
const trialForm = $('#trialForm');
const formMessage = $('#formMessage');
const phoneInput = $('#studentPhone');
const receipt = $('#applicationReceipt');
let latestReceiptId = '';

function showFormMessage(message) {
    if (!formMessage) return;
    formMessage.textContent = message;
    formMessage.classList.add('show');
}

phoneInput?.addEventListener('input', () => phoneInput.setCustomValidity(''));

trialForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    formMessage?.classList.remove('show');
    if (receipt) receipt.hidden = true;

    const formData = new FormData(trialForm);
    const phone = String(formData.get('studentPhone') || '').trim();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9) {
        phoneInput?.setCustomValidity('Telefon raqamini to‘liq kiriting.');
        phoneInput?.reportValidity();
        return;
    }

    if (!formData.get('demoConsent')) {
        showFormMessage('Davom etishdan oldin demo saqlash shartini tasdiqlang.');
        $('#demoConsent')?.focus();
        return;
    }

    const now = new Date();
    const application = {
        id: `EL-DEMO-${String(now.getTime()).slice(-6)}`,
        name: String(formData.get('studentName') || '').trim(),
        phone,
        course: String(formData.get('courseChoice') || ''),
        level: String(formData.get('studentLevel') || 'Aniqlanmagan'),
        preferredTime: String(formData.get('preferredTime') || 'Farqi yo‘q'),
        goal: String(formData.get('studentGoal') || '').trim(),
        createdAt: now.toISOString(),
        status: 'demo-local-only'
    };

    try {
        const saved = JSON.parse(localStorage.getItem('elegantDemoApplications') || '[]');
        saved.push(application);
        localStorage.setItem('elegantDemoApplications', JSON.stringify(saved));
        latestReceiptId = application.id;

        const summary = `${application.id} · ${application.name} · ${application.course} · qulay vaqt: ${application.preferredTime}.`;
        $('#receiptSummary').textContent = summary;
        if (receipt) receipt.hidden = false;
        showToast('Demo ariza shu brauzerda saqlandi. Markazga yuborilmadi.');
        receipt?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        showFormMessage('Brauzer ma’lumot saqlashga ruxsat bermadi. Brauzer sozlamalarini tekshiring yoki ma’lumotni vaqtincha nusxalab oling.');
        return;
    }
});

// Copy helper used for contact details and local demo receipt.
async function copyText(text, successMessage) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const copied = document.execCommand('copy');
            textarea.remove();
            if (!copied) throw new Error('Copy failed');
        }
        showToast(successMessage);
    } catch (error) {
        showToast('Avtomatik nusxalab bo‘lmadi. Matnni belgilang va qo‘lda nusxalang.');
    }
}

$('#copyPhone')?.addEventListener('click', (event) => {
    const phone = event.currentTarget.dataset.phone || '+998 99 641 90 60';
    copyText(phone, 'Telefon raqami nusxalandi. Raqamni markaz bilan tasdiqlash kerak.');
});
$('#copyReceipt')?.addEventListener('click', () => {
    if (latestReceiptId) copyText(latestReceiptId, 'Demo ariza raqami nusxalandi.');
});

// Reveal animations
const revealElements = $$('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealElements.forEach((elegant) => revealObserver.observe(elegant));
} else {
    revealElements.forEach((elegant) => elegant.classList.add('visible'));
}

// Career quiz
const quizBody = $('#quiz-body');
const quizAnswers = {};
let quizStep = 1;

quizBody?.addEventListener('click', (event) => {
    const answerButton = event.target.closest('[data-quiz-step][data-quiz-answer]');
    if (!answerButton || Number(answerButton.dataset.quizStep) !== quizStep) return;

    quizAnswers[quizStep] = answerButton.dataset.quizAnswer;
    const currentStep = $(`#step-${quizStep}`);
    currentStep.hidden = true;
    quizStep++;

    if (quizStep <= 3) {
        $(`#step-${quizStep}`).hidden = false;
        return;
    }

    const frontendAnswers = ['design', 'visual', 'interface'];
    const frontendScore = Object.values(quizAnswers).filter((answer) => frontendAnswers.includes(answer)).length;
    const resultIsFrontend = frontendScore >= 2;
    $('#res-title').textContent = resultIsFrontend
        ? 'Sizga mos yo‘nalish: Web Frontend dasturlash!'
        : 'Sizga mos yo‘nalish: Backend dasturlash!';
    $('#res-desc').textContent = resultIsFrontend
        ? 'Sizga ko‘rinadigan natija, dizayn va foydalanuvchi bilan ishlash yoqadi. Frontend yo‘nalishida sayt va ilovalarning foydalanuvchi ko‘radigan qismini yaratishingiz mumkin.'
        : 'Sizni mantiq, tizimlar va ma’lumotlar bilan ishlash qiziqtiradi. Backend yo‘nalishida sayt va ilovalarning server tomoni hamda ichki jarayonlarini yaratasiz.';
    $('#step-result').hidden = false;
});

$('#restartQuiz')?.addEventListener('click', () => {
    Object.keys(quizAnswers).forEach((key) => delete quizAnswers[key]);
    quizStep = 1;
    $$('.quiz-step', quizBody).forEach((step) => {
        step.hidden = step.id !== 'step-1';
    });
});

// FAQ accordion: keep one answer open at a time.
$$('.faq-item').forEach((item) => {
    const button = $('.faq-question', item);
    const answer = $('.faq-answer', item);
    button?.addEventListener('click', () => {
        const wasOpen = button.getAttribute('aria-expanded') === 'true';
        $$('.faq-item').forEach((otherItem) => {
            const otherButton = $('.faq-question', otherItem);
            const otherAnswer = $('.faq-answer', otherItem);
            otherButton?.setAttribute('aria-expanded', 'false');
            otherItem.classList.remove('is-open');
            if (otherAnswer) otherAnswer.hidden = true;
        });
        if (!wasOpen) {
            button.setAttribute('aria-expanded', 'true');
            item.classList.add('is-open');
            answer.hidden = false;
        }
    });
});

// Current year in footer
const currentYear = $('#currentYear');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

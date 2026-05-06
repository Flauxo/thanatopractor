/* ===== THANATOPRACTOR - i18n System ===== */
const I18n = (() => {
    let lang = localStorage.getItem('thanatopractor_lang') || 'en';
    const strings = { en: {}, es: {} };

    function T(key, ...args) {
        let s = strings[lang][key] || strings['en'][key] || key;
        args.forEach((a, i) => { s = s.replace(`{${i}}`, a); });
        return s;
    }
    
    function applyToDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = T(key);
            } else {
                el.innerHTML = T(key);
            }
        });
    }

    function setLanguage(l) { 
        lang = l; 
        localStorage.setItem('thanatopractor_lang', l); 
        applyToDOM();
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: l }));
    }
    function getLanguage() { return lang; }
    function register(l, obj) { Object.assign(strings[l], obj); }

    // Init on load
    document.addEventListener('DOMContentLoaded', applyToDOM);

    return { T, setLanguage, getLanguage, register, applyToDOM };
})();
const T = I18n.T;

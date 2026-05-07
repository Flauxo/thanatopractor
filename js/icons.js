/* ===== THANATOPRACTOR - Pixel Art Icon Engine ===== */
const Icons = (() => {
    // Color palette mapped to CSS variables
    const palette = {
        'P': 'var(--accent-bright)', // Neon Pink
        'D': 'var(--text-dim)',     // #8b6ea8
        'A': 'var(--accent-pink)',  // #d4609a
        'B': 'var(--accent-bright)',// Neon Pink
        'S': 'var(--accent-bright)',// Neon Pink
        'W': 'var(--accent-bright)',// Neon Pink
        'R': 'var(--accent-pink)',  // #d4609a
        'G': 'var(--accent-bright)',// Neon Pink
        'M': 'var(--bg-medium)',    // #2d1b4e
        'C': '#ffffff',             // White
        ' ': 'transparent'
    };

    // 12x12 grid definitions for all icons
    const grids = {
        menu: [
            "            ",
            "  AAAAAAAA  ",
            "  AAAAAAAA  ",
            "            ",
            "  AAAAAAAA  ",
            "  AAAAAAAA  ",
            "            ",
            "  AAAAAAAA  ",
            "  AAAAAAAA  ",
            "            ",
            "            ",
            "            "
        ],
        // UI Icons
        speaker: [
            "            ",
            "       A    ",
            "     AAA  A ",
            "   AAAAA AA ",
            "   AAAAA AA ",
            "   AAAAA AA ",
            "   AAAAA AA ",
            "     AAA  A ",
            "       A    ",
            "            ",
            "            ",
            "            "
        ],
        speaker_off: [
            "            ",
            "       A    ",
            "     AAA    ",
            "   AAAAA C C",
            "   AAAAA  C ",
            "   AAAAA C C",
            "   AAAAA    ",
            "     AAA    ",
            "       A    ",
            "            ",
            "            ",
            "            "
        ],
        bell: [
            "            ",
            "            ",
            "     GG     ",
            "    GWWG    ",
            "   GWWWWG   ",
            "  GWWWWWWG  ",
            "  GWWWWWWG  ",
            " GGWWWWWWGG ",
            " GGGGGGGGGG ",
            "    GWWG    ",
            "     GG     ",
            "            "
        ],
        skull: [
            "   PPPPPP   ",
            "  PPPPPPPP  ",
            " PPPPPPPPPP ",
            " PPPPPPPPPP ",
            " PP  PP  PP ",
            " PPPPPPPPPP ",
            "  PPPPPPPP  ",
            "   PP  PP   ",
            "   P PP P   ",
            "   P PP P   ",
            "    PPPP    ",
            "            "
        ],
        paperwork: [
            "  PPPPPP    ",
            "  PWWWWP    ",
            "  PWDDWP  W ",
            "  PWDDWPRRW ",
            "  PWDDWPWW  ",
            "  PWWWWP    ",
            "  PWDDWP    ",
            "  PWDDWP    ",
            "  PWWWWP    ",
            "  PPPPPP    ",
            "            ",
            "            "
        ],
        phone: [
            "            ",
            "    AAAA    ",
            "  AAA  AAA  ",
            " AA      AA ",
            " A        A ",
            " A  PPPP  A ",
            " AA P  P AA ",
            "  A P  P A  ",
            "    P  P    ",
            "    P  P    ",
            "    PPPP    ",
            "            "
        ],
        upgrades: [
            "            ",
            "            ",
            "        DD  ",
            "       D  D ",
            "       D  D ",
            "      DD  D ",
            "     DD DD  ",
            "    DD      ",
            "   DD       ",
            "  DD        ",
            " DD         ",
            "            "
        ],
        hourglass: [
            "  GGGGGGGG  ",
            "  P      P  ",
            "   P    P   ",
            "    PWWP    ",
            "     PW     ",
            "     WP     ",
            "    PWWP    ",
            "   PWWWWP   ",
            "  PWWWWWWP  ",
            "  GGGGGGGG  ",
            "            ",
            "            "
        ],
        // HUD & Title Icons
        calendar: [
            "            ",
            "  P  P  P   ",
            " PPPPPPPPPP ",
            " PWWWWWWWWP ",
            " PPPPPPPPPP ",
            " PWWPWWPWWP ",
            " PWWPWWPWWP ",
            " PPPPPPPPPP ",
            " PWWPWWPWWP ",
            " PWWPWWPWWP ",
            " PPPPPPPPPP ",
            "            "
        ],
        clock: [
            "            ",
            "   PPPPPP   ",
            "  PPWWWWPP  ",
            "  PWWMWWWP  ",
            " PWWWMWWWWP ",
            " PWWWMMMWWP ",
            " PWWWWWWWWP ",
            " PWWWWWWWWP ",
            "  PPWWWWPP  ",
            "   PPPPPP   ",
            "            ",
            "            "
        ],
        people: [
            "            ",
            "  PPP  PPP  ",
            " P   PP   P ",
            " P   PP   P ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            " P   PP   P ",
            "PPPPPPPPPPPP",
            "P          P",
            "P          P",
            "            ",
            "            "
        ],
        money: [
            "            ",
            "     GG     ",
            "    GWWG    ",
            "   GWWWWG   ",
            "  GWWGGWWG  ",
            "  GWGWWGWG  ",
            "  GWGWWGWG  ",
            "  GWWGGWWG  ",
            "   GWWWWG   ",
            "    GWWG    ",
            "     GG     ",
            "            "
        ],
        coffin: [
            "    PPPP    ",
            "   PWWWWP   ",
            "  PWWWWWWP  ",
            " PWWWWWWWWP ",
            "PWWWWWWWWWWP",
            "PWWWWWPWWWWP",
            "PWWPPPPPWWP ",
            "PWWWWWPWWWWP",
            " PWWWWWWWWP ",
            "  PWWWWWWP  ",
            "   PPPPPP   ",
            "            "
        ],
        play: [
            "            ",
            "  P         ",
            "  PPP       ",
            "  PPPPP     ",
            "  PPPPPPP   ",
            "  PPPPPPPPP ",
            "  PPPPPPPPP ",
            "  PPPPPPP   ",
            "  PPPPP     ",
            "  PPP       ",
            "  P         ",
            "            "
        ],
        pause: [
            "            ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            "  PPP  PPP  ",
            "            "
        ],
        fast: [
            "            ",
            "  P     P   ",
            "  PPP   PPP ",
            "  PPPPP PPP ",
            "  PPPPPPPPP ",
            "  PPPPPPPPP ",
            "  PPPPPPPPP ",
            "  PPPPPPPPP ",
            "  PPPPP PPP ",
            "  PPP   PPP ",
            "  P     P   ",
            "            "
        ],
        
        // Room Icons
        reception: [
            "            ",
            "   PPPPPP   ",
            "   P    P   ",
            "   P    P   ",
            "   P  G P   ",
            "   P    P   ",
            "   P    P   ",
            "   P    P   ",
            "   P    P   ",
            "   PPPPPP   ",
            "  PPPPPPPP  ",
            "            "
        ],
        embalming: [
            "     PP     ",
            "     SS     ",
            "    P  P    ",
            "    P  P    ",
            "   P    P   ",
            "   P    P   ",
            "  P      P  ",
            "  P  SS  P  ",
            "  P SSSS P  ",
            "  P SSSS P  ",
            "   PPPPPP   ",
            "            "
        ],
        cafeteria: [
            "            ",
            "            ",
            "     P      ",
            "   P  P     ",
            "    P       ",
            "  PPPPPP    ",
            "  P    P P  ",
            "  P    PP   ",
            "  P    P    ",
            "   PPPP     ",
            "  PPPPPP    ",
            "            "
        ],
        crematorium: [
            "            ",
            "     R      ",
            "    RWR     ",
            "   RWWWR    ",
            "  RWG GWR   ",
            "  RWGGGWR   ",
            "  RWGWGWR   ",
            "  RRWWWRR   ",
            " M RRRRR M  ",
            " MMMMRMMMM  ",
            " MMMMMMMMM  ",
            "            "
        ],
        viewing: [
            "    PPPP    ",
            "   PPPPPP   ",
            "  PPPPPPPP  ",
            "  PPPPPPPP  ",
            "  PPPPPPPP  ",
            "  PPPPPPPP  ",
            "  PPPPPPPP  ",
            "  PPPPPPPP  ",
            "  PPPPPPPP  ",
            "  PPPPPPPP  ",
            " PPPPPPPPPP ",
            "            "
        ],
        chapel: [
            "     G      ",
            "    GGG     ",
            "     G      ",
            "   PPGPP    ",
            "   PPGPP    ",
            "  PPPPPPP   ",
            "  PP G PP   ",
            "  PP G PP   ",
            "  PP G PP   ",
            "  PPPPPPP   ",
            " P        P ",
            "            "
        ],
        office: [
            "            ",
            "    PPPP    ",
            "   P    P   ",
            "  PPPPPPPP  ",
            "  P      P  ",
            "  P  GG  P  ",
            "  PPPPPPPP  ",
            "  P      P  ",
            "  P      P  ",
            "  PPPPPPPP  ",
            "            ",
            "            "
        ],
        families: [
            "            ",
            "  WWWW      ",
            " WWWWWWWWWW ",
            " WPPPPPPPPW ",
            " WPPPPPPPPW ",
            " WPPPPPPPPW ",
            " WPPPPPPPPW ",
            " WWWWWWWWWW ",
            " W        W ",
            " WWWWWWWWWW ",
            "            ",
            "            "
        ],
        
        // Moods / Feedback
        star: [
            "            ",
            "     G      ",
            "    GGG     ",
            "   GGGGG    ",
            " GGGGGGGGGG ",
            "  GGGGGGGG  ",
            "   GGGGGG   ",
            "  GG GG GG  ",
            "  G   G  G  ",
            " G       G  ",
            "            ",
            "            "
        ],
        cross: [
            "     P      ",
            "     P      ",
            "   PPPPPP   ",
            "     P      ",
            "     P      ",
            "     P      ",
            "     P      ",
            "     P      ",
            "     P      ",
            "     P      ",
            "     P      ",
            "            "
        ],
        jewish: [
            "      P     ",
            "     P P    ",
            "    P   P   ",
            " PPPPPPPPPPP",
            "  P       P ",
            "   P     P  ",
            "  P       P ",
            " PPPPPPPPPPP",
            "    P   P   ",
            "     P P    ",
            "      P     ",
            "            "
        ],
        muslim: [
            "     PPP    ",
            "   PP   P   ",
            "  PP   P    ",
            "  P  P      ",
            "  P   P     ",
            "  P    P    ",
            "  P    P    ",
            "  PP  PP    ",
            "   PPPP     ",
            "            ",
            "            ",
            "            "
        ],
        buddhist: [
            "            ",
            "     PP     ",
            "    P  P    ",
            "   P P  P   ",
            "  P P PP P  ",
            "  P P PP P  ",
            "  P P PP P  ",
            "   P P  P   ",
            "    P  P    ",
            "     PP     ",
            "            ",
            "            "
        ],
        pastafarian:[
            "            ",
            "  PPPPPPPP  ",
            " PP  PP  PP ",
            " P  PPPP  P ",
            "    PPPP    ",
            "   PW  WP   ",
            "   PR  RP   ",
            "   PW  WP   ",
            "    PPPP    ",
            "     PP     ",
            "            ",
            "            "
        ],
        jedi: [
            "     S      ",
            "    SSS     ",
            "    SSS     ",
            "    SSS     ",
            "    SSS     ",
            "    SSS     ",
            "    SSS     ",
            "    SSS     ",
            "   PPPPP    ",
            "   P   P    ",
            "   PPPPP    ",
            "            "
        ],
        secular: [
            "            ",
            "    PPPP    ",
            "  PPS  SPP  ",
            " P  SS  S P ",
            " P S  S S P ",
            " P SSS  S P ",
            " P SS   S P ",
            " P   SSSS P ",
            "  PP    PP  ",
            "    PPPP    ",
            "            ",
            "            "
        ],
        satanist: [
            "            ",
            " P        P ",
            " P        P ",
            " P   P    P ",
            " P  P P   P ",
            " P PPPP   P ",
            " PP    P  P ",
            " P      P P ",
            "            ",
            "   PPPPPP   ",
            "            ",
            "            "
        ],
        viking: [
            "     W      ",
            "    WW      ",
            "    W       ",
            "   WW       ",
            "   WWWWWW   ",
            "    WW      ",
            "     W      ",
            "    WW      ",
            "   WW       ",
            "  WW        ",
            "  W         ",
            "            "
        ],
        water: [
            "            ",
            "            ",
            "     B      ",
            "    BBB     ",
            "   BBBBB    ",
            "  BBBBBBB   ",
            " BBBBBBBBB  ",
            " BBBBBBBBB  ",
            " BBBBBBBBB  ",
            "  BBBBBBB   ",
            "   BBBBB    ",
            "            "
        ],
        music: [
            "            ",
            "    PPPP    ",
            "    P  P    ",
            "    P  P    ",
            "    P  P    ",
            "    P  P    ",
            "   PP  PP   ",
            "  PPP PPP   ",
            "  PPP PPP   ",
            "   P   P    ",
            "            ",
            "            "
        ],
        flowers: [
            "  AA  AA    ",
            " AAAAAAAA   ",
            "  AA  AA    ",
            "    SS      ",
            "   S  S     ",
            "    S  AA   ",
            "  S  SAAA   ",
            "    S       ",
            "   S        ",
            "  S         ",
            "            ",
            "            "
        ],
        firstaid: [
            "            ",
            "   PPPPPP   ",
            "  PWWWWWWP  ",
            "  PWWRRWWP  ",
            "  PWRRRRWP  ",
            "  PWWRRWWP  ",
            "  PWWWWWWP  ",
            "   PPPPPP   ",
            "            ",
            "            ",
            "            ",
            "            "
        ],
        light: [
            "            ",
            "    WWWW    ",
            "   W    W   ",
            "  W      W  ",
            "  W      W  ",
            "  W      W  ",
            "   W    W   ",
            "    W  W    ",
            "    PPPP    ",
            "    P  P    ",
            "     PP     ",
            "            "
        ],
        hearse: [
            "            ",
            "            ",
            "      WWWW  ",
            "   WWWWWWWW ",
            "  WPPPPPPPPW",
            " WWWWWWWWWWW",
            " WPPPPPPPPPW",
            " WWWWWWWWWWW",
            "  WW    WW  ",
            "   WW  WW   ",
            "            ",
            "            "
        ],
        ac: [
            "      P     ",
            "    PP PP   ",
            " P  P P P P ",
            "  P P P P P ",
            "   P   P    ",
            " PPPP PPPP  ",
            "   P   P    ",
            "  P P P P P ",
            " P  P P P P ",
            "    PP PP   ",
            "      P     ",
            "            "
        ],
        cake: [
            "            ",
            "            ",
            "    AAAA    ",
            "   P    P   ",
            "  PWWWWWWP  ",
            "  PWRRRRWP  ",
            "  PWWWWWWP  ",
            "  P      P  ",
            "  PPPPPPPP  ",
            "            ",
            "            ",
            "            "
        ],
        sandwich: [
            "            ",
            "            ",
            "    WWWW    ",
            "   W    W   ",
            "  W      W  ",
            "  WWWWWWWW  ",
            "  S      S  ",
            "  RRRRRRRR  ",
            "  WWWWWWWW  ",
            "            ",
            "            ",
            "            "
        ],
        drunk: [
            "            ",
            "            ",
            "    WWWW    ",
            "   WWWWWW   ",
            "  WWWWWWWW  ",
            "  W      W  ",
            "  W GGGG W  ",
            "  W GGGG W  ",
            "  W GGGG W  ",
            "  W GGGG W  ",
            "  WWWWWWWW  ",
            "            "
        ],
        d20: [
            "     P      ",
            "    P P     ",
            "   P   P    ",
            "  P  P  P   ",
            " P  P P  P  ",
            "P  P B P  P ",
            " P  P P  P  ",
            "  P  P  P   ",
            "   P   P    ",
            "    P P     ",
            "     P      ",
            "            "
        ],
        crying: [
            "            ",
            "   PPPPPP   ",
            "  P      P  ",
            " P B B B B P",
            " P         P",
            " P   R R   P",
            " P  R   R  P",
            " P R     R P",
            "  P       P ",
            "   PPPPPP   ",
            "            ",
            "            "
        ],
        back: [
            "            ",
            "    A       ",
            "   AA       ",
            "  AAAAAAAAAA",
            "   AA     AA",
            "    A      A",
            "           A",
            "           A",
            "    AAAAAAAA",
            "            ",
            "            ",
            "            "
        ]
    };

    // Helper: Map emoji keys directly to new icon IDs
    const emojiMap = {
        '✝️': 'cross', '⛪': 'chapel', '✡️': 'jewish', '☪️': 'muslim', '☸️': 'buddhist', '🍝': 'pastafarian', '⚔️': 'jedi', '🌍': 'secular', '🐐': 'satanist', '⚡': 'viking',
        '😭': 'crying', '🎉': 'star', '🧘': 'secular', '🍺': 'drunk', '😡': 'crying', '😏': 'star', '🤨': 'skull', '😌': 'star',
        '☕': 'cafeteria', '🍵': 'cafeteria', '🥪': 'sandwich', '🍰': 'cake',
        '👁️': 'viewing', '💧': 'water', '🌡️': 'ac', '😵': 'firstaid', '💐': 'flowers', '💡': 'light', '🚪': 'reception', '🎵': 'music',
        '🩹': 'firstaid', '🧪': 'embalming', '❄️': 'ac', '🔥': 'crematorium', '🚗': 'hearse', '🪦': 'viewing', '📚': 'upgrades',
        '📅': 'calendar', '🕐': 'clock', '👥': 'people', '💰': 'money', '☠': 'skull', '⚰': 'coffin', '♱': 'cross',
        '⏸': 'pause', '▶': 'play', '⏩': 'fast'
    };

    function parse(name) {
        let grid = grids[name] || grids.skull;
        let svg = `<svg width="100%" height="100%" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">`;
        for (let y = 0; y < 12; y++) {
            for (let x = 0; x < 12; x++) {
                let char = grid[y][x];
                if (char && char !== ' ') {
                    let color = palette[char] || '#fff';
                    svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;
                }
            }
        }
        svg += `</svg>`;
        return svg;
    }

    return {
        getHTML: (name) => {
            // Handle legacy emoji mappings
            if (emojiMap[name]) name = emojiMap[name];
            return `<span class="custom-icon" data-icon="${name}">${parse(name)}</span>`;
        },
        initDOM: () => {
            document.querySelectorAll('.custom-icon[data-icon]').forEach(el => {
                if (el.innerHTML.trim() === '') {
                    el.innerHTML = parse(el.dataset.icon);
                }
            });
        }
    };
})();

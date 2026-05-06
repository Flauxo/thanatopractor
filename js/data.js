/* ===== THANATOPRACTOR - Game Data ===== */
const DATA = {
    // ===== NAME GENERATION =====
    firstNames: {
        male: ["Reginald","Cornelius","Mortimer","Barnaby","Ignatius","Archibald","Thaddeus","Alistair","Percival","Montague","Horatio","Clarence","Aubrey","Crispin","Sylvester","Algernon","Ambrose","Humphrey","Alistair","Phineas"],
        female: ["Mildred","Ethel","Constance","Prudence","Patience","Gertrude","Agatha","Millicent","Dorothea","Harriet","Perpetua","Winifred","Beatrice","Lavinia","Hildegard","Brunhilde","Morticia","Wilhelmina","Cordelia","Eunice"]
    },
    lastNames: ["Death","Graves","Hollow","Bones","Gloom","Tombstone","Shroud","Ash","Dust","Spirit","Forgotten","Eternal","Silence","Darkness","Shadow","Repose","Cypress","Marble","Cinder","Cobwebb"],
    
    religions: [
        { id: "pastafarian", name: "Pastafarian", icon: "🍝" },
        { id: "satanist", name: "LaVeyan Satanist", icon: "🐐" },
        { id: "caffeinated", name: "Order of the Caffeinated", icon: "☕" },
        { id: "rng", name: "Cult of the RNG", icon: "🎲" },
        { id: "nap", name: "Church of the Final Nap", icon: "⚰" },
        { id: "void", name: "Children of the Void", icon: "💀" },
        { id: "jedi", name: "Jedi Order", icon: "⚔️" },
        { id: "viking", name: "Norse Pagan", icon: "⚡" }
    ],

    familyMoods: [
        { id: "crying", name: "Devastated", icon: "😭", desc: "They can barely speak through the tears." },
        { id: "celebrating", name: "Celebrating", icon: "🎉", desc: "They brought confetti. To a funeral home." },
        { id: "zen", name: "Zen", icon: "🧘", desc: "Eerily calm. Like, unsettlingly calm." },
        { id: "drunk", name: "Intoxicated", icon: "🍺", desc: "They smell like a distillery had a baby with a pharmacy." },
        { id: "arguing", name: "Fighting", icon: "😡", desc: "The inheritance discussion started in the parking lot." },
        { id: "flirty", name: "Flirtatious", icon: "😏", desc: "Someone is definitely hitting on you. At their relative's funeral intake." },
        { id: "paranoid", name: "Suspicious", icon: "🤨", desc: "They keep asking if you're SURE their relative is dead." },
        { id: "cheerful", name: "Relieved", icon: "😌", desc: "\"To be honest, Uncle was kind of a jerk.\"" },
        { id: "vampire", name: "Gothic", icon: "🧛", desc: "They seem to be waiting for the deceased to wake up." },
        { id: "alien", name: "Extraterrestrial", icon: "👽", desc: "They suspect the deceased was a cosmic observer." },
        { id: "influencer", name: "Trending", icon: "📸", desc: "Everything is a photo opportunity. Even this." },
        { id: "gamer", name: "Gamer", icon: "🎮", desc: "They keep looking for the 'respawn' button." },
        { id: "clone", name: "Suspicious", icon: "👥", desc: "They are convinced this body is a government clone." },
        { id: "tax", name: "Scheming", icon: "💼", desc: "They need one last 'signature' from the deceased." },
        { id: "steampunk", name: "Mechanized", icon: "⚙️", desc: "They want to add brass gears to the coffin." },
        { id: "reality", name: "Dramatic", icon: "📺", desc: "They are treating this like a season finale." },
        { id: "coupon", name: "Frugal", icon: "🎫", desc: "They brought a stack of expired coupons." },
        { id: "traveler", name: "Temporal", icon: "⏳", desc: "They claim the deceased will revive in a week." }
    ],

    // ===== ARRIVAL DIALOGUES =====
    arrivalIntros: [
        "A family walks in through the door. The bell rings. Someone sniffles.",
        "The door creaks open dramatically. A family enters as if auditioning for a telenovela.",
        "A group stumbles in. One of them is wearing sunglasses. Indoors. At 9 AM.",
        "The doorbell rings. You put down your 'DEAD TIRED' coffee mug and put on your professional face.",
        "A car pulls up blasting reggaeton. Three people emerge, one holding a framed photo.",
        "Someone kicks the door open. \"WE NEED YOUR SERVICES!\" they announce to the empty lobby.",
        "A very composed person in a tailored suit walks in and places a business card on the counter.",
        "The door opens. A woman enters carrying a Tupperware. \"The deceased loved my lasagna,\" she explains."
    ],

    arrivalDialogues: {
        crying: [
            { text: "\"Our beloved {name} has... has...\" *uncontrollable sobbing*", choices: [
                { text: "\"Take your time. Here's a tissue... and another... and the whole box.\"", rep: 2, money: 0 },
                { text: "\"I understand. Let's handle this with dignity and care.\"", rep: 1, money: 0 },
                { text: "\"Look, I charge by the hour, so whenever you're ready...\"", rep: -3, money: 0 }
            ]},
        ],
        celebrating: [
            { text: "\"Uncle {name} is FINALLY dead! I mean... may he rest in peace. Party at our place after!\"", choices: [
                { text: "\"Every life deserves celebration. Let's give {name} a proper sendoff!\"", rep: 2, money: 0 },
                { text: "\"That's... one way to handle grief. We offer full services.\"", rep: 1, money: 0 },
                { text: "\"Can I come to the party? I'll bring the embalming fluid cocktails.\"", rep: 0, money: 0 }
            ]},
        ],
        zen: [
            { text: "\"Death is merely a transition. {name} has transcended. We seek your earthly services.\"", choices: [
                { text: "\"What a beautiful perspective. We'll make this transition seamless.\"", rep: 2, money: 0 },
                { text: "\"Right. Transcended. Let's talk packages.\"", rep: 0, money: 0 },
                { text: "\"Cool, cool. Has {name}'s spirit mentioned a budget for all this?\"", rep: -2, money: 0 }
            ]},
        ],
        drunk: [
            { text: "*hiccup* \"Sho... my {relation} {name}... they died... or did they? No wait, yeah, they did.\"", choices: [
                { text: "\"Let me get you some water first. We can discuss everything once you're comfortable.\"", rep: 2, money: 0 },
                { text: "\"I can confirm: yes, they are definitely deceased. Let's proceed.\"", rep: 0, money: 0 },
                { text: "\"Sir/Ma'am, this is a funeral home, not a bar. Although we do have a cafeteria...\"", rep: -1, money: 0 }
            ]},
        ],
        arguing: [
            { text: "\"I TOLD you mom wanted to be cremated!\" \"SHE SAID BURIED!\" \"YOU NEVER LISTENED TO HER!\"", choices: [
                { text: "\"Families, let's take a breath. We can explore all options together.\"", rep: 2, money: 0 },
                { text: "\"How about we do both? Cremate half, bury half. Everyone wins!\"", rep: -1, money: 0 },
                { text: "\"I have a coin we can flip. Professional funeral coin. Very dignified.\"", rep: -2, money: 50 }
            ]},
        ],
        flirty: [
            { text: "\"So... you work with the dead all day? That must make you really appreciate the *living*.\" *wink*", choices: [
                { text: "\"I appreciate ALL my clients. Now, about the deceased...\"", rep: 2, money: 0 },
                { text: "\"Is this really the time? ...But yes, I do have great hands. For embalming.\"", rep: 0, money: 0 },
                { text: "\"My heart is as cold as my clients. Let's talk business.\"", rep: 1, money: 0 }
            ]},
        ],
        paranoid: [
            { text: "\"Are you ABSOLUTELY sure {name} is dead? Check again. I saw a documentary once...\"", choices: [
                { text: "\"I assure you, our medical certifications are thorough. {name} is at peace.\"", rep: 2, money: 0 },
                { text: "\"Would you like to poke them with a stick? We have a professional poking stick.\"", rep: -1, money: 0 },
                { text: "\"If they wake up, services are free. Deal?\"", rep: 0, money: 0 }
            ]},
        ],
        cheerful: [
            { text: "\"Look, Uncle {name} lived to 94, ate bacon every day, and outlived three wives. Legend.\"", choices: [
                { text: "\"What a life! Let's honor that legacy with a service worthy of a legend.\"", rep: 2, money: 0 },
                { text: "\"94 and bacon daily? We should study that man's arteries.\"", rep: 0, money: 0 },
                { text: "\"Three wives? We can arrange separate viewing times. Trust me, we've dealt with this.\"", rep: 1, money: 50 }
            ]},
        ],
        vampire: [
            { textKey: "dlg.vampire.text", choices: [
                { textKey: "dlg.vampire.c1", rep: 2, money: 0 },
                { textKey: "dlg.vampire.c2", rep: 0, money: 150 },
                { textKey: "dlg.vampire.c3", rep: -3, money: 0 }
            ]}
        ],
        alien: [
            { textKey: "dlg.alien.text", choices: [
                { textKey: "dlg.alien.c1", rep: 2, money: 0 },
                { textKey: "dlg.alien.c2", rep: -5, money: 400 },
                { textKey: "dlg.alien.c3", rep: 1, money: 0 }
            ]}
        ],
        influencer: [
            { textKey: "dlg.influencer.text", choices: [
                { textKey: "dlg.influencer.c1", rep: 5, money: 0 },
                { textKey: "dlg.influencer.c2", rep: 0, money: 200 },
                { textKey: "dlg.influencer.c3", rep: -10, money: 0 }
            ]}
        ],
        gamer: [
            { textKey: "dlg.gamer.text", choices: [
                { textKey: "dlg.gamer.c1", rep: 2, money: 0 },
                { textKey: "dlg.gamer.c2", rep: 1, money: 0 },
                { textKey: "dlg.gamer.c3", rep: -2, money: 0 }
            ]}
        ],
        clone: [
            { textKey: "dlg.clone.text", choices: [
                { textKey: "dlg.clone.c1", rep: 2, money: 0 },
                { textKey: "dlg.clone.c2", rep: 5, money: 0 },
                { textKey: "dlg.clone.c3", rep: -3, money: 0 }
            ]}
        ],
        tax: [
            { textKey: "dlg.tax.text", choices: [
                { textKey: "dlg.tax.c1", rep: 1, money: 0 },
                { textKey: "dlg.tax.c2", rep: -15, money: 500 },
                { textKey: "dlg.tax.c3", rep: -5, money: 0 }
            ]}
        ],
        steampunk: [
            { textKey: "dlg.steampunk.text", choices: [
                { textKey: "dlg.steampunk.c1", rep: 0, money: 300 },
                { textKey: "dlg.steampunk.c2", rep: 2, money: 0 },
                { textKey: "dlg.steampunk.c3", rep: -2, money: 0 }
            ]}
        ],
        reality: [
            { textKey: "dlg.reality.text", choices: [
                { textKey: "dlg.reality.c1", rep: 2, money: 0 },
                { textKey: "dlg.reality.c2", rep: 1, money: 0 },
                { textKey: "dlg.reality.c3", rep: 5, money: 0 }
            ]}
        ],
        coupon: [
            { textKey: "dlg.coupon.text", choices: [
                { textKey: "dlg.coupon.c1", rep: 1, money: -50 },
                { textKey: "dlg.coupon.c2", rep: -2, money: 0 },
                { textKey: "dlg.coupon.c3", rep: -5, money: 0 }
            ]}
        ],
        traveler: [
            { textKey: "dlg.traveler.text", choices: [
                { textKey: "dlg.traveler.c1", rep: 2, money: 0 },
                { textKey: "dlg.traveler.c2", rep: 10, money: -500 },
                { textKey: "dlg.traveler.c3", rep: 1, money: 0 }
            ]}
        ]
    },

    deathCauses: [
        "natural causes", "extreme old age", "a tragic gardening accident",
        "choking on an olive at a wedding", "ironic circumstances",
        "a heated argument about parking spaces", "excessive napping",
        "complications from an allergic reaction to Mondays",
        "fell off a ladder while changing a lightbulb (the lightbulb survived)",
        "spontaneous combustion (allegedly)", "a disagreement with gravity",
        "too much excitement at a bingo game", "miscalculation during a leap of faith",
        "failed attempt to domesticate a badger with a selfie stick",
        "shock from seeing the electric bill", "mistook the wrong mushroom for a risotto",
        "ill-timed sneeze while operating a chainsaw", "bite from a radioactive hamster (allegedly)",
        "choked trying to say 'supercalifragilisticexpialidocious' underwater",
        "laughing fit while watching someone else's funeral", "allergic reaction to reality",
        "got locked in a fridge looking for the last yogurt",
        "impact from a marble-sized meteorite in the left eye"
    ],

    // ===== CAFETERIA =====
    cafeOrders: [
        { item: "Coffee", price: 2, icon: "☕", humor: "Black as the void, just right." },
        { item: "Tea", price: 2, icon: "🍵", humor: "Comfort in a cup. Earl Grey won't judge you." },
        { item: "Sandwich", price: 4, icon: "🥪", humor: "Our 'Last Supper' special." },
        { item: "Soul Cake", price: 5, icon: "🍰", humor: "Baked with questionable intentions." },
    ],
    cafeAlcoholRequests: [
        "\"Got anything... stronger? It's been a DAY.\"",
        "\"I don't suppose you have whiskey? For... medicinal purposes.\"",
        "\"My father would've wanted me to toast with tequila. Do you have any?\"",
        "\"Is it too early for wine? Asking for a friend. The friend is me.\""
    ],
    cafeAlcoholChoices: [
        { text: "\"I'm sorry, alcohol is not permitted on the premises.\"", rep: 1, money: 0, satisfaction: -5 },
        { text: "\"But for {bribe} coins, I can serve it to you...\"", rep: -5, money: 0, satisfaction: 25, isBribe: true },
        { text: "\"Let me offer you our 'Comfort Blend' instead. Extra strong coffee.\"", rep: 1, money: 2, satisfaction: 5 }
    ],

    // ===== CHAPEL - IVAN'S SERMONS =====
    sermons: {
        caffeinated: {
            correct: [
                "\"In the name of the Roast, the Brew, and the Holy Bean. {name} has ascended to the great espresso machine in the sky.\"",
                "\"The Lord giveth and the Lord taketh... especially when the caffeine wears off. {name} is fully decaffeinated now.\"",
            ],
            name: "Caffeinated Rite"
        },
        rng: {
            correct: [
                "\"By the luck of the dice, {name} has been called away. Their HP dropped to zero, and the Cleric was out of spell slots.\"",
                "\"{name} lived by the roll. Unfortunately, their last saving throw was a natural 1. We honor their character sheet.\""
            ],
            name: "RNG Service"
        },
        nap: {
            correct: [
                "\"Hush now. {name} has entered the Deep Sleep. The alarm clock is forever silenced. May their pillows always be cool.\"",
                "\"{name} has returned to the ultimate mattress. Do not disturb. Housekeeping has been notified.\""
            ],
            name: "Slumber Ceremony"
        },
        void: {
            correct: [
                "\"The Void calls us all. {name} simply answered early. We return this borrowed stardust to the infinite emptiness.\"",
                "\"Nothing matters, and that's beautiful. {name} embraces the beautiful nothingness. Fade to black.\""
            ],
            name: "Void Invocation"
        },
        pastafarian: {
            correct: [
                "\"By His Noodly Appendage, {name} has been embraced by the Flying Spaghetti Monster. May the sauce be with them. R'amen.\"",
                "\"{name} now sails the great Beer Volcano in the sky. Touched by His Noodly Appendage forevermore. R'amen.\""
            ],
            name: "Pastafarian Blessing"
        },
        jedi: {
            correct: [
                "\"The Force was strong with {name}. Now they are one with it. Like Obi-Wan, but with less dramatic disappearing.\"",
                "\"Do or do not, there is no try. {name} did. And now they rest. May the Force be with them. Always.\""
            ],
            name: "Jedi Memorial"
        },

        satanist: {
            correct: [
                "\"Hail thyself! {name} lived by their own rules. LaVey would be proud. Probably. He's also dead, so...\"",
                "\"{name} embraced the darkness within. Now they embrace the darkness without. Full circle. Very poetic.\""
            ],
            name: "LaVeyan Ritual"
        },
        viking: {
            correct: [
                "\"ODIN WELCOMES {name} TO VALHALLA! Unfortunately we can't do the burning boat thing. Fire codes.\"",
                "\"By Thor's hammer and Freya's grace, {name} feasts with the gods tonight! We feast with sandwiches. Close enough.\""
            ],
            name: "Norse Send-off"
        },
        wrong: [
            "\"Iván clears his throat nervously. He clearly picked the wrong script.\"",
            "\"The family exchanges horrified glances as Iván mentions the wrong deity.\"",
            "\"Someone in the front row whispers 'That's not our religion' loud enough for everyone to hear.\""
        ]
    },

    ivanQuotes: [
        "\"Death is just God's way of telling you your subscription expired.\"",
        "\"I've officiated 400 funerals. My success rate is... well, everyone stays dead.\"",
        "\"People say I have a gift for making the dead feel welcome. The living, less so.\"",
        "\"Another day, another soul. Let's give them a show!\"",
        "\"I was going to be a comedian, but this gig kills. Literally.\"",
        "\"Ready when you are. Death waits for no one, but I charge by the hour.\"",
        "\"Fun fact: I'm the most popular guy at funerals. Low bar, but still.\""
    ],

    // ===== VIEWING ROOM EVENTS =====
    viewingRequests: [
        { type: "see_body", text: "\"We'd like to see {name} one last time.\"", icon: "👁️" },
        { type: "water", text: "\"Could we get some water, please?\"", icon: "💧" },
        { type: "temperature", text: "\"It's freezing/boiling in here!\"", icon: "🌡️" },
        { type: "faint", text: "\"Oh no, someone just fainted!\"", icon: "😵" },
        { type: "flowers", text: "\"The flowers look wilted. Can we get fresh ones?\"", icon: "💐" },
        { type: "lighting", text: "\"Could we adjust the lighting? It's too bright/dark.\"", icon: "💡" },
        { type: "privacy", text: "\"We need a moment alone with {name}.\"", icon: "🚪" },
        { type: "music", text: "\"Can you play some music? {name} loved jazz.\"", icon: "🎵" }
    ],

    viewingBodyReactions: {
        excellent: [
            "{name} looks... at peace. Like they're just sleeping. Thank you so much.",
            "You've done a beautiful job. {name} would have loved it. Well... you know.",
            "{name} looks ready to party. What a bodywork and paint job!",
            "Incredible. I swear I saw {name} wink at me. Great job!"
        ],
        good: [
            "{name} looks good. A bit sallow perhaps, but good.",
            "That's... more or less how I remember them. Fairly close.",
            "He looks... acceptable. {name} was never a runway model, but you did what you could.",
            "Pretty good. At least his jaw doesn't fall off like old man Garcia's."
        ],
        mediocre: [
            "Is {name} supposed to be that... orange?",
            "Something feels off. Did {name} always have that expression?",
            "Was {name} always this... grayish? He looks like he's out of a 1920s movie.",
            "Well, at least he's presentable. If you squint really hard, it looks like him."
        ],
        bad: [
            "WHAT DID YOU DO TO {name}?! They look like a cursed doll!",
            "I'm going to need therapy after seeing this. A LOT of therapy.",
            "My goodness! {name} looks like he fought a makeup jar and lost.",
            "Why does {name} have that sinister smile? It's giving me the creeps."
        ],
        catastrophic: [
            "IS THAT EVEN {name}?! OH GOD! *screaming and crying*",
            "I'm going to sue this place into THE GROUND! I have my lawyer on speed dial!",
            "WHAT IS THIS?! He looks like a badly made lasagna! Sacrilege!",
            "Call the exorcist! You've turned {name} into something not of this world!"
        ]
    },

    // ===== RANDOM EVENTS =====
    randomEvents: [
        { type: "phone_prank", text: "📞 Phone rings: \"Hello, is this where I book a reservation? For the afterlife?\" *click*", effect: null },
        { type: "cat", text: "🐈 A stray cat has wandered into the viewing room and refuses to leave.", choices: [
            { text: "Gently remove the cat", rep: 0, money: 0 },
            { text: "Let it stay. Cats are therapeutic.", rep: 1, money: 0 },
            { text: "Adopt it as the funeral home mascot", rep: 2, money: -50 }
        ]},
        { type: "power_outage", text: "💡 Power outage! The crematorium temperature is dropping!", effect: "crema_cool" },
        { type: "newspaper", text: "📰 Local newspaper wants to feature Eternal Rest. Interview?", choices: [
            { text: "Accept the interview graciously", rep: 5, money: 0 },
            { text: "Decline — too busy with the dead", rep: 0, money: 0 },
            { text: "Only if the headline is 'Dying to Get In'", rep: 3, money: 0 }
        ]},
        { type: "ghost", text: "👻 A family member claims they saw a ghost in the hallway.", choices: [
            { text: "\"That's just the A/C draft. Nothing supernatural.\"", rep: 1, money: 0 },
            { text: "\"We offer ghost-detection for only $200 extra.\"", rep: -1, money: 200 },
            { text: "\"Oh, that's just Gerald. He never left.\"", rep: 0, money: 0 }
        ]},
        { type: "supplier", text: "📦 Embalming supply delivery! Sign for the package?", effect: "supplies" },
        
        // NEW RANDOM EVENTS
        { type: "flood", text: "💧 A pipe burst in the basement! The embalming fluid is mixing with the water...", choices: [
            { text: "Call an emergency plumber ($500)", rep: 2, money: -500 },
            { text: "Mop it up yourself and hope for the best", rep: -5, money: 0 },
            { text: "Sell it as 'premium scented water' to the neighbors", rep: -15, money: 300 }
        ]},
        { type: "casino", text: "🎰 A shady businessman offers to buy the funeral home to build a casino.", choices: [
            { text: "\"This is sacred ground! Leave immediately!\"", rep: 10, money: 0 },
            { text: "\"I'll consider it... for the right price.\"", rep: -5, money: 2000 },
            { text: "\"Can we combine them? A funeral casino?\"", rep: -2, money: 500 }
        ]},
        { type: "debt_collector", text: "💼 A debt collector arrives demanding payment from one of the deceased.", choices: [
            { text: "\"They are dead. Take it up with God.\"", rep: 5, money: 0 },
            { text: "Pay them off to avoid a scene ($300)", rep: 2, money: -300 },
            { text: "Let them into the viewing room to collect", rep: -20, money: 100 }
        ]},
        { type: "secret_lover", text: "💋 A mysterious person in a veil claims to be the deceased's secret lover.", choices: [
            { text: "Allow them a private goodbye", rep: 5, money: 0 },
            { text: "Turn them away to respect the family", rep: 2, money: 0 },
            { text: "Charge them an 'undisclosed visit fee' ($200)", rep: -10, money: 200 }
        ]},
        { type: "blackout", text: "⚡ Complete blackout! Families are panicking in the dark.", choices: [
            { text: "Hand out premium scented candles (Costs $100)", rep: 8, money: -100 },
            { text: "Tell Ivan to sing louder to calm them", rep: 0, money: 0 },
            { text: "Use the opportunity to cut the A/C costs", rep: -15, money: 50 }
        ]},
        { type: "gold_rush", text: "💍 A valuable gold ring was found in the incinerator filters.", choices: [
            { text: "Return it to the grieving family", rep: 12, money: 0 },
            { text: "Sell it to a shady pawn shop downtown", rep: -15, money: 450 },
            { text: "Use it as a 'decoration' for a budget funeral", rep: -5, money: 100 }
        ]},
        { type: "funeral_critic", text: "🧐 A famous 'Funeral Critic' is in town to review your services.", choices: [
            { text: "Prepare a 'VIP Death Experience' ($600)", rep: 25, money: -600 },
            { text: "Treat them like anyone else (dead or alive)", rep: 2, money: 0 },
            { text: "Bribe them with 'complimentary burial plots'", rep: -10, money: -300 }
        ]},
        { type: "wrong_urn", text: "⚱️ You realize you just handed the wrong ashes to a family.", choices: [
            { text: "Run after them and admit the mistake", rep: -25, money: 0 },
            { text: "Pretend nothing happened. Ashes are ashes.", rep: 5, money: 0 },
            { text: "Sell them a 'Multicultural Mix' certificate ($200)", rep: -15, money: 200 }
        ]},
        { type: "escapee", text: "🏃 A corpse is missing from the table! Wait, it's just Ivan taking a nap.", choices: [
            { text: "Wake him up and get back to work", rep: 2, money: 0 },
            { text: "Charge the family for a 'spontaneous resurrection' show", rep: -20, money: 500 },
            { text: "Let him sleep, he looks peaceful", rep: 0, money: 0 }
        ]},
        { type: "mixup", text: "👯 Two families booked the same viewing room. They are starting to argue.", choices: [
            { text: "Offer a joint 'Double Death' ceremony discount", rep: -10, money: -200 },
            { text: "Flip a coin to see who gets the room", rep: -5, money: 0 },
            { text: "Bribe one family with free 'premium' coffee to wait", rep: 5, money: -100 }
        ]},
        { type: "tax_audit", text: "⚖️ A tax inspector arrives. He looks like he hasn't smiled since 1994.", choices: [
            { text: "Show him the (clean) books", rep: 5, money: 0 },
            { text: "Offer a 'Consultation Fee' to ignore the gold teeth sales", rep: -25, money: -400 },
            { text: "Claim the corpses are all 'unpaid interns'", rep: -5, money: 100 }
        ]},
        { type: "celebrity", text: "📸 A minor local Tik-Tok celebrity has passed away. The press is outside.", choices: [
            { text: "Keep it private and respectful", rep: 15, money: 0 },
            { text: "Sell exclusive 'Last Selfie' rights to a tabloid", rep: -40, money: 1500 },
            { text: "Use it to promote your own social media", rep: -10, money: 200 }
        ]},
        { type: "the_will", text: "📜 You found a hidden will in a jacket. It says 'Leave everything to my mortician'.", choices: [
            { text: "Report it to the authorities immediately", rep: 20, money: 0 },
            { text: "Cash it in and book a trip to the Bahamas", rep: -60, money: 5000 },
            { text: "Accidentally drop it into the furnace", rep: -10, money: 0 }
        ]},
        { type: "ghost_hunters", text: "🎥 A TV show called 'Ghost Bros' wants to film in your basement.", choices: [
            { text: "Let them in for a 'location fee' ($500)", rep: -10, money: 500 },
            { text: "Rig some fishing wire to make it look haunted ($800)", rep: -20, money: 800 },
            { text: "Refuse. The dead deserve silence.", rep: 10, money: 0 }
        ]},
        { type: "pet_cemetery", text: "🐹 A child wants a full funeral for their hamster, Mr. Fluffles.", choices: [
            { text: "Give Mr. Fluffles a hero's send-off ($100)", rep: 8, money: 100 },
            { text: "Offer a 'Viking Burial' in the coffee machine", rep: -15, money: 50 },
            { text: "Explain that this is a humans-only facility", rep: 0, money: 0 }
        ]},
        { type: "cryogenics", text: "❄️ A client wants to be frozen in your supply freezer until 2099.", choices: [
            { text: "Accept the contract and the cash ($1000)", rep: -20, money: 1000 },
            { text: "Tell them to try the local ice cream shop instead", rep: 2, money: 0 },
            { text: "Charge them for a 'Pre-Frozen' viewing package", rep: -10, money: 400 }
        ]},
        { type: "musical_tribute", text: "🎸 A family wants a 10-piece death metal band to play in the chapel.", choices: [
            { text: "Let them rock out for a 'Noise Fee' ($300)", rep: -15, money: 300 },
            { text: "Tell them Ivan will do a 'heavy' acoustic cover instead", rep: 5, money: 0 },
            { text: "Suggest a more traditional organist", rep: 2, money: 0 }
        ]},
        { type: "heirloom", text: "💎 You found a massive diamond inside the deceased's mouth while cleaning.", choices: [
            { text: "Discreetly return it to the family", rep: 25, money: 0 },
            { text: "It's finders keepers in this business!", rep: -35, money: 2000 },
            { text: "Sell it and donate half to 'charity' (yourself)", rep: -15, money: 1000 }
        ]}
    ],

    badLuckEvents: [
        { id: "roof_rats", textKey: "bad.roof_rats", rep: -10, money: -300 },
        { id: "broken_lighter", textKey: "bad.broken_lighter", rep: 0, money: -200 },
        { id: "coffee_explosion", textKey: "bad.coffee_explosion", rep: -15, money: 0 },
        { id: "termite_coffin", textKey: "bad.termite_coffin", rep: 0, money: -400 },
        { id: "wrong_air", textKey: "bad.wrong_air", rep: -5, money: 0 },
        { id: "ghost_complaint", textKey: "bad.ghost_complaint", rep: -8, money: 0 },
        { id: "tax_error", textKey: "bad.tax_error", rep: 0, money: -500 },
        { id: "slip_fall", textKey: "bad.slip_fall", rep: -20, money: -150 },
        { id: "stolen_urn", textKey: "bad.stolen_urn", rep: -12, money: 0 },
        { id: "cursed_phone", textKey: "bad.cursed_phone", rep: -5, money: 0 }
    ],

    // ===== HEARSE DRIVER =====
    hearseDriverQuotes: [
        "\"Buckle up! Wait, wrong audience. The cargo doesn't buckle.\"",
        "\"Another day, another body. I should start a podcast about this.\"",
        "\"I've seen things, man. Things that would make an undertaker cry. Wait, you ARE an undertaker.\"",
        "\"My GPS says 'arrive at final destination' for EVERY trip. Dark, right?\"",
        "\"I used to drive an ice cream truck. Surprisingly similar skill set.\""
    ],

    // ===== PAPERWORK TASKS =====
    paperworkTasks: [
        { text: "Try to pay the florist less money than the actual bill.", dc: 12, reward: 100, penalty: -50 },
        { text: "Bill speaker Ivan's expenses to the insurance company.", dc: 15, reward: 200, penalty: 0 },
        { text: "Use your niece's car as a hearse to save money.", dc: 10, reward: 150, penalty: -100, repPenalty: -5 },
        { text: "Hire a cleaning crew that looks suspiciously underage.", dc: 8, reward: 50, penalty: -150, repPenalty: -10 },
        { text: "Sign all the papers on the desk without reading them.", dc: 5, reward: 50, penalty: -200, repPenalty: -20 },
        { text: "Convince the formaldehyde supplier you already paid last month.", dc: 16, reward: 120, penalty: 0 },
        { text: "Sell the most expensive urn by claiming it is gold-plated.", dc: 13, reward: 250, penalty: -150, repPenalty: -15 },
        // Trade-offs & Random Humor
        { text: "Extract gold teeth from the incinerator 'for recycling'.", dc: 14, reward: 400, penalty: 0, repReward: -15, repPenalty: -25 },
        { text: "Water down the formaldehyde chemicals with cheap gin.", dc: 12, reward: 300, penalty: -100, repReward: -10, repPenalty: -15 },
        { text: "Donate to the 'Widows of Fallen Morticians' charity.", dc: 6, reward: -400, penalty: -500, repReward: 20, repPenalty: 0 },
        { text: "Organize a 'bring your own body' discount weekend.", dc: 17, reward: 600, penalty: 0, repReward: -30, repPenalty: -15 },
        { text: "Hire a professional 'hyper-mourner' to boost the atmosphere.", dc: 9, reward: -200, penalty: -300, repReward: 12, repPenalty: -5 },
        { text: "Recycle the 'single-use' funeral outfits from last week.", dc: 11, reward: 250, penalty: -150, repReward: -15, repPenalty: -25 },
        { text: "Convince a family that ghosts are actually 'premium features'.", dc: 18, reward: 500, penalty: -200, repReward: -5, repPenalty: -15 }
    ],

    paperworkExcuses: [
        "Maybe another time...",
        "I don't have the nerve for this right now.",
        "This is way too risky.",
        "My mother would not approve of this.",
        "I don't want to go to hell for this.",
        "Maybe if I close my eyes it'll disappear.",
        "My lawyer told me not to comment.",
        "I don't have steady enough hands for this today."
    ],

    // ===== UPGRADES =====
    upgrades: [
        { id: "firstaid", name: "First Aid Kit", desc: "Handle fainting in viewing room", cost: 1500, level: 1, icon: "🩹", room: null },
        { id: "embalm_kit", name: "Premium Embalming Kit", desc: "+2 to embalming rolls", cost: 2500, level: 1, icon: "🧪", room: null },
        { id: "ac_system", name: "A/C System", desc: "Control viewing room temperature", cost: 3000, level: 1, icon: "❄️", room: null },
        { id: "coffee_machine", name: "Espresso Machine", desc: "+10% cafeteria satisfaction", cost: 1200, level: 1, icon: "☕", room: null },
        { id: "cafeteria", name: "Full Cafeteria", desc: "Serve drinks & food to families", cost: 8500, level: 1, icon: "☕", room: "cafeteria" },
        { id: "crematorium", name: "Crematorium", desc: "Cremate on-site", cost: 12000, level: 1, icon: "🔥", room: "crematorium" },
        { id: "chapel", name: "The Chapel", desc: "Hold ceremonies on-site", cost: 15000, level: 1, icon: "⛪", room: "chapel" },
        { id: "hearse", name: "Own Hearse", desc: "No more rental fees", cost: 20000, level: 1, icon: "🚗", room: null },
        { id: "viewing2", name: "Viewing Room #2", desc: "Handle 2 families at once", cost: 5000, level: 1, icon: "🪦", room: null },
        { id: "viewing3", name: "Viewing Room #3", desc: "Handle 3 families at once", cost: 9000, level: 1, icon: "🪦", room: null },
        { id: "embalm_train", name: "Embalming Training", desc: "+1 permanent modifier", cost: 2000, level: 1, icon: "📚", room: null, repeatable: true, maxRepeats: 5 },
    ],

    // ===== GAME OVER QUOTES =====
    gameOverMoney: [
        "\"Turns out, death doesn't pay... YOUR bills.\"",
        "\"Bankrupt. Even the ghosts left — they couldn't afford the rent.\"",
        "\"Your funeral home needs a funeral. For its finances.\""
    ],
    gameOverRep: [
        "\"Your reputation is deader than your clients.\"",
        "\"Google reviews: ★☆☆☆☆ 'Would rather stay dead than go here.'\"",
        "\"Even the stray cat left a 1-star review.\""
    ],

    // ===== LEVEL THRESHOLDS =====
    levelXP: [0, 500, 1200, 2500, 4000, 6000, 8500, 12000, 16000, 21000, 27000],
    
    // Service pricing
    serviceBasePrices: {
        basic: 800,
        standard: 1500,
        premium: 2500,
        cremation: 1200,
        chapelService: 500,
        hearseRental: 300
    },

    tips: [
        "TIP: Keep your supplies stocked. Running out mid-embalming is... awkward.",
        "TIP: Match the sermon to the family's religion. Ivan won't check for you.",
        "TIP: The crematorium needs time to preheat. Plan ahead!",
        "TIP: Some families want alcohol. It's forbidden. But is it, really?",
        "TIP: Your reputation is everything. One bad review can spiral.",
        "TIP: The external hearse driver is weird, but reliable. Mostly."
    ]
};

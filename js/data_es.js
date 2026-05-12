/* ===== THANATOPRACTOR - Game Data (Spanish) ===== */
const DATA_ES = {
    // ===== GENERACIÓN DE NOMBRES =====
    firstNames: {
        male: ["Extinto","Fiambre","Difuntino","Mortis","Lázaro","Casimiro","Agapito","Bernabé","Torcuato","Pancracio","Rigoberto","Telesforo","Eustaquio","Tiburcio","Sinforoso","Apolonio","Heriberto","Desiderio","Anacleto","Celedonio"],
        female: ["Morticia","Difuntina","Llorona","Angustias","Dolores","Remedios","Visitación","Pura","Encarnación","Resurrección","Tecla","Candelaria","Gertrudis","Filomena","Clotilde","Segismunda","Dorotea","Petronila","Hermenegilda","Primitiva"]
    },
    lastNames: ["De la Fosa","Del Hoyo","Calavera","Tiesas","Frías","Del Campo Santo","De la Cruz","De la Sombra","Olvido","Silencio","Mármol","Ceniza","Polvo","Ciprés","Del Valhalla","Mortaja","Espectro","Ánima","Lamento","Tinieblas"],

    religions: [
        { id: "pastafarian", name: "Pastafari", icon: "🍝" },
        { id: "satanist", name: "Satanista LaVeyano", icon: "🐐" },
        { id: "caffeinated", name: "Orden del Cafeinado", icon: "☕" },
        { id: "rpg", name: "Culto al RPG", icon: "🎲" },
        { id: "nap", name: "Iglesia de la Siesta Final", icon: "⚰" },
        { id: "void", name: "Hijos del Vacío", icon: "💀" },
        { id: "jedi", name: "Orden Jedi", icon: "⚔️" },
        { id: "viking", name: "Pagano Nórdico", icon: "⚡" }
    ],

    familyMoods: [
        { id: "crying", name: "Devastados", icon: "😭", desc: "Apenas pueden hablar entre lágrimas." },
        { id: "celebrating", name: "Celebrando", icon: "🎉", desc: "Han traído confeti. A una funeraria." },
        { id: "zen", name: "Zen", icon: "🧘", desc: "Inquietantemente tranquilos." },
        { id: "drunk", name: "Intoxicados", icon: "🍺", desc: "Huelen a destilería." },
        { id: "arguing", name: "Peleando", icon: "😡", desc: "La discusión por la herencia empezó en el parking." },
        { id: "flirty", name: "Coquetos", icon: "😏", desc: "Alguien te está tirando los tejos." },
        { id: "paranoid", name: "Sospechosos", icon: "🤨", desc: "No paran de preguntar si estás SEGURO de que está muerto." },
        { id: "cheerful", name: "Aliviados", icon: "😌", desc: "\"Para ser sinceros, el tío era un poco capullo.\"" },
        { id: "vampire", name: "Góticos", icon: "🦇", desc: "Parecen estar esperando a que el fallecido despierte." },
        { id: "alien", name: "Extraterrestres", icon: "🛸", desc: "Sospechan que el fallecido era un observador cósmico." },
        { id: "influencer", name: "Tendencia", icon: "🤳", desc: "Todo es una oportunidad para una foto. Incluso esto." },
        { id: "gamer", name: "Gamers", icon: "🎮", desc: "Siguen buscando el botón de 'respawn'." },
        { id: "clone", name: "Sospechosos", icon: "👥", desc: "Están convencidos de que este cuerpo es un clon del gobierno." },
        { id: "tax", name: "Intrigantes", icon: "💼", desc: "Necesitan una última 'firma' del fallecido." },
        { id: "steampunk", name: "Mecanizados", icon: "⚙️", desc: "Quieren añadir engranajes de latón al ataúd." },
        { id: "reality", name: "Dramáticos", icon: "🎭", desc: "Se lo están tomando como el final de temporada." },
        { id: "coupon", name: "Austeros", icon: "🎫", desc: "Han traído una pila de cupones caducados." },
        { id: "traveler", name: "Temporales", icon: "⏳", desc: "Afirman que el fallecido revivirá en una semana." },
        { id: "conspiracy", name: "Conspiranoicos", icon: "🛸", desc: "Creen que el gobierno rastrea el ataúd con satélites." },
        { id: "fitness", name: "Fitness", icon: "🏋️", desc: "Quieren saber si el difunto llegó a su meta de pasos diaria." },
        { id: "chef", name: "Chefs", icon: "👨‍🍳", desc: "Más interesados en el menú de la cafetería que en el entierro." },
        { id: "musician", name: "Músicos", icon: "🎸", desc: "Quieren convertir el funeral en una gira mundial." },
        { id: "superstitious", name: "Supersticiosos", icon: "🧿", desc: "Necesitan tapar todos los espejos del edificio." },
        { id: "detective", name: "Detectives", icon: "🕵️", desc: "Están investigando las causas por su cuenta." },
        { id: "occult", name: "Ocultistas", icon: "🕯️", desc: "Quieren celebrar una sesión de espiritismo en el velatorio." },
        { id: "techie", name: "Tecnológicos", icon: "💻", desc: "Quieren subir la conciencia del difunto a la nube." },
        { id: "romantic", name: "Románticos", icon: "🌹", desc: "Buscan a su próxima pareja entre los asistentes." },
        { id: "minimalist", name: "Minimalistas", icon: "📦", desc: "Quieren un ataúd de montaje fácil tipo IKEA." }
    ],
    collections: [
        { id: "gold_tooth", name: "Diente de oro calavera", desc: "Un molar tallado como una calavera. Puro lujo.", icon: "🦷" },
        { id: "pizza_letter", name: "Carta de amor a una pizza", desc: "Dedicada a una Pepperoni. Muy romántico.", icon: "🍕" },
        { id: "magic_sock", name: "Calcetín desparejado mágico", desc: "Siempre parece pertenecer a otra persona.", icon: "🧦" },
        { id: "ghost_key", name: "Llave de mansión inexistente", desc: "No abre nada, pero pesa mucho.", icon: "🔑" },
        { id: "crystal_balls", name: "Bolas de cristal de hipnotista", desc: "Si miras fijamente, ves la cara de Iván.", icon: "🔮" },
        { id: "treasure_map", name: "Mapa del tesoro en servilleta", desc: "La X marca el lugar. Está bajo una tumba local. Tumba: 1418a", icon: "📜" },
        { id: "glass_eye", name: "Ojo de cristal que mira", desc: "Parece seguirte por toda la oficina.", icon: "👁️" },
        { id: "concert_ticket", name: "Entrada de concierto Ska", desc: "Concierto de Mephiskapheles con Seiskafés de teloneros.", icon: "🎫" },
        { id: "returned_ring", name: "Anillo de compromiso devuelto", desc: "Una historia triste en una joya pequeña.", icon: "💍" },
        { id: "choc_coin", name: "Moneda de chocolate eterna", desc: "Nunca se derrite, pero huele a cacao.", icon: "🍫" },
        { id: "vintage_lighter", name: "Mechero Vintage", desc: "Grabado con: 'Propiedad de la Muerte'.", icon: "🔥" },
        { id: "mystery_cassette", name: "Cassette Misterioso", desc: "Etiquetado: 'No escuchar de noche'.", icon: "📼" }
    ],

    arrivalIntros: [
        "Una familia entra por la puerta. Suena la campana. Alguien sorbe por la nariz.",
        "La puerta cruje dramáticamente. Entra una familia como si hicieran casting para una telenovela.",
        "Entra un grupo a trompicones. Uno lleva gafas de sol. En interiores. A las 9 AM.",
        "Suena el timbre. Dejas tu taza de café de 'MUERTO DE SUEÑO' y pones cara profesional.",
        "Llega un coche a tope de reguetón. Salen tres personas, una con una foto enmarcada.",
        "Alguien abre la puerta de una patada. \"¡NECESITAMOS SUS SERVICIOS!\" anuncian al vestíbulo vacío.",
        "Una persona muy compuesta en traje sastre entra y deja una tarjeta en el mostrador.",
        "Se abre la puerta. Entra una mujer con un Tupperware. \"Al difunto le encantaba mi lasaña\", explica."
    ],

    arrivalDialogues: {
        crying: [
            { text: "\"Nuestro amado {name} ha... ha...\" *llanto incontrolable*", choices: [
                { text: "\"Tómese su tiempo. Aquí tiene un pañuelo... y otro... y la caja entera.\"", rep: 2, money: 0 },
                { text: "\"Lo entiendo. Trataremos esto con dignidad y cuidado.\"", rep: 1, money: 0 },
                { text: "\"Mire, cobro por horas, así que cuando esté listo...\"", rep: -3, money: 0 }
            ]},
        ],
        celebrating: [
            { text: "\"¡El tío {name} POR FIN ha muerto! Digo... que descanse en paz. ¡Fiesta en nuestra casa luego!\"", choices: [
                { text: "\"Toda vida merece celebración. ¡Démosle a {name} una buena despedida!\"", rep: 2, money: 0 },
                { text: "\"Esa es... una forma de llevar el duelo. Ofrecemos servicios completos.\"", rep: 1, money: 0 },
                { text: "\"¿Puedo ir a la fiesta? Llevaré cócteles de líquido embalsamador.\"", rep: 0, money: 0 }
            ]},
        ],
        zen: [
            { text: "\"La muerte es solo una transición. {name} ha trascendido. Buscamos sus servicios terrenales.\"", choices: [
                { text: "\"Qué perspectiva tan hermosa. Haremos que esta transición sea perfecta.\"", rep: 2, money: 0 },
                { text: "\"Vale. Trascendido. Hablemos de los paquetes.\"", rep: 0, money: 0 },
                { text: "\"Guay, guay. ¿El espíritu de {name} ha mencionado un presupuesto para todo esto?\"", rep: -2, money: 0 }
            ]},
        ],
        drunk: [
            { text: "*hip* \"Aschí... mi {relation} {name}... ha muerto... ¿o no? No espera, sí, está muerto.\"", choices: [
                { text: "\"Déjeme traerle agua primero. Discutiremos todo cuando esté más cómodo.\"", rep: 2, money: 0 },
                { text: "\"Puedo confirmar: sí, definitivamente ha fallecido. Procedamos.\"", rep: 0, money: 0 },
                { text: "\"Señor/Señora, esto es una funeraria, no un bar. Aunque tenemos cafetería...\"", rep: -1, money: 0 }
            ]},
        ],
        arguing: [
            { text: "\"¡TE DIJE que mamá quería ser incinerada!\" \"¡ELLA DIJO ENTERRADA!\" \"¡NUNCA LA ESCUCHABAS!\"", choices: [
                { text: "\"Familias, respiremos. Podemos explorar todas las opciones juntos.\"", rep: 2, money: 0 },
                { text: "\"¿Y si hacemos ambas? Incineramos la mitad, enterramos la mitad. ¡Todos ganan!\"", rep: -1, money: 0 },
                { text: "\"Tengo una moneda para lanzar. Moneda funeraria profesional. Muy digna.\"", rep: -2, money: 50 }
            ]},
        ],
        flirty: [
            { text: "\"Así que... ¿trabajas con muertos todo el día? Eso debe hacer que aprecies a los *vivos*.\" *guiño*", choices: [
                { text: "\"Aprecio a TODOS mis clientes. Ahora, sobre el difunto...\"", rep: 2, money: 0 },
                { text: "\"¿De verdad es el momento? ...Pero sí, tengo muy buenas manos. Para embalsamar.\"", rep: 0, money: 0 },
                { text: "\"Mi corazón es tan frío como mis clientes. Hablemos de negocios.\"", rep: 1, money: 0 }
            ]},
        ],
        paranoid: [
            { text: "\"¿Estás ABSOLUTAMENTE seguro de que {name} está muerto? Compruébalo otra vez. Vi un documental...\"", choices: [
                { text: "\"Le aseguro que nuestros certificados médicos son exhaustivos. {name} descansa en paz.\"", rep: 2, money: 0 },
                { text: "\"¿Quiere pincharle con un palo? Tenemos un palo profesional para pinchar.\"", rep: -1, money: 0 },
                { text: "\"Si se despierta, los servicios son gratis. ¿Trato?\"", rep: 0, money: 0 }
            ]},
        ],
        cheerful: [
            { text: "\"Mira, el tío {name} vivió hasta los 94, comió tocino todos los días y sobrevivió a tres esposas. Leyenda.\"", choices: [
                { text: "\"¡Menuda vida! Honremos ese legado con un servicio digno de una leyenda.\"", rep: 2, money: 0 },
                { text: "\"¿94 y tocino a diario? Deberíamos estudiar las arterias de ese hombre.\"", rep: 0, money: 0 },
                { text: "\"¿Tres esposas? Podemos arreglar horarios de visita separados. Créame, ya nos ha pasado.\"", rep: 1, money: 50 }
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
                { textKey: "dlg.clone.c2", rep: 1, money: 0 },
                { textKey: "dlg.clone.c3", rep: -2, money: 0 }
            ]}
        ],
        tax: [
            { textKey: "dlg.tax.text", choices: [
                { textKey: "dlg.tax.c1", rep: -1, money: 0 },
                { textKey: "dlg.tax.c2", rep: -10, money: 500 },
                { textKey: "dlg.tax.c3", rep: 5, money: 0 }
            ]}
        ],
        steampunk: [
            { textKey: "dlg.steampunk.text", choices: [
                { textKey: "dlg.steampunk.c1", rep: 3, money: 100 },
                { textKey: "dlg.steampunk.c2", rep: 2, money: 0 },
                { textKey: "dlg.steampunk.c3", rep: -5, money: 0 }
            ]}
        ],
        reality: [
            { textKey: "dlg.reality.text", choices: [
                { textKey: "dlg.reality.c1", rep: 2, money: 0 },
                { textKey: "dlg.reality.c2", rep: 0, money: 200 },
                { textKey: "dlg.reality.c3", rep: 1, money: 0 }
            ]}
        ],
        coupon: [
            { textKey: "dlg.coupon.text", choices: [
                { textKey: "dlg.coupon.c1", rep: 2, money: -50 },
                { textKey: "dlg.coupon.c2", rep: 0, money: 0 },
                { textKey: "dlg.coupon.c3", rep: -5, money: 0 }
            ]}
        ],
        traveler: [
            { textKey: "dlg.traveler.text", choices: [
                { textKey: "dlg.traveler.c1", rep: 2, money: 0 },
                { textKey: "dlg.traveler.c2", rep: 1, money: 0 },
                { textKey: "dlg.traveler.c3", rep: -2, money: 0 }
            ]}
        ],
        conspiracy: [
            { textKey: "dlg.conspiracy.text", choices: [
                { textKey: "dlg.conspiracy.c1", rep: 2, money: 0 },
                { textKey: "dlg.conspiracy.c2", rep: 0, money: 200 },
                { textKey: "dlg.conspiracy.c3", rep: 5, money: 0 }
            ]}
        ],
        fitness: [
            { textKey: "dlg.fitness.text", choices: [
                { textKey: "dlg.fitness.c1", rep: 1, money: 0 },
                { textKey: "dlg.fitness.c2", rep: 2, money: 0 },
                { textKey: "dlg.fitness.c3", rep: -2, money: 0 }
            ]}
        ],
        chef: [
            { textKey: "dlg.chef.text", choices: [
                { textKey: "dlg.chef.c1", rep: 2, money: 0 },
                { textKey: "dlg.chef.c2", rep: 1, money: 0 },
                { textKey: "dlg.chef.c3", rep: -1, money: 100 }
            ]}
        ],
        musician: [
            { textKey: "dlg.musician.text", choices: [
                { textKey: "dlg.musician.c1", rep: 2, money: 0 },
                { textKey: "dlg.musician.c2", rep: -2, money: 300 },
                { textKey: "dlg.musician.c3", rep: 1, money: 0 }
            ]}
        ],
        superstitious: [
            { textKey: "dlg.superstitious.text", choices: [
                { textKey: "dlg.superstitious.c1", rep: 3, money: 0 },
                { textKey: "dlg.superstitious.c2", rep: 0, money: 150 },
                { textKey: "dlg.superstitious.c3", rep: -1, money: 0 }
            ]}
        ],
        detective: [
            { textKey: "dlg.detective.text", choices: [
                { textKey: "dlg.detective.c1", rep: 2, money: 0 },
                { textKey: "dlg.detective.c2", rep: 0, money: 100 },
                { textKey: "dlg.detective.c3", rep: -5, money: 0 }
            ]}
        ],
        occult: [
            { textKey: "dlg.occult.text", choices: [
                { textKey: "dlg.occult.c1", rep: 1, money: 0 },
                { textKey: "dlg.occult.c2", rep: -2, money: 200 },
                { textKey: "dlg.occult.c3", rep: 5, money: 0 }
            ]}
        ],
        techie: [
            { textKey: "dlg.techie.text", choices: [
                { textKey: "dlg.techie.c1", rep: 2, money: 0 },
                { textKey: "dlg.techie.c2", rep: 0, money: 500 },
                { textKey: "dlg.techie.c3", rep: -3, money: 0 }
            ]}
        ],
        romantic: [
            { textKey: "dlg.romantic.text", choices: [
                { textKey: "dlg.romantic.c1", rep: 2, money: 0 },
                { textKey: "dlg.romantic.c2", rep: 0, money: 0 },
                { textKey: "dlg.romantic.c3", rep: -2, money: 0 }
            ]}
        ],
        minimalist: [
            { textKey: "dlg.minimalist.text", choices: [
                { textKey: "dlg.minimalist.c1", rep: 1, money: -100 },
                { textKey: "dlg.minimalist.c2", rep: 2, money: 0 },
                { textKey: "dlg.minimalist.c3", rep: -2, money: 0 }
            ]}
        ]
    },

    deathCauses: [
        "Causas naturales", "Vejez extrema", "Un trágico accidente de jardinería",
        "Se atragantó con una aceituna en una boda", "Circunstancias irónicas",
        "Una acalorada discusión sobre aparcamiento", "Siesta excesiva",
        "Complicaciones por una reacción alérgica a los lunes",
        "Se cayó de una escalera cambiando una bombilla (la bombilla sobrevivió)",
        "Combustión espontánea (supuestamente)", "Un desacuerdo con la gravedad",
        "Demasiada emoción en el bingo", "Error de cálculo en un salto de fe",
        "Intento fallido de domesticar un tejón con un palo de selfie",
        "Shock al ver los precios de la luz", "Se confundió de seta en el risotto",
        "Un estornudo inoportuno mientras manejaba una motosierra",
        "Mordedura de hámster radioactivo (supuestamente)",
        "Se atragantó intentando decir 'supercalifragilisticoespialidodoso' bajo el agua",
        "Ataque de risa viendo un funeral ajeno", "Reacción alérgica a la realidad",
        "Se quedó encerrado en una nevera buscando el último yogur",
        "Impacto de un meteorito del tamaño de una canica en el ojo izquierdo"
    ],

    // ===== CAFETERIA =====
    cafeOrders: [
        { item: "Café", price: 2, icon: "☕", humor: "Negro como el vacío, perfecto." },
        { item: "Té", price: 2, icon: "🍵", humor: "Consuelo en taza. El Earl Grey no te juzga." },
        { item: "Sándwich del más acá", price: 4, icon: "🥪", humor: "Nuestra 'Última Cena' especial." },
        { item: "Pastel de alma", price: 5, icon: "🍰", humor: "Horneado con dudosas intenciones." },
    ],
    cafeAlcoholRequests: [
        "\"¿Tienes algo... más fuerte? Ha sido un DÍA.\"",
        "\"¿No tendrás whisky por ahí? Por... motivos medicinales.\"",
        "\"Mi padre habría querido que brindara con tequila. ¿Tienes?\"",
        "\"¿Es muy pronto para vino? Pregunto por un amigo. El amigo soy yo.\""
    ],
    cafeAlcoholChoices: [
        { text: "\"Lo siento, no se permite alcohol en las instalaciones.\"", rep: 1, money: 0, satisfaction: -5 },
        { text: "\"Pero por {bribe} monedas, puedo servírtelo...\"", rep: -5, money: 0, satisfaction: 25, isBribe: true },
        { text: "\"Permítame ofrecerle nuestra 'Mezcla de Consuelo'. Café extra fuerte.\"", rep: 1, money: 2, satisfaction: 5 }
    ],

    // ===== CHAPEL - IVAN'S SERMONS =====
    sermons: {
        caffeinated: {
            correct: [
                "\"En el nombre del Tueste, el Filtro y el Grano Sagrado. {name} ha ascendido a la gran cafetera en el cielo.\"",
                "\"El Señor da y el Señor quita... especialmente cuando se pasa el efecto de la cafeína. {name} está totalmente descafeinado ahora.\"",
            ],
            name: "Rito Cafeinado"
        },
        rpg: {
            correct: [
                "\"Por la suerte de los dados, {name} ha sido llamado. Sus HP cayeron a cero y el Clérigo no tenía más hechizos.\"",
                "\"| {name} vivía por la tirada. Por desgracia, su última tirada de salvación fue un 1 natural. Honramos su hoja de personaje.\""
            ],
            name: "Servicio RPG"
        },
        nap: {
            correct: [
                "\"Silencio. {name} ha entrado en el Sueño Profundo. El despertador se ha silenciado para siempre. Que sus almohadas estén siempre frías.\"",
                "\"{name} ha vuelto al colchón supremo. No molestar. El servicio de habitaciones ha sido notificado.\""
            ],
            name: "Ceremonia del Sueño"
        },
        void: {
            correct: [
                "\"El Vacío nos llama a todos. {name} simplemente respondió temprano. Devolvemos este polvo de estrellas prestado a la nada infinita.\"",
                "\"Nada importa, y eso es hermoso. {name} abraza la hermosa nada. Fundido a negro.\""
            ],
            name: "Invocación del Vacío"
        },
        pastafarian: {
            correct: [
                "\"Por Su Apéndice Tallarinesco, {name} ha sido abrazado por el Monstruo de Espagueti Volador. Que la salsa le acompañe. R'amén.\"",
                "\"{name} ahora navega por el gran Volcán de Cerveza en el cielo. Tocado por Su Apéndice Tallarinesco para siempre. R'amén.\""
            ],
            name: "Bendición Pastafari"
        },
        jedi: {
            correct: [
                "\"La Fuerza era intensa en {name}. Ahora es uno con ella. Como Obi-Wan, pero desapareciendo con menos dramatismo.\"",
                "\"Hazlo o no lo hagas, pero no lo intentes. {name} lo hizo. Y ahora descansa. Que la Fuerza le acompañe. Siempre.\""
            ],
            name: "Memorial Jedi"
        },
        satanist: {
            correct: [
                "\"¡Salve a ti mismo! {name} vivió bajo sus propias reglas. LaVey estaría orgulloso. Probablemente. También está muerto, así que...\"",
                "\"{name} abrazó su oscuridad interior. Ahora abraza la oscuridad exterior. Círculo completo. Muy poético.\""
            ],
            name: "Ritual LaVeyano"
        },
        viking: {
            correct: [
                "\"¡ODÍN DA LA BIENVENIDA A {name} EN EL VALHALLA! Por desgracia no podemos hacer lo del barco en llamas. Normativas de incendios.\"",
                "\"¡Por el martillo de Thor y la gracia de Freya, {name} cena con los dioses esta noche! Nosotros cenamos sándwiches. Casi lo mismo.\""
            ],
            name: "Despedida Nórdica"
        },
        wrong: [
            "\"Iván se aclara la garganta nerviosamente. Está claro que eligió el guión equivocado.\"",
            "\"La familia intercambia miradas horrorizadas cuando Iván menciona a la deidad equivocada.\"",
            "\"Alguien en la primera fila susurra 'Esa no es nuestra religión' lo suficientemente alto para que todos lo escuchen.\""
        ]
    },

    ivanQuotes: [
        "\"La muerte es solo la forma que tiene Dios de decirte que tu suscripción ha caducado.\"",
        "\"He oficiado 400 funerales. Mi tasa de éxito es... bueno, todos siguen muertos.\"",
        "\"La gente dice que tengo un don para hacer que los muertos se sientan bienvenidos. Los vivos, no tanto.\"",
        "\"Otro día, otra alma. ¡Vamos a darles un espectáculo!\"",
        "\"Iba a ser cómico, pero este trabajo es mortal. Literalmente.\"",
        "\"Listo cuando queráis. La muerte no espera a nadie, pero yo cobro por hora.\"",
        "\"Dato curioso: soy el tío más popular en los funerales. El listón está bajo, pero aún así.\""
    ],

    viewingRequests: [
        { type: "see_body", text: "\"Nos gustaría ver a {name} una última vez. (Concluir el velatorio)\"", icon: "👁️" },
        { type: "water", text: "\"¿Podríamos tomar un poco de agua, por favor?\"", icon: "💧" },
        { type: "temperature", text: "\"¡Hace un frío/calor horrible aquí!\"", icon: "🌡️" },
        { type: "faint", text: "\"¡Oh no, alguien se acaba de desmayar!\"", icon: "😵" },
        { type: "flowers", text: "\"Las flores parecen marchitas. ¿Podemos conseguir otras frescas? (llama por tlf, corre)\"", icon: "💐" },
        { type: "lighting", text: "\"¿Se podría ajustar la iluminación? Está demasiado brillante/oscura.\"", icon: "💡" },
        { type: "privacy", text: "\"Necesitamos un momento a solas con {name}, vuelva en 5 min.\"", icon: "🚪" },
        { type: "music", text: "\"¿Pueden poner algo de música? A {name} le encantaba el jazz.\"", icon: "🎵" }
    ],

    viewingBodyReactions: {
        excellent: [
            "\"{name} se ve... en paz. Como si estuviera durmiendo. Muchas gracias.\"",
            "\"Habéis hecho un trabajo precioso. A {name} le habría encantado. Bueno... ya me entiendes.\"",
            "\"{name} parece listo para irse de fiesta. ¡Menudo trabajo de chapa y pintura!\"",
            "\"Es increíble. Juro que he visto a {name} guiñarme un ojo. ¡Gran trabajo!\""
        ],
        good: [
            "\"{name} se ve bien. Un poco cetrino quizás, pero bien.\"",
            "\"Así es... más o menos como le recuerdo. Bastante parecido.\"",
            "\"Se ve... aceptable. {name} nunca fue un modelo de pasarela, pero habéis hecho lo que habéis podido.\"",
            "\"Bastante bien. Al menos no se le cae la mandíbula como al abuelo de los García.\""
        ],
        mediocre: [
            "\"¿Se supone que {name} tiene que estar tan... naranja?\"",
            "\"Algo parece raro. ¿{name} siempre tuvo esa expresión?\"",
            "\"¿{name} siempre fue tan... grisáceo? Parece que lo habéis sacado de una película de los años 20.\"",
            "\"Bueno, al menos está presentable. Si cierras mucho los ojos, se parece a él.\""
        ],
        bad: [
            "\"¡¿QUÉ LE HABÉIS HECHO A {name}?! ¡Parece un muñeco maldito!\"",
            "\"Voy a necesitar terapia después de ver esto. MUCHA terapia.\"",
            "\"¡Madre mía! {name} parece que ha tenido una pelea con un bote de maquillaje y ha perdido.\"",
            "\"¿Por qué tiene {name} esa sonrisa tan siniestra? Me está dando escalofríos.\""
        ],
        catastrophic: [
            "\"¡¿ESE ES SIQUIERA {name}?! ¡OH DIOS!\" *gritos y lloros*",
            "\"¡Voy a demandar a este lugar hasta ARRUINAROS! ¡Tengo a mi abogado en marcado rápido!\"",
            "\"¡¿PERO QUÉ ES ESTO?! ¡Parece una lasaña mal hecha! ¡Sacrílegos!\"",
            "\"¡Llamad al exorcista! ¡Habéis convertido a {name} en algo que no es de este mundo!\""
        ]
    },

    randomEvents: [
        { type: "phone_prank", text: "📞 Suena el teléfono: \"Hola, ¿es aquí para reservar mesa? ¿Para el más allá?\" *clic*", effect: null },
        { type: "cat", text: "🐈 Un gato callejero ha entrado en la sala de velatorio y se niega a irse.", choices: [
            { text: "Sacar al gato suavemente", rep: 0, money: 0 },
            { text: "Dejar que se quede. Los gatos son terapéuticos.", rep: 1, money: 0 },
            { text: "Adoptarlo como mascota de la funeraria", rep: 2, money: -50 }
        ]},
        { type: "power_outage", text: "💡 ¡Corte de luz! ¡La temperatura del crematorio está bajando!", effect: "crema_cool" },
        { type: "newspaper", text: "📰 El periódico local quiere hacer un reportaje sobre Descanso Eterno. ¿Entrevista?", choices: [
            { text: "Aceptar la entrevista cortésmente", rep: 5, money: 0 },
            { text: "Rechazar — demasiado ocupado con los muertos", rep: 0, money: 0 },
            { text: "Solo si el titular es 'Se Mueren Por Entrar'", rep: 3, money: 0 }
        ]},
        { type: "ghost", text: "👻 Un familiar asegura haber visto un fantasma en el pasillo.", choices: [
            { text: "\"Es solo la corriente del aire acondicionado. Nada sobrenatural.\"", rep: 1, money: 0 },
            { text: "\"Ofrecemos detección de fantasmas por solo $200 adicionales.\"", rep: -1, money: 200 },
            { text: "\"Ah, ese es solo Gerald. Nunca se fue.\"", rep: 0, money: 0 }
        ]},
        { type: "supplier", text: "📦 ¡Entrega de suministros para embalsamar! ¿Firmar el paquete?", effect: "supplies" },
        
        { type: "flood", text: "💧 ¡Ha reventado una tubería en el sótano! El líquido de embalsamar se mezcla con el agua...", choices: [
            { text: "Llamar a un fontanero de urgencia ($500)", rep: 2, money: -500 },
            { text: "Fregarlo tú mismo y esperar lo mejor", rep: -5, money: 0 },
            { text: "Venderlo como 'agua perfumada premium' a los vecinos", rep: -15, money: 300 }
        ]},
        { type: "casino", text: "🎰 Un empresario turbio ofrece comprar la funeraria para montar un casino.", choices: [
            { text: "\"¡Esto es terreno sagrado! ¡Lárguese inmediatamente!\"", rep: 10, money: 0 },
            { text: "\"Me lo pensaré... por el precio adecuado.\"", rep: -5, money: 2000 },
            { text: "\"¿Podemos combinar ambos? ¿Un casino funerario?\"", rep: -2, money: 500 }
        ]},
        { type: "debt_collector", text: "💼 Un cobrador de morosos llega exigiendo el pago de una deuda de uno de los difuntos.", choices: [
            { text: "\"Está muerto. Háblelo con Dios.\"", rep: 5, money: 0 },
            { text: "Pagarle para evitar una escena ($300)", rep: 2, money: -300 },
            { text: "Dejarle pasar a la sala de velatorio para que cobre", rep: -20, money: 100 }
        ]},
        { type: "secret_lover", text: "💋 Una persona misteriosa con velo afirma ser el amante secreto del difunto.", choices: [
            { text: "Permitirles una despedida privada", rep: 5, money: 0 },
            { text: "No dejarle pasar por respeto a la familia", rep: 2, money: 0 },
            { text: "Cobrarles una 'tarifa de visita no revelada' ($200)", rep: -10, money: 200 }
        ]},
        { type: "blackout", text: "⚡ ¡Apagón total! Las familias están en pánico a oscuras.", choices: [
            { text: "Repartir velas aromáticas premium (Cuesta $100)", rep: 8, money: -100 },
            { text: "Decirle a Iván que cante más alto para calmarlos", rep: 0, money: 0 },
            { text: "Usar la oportunidad para ahorrar gastos de aire acondicionado", rep: -15, money: 50 }
        ]},
        { type: "gold_rush", text: "💍 Se ha encontrado un valioso anillo de oro en los filtros de la incineradora.", choices: [
            { text: "Devolverlo a la afligida familia", rep: 12, money: 0 },
            { text: "Venderlo en una casa de empeños de dudosa reputación", rep: -15, money: 450 },
            { text: "Usarlo como 'decoración' para un funeral de bajo presupuesto", rep: -5, money: 100 }
        ]},
        { type: "funeral_critic", text: "🧐 Un famoso 'Crítico de Funerarias' está en la ciudad para evaluar tus servicios.", choices: [
            { text: "Preparar una 'Experiencia de Muerte VIP' ($600)", rep: 25, money: -600 },
            { text: "Tratarlo como a cualquier otro (vivo o muerto)", rep: 2, money: 0 },
            { text: "Sobornarlo con 'parcelas de entierro de cortesía'", rep: -10, money: -300 }
        ]},
        { type: "wrong_urn", text: "⚱️ Te das cuenta de que acabas de entregar las cenizas equivocadas a una familia.", choices: [
            { text: "Correr tras ellos y admitir el error", rep: -25, money: 0 },
            { text: "Fingir que no ha pasado nada. Cenizas son cenizas.", rep: 5, money: 0 },
            { text: "Venderles un certificado de 'Mezcla Multicultural' ($200)", rep: -15, money: 200 }
        ]},
        { type: "escapee", text: "🏃 ¡Falta un cadáver de la camilla! Ah, no, es solo Iván echándose una siesta.", choices: [
            { text: "Despertarlo y que vuelva al trabajo", rep: 2, money: 0 },
            { text: "Cobrar a la familia por un espectáculo de 'resurrección espontánea'", rep: -20, money: 500 },
            { text: "Dejarlo dormir, se le ve tan en paz", rep: 0, money: 0 }
        ]},
        { type: "mixup", text: "👯 Dos familias reservaron la misma sala de velatorio. Estás empezando a discutir.", choices: [
            { text: "Ofrecer un descuento por ceremonia conjunta 'Muerte Doble'", rep: -10, money: -200 },
            { text: "Lanzar una moneda para ver quién se queda la sala", rep: -5, money: 0 },
            { text: "Sobornar a una familia con café 'premium' gratis para que esperen", rep: 5, money: -100 }
        ]},
        { type: "tax_audit", text: "⚖️ Llega un inspector de hacienda. Parece que no sonríe desde el Mundial del 94.", choices: [
            { text: "Enseñarle los libros (los legales)", rep: 5, money: 0 },
            { text: "Ofrecerle una 'tasa de consulta' para que ignore la venta de dientes de oro", rep: -25, money: -400 },
            { text: "Afirmar que los cadáveres son todos 'becarios sin sueldo'", rep: -5, money: 100 }
        ]},
        { type: "celebrity", text: "📸 Ha muerto una pequeña celebridad local de Tik-Tok. La prensa está fuera.", choices: [
            { text: "Mantenerlo privado y respetuoso", rep: 15, money: 0 },
            { text: "Vender los derechos de la 'Última Selfie' a un tabloide", rep: -40, money: 1500 },
            { text: "Usarlo para promocionar tus propias redes sociales", rep: -10, money: 200 }
        ]},
        { type: "the_will", text: "📜 Has encontrado un testamento oculto en una chaqueta. Dice: 'Déjaselo todo a mi funerario'.", choices: [
            { text: "Informar a las autoridades inmediatamente", rep: 20, money: 0 },
            { text: "Cobrarlo y reservar un viaje a las Bahamas", rep: -60, money: 5000 },
            { text: "Dejarlo caer 'accidentalmente' en la incineradora", rep: -10, money: 0 }
        ]},
        { type: "ghost_hunters", text: "🎥 Un programa de TV llamado 'Ghost Bros' quiere rodar en tu sótano.", choices: [
            { text: "Dejarles entrar por una 'tasa de localización' ($500)", rep: -10, money: 500 },
            { text: "Preparar unos hilos de pescar para que parezca encantado ($800)", rep: -20, money: 800 },
            { text: "Rechazar. Los muertos merecen silencio.", rep: 10, money: 0 }
        ]},
        { type: "pet_cemetery", text: "🐹 Un niño quiere un funeral completo para su hámster, el Sr. Peluquín.", choices: [
            { text: "Darle al Sr. Peluquín una despedida de héroe ($100)", rep: 8, money: 100 },
            { text: "Ofrecer un 'Entierro Vikingo' en la máquina de café", rep: -15, money: 50 },
            { text: "Explicar que estas instalaciones son solo para humanos", rep: 0, money: 0 }
        ]},
        { type: "cryogenics", text: "❄️ Un cliente quiere ser congelado en tu nevera de suministros hasta el 2099.", choices: [
            { text: "Aceptar el contrato y el efectivo ($1000)", rep: -20, money: 1000 },
            { text: "Decirle que pruebe en la heladería del barrio", rep: 2, money: 0 },
            { text: "Cobrarle por un paquete de velatorio 'Pre-Congelado'", rep: -10, money: 400 }
        ]},
        { type: "musical_tribute", text: "🎸 Una familia quiere que una banda de death metal toque en la capilla.", choices: [
            { text: "Dejarles tocar por una 'Tasa de Ruido' ($300)", rep: -15, money: 300 },
            { text: "Decir que Iván hará una versión acústica 'cañera' en su lugar", rep: 5, money: 0 },
            { text: "Sugerir un organista más tradicional", rep: 2, money: 0 }
        ]},
        { type: "heirloom", text: "💎 Has encontrado un diamante enorme dentro de la boca del difunto mientras limpiabas.", choices: [
            { text: "Devolverlo discretamente a la familia", rep: 25, money: 0 },
            { text: "¡El que lo encuentra se lo queda!", rep: -35, money: 2000 },
            { text: "Venderlo y donar la mitad a 'caridad' (a ti mismo)", rep: -15, money: 1000 }
        ]},
        { type: "lookalike", text: "🎭 Un imitador profesional del difunto aparece en el velatorio y empieza a actuar.", choices: [
            { text: "Aceptarlo como un tributo artístico", rep: 5, money: 0 },
            { text: "Echarlo inmediatamente por falta de respeto", rep: 2, money: 0 },
            { text: "Cobrarle entrada como 'Espectáculo Extra' ($100)", rep: -10, money: 100 }
        ]},
        { type: "ikea_coffin", text: "📦 Una familia trae su propio ataúd de cartón tipo IKEA y te pide que lo montes.", choices: [
            { text: "Cobrar 'Tasa de Montaje' ($200)", rep: 0, money: 200 },
            { text: "Decir que no cumple las normas de seguridad", rep: -5, money: 0 },
            { text: "Aceptarlo por compromiso ecológico", rep: 10, money: 0 }
        ]},
        { type: "parrot", text: "🦜 El loro del difunto no para de insultar a los asistentes con la voz del fallecido.", choices: [
            { text: "Taparle la jaula discretamente", rep: 2, money: 0 },
            { text: "Decir que es el espíritu manifestándose", rep: 8, money: 0 },
            { text: "Cobrar 'Tasa de Mascota Parlanchina' ($50)", rep: -5, money: 50 }
        ]},
        { type: "strike", text: "🪧 Los enterradores locales están en huelga de palas caídas.", choices: [
            { text: "Cavar tú mismo (Pierdes 2h de juego)", rep: 15, money: 0 },
            { text: "Pagar 'Servicios Mínimos' muy caros ($400)", rep: 5, money: -400 },
            { text: "Retrasar el entierro y culpar al gobierno", rep: -10, money: 0 }
        ]},
        { type: "goth_teen", text: "📸 Un adolescente gótico quiere hacerse fotos 'estéticas' dentro de los ataúdes.", choices: [
            { text: "Dejarle a cambio de que te etiquete", rep: 5, money: 0 },
            { text: "Echarlo antes de que raye la madera", rep: 2, money: 0 },
            { text: "Cobrarle $50 por sesión de fotos", rep: -5, money: 50 }
        ]},
        { type: "prank_show", text: "🎥 Crees que hay un programa de bromas pesadas grabando con cámara oculta.", choices: [
            { text: "Actuar de forma extremadamente profesional", rep: 10, money: 0 },
            { text: "Saludar a cámara y hacer el tonto", rep: -15, money: 0 },
            { text: "Cobrar 'Tasa de Rodaje' de $300", rep: -5, money: 300 }
        ]},
        { type: "melting_urn", text: "⚱️ La urna biodegradable se empieza a deshacer por la humedad del ambiente.", choices: [
            { text: "Arreglarla con cinta americana discretamente", rep: -5, money: 0 },
            { text: "Venderles una urna premium de mármol ($300)", rep: 2, money: 300 },
            { text: "Decir que es 'Polvo Sagrado' fundiéndose", rep: 5, money: 0 }
        ]},
        { type: "psychic", text: "🔮 Una vidente afirma que el espíritu del difunto odia la corbata que le has puesto.", choices: [
            { text: "Cambiársela por una más colorida", rep: 5, money: 0 },
            { text: "Ignorarla, los muertos no hablan (normalmente)", rep: 0, money: 0 },
            { text: "Cobrarle por 'Consulta Espiritual Directa' ($100)", rep: -5, money: 100 }
        ]},
        { type: "pizza", text: "🍕 Llega una pizza familiar que el difunto dejó programada 'para su último viaje'.", choices: [
            { text: "Repartirla entre los asistentes hambrientos", rep: 12, money: 0 },
            { text: "Comértela tú en la oficina (Recuperas energía)", rep: 5, money: 0 },
            { text: "Decir que es una ofrenda ritual al Dios del Queso", rep: 2, money: 0 }
        ]},
        { type: "zombie_prank", text: "🧟 Alguien ha puesto un muelle mecánico para que el cuerpo se siente de golpe.", choices: [
            { text: "Pánico general. ¡Llama a un exorcista!", rep: -20, money: 0 },
            { text: "Reírte y decir que era su último chiste", rep: 5, money: 0 },
            { text: "Multar a la familia por falta de respeto ($200)", rep: -10, money: 200 }
        ]},
        { type: "grief_influencer", text: "🤳 Un influencer hace un directo 'Get Ready With Me: Edición Funeral' al lado del cuerpo.", choices: [
            { text: "Salir de fondo haciendo el signo de la paz", rep: -10, money: 0 },
            { text: "Cortarle el Wi-Fi del tanatorio", rep: 5, money: 0 },
            { text: "Cobrar 'Tasa de Streaming Funerario' ($150)", rep: -2, money: 150 }
        ]},
        { type: "static_voices", text: "📻 Los altavoces emiten interferencias que suenan a voces de ultratumba.", choices: [
            { text: "Decir que es 'Comunicación Directa' ($200)", rep: -5, money: 200 },
            { text: "Apagar el sistema y pedir disculpas", rep: 5, money: 0 },
            { text: "Subir el volumen para oír el mensaje", rep: 0, money: 0 }
        ]},
        { type: "salesman", text: "👔 Un comercial agresivo intenta vender parcelas a los familiares que lloran.", choices: [
            { text: "Echarlo a patadas del recinto", rep: 15, money: 0 },
            { text: "Pedirle una comisión del 20% por cada venta", rep: -20, money: 200 },
            { text: "Decir que ya están todas las parcelas vendidas", rep: 5, money: 0 }
        ]},
        { type: "dog_heir", text: "🐕 El perro del difunto hereda la fortuna y 'paga' el servicio con ladridos.", choices: [
            { text: "Aceptar el 'pago' por la buena publicidad", rep: 10, money: 0 },
            { text: "Buscar urgentemente al tutor legal del animal", rep: 2, money: 0 },
            { text: "Echar al perro y quedarte con el collar de oro", rep: -30, money: 300 }
        ]},
        { type: "lightning", text: "⚡ Un rayo cae sobre el pararrayos y funde todos los plomos del edificio.", choices: [
            { text: "Usar velas de emergencia (Ambiente gótico)", rep: 8, money: 0 },
            { text: "Cobrar 'Tasa de Iluminación Ambiental' ($100)", rep: -15, money: 100 },
            { text: "Decir que es un mensaje divino directo", rep: 5, money: 0 }
        ]}
    ],

    hearseDriverQuotes: [
        "\"¡Abróchense los cinturones! Espera, público equivocado. La carga no se abrocha.\"",
        "\"Otro día, otro cuerpo. Debería empezar un podcast sobre esto.\"",
        "\"He visto cosas, tío. Cosas que harían llorar a un sepulturero. Espera, TÚ eres sepulturero.\"",
        "\"Mi GPS dice 'Llegada al destino final' en CADA viaje. Muy oscuro, ¿verdad?\"",
        "\"Yo antes conducía un camión de los helados. Sorprendentemente es casi el mismo trabajo.\""
    ],


    paperworkExcuses: [
        "A lo mejor en otro momento...",
        "No tengo nervios para esto ahora mismo.",
        "Esto es demasiado arriesgado.",
        "Mi madre no aprobaría esto.",
        "No quiero ir al infierno por esto.",
        "Si cierro los ojos, a lo mejor desaparece.",
        "Mi abogado me recomendó no comentar sobre esto.",
        "Hoy no tengo pulso para hacer esto."
    ],

    upgrades: [
        { id: "firstaid", name: "Botiquín", desc: "Trata desmayos en velatorio", cost: 1500, level: 1, icon: "🩹", room: null },
        { id: "embalm_kit", name: "Kit Premium Embalsamar", desc: "+2 tiradas embalsamar", cost: 2500, level: 1, icon: "🧪", room: null },
        { id: "ac_system", name: "Sistema de Aire", desc: "Controla temperatura velatorio", cost: 3000, level: 1, icon: "❄️", room: null },
        { id: "coffee_machine", name: "Máquina de Espresso", desc: "+10% satisfacción cafetería", cost: 1200, level: 1, icon: "☕", room: null },
        { id: "cafeteria", name: "Cafetería Completa", desc: "Sirve bebidas a las familias", cost: 7500, level: 1, icon: "☕", room: "cafeteria" },
        { id: "crematorium", name: "Crematorio", desc: "Incinera en tus instalaciones", cost: 5000, level: 1, icon: "🔥", room: "crematorium" },
        { id: "chapel", name: "La Capilla", desc: "Da ceremonias en la funeraria", cost: 10000, level: 1, icon: "⛪", room: "chapel" },
        { id: "hearse", name: "Coche Fúnebre", desc: "No más pagos por alquiler", cost: 20000, level: 1, icon: "🚗", room: null },
        { id: "viewing2", name: "Sala de Velatorio #2", desc: "Gestiona 2 familias a la vez", cost: 5000, level: 1, icon: "🪦", room: null },
        { id: "viewing3", name: "Sala de Velatorio #3", desc: "Gestiona 3 familias a la vez", cost: 9000, level: 1, icon: "🪦", room: null },
        { id: "embalm_train", name: "Curso de Embalsamamiento", desc: "+1 modificador permanente", cost: 2000, level: 1, icon: "📚", room: null, repeatable: true, maxRepeats: 5 },
    ],

    gameOverMoney: [
        "\"Resulta que la muerte no paga... TUS facturas.\"",
        "\"Bancarrota. Hasta los fantasmas se fueron — no podían pagar el alquiler.\"",
        "\"Tu funeraria necesita un funeral. Para sus finanzas.\""
    ],
    gameOverRep: [
        "\"Tu reputación está más muerta que tus clientes.\"",
        "\"Reseñas de Google: ★☆☆☆☆ 'Preferiría seguir muerto antes que ir aquí.'\"",
        "\"Hasta el gato callejero te dejó una reseña de 1 estrella.\""
    ],

    tips: [
        "CONSEJO: Mantén los suministros llenos. Quedarte sin nada a medio embalsamar es... incómodo.",
        "CONSEJO: Asegúrate de que el sermón coincida con la religión. Iván no lo comprobará por ti.",
        "CONSEJO: El crematorio necesita tiempo para calentarse. ¡Planifica con tiempo!",
        "CONSEJO: Algunas familias piden alcohol. Está prohibido. ¿Pero lo está de verdad?",
        "CONSEJO: Tu reputación lo es todo. Una mala reseña puede arruinarte.",
        "CONSEJO: El conductor externo del coche fúnebre es raro, pero de confianza. Más o menos."
    ],

    levelUpPhrases: [
        "Felicidades. Un nivel más cerca de ser tú el que esté en la camilla.",
        "Has subido de nivel. Lástima que tu esperanza de vida no haga lo mismo.",
        "Excelente trabajo. Tus clientes están muriendo por ver qué haces ahora.",
        "Nivel alcanzado. El cementerio está lleno de gente que se creía indispensable.",
        "Tu carrera despega. Como el alma de ese pobre diablo de la sala 2.",
        "Nuevo nivel. Más dinero para gastar antes de que hereden tus deudas.",
        "Cada vez eres más profesional. El formaldehído ya corre por tus venas.",
        "Felicidades. Has desbloqueado nuevas formas de ignorar tu propia mortalidad.",
        "Sigue así y pronto serás el rey de los gusanos.",
        "Un nivel más. Disfrútalo, la eternidad es muy larga y aburrida.",
        "Eres tan bueno que la Parca está pensando en abrir una franquicia.",
        "¡Nuevo nivel! Tu oscuro futuro parece... ligeramente más rentable."
    ],
    // ===== ESCENARIOS DE ENTREVISTA =====
    interviewScenarios: [
        {
            id: "tissues",
            text: "La familia empieza a llorar. Tienes que ofrecer algo.",
            choices: [
                { text: "Ofrecer un único pañuelo de seda de alta calidad.", sat: 10 },
                { text: "Empujar la caja entera hacia ellos. 'Lo van a necesitar'.", sat: 20 },
                { text: "Decirles que llorar es malo para la piel.", sat: -30 }
            ]
        },
        {
            id: "coffee",
            text: "Parecen agotados. Iván, el orador, susurra: 'Véndeles el café caro'.",
            choices: [
                { text: "Ofrecer muestras gratuitas de café artesanal.", sat: 15 },
                { text: "Intentar vender el espresso 'Tueste de Duelo' ($5).", roll: 12, success: { text: "¡Les encanta!", sat: 25 }, fail: { text: "Les parece insensible.", sat: -10 } },
                { text: "Mencionar que nuestro café es mejor que el de la competencia.", sat: 5 }
            ]
        },
        {
            id: "cremation_pitch",
            text: "Surge el tema de la incineración. ¿Cómo lo manejas?",
            choices: [
                { text: "Explicar que es 'Ecológico y eficiente'.", sat: 10 },
                { text: "Describir la 'Hermosa transformación a través del fuego'.", roll: 14, success: { text: "¡Muy poético!", sat: 20 }, fail: { text: "Demasiado gráfico...", sat: -15 } },
                { text: "Mencionar que es la opción más barata que tenemos.", sat: -10 }
            ]
        },
        {
            id: "mistaken_identity",
            text: "Accidentalmente llamas al hijo por el nombre del difunto.",
            choices: [
                { text: "Pedir disculpas rápidamente y culpar al papeleo.", sat: -5 },
                { text: "Intentar disimular: '¡Tiene sus mismos ojos nobles!'", roll: 10, success: { text: "Se sienten conmovidos.", sat: 15 }, fail: { text: "Se sienten extrañados.", sat: -20 } },
                { text: "Insistir en que tienes razón y ellos se equivocan.", sat: -40 }
            ]
        },
        {
            id: "flower_talk",
            text: "Preguntan por los arreglos florales.",
            choices: [
                { text: "Sugerir el paquete 'Eterno Florecer'.", sat: 10 },
                { text: "Explicar que las flores son solo 'plantas muriendo'.", sat: -25 },
                { text: "Llamar a la floristería ahora mismo para mostrar dedicación.", sat: 20 }
            ]
        },
        {
            id: "gold_tooth",
            text: "Has encontrado un diente de oro durante la preparación. ¿Lo mencionas?",
            choices: [
                { text: "Devolverlo discretamente en una bolsa de terciopelo.", sat: 30 },
                { text: "Decirles que se 'perdió en el proceso' (quedártelo).", roll: 15, success: { text: "Te creen. +$200 más tarde.", sat: 0 }, fail: { text: "¡Te han pillado!", sat: -40 } },
                { text: "Preguntar si quieren pagar el funeral con él.", sat: -20 }
            ]
        },
        {
            id: "ivan_outfit",
            text: "Iván, el orador, entra con una camiseta que dice 'Amo los Cementerios'.",
            choices: [
                { text: "Pedir disculpas y decir que es nuestro 'viernes informal'.", sat: -5 },
                { text: "Explicar que es una marca irónica de alta costura.", roll: 13, success: { text: "Creen que estás a la moda.", sat: 15 }, fail: { text: "Les parece irrespetuoso.", sat: -15 } },
                { text: "Obligar a Iván a cambiarse por una bolsa de basura.", sat: 10 }
            ]
        },
        {
            id: "memory_foam",
            text: "Un pariente pregunta si el ataúd es lo suficientemente cómodo.",
            choices: [
                { text: "Ofrecer la mejora 'Memory Foam Deluxe'.", sat: 15 },
                { text: "Asegurarles: 'No se va a quejar'.", sat: -10 },
                { text: "Fingir que pruebas la suavidad tú mismo.", roll: 11, success: { text: "Aprecian tu minuciosidad.", sat: 10 }, fail: { text: "Quedas como un ridículo.", sat: -10 } }
            ]
        },
        {
            id: "ghost_insurance",
            text: "Están aterrorizados por las apariciones. ¿Seguro de fantasmas?",
            choices: [
                { text: "Ofrecer la póliza 'Protección Espectral' ($100).", roll: 14, success: { text: "¡Vendido! Se sienten más seguros.", sat: 20 }, fail: { text: "Creen que eres un estafador.", sat: -25 } },
                { text: "Explicar que nuestras paredes están 'a prueba de ectoplasma'.", sat: 5 },
                { text: "Decirles que los fantasmas solo asustan a gente 'aburrida'.", sat: -30 }
            ]
        },
        {
            id: "qr_grave",
            text: "Quieren un código QR en la tumba para un tributo en Tik-Tok.",
            choices: [
                { text: "¡Abraza el futuro! Pack 'Inmortalidad Digital'.", sat: 20 },
                { text: "Sugerir cortésmente un epitafio tradicional.", sat: 5 },
                { text: "Reírte y decir 'Sobre mi cadáver'.", sat: -20 }
            ]
        },
        {
            id: "wrong_ashes",
            text: "Te das cuenta de que la urna que sostienes tiene un poco de polvo.",
            choices: [
                { text: "Pulirla delante de ellos con tu propia corbata.", sat: 5 },
                { text: "Fingir que es 'Polvo de Bendición Ancestral'.", roll: 16, success: { text: "Se quedan asombrados.", sat: 25 }, fail: { text: "Eso es simplemente asqueroso.", sat: -30 } },
                { text: "Ir a por una limpia y culpar al 'Protocolo de la Bóveda'.", sat: 15 }
            ]
        },
        {
            id: "scent_choice",
            text: "Preguntan por el olor. El formaldehído está fuerte hoy.",
            choices: [
                { text: "Decirles que es 'El aroma de la eternidad'.", sat: 10 },
                { text: "Culpar a lo que Iván, el orador, está cocinando en la cafetería.", sat: -5 },
                { text: "Usar tu 'Empatía' para describirlo como 'Limpieza'.", roll: 12, success: { text: "Se sienten tranquilizados.", sat: 15 }, fail: { text: "Sigue oliendo a laboratorio.", sat: -10 } }
            ]
        },
        {
            id: "neighbor_grave",
            text: "Quieren saber quién está enterrado en la parcela de al lado.",
            choices: [
                { text: "Decirles que es una familia muy 'tranquila y prestigiosa'.", sat: 15 },
                { text: "Mirar el registro y 'maquillar' los datos para que suene mejor.", roll: 13, success: { text: "¡Les encantan los vecinos!", sat: 20 }, fail: { text: "Mezclas los nombres.", sat: -10 } },
                { text: "Decir: 'Los vecinos no importan a dos metros bajo tierra'.", sat: -15 }
            ]
        },
        {
            id: "heirloom_ring",
            text: "Un anillo está atascado en el dedo del difunto. La familia lo quiere.",
            choices: [
                { text: "Usar tus 'Manos Profesionales' para quitarlo (Habilidad).", roll: 14, success: { text: "Retirado con dignidad.", sat: 25 }, fail: { text: "Forcejeas torpemente.", sat: -20 } },
                { text: "Sugerir enterrarlo como un 'Sacrificio al Más Allá'.", sat: -5 },
                { text: "Decirles: 'Déjenlo ir, es solo metal brillante'.", sat: -35 }
            ]
        },
        {
            id: "metal_service",
            text: "Quieren un tributo de Heavy Metal en la capilla.",
            choices: [
                { text: "Aceptar y llamar a la banda local 'Almas Podridas'.", sat: 20 },
                { text: "Sugerir que Iván, el orador, haga una versión acústica 'cañera'.", roll: 15, success: { text: "¡Iván es un crack! Les encanta.", sat: 30 }, fail: { text: "Es vergonzoso.", sat: -20 } },
                { text: "Insistir en cantos gregorianos para 'Estabilidad del Alma'.", sat: -10 }
            ]
        },
        {
            id: "viewing_snacks",
            text: "Un primo empieza a comer palomitas durante el velatorio.",
            choices: [
                { text: "Pedirle cortésmente que pare por respeto.", sat: 15 },
                { text: "Intentar 'venderle' un snack adecuado de la cafetería.", roll: 11, success: { text: "¡El negocio prospera!", sat: 10 }, fail: { text: "Les pareces un codicioso.", sat: -15 } },
                { text: "Unirte a él y pedirle un puñado.", sat: -40 }
            ]
        },
        {
            id: "makeup_fail",
            text: "El maquillaje del catálogo parece un poco... excesivo. El difunto va a parecer una muñeca.",
            choices: [
                { text: "Explicar que es la técnica 'Brillo Post-Vida'.", roll: 14, success: { text: "Creen que es artístico.", sat: 20 }, fail: { text: "Quieren que les devuelvas el dinero.", sat: -30 } },
                { text: "Ofrecerte inmediatamente a arreglarlo gratis.", sat: 15 },
                { text: "Decir: 'Siempre quiso tener más color'.", sat: -20 }
            ]
        },
        {
            id: "pet_goodbye",
            text: "Quieren traer una cabra para una 'Bendición Final'.",
            choices: [
                { text: "Aceptar, pero cobrar una 'Tasa de Limpieza de Ganado'.", sat: 10 },
                { text: "Usar 'Persuasión' para convencerles de que un gato es mejor.", roll: 15, success: { text: "Traen un gatito. ¡Qué mono!", sat: 20 }, fail: { text: "Quieren la cabra.", sat: -5 } },
                { text: "Decirles que esto es un tanatorio, no una granja.", sat: -25 }
            ]
        },
        {
            id: "eco_cardboard",
            text: "Quieren un ataúd de cartón para ser 'Ecológicos'.",
            choices: [
                { text: "¡Apoya su elección verde! +20 Satisfacción.", sat: 20 },
                { text: "Venderles el 'Eco-Roble Reforzado' ($500 extra).", roll: 14, success: { text: "¡Compran la madera premium!", sat: 15 }, fail: { text: "Ven la estafa.", sat: -20 } },
                { text: "Mencionar que podría colapsar si llueve.", sat: -15 }
            ]
        },
        {
            id: "selfie_grief",
            text: "La hija quiere hacerse un selfie de duelo contigo y el ataúd.",
            choices: [
                { text: "Poner cara 'profesional pero triste'.", sat: 15 },
                { text: "Cobrar tarifa por 'Aparición en Redes' ($50).", roll: 12, success: { text: "¡Paga sin dudar! #Profit", sat: 5 }, fail: { text: "Se ofende muchísimo.", sat: -20 } },
                { text: "Explicarle que las cámaras roban el alma de los difuntos.", sat: -10 }
            ]
        },
        {
            id: "live_pet",
            text: "La familia pregunta si el difunto puede ser enterrado con su mascota favorita, que sigue viva.",
            choices: [
                { text: "Decir que no, eso es ilegal.", sat: -10 },
                { text: "Convencerles de que la mascota preferiría seguir viva.", roll: 14, success: { text: "Están de acuerdo, el perro se salva.", sat: 20 }, fail: { text: "Te llaman insensible ante su vínculo.", sat: -15 } },
                { text: "Ofrecer taxidermizar a la mascota más adelante.", sat: -30 }
            ]
        },
        {
            id: "widow_discount",
            text: "La viuda pide un descuento porque 'tampoco era tan buen marido'.",
            choices: [
                { text: "Disculparse, los precios son fijos.", sat: 0 },
                { text: "Cotillear sobre lo terribles que son los hombres para ganar propina.", roll: 12, success: { text: "Le encanta el chisme. ¡Gran propina!", sat: 25 }, fail: { text: "Se ofende porque has insultado a su marido.", sat: -20 } },
                { text: "Decirle que el crematorio quema a los pecadores por igual.", sat: -25 }
            ]
        },
        {
            id: "bribe_dental",
            text: "Un hombre misterioso en gabardina ofrece $500 extra por 'perder' los registros dentales.",
            choices: [
                { text: "Rechazar amablemente.", sat: 10 },
                { text: "Aceptar el soborno sutilmente.", roll: 15, success: { text: "Transacción perfecta. +$500.", sat: 5, money: 500 }, fail: { text: "Se te caen los billetes al suelo. Se va.", sat: -40, rep: -10 } },
                { text: "Amenazar con llamar a la policía.", sat: -15 }
            ]
        },
        {
            id: "heavy_metal_viewing",
            text: "La familia quiere poner música heavy metal extremadamente inapropiada durante el velatorio.",
            choices: [
                { text: "Negarse, molesta a otras familias que están de luto.", sat: -15 },
                { text: "Sugerir ponerla como una versión instrumental acústica.", roll: 13, success: { text: "Les encanta la versión acústica.", sat: 20 }, fail: { text: "Te llaman 'poser' y lloran.", sat: -10 } },
                { text: "Ofrecer subir el volumen al máximo para 'despertar a los muertos'.", sat: 10, rep: -5 }
            ]
        },
        {
            id: "secret_families",
            text: "Las dos familias secretas del difunto se encuentran por accidente en tu oficina.",
            choices: [
                { text: "Retroceder lentamente y salir de la habitación.", sat: -10 },
                { text: "Intervenir como consejero de duelo y calmar a todos.", roll: 16, success: { text: "¡Crisis evitada! Eres un héroe.", sat: 35, rep: 10 }, fail: { text: "Empieza una pelea campal. Rompen un jarrón.", sat: -40, rep: -10 } },
                { text: "Ofrecer un descuento del 50% en la segunda sala de velatorio.", sat: -50 }
            ]
        },
        {
            id: "casket_selfie",
            text: "El hijo insiste en hacerse un selfie con el ataúd abierto.",
            choices: [
                { text: "Recordarle que es una gran falta de respeto.", sat: -10 },
                { text: "Ofrecerte a hacerle tú la foto con iluminación profesional.", roll: 11, success: { text: "La luz es perfecta. La sube a Insta.", sat: 20 }, fail: { text: "Se te cae su móvil al suelo.", sat: -15 } },
                { text: "Hacer un 'photobomb' en la foto haciendo el símbolo de la paz.", sat: -40 }
            ]
        },
        {
            id: "gold_teeth",
            text: "Preguntan qué pasa con los dientes de oro durante la cremación.",
            choices: [
                { text: "Explicar el procedimiento legal estándar.", sat: 5 },
                { text: "Asegurarles que se funden para 'enriquecer su espíritu'.", roll: 14, success: { text: "Les parece un final muy poético.", sat: 25 }, fail: { text: "Exigen que se los devuelvas.", sat: -10 } },
                { text: "¿Qué dientes de oro? Yo no he visto ningún diente de oro.", sat: -30 }
            ]
        },
        {
            id: "vegan_embalm",
            text: "La hija quiere saber si el líquido de embalsamar es vegano y 'cruelty-free'.",
            choices: [
                { text: "Explicarle que es literalmente formaldehído cancerígeno.", sat: -10 },
                { text: "Inventar una historia sobre conservantes botánicos éticos.", roll: 13, success: { text: "Se siente aliviada e impresionada.", sat: 30 }, fail: { text: "Lo busca en Google y te llama mentiroso.", sat: -20 } },
                { text: "Decirle que la única crueldad aquí fue la causa de la muerte.", sat: -40 }
            ]
        },
        {
            id: "keg_urn",
            text: "Han traído una urna personalizada en forma de barril de cerveza, pero gotea.",
            choices: [
                { text: "Exigir que compren una de tus urnas estándar.", sat: -15 },
                { text: "Arreglarla con cinta americana y llamarlo 'toque rústico'.", roll: 12, success: { text: "Están de acuerdo, le da personalidad.", sat: 20 }, fail: { text: "La cinta se rompe. Cenizas por todas partes.", sat: -15 } },
                { text: "Sugerir que se beban las cenizas en un chupito.", sat: -50 }
            ]
        },
        {
            id: "face_down",
            text: "El difunto pidió ser enterrado boca abajo 'para que el mundo me bese el c*lo'.",
            choices: [
                { text: "Negarse a aceptar tal vulgaridad.", sat: -20 },
                { text: "Convencerles de que cerrar el ataúd logra el mismo objetivo.", roll: 15, success: { text: "Filosóficamente, están de acuerdo.", sat: 25 }, fail: { text: "Insisten en la posición exacta.", sat: -15 } },
                { text: "Cobrar el doble por 'posicionamiento ergonómico especial'.", sat: 10 }
            ]
        },
        {
            id: "inheritance_watch",
            text: "Dos hermanos se pelean por el reloj de oro del difunto. Quieren que TÚ decidas quién se lo queda.",
            choices: [
                { text: "Sugerir donarlo a la funeraria para 'custodia segura'.", roll: 16, success: { text: "Aceptan que es la opción más neutral. +$300.", sat: 10, money: 300 }, fail: { text: "¡Ambos vuelcan su ira contra ti!", sat: -30 } },
                { text: "Sugerir dárselo al que llore más.", sat: -15 },
                { text: "Enterrar al difunto con el reloj para acabar con el debate.", sat: 20 }
            ]
        },
        {
            id: "wrong_face",
            text: "La viuda afirma que el difunto tiene 'demasiado pelo' y que ese no es su marido.",
            choices: [
                { text: "Ofrecer un 'afeitado de emergencia' gratuito ahora mismo.", sat: 15 },
                { text: "Explicar que el pelo crece tras la muerte (una mentira total).", roll: 14, success: { text: "Se cree la pseudociencia.", sat: 20 }, fail: { text: "Llama a su abogado.", sat: -35 } },
                { text: "Enseñarle la etiqueta de identificación en el pie.", sat: 5 }
            ]
        },
        {
            id: "tapping_sound",
            text: "Alguien afirma haber oído un 'golpe' desde dentro del ataúd.",
            choices: [
                { text: "Explicar que son 'gases escapando'. Algo normal.", sat: 10 },
                { text: "Abrirlo inmediatamente para tranquilizarlos.", roll: 12, success: { text: "Está vacío. Digo, solo el cuerpo. Todo bien.", sat: 15 }, fail: { text: "¡La tapa se atasca! ¡Pánico general!", sat: -25 } },
                { text: "Decirles que el difunto siempre fue de 'sueño inquieto'.", sat: -20 }
            ]
        },
        {
            id: "clown_request",
            text: "La familia quiere que el difunto sea enterrado con maquillaje completo de payaso y nariz roja.",
            choices: [
                { text: "Honrar el último deseo. 'El espectáculo debe continuar'.", sat: 20 },
                { text: "Sugerir un compromiso de 'payaso elegante' (solo nariz).", roll: 13, success: { text: "Les encanta el sutil tributo.", sat: 15 }, fail: { text: "Quieren la experiencia Bozo completa.", sat: -10 } },
                { text: "Decirles que esto es un funeral, no un circo.", sat: -30 }
            ]
        },
        {
            id: "rival_widows",
            text: "La ex-mujer y la viuda actual están teniendo un 'duelo de miradas' en el vestíbulo.",
            choices: [
                { text: "Ofrecer dos salas de velatorio separadas ($400 extra).", roll: 15, success: { text: "¡Ambas pagan para evitarse! +$400.", sat: 25, money: 400 }, fail: { text: "Se unen... contra ti.", sat: -20 } },
                { text: "Pedir a Iván que ponga música 'relajante' a todo volumen.", sat: 5 },
                { text: "Intentar mediar sobre la herencia aquí mismo.", sat: -40 }
            ]
        },
        {
            id: "pigeon_blessing",
            text: "Una paloma ha entrado y ha... 'bendecido' el traje del difunto.",
            choices: [
                { text: "Afirmar que es una 'señal de los cielos'.", roll: 14, success: { text: "Se sienten profundamente conmovidos por la señal.", sat: 30 }, fail: { text: "Exigen un reembolso por la tintorería.", sat: -20 } },
                { text: "Limpiarlo discretamente con un pañuelo.", sat: 10 },
                { text: "Decirles que es mejor que un cuervo.", sat: -15 }
            ]
        },
        {
            id: "lasagna_complaint",
            text: "Se quejan de que la sala huele a ajo. Iván estaba cocinando al fondo.",
            choices: [
                { text: "Explicar que es un 'incienso mediterráneo especial'.", roll: 13, success: { text: "Les parece exótico y relajante.", sat: 20 }, fail: { text: "Se dan cuenta de que es pasta.", sat: -10 } },
                { text: "Pedir disculpas y abrir todas las ventanas.", sat: 10 },
                { text: "Preguntar si quieren un poco de lasaña. Solo $10.", sat: -25 }
            ]
        },
        {
            id: "gold_teeth_rumor",
            text: "Un sobrino susurra: 'El abuelo tenía la boca llena de oro. ¿Dónde está?'",
            choices: [
                { text: "Asegurarle que todo está contabilizado en la urna.", sat: 10 },
                { text: "Ofrecer un servicio de 'recuperación dental' previo pago.", roll: 16, success: { text: "Paga la tarifa. No encuentras... nada.", sat: 5, money: 200 }, fail: { text: "Sospecha que ya te lo has llevado tú.", sat: -30 } },
                { text: "Decirle que vaya a cavar él mismo.", sat: -40 }
            ]
        },
        {
            id: "viking_arrow",
            text: "Quieren disparar una flecha incendiaria al ataúd en el parking.",
            choices: [
                { text: "Explicar las normas de incendios y ofrecer una 'lámpara de fuego'.", sat: 15 },
                { text: "Dejarles si pagan la 'exención de seguro' ($300).", roll: 14, success: { text: "¡Espectacular! Ningún árbol sufrió daños.", sat: 25, money: 300 }, fail: { text: "Fallan y le dan a tu coche fúnebre.", sat: -40, rep: -10 } },
                { text: "Sugerir un 'entierro acuático' en el fregadero.", sat: -20 }
            ]
        },
        {
            id: "ghost_bros_tv",
            text: "La familia quiere rodar un especial de 'cazadores de fantasmas' durante el velatorio.",
            choices: [
                { text: "Aceptar por una 'tasa de producción' ($500).", roll: 15, success: { text: "¡Vas a salir en la tele! +$500.", sat: 10, money: 500 }, fail: { text: "Los equipos no paran de saltar los plomos.", sat: -20 } },
                { text: "Rechazar cortésmente para mantener la dignidad.", sat: 15 },
                { text: "Ofrecerte para hacer de fantasma por $100 extra.", sat: -35 }
            ]
        },
        {
            id: "pacemaker",
            text: "La familia pregunta si se le ha quitado el marcapasos antes de la cremación. 'Hemos oído que explotan'.",
            choices: [
                { text: "Por supuesto, la seguridad es lo primero en nuestra casa.", sat: 15 },
                { text: "Aposté con Iván a ver si explotaba. He perdido 50 monedas.", sat: -30 },
                { text: "El marcapasos es ahora una 'batería espiritual' eterna. No se preocupen.", roll: 14, success: { text: "Les parece una idea reconfortante.", sat: 25 }, fail: { text: "Creen que se está riendo de ellos.", sat: -15 } }
            ]
        },
        {
            id: "ash_taste",
            text: "Un familiar muy afectado quiere probar un poco de las cenizas para 'conectar con su esencia'.",
            choices: [
                { text: "Señor, eso es... poco higiénico. Pruebe nuestro café de cortesía.", sat: 10 },
                { text: "Saben a barbacoa y arrepentimiento. 20 monedas la cata.", sat: -20, money: 20 },
                { text: "Iván dice que con un poco de sal están mucho mejor.", sat: -45 }
            ]
        },
        {
            id: "swallowed_key",
            text: "Sospechan que el abuelo se tragó la llave de la caja fuerte antes de morir.",
            choices: [
                { text: "Podemos hacer una 'inspección profunda' por una tarifa de recuperación.", roll: 15, success: { text: "¡La has encontrado! +200 monedas.", sat: 20, money: 200 }, fail: { text: "No hay nada ahí dentro. Se sienten decepcionados.", sat: -25 } },
                { text: "Si suena como una hucha al moverlo, es que hay premio.", sat: -30 },
                { text: "La honestidad es clave. Si aparece durante el proceso, les avisamos.", sat: 15 }
            ]
        },
        {
            id: "fridge_box",
            text: "Traen una caja de nevera vacía para usarla como ataúd y ahorrar costes.",
            choices: [
                { text: "El reciclaje es la forma más noble de volver a la tierra.", sat: 15 },
                { text: "Si llueve durante el entierro, el abuelo va a ser puré de cartón.", sat: -40 },
                { text: "Podemos pintarla de marrón para que parezca roble a media distancia.", roll: 12, success: { text: "Aceptan el apaño encantados.", sat: 20 }, fail: { text: "Se dan cuenta de lo ridículo que suena.", sat: -15 } }
            ]
        },
        {
            id: "dead_selfie",
            text: "Quieren que pongas al difunto en una pose 'dinámica' para un último selfie familiar.",
            choices: [
                { text: "La dignidad de nuestros clientes es innegociable, lo siento.", sat: 10 },
                { text: "Tengo un pack de 'Poses de Instagram' por 100 monedas.", roll: 14, success: { text: "¡Sale genial en la foto! #RIP", sat: 25, money: 100 }, fail: { text: "Se le cae un brazo durante la pose. Desastre.", sat: -35 } },
                { text: "Si le pongo gafas de sol, parecerá que está de vacaciones en Benidorm.", sat: -15 }
            ]
        },
        {
            id: "sweating_body",
            text: "Un familiar grita horrorizado porque el difunto 'está sudando'. Es solo condensación.",
            choices: [
                { text: "Es el proceso natural de enfriamiento, no se preocupen en absoluto.", sat: 15 },
                { text: "Es que en el infierno hace calor, ¿saben? Mala señal.", sat: -55 },
                { text: "Está nervioso por verles una última vez, es una señal de puro amor.", roll: 13, success: { text: "Se sienten conmovidos por el 'fenómeno'.", sat: 20 }, fail: { text: "Creen que les estás tomando el pelo.", sat: -25 } }
            ]
        },
        {
            id: "boring_music",
            text: "Se quejan amargamente de que la música de la capilla es aburrida y 'poca cosa'.",
            choices: [
                { text: "Buscamos siempre un ambiente de máxima paz y recogimiento.", sat: 10 },
                { text: "Iván puede pinchar Techno-Muerte si pagan el equipo de sonido.", roll: 15, success: { text: "¡La fiesta de su vida! Digo, de su muerte.", sat: 30, money: 150 }, fail: { text: "Iván pone reguetón antiguo. Les horroriza.", sat: -25 } },
                { text: "A los muertos les encanta, no se han quejado nunca hasta ahora.", sat: -15 }
            ]
        },
        {
            id: "twin_cremation",
            text: "Una pareja de gemelos idénticos quiere saber si hay descuento 2x1 si mueren a la vez.",
            choices: [
                { text: "La logística es la misma, pero puedo hacerles un 10% por fidelidad.", sat: 15 },
                { text: "Si caben en el mismo horno, ahorramos leña y tiempo. Trato hecho.", sat: -35 },
                { text: "El 'Pack Dúo Eterno' incluye una urna compartida muy elegante.", roll: 12, success: { text: "Les encanta la idea de estar juntos siempre.", sat: 20 }, fail: { text: "Les parece una oferta de mal gusto.", sat: -15 } }
            ]
        },
        {
            id: "psychic_insult",
            text: "Una vidente en la sala afirma que el muerto le está insultando desde el otro lado.",
            choices: [
                { text: "El duelo a veces nos hace oír cosas, descanse un poco en la cafetería.", sat: 10 },
                { text: "Dígale que si sigue así, le cobraré recargo por mal comportamiento post-mortem.", sat: -25 },
                { text: "Yo también lo oigo, dice que usted le debe 50 monedas.", roll: 16, success: { text: "¡La vidente paga asustada! +50 monedas.", sat: 20, money: 50 }, fail: { text: "Creen que todos estáis locos.", sat: -35 } }
            ]
        },
        {
            id: "beach_urn",
            text: "Quieren mezclar las cenizas con arena de playa para que parezca que 'sigue de vacaciones'.",
            choices: [
                { text: "Un tributo veraniego muy original. Lo prepararemos con mimo.", sat: 15 },
                { text: "Tengan cuidado no la confundan con el cenicero del hotel este verano.", sat: -30 },
                { text: "Podemos añadirle esencia de coco y protector solar por 20 monedas.", roll: 11, success: { text: "Huele a vacaciones eternas. ¡Perfecto!", sat: 20, money: 20 }, fail: { text: "Huele a rayos. No les gusta nada.", sat: -15 } }
            ]
        }
    ],
    dailyNews: [
        { id: "day_tanato", text: "¡Hoy es el Día del Tanatopractor! La asociación local regala café a todos los profesionales.", effect: { rep: 5, msg: "+5 Reputación" } },
        { id: "strike_gravediggers", text: "Huelga de enterradores en el cementerio municipal. Los cuerpos se acumulan en los depósitos.", effect: { money: -100, msg: "-$100 (Tasas de almacenamiento)" } },
        { id: "heat_wave", text: "Ola de calor extrema. Se recomienda bajar la temperatura de las salas de velatorio para evitar olores.", effect: { priceMod: 1.3, msg: "Suministros +30% más caros" } },
        { id: "vampire_client", text: "Un cliente afirma ser un vampiro real de Transilvania. Pide un ataúd con revestimiento de terciopelo rojo.", effect: { rep: -5, msg: "-5 Reputación" } },
        { id: "ivan_award", text: "Iván ha ganado el premio a la 'Voz más Tétrica' del año. Está insoportable celebrándolo.", effect: { rep: 5, msg: "+5 Reputación" } },
        { id: "ghost_rumors", text: "Se rumorea que un fantasma vaga por los pasillos de Eternal Rest. Algunos clientes piden descuentos.", effect: { rep: -10, msg: "-10 Reputación" } },
        { id: "inflation_formal", text: "Inflación en los suministros de embalsamamiento. El formaldehído está por las nubes hoy.", effect: { priceMod: 2.0, msg: "Suministros +100% más caros" } },
        { id: "vandalism", text: "Gamberros volcaron varias lápidas anoche. Los vecinos están indignados con la seguridad.", effect: { rep: -5, msg: "-5 Reputación" } },
        { id: "comp_war", text: "La funeraria de la competencia regala ataúdes de segunda mano. ¡Es una guerra de precios!", effect: { rep: -5, msg: "-5 Reputación" } },
        { id: "storm_crema", text: "Tormenta eléctrica prevista. Riesgo de apagones. El crematorio no funcionará de 11h a 12h.", effect: { cremaLock: [660, 720], msg: "Crematorio bloqueado (11h-12h)" } },
        { id: "rat_report", text: "Reportaje de investigación revela presencia de ratas en 'Descanso Eterno'. Escándalo sanitario.", effect: { rep: -10, msg: "-10 Reputación" } },
        { id: "pollution_alert", text: "Alerta por contaminación: Prohibido incinerar de 14:00h a 16:00h hoy por orden municipal.", effect: { cremaLock: [840, 960], msg: "Crematorio bloqueado (14h-16h)" } },
        { id: "transport_strike", text: "Huelga de transportes: Los proveedores triplican los gastos de envío por la escasez.", effect: { priceMod: 1.8, msg: "Suministros +80% más caros" } },
        { id: "lucky_find", text: "Se ha encontrado una cápsula del tiempo bajo el porche con monedas de oro antiguas.", effect: { money: 500, msg: "+$500" } },
        { id: "inspector_visit", text: "El inspector de sanidad está en la ciudad. Los estándares son más altos hoy.", effect: { rep: 5, msg: "+5 Reputación (por limpieza)" } }
    ]
};

// Store original EN data
let DATA_EN = null;

// Hot-swap script
document.addEventListener('languageChanged', (e) => {
    if (!DATA_EN) DATA_EN = JSON.parse(JSON.stringify(DATA));
    
    const lang = e.detail;
    const source = lang === 'es' ? DATA_ES : DATA_EN;
    
    // Replace all text fields in DATA with the ones from source
    for (const key in source) {
        if (DATA[key] !== undefined) {
            DATA[key] = source[key];
        }
    }
});

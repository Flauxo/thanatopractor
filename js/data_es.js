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
        { id: "rng", name: "Culto al RNG", icon: "🎲" },
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
        { id: "cheerful", name: "Aliviados", icon: "😌", desc: "\"Para ser sinceros, el tío era un poco capullo.\"" }
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
        ]
    },

    deathCauses: [
        "causas naturales", "vejez extrema", "un trágico accidente de jardinería",
        "se atragantó con una aceituna en una boda", "circunstancias irónicas",
        "una acalorada discusión sobre aparcamiento", "siesta excesiva",
        "complicaciones por una reacción alérgica a los lunes",
        "se cayó de una escalera cambiando una bombilla (la bombilla sobrevivió)",
        "combustión espontánea (supuestamente)", "un desacuerdo con la gravedad",
        "demasiada emoción en el bingo"
    ],

    // ===== CAFETERIA =====
    cafeOrders: [
        { item: "Café", price: 2, icon: "☕", humor: "Negro como el vacío, perfecto." },
        { item: "Té", price: 2, icon: "🍵", humor: "Consuelo en taza. El Earl Grey no te juzga." },
        { item: "Sándwich", price: 4, icon: "🥪", humor: "Nuestra 'Última Cena' especial." },
        { item: "Pastel", price: 5, icon: "🍰", humor: "Horneado con dudosas intenciones." },
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
        rng: {
            correct: [
                "\"Por la suerte de los dados, {name} ha sido llamado. Sus HP cayeron a cero y el Clérigo no tenía más hechizos.\"",
                "\"{name} vivía por la tirada. Por desgracia, su última tirada de salvación fue un 1 natural. Honramos su hoja de personaje.\""
            ],
            name: "Servicio RNG"
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
        { type: "see_body", text: "\"Nos gustaría ver a {name} una última vez.\"", icon: "👁️" },
        { type: "water", text: "\"¿Podríamos tomar un poco de agua, por favor?\"", icon: "💧" },
        { type: "temperature", text: "\"¡Hace un frío/calor horrible aquí!\"", icon: "🌡️" },
        { type: "faint", text: "\"¡Oh no, alguien se acaba de desmayar!\"", icon: "😵" },
        { type: "flowers", text: "\"Las flores parecen marchitas. ¿Podemos conseguir otras frescas?\"", icon: "💐" },
        { type: "lighting", text: "\"¿Se podría ajustar la iluminación? Está demasiado brillante/oscura.\"", icon: "💡" },
        { type: "privacy", text: "\"Necesitamos un momento a solas con {name}.\"", icon: "🚪" },
        { type: "music", text: "\"¿Pueden poner algo de música? A {name} le encantaba el jazz.\"", icon: "🎵" }
    ],

    viewingBodyReactions: {
        excellent: [
            "\"{name} se ve... en paz. Como si estuviera durmiendo. Muchas gracias.\"",
            "\"Habéis hecho un trabajo precioso. A {name} le habría encantado. Bueno... ya me entiendes.\""
        ],
        good: [
            "\"{name} se ve bien. Un poco cetrino quizás, pero bien.\"",
            "\"Así es... más o menos como le recuerdo. Bastante parecido.\""
        ],
        mediocre: [
            "\"¿Se supone que {name} tiene que estar tan... naranja?\"",
            "\"Algo parece raro. ¿{name} siempre tuvo esa expresión?\""
        ],
        bad: [
            "\"¡¿QUÉ LE HABÉIS HECHO A {name}?! ¡Parece un muñeco maldito!\"",
            "\"Voy a necesitar terapia después de ver esto. MUCHA terapia.\""
        ],
        catastrophic: [
            "\"¡¿ESE ES SIQUIERA {name}?! ¡OH DIOS!\" *gritos y lloros*",
            "\"¡Voy a demandar a este lugar hasta ARRUINAROS! ¡Tengo a mi abogado en marcado rápido!\""
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
        ]}
    ],

    hearseDriverQuotes: [
        "\"¡Abróchense los cinturones! Espera, público equivocado. La carga no se abrocha.\"",
        "\"Otro día, otro cuerpo. Debería empezar un podcast sobre esto.\"",
        "\"He visto cosas, tío. Cosas que harían llorar a un sepulturero. Espera, TÚ eres sepulturero.\"",
        "\"Mi GPS dice 'Llegada al destino final' en CADA viaje. Muy oscuro, ¿verdad?\"",
        "\"Yo antes conducía un camión de los helados. Sorprendentemente es casi el mismo trabajo.\""
    ],

    paperworkTasks: [
        { text: "Intenta evitar pagarle al florista por el pedido equivocado.", dc: 12, reward: 100, penalty: -50 },
        { text: "Carga los gastos del orador Iván a la aseguradora.", dc: 15, reward: 200, penalty: 0 },
        { text: "Usa el coche de tu sobrina como coche fúnebre para ahorrar.", dc: 10, reward: 150, penalty: -100, repPenalty: -5 },
        { text: "Contrata a un equipo de limpieza que parece sospechosamente menor de edad.", dc: 8, reward: 50, penalty: -150, repPenalty: -10 },
        { text: "Firma todos los papeles del escritorio sin leerlos.", dc: 5, reward: 50, penalty: -200, repPenalty: -20 },
        { text: "Convence al proveedor de formaldehído de que ya le pagaste el mes pasado.", dc: 16, reward: 120, penalty: 0 },
        { text: "Vende la urna más cara afirmando que está bañada en oro.", dc: 13, reward: 250, penalty: -150, repPenalty: -15 },
        // Intercambios y humor random
        { text: "Extrae dientes de oro de la incineradora 'para reciclaje'.", dc: 14, reward: 400, penalty: 0, repReward: -15, repPenalty: -25 },
        { text: "Rebaja los químicos del formaldehído con ginebra barata.", dc: 12, reward: 300, penalty: -100, repReward: -10, repPenalty: -15 },
        { text: "Dona a la caridad de 'Viudas de Tanatopractores Caídos'.", dc: 6, reward: -400, penalty: -500, repReward: 20, repPenalty: 0 },
        { text: "Organiza un fin de semana de descuento 'trae tu propio cuerpo'.", dc: 17, reward: 600, penalty: 0, repReward: -30, repPenalty: -15 },
        { text: "Contrata a una 'hiper-llorona' profesional para animar el ambiente.", dc: 9, reward: -200, penalty: -300, repReward: 12, repPenalty: -5 },
        { text: "Recicle los trajes funerarios 'de un solo uso' de la semana pasada.", dc: 11, reward: 250, penalty: -150, repReward: -15, repPenalty: -25 },
        { text: "Convence a una familia de que los fantasmas son 'servicios premium'.", dc: 18, reward: 500, penalty: -200, repReward: -5, repPenalty: -15 }
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
        { id: "cafeteria", name: "Cafetería Completa", desc: "Sirve bebidas a las familias", cost: 8500, level: 1, icon: "☕", room: "cafeteria" },
        { id: "crematorium", name: "Crematorio", desc: "Incinera en tus instalaciones", cost: 12000, level: 1, icon: "🔥", room: "crematorium" },
        { id: "chapel", name: "La Capilla", desc: "Da ceremonias en la funeraria", cost: 15000, level: 1, icon: "⛪", room: "chapel" },
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

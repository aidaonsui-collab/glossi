// Shared guide body data — used by iOS Guide screen and web Editorial reader.

export const GUIDE_BODIES = {
  0: {
    en: {
      dek: 'A vocabulary cheat-sheet for the chair: ombré, mechas, baby lights, and the words your Tía actually uses.',
      author: 'María Treviño', authorRole: 'Senior stylist · Pharr',
      sections: [
        { h: 'Why this matters', p: 'Half of bad color jobs in the Valley start with a translation gap. "Highlights" lands differently than "rayitos" — and "balayage" gets confused with "babylights" all the time. Use the real words, you spend less time fixing what you didn\'t order.' },
        { h: 'Five words to know', list: [['Mechas', 'Highlights, full panel. Bold contrast.'], ['Rayitos', 'Babylights. Soft, fine, sun-kissed.'], ['Iluminaciones', 'Face-frame highlights only.'], ['Decoloración', 'Bleach lift — ask about timing.'], ['Tonalizar', 'Toner. Kills brassiness.']] },
        { h: 'What to send', p: 'Two photos: hair right now in natural light, and the result you want. Add one sentence about what you DON\'T want — that line cuts re-do bookings in half.' },
        { pull: '"If she says \'pero suave\' — soft, but — believe her. That\'s the brief."' },
      ],
    },
    es: {
      dek: 'Vocabulario para la silla: ombré, mechas, baby lights, y las palabras que sí usa tu Tía.',
      author: 'María Treviño', authorRole: 'Estilista senior · Pharr',
      sections: [
        { h: 'Por qué importa', p: 'La mitad de los malos trabajos de color empiezan con un mal entendido. "Highlights" no es lo mismo que "rayitos". Usa las palabras correctas y pierdes menos tiempo arreglando lo que no pediste.' },
        { h: 'Cinco palabras', list: [['Mechas', 'Highlights de panel completo.'], ['Rayitos', 'Babylights. Finos, suaves.'], ['Iluminaciones', 'Solo en el marco de la cara.'], ['Decoloración', 'Decolorante.'], ['Tonalizar', 'Tonalizador. Mata el brassy.']] },
        { h: 'Qué mandar', p: 'Dos fotos: tu pelo ahora con luz natural, otra del resultado. Agrega qué NO quieres — reduce reagendamientos a la mitad.' },
        { pull: '"Si dice \'pero suave\' — créele. Ese es el brief."' },
      ],
    },
  },
  1: {
    en: {
      dek: 'Six standout neighborhood salons across the RGV — what they do best, who they\'re for.',
      author: 'The Glossi Editors', authorRole: 'McAllen, TX',
      sections: [
        { h: 'How we picked', p: 'We sent the same ask — color refresh, $120 budget, weekend slot — to 80 salons across the Valley. We watched response time, photo quality, and tone. These six rose to the top.' },
        { list: [['Casa de Belleza · Pharr', 'Old-school warmth, modern color. Marisol\'s 12 years show in the gloss.'], ['Studio Onyx · McAllen', 'Private chairs, premium product.'], ['La Reina · Edinburg', 'Newest on the list. Luz answers in two minutes flat.'], ['The Beauty Loft · Mission', 'Senior stylists, real loyalty perks.'], ['Brisa Hair Bar · Weslaco', 'Bilingual top to bottom. Free parking.'], ['Salón D\'Lara · Brownsville', 'New to Glossi but not new to the chair.']] },
      ],
    },
    es: {
      dek: 'Seis salones destacados del Valle — qué hacen mejor, y para quién.',
      author: 'Los editores de Glossi', authorRole: 'McAllen, TX',
      sections: [
        { h: 'Cómo elegimos', p: 'Mandamos la misma solicitud a 80 salones del Valle. Medimos tiempo, calidad de fotos, y trato. Estos seis ganaron.' },
        { list: [['Casa de Belleza · Pharr', 'Calor del barrio, color moderno.'], ['Studio Onyx · McAllen', 'Sillas privadas, producto premium.'], ['La Reina · Edinburg', 'Luz contesta en 2 minutos.'], ['The Beauty Loft · Mission', 'Estilistas senior, lealtad.'], ['Brisa Hair Bar · Weslaco', 'Bilingüe de pies a cabeza.'], ['Salón D\'Lara · Brownsville', 'Nueva en Glossi.']] },
      ],
    },
  },
  2: {
    en: {
      dek: 'Stop overpaying. Stop underpaying. Here\'s what the math actually looks like in 2026.',
      author: 'Glossi Pricing Desk', authorRole: 'Data from 2,400 RGV bookings',
      sections: [
        { h: 'The bands', p: 'After 2,400 bookings across the Valley, fair-price bands by service. Real numbers — middle 50% of last quarter.' },
        { table: [['Service', 'Fair', 'Premium'], ['Haircut & style', '$45–65', '$80+'], ['Color refresh', '$95–135', '$160+'], ['Full balayage', '$160–220', '$260+'], ['Gel manicure', '$30–45', '$55+'], ['Lash full set', '$110–145', '$180+']] },
        { h: 'When premium pays', p: 'Two cases: corrective color, and stylists with documented editorial work. Anything else, the middle band is your friend.' },
        { pull: '"Pay for the years in the chair, not the chandeliers in the lobby."' },
      ],
    },
    es: {
      dek: 'Deja de pagar de más. Cuentas reales en 2026.',
      author: 'Glossi · Precios', authorRole: 'Datos de 2,400 reservas',
      sections: [
        { h: 'Las bandas', p: '2,400 reservas en el Valle. El 50% del centro del trimestre pasado.' },
        { table: [['Servicio', 'Justo', 'Premium'], ['Corte y peinado', '$45–65', '$80+'], ['Color', '$95–135', '$160+'], ['Balayage', '$160–220', '$260+'], ['Gel mani', '$30–45', '$55+'], ['Set de pestañas', '$110–145', '$180+']] },
        { h: 'Cuándo sí premium', p: 'Color correctivo y trayectoria editorial. Lo demás, la banda del medio.' },
        { pull: '"Paga por los años en la silla, no por el candelabro."' },
      ],
    },
  },
  "3": {
    "en": {
      "dek": "The Spanish phrase for hair color is el color de pelo — el because the noun color is masculine, and pelo because that's the word for hair in this context. This one phrase unlocks most of what you need at a salon or describing someone at a birthday party. Here's everything else.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Six core words cover every natural hair color — rubio, castaño, pelirrojo, negro, canoso, güero",
            "Two sentence formulas let you describe any hair color naturally: tener (what you have) and ser (what you are)",
            "Salon terms split by gender: el tinte is masculine, la tintura is feminine — both mean hair dye",
            "Güero is Valley/Mexican slang for blonde — your Tía actually uses it",
            "Regional vocabulary matters: rubio and güero both mean blonde but one is textbook, one is home"
          ]
        },
        {
          "h": "The Core Hair Color Words in Spanish",
          "p": "Here's the whole list in one place. No fluff."
        },
        {
          "list": [
            [
              "Rubio",
              "Blond"
            ],
            [
              "Güero",
              "Blond (Mexican slang)"
            ],
            [
              "Castaño",
              "Chestnut / Brown / Brunette"
            ],
            [
              "Pelirrojo",
              "Redheaded"
            ],
            [
              "Negro",
              "Black"
            ],
            [
              "Canoso",
              "Grey-haired"
            ]
          ]
        },
        {
          "p": "Rubio is the standard textbook word for blonde — both rubio and blond appear in Spanish-English dictionaries as direct translations. Güero means the same thing but it's Valley slang, the word your Tía actually uses, and it can also function as a nickname for fair-skinned people in general. Castaño covers a wide range — brown, chestnut, brunette — it's the word you reach for when someone isn't blonde or red, just about everything in between. Negro is black and it works exactly as you'd expect. Canoso is for grey or silver hair, and it's less common in casual conversation than the other terms but you'll hear it. Pelirrojo means redheaded — literally the person who has red hair."
        },
        {
          "h": "How to Say It: Two Sentence Formulas",
          "p": "Spanish gives you two ways to describe hair color, and once you know the pattern, you can build hundreds of sentences."
        },
        {
          "p": "Example: Tengo el pelo rubio. — I have blonde hair."
        },
        {
          "p": "This is the literal way to say it — you're stating a possession, which sounds natural in Spanish even though it sounds a little odd in English. María es pelirroja uses the ser formula — she's ginger. Both sentences say the same thing about the same person, just with different grammar."
        },
        {
          "p": "Formula two — what you are (ser): (pronoun or name) + ser (conjugated) + hair/skin color"
        },
        {
          "p": "This one drops the body part entirely. You're not saying \"I have blonde hair\" — you're saying \"I am blonde,\" which is how most people actually talk. María es pelirroja. That's it. Six words, done."
        },
        {
          "p": "Both formulas are correct. The tener version is more precise about the body part; the ser version is faster and more conversational."
        },
        {
          "h": "Salon Spanish: Hair Dye Vocabulary",
          "p": "When you're booking a color service or talking to your stylist, the vocabulary splits by grammatical gender — and knowing which word to use signals that you know what you're asking for."
        },
        {
          "bullets": [
            "el color de pelo — \"hair color\" (masculine noun)",
            "el color de cabello — \"hair color\" (also masculine, same meaning)",
            "el tinte — \"hair dye\" (masculine)",
            "la tintura — \"hair dye\" (feminine)"
          ]
        },
        {
          "p": "El tinte and la tintura both mean hair dye, but el tinte is what you'll hear in most salons and what most people say when they want to paint their hair a different color. La tintura shows up more in formal or medical contexts. El tinte is the word you want when you're in the chair."
        },
        {
          "h": "Practical Sentences for Real Conversations",
          "p": "Letty se quiere pintar el cabello rojo. — Letty wants to dye her hair red."
        },
        {
          "p": "Creo que Paola tiene el cabello castaño claro. — I think Paola has light chestnut hair."
        },
        {
          "p": "La novia de Paco tiene el cabello muy güero. — Paco's girlfriend has very blond hair."
        },
        {
          "p": "These three sentences cover three real scenarios — requesting a color change, describing someone you've just met, and commenting on someone's natural color at a family gathering. Castaño claro is a useful phrase because plain castaño can mean anything from medium brown to dark brunette; claro specifies the lighter end of that range."
        },
        {
          "h": "Frequently Asked Questions"
        },
        {
          "q": "What is the Spanish word for hair color?",
          "a": "The most common term is el color de pelo. El color de cabello means the same thing — both are masculine nouns. You might also hear el tinte used to mean hair dye specifically."
        },
        {
          "q": "What is rubio in English?",
          "a": "Rubio means blond or blonde in English. It's the standard word for light blonde to medium yellow hair. Güero is a Mexican slang alternative with the same meaning, commonly used in South Texas and the RGV."
        },
        {
          "q": "What is pelirrojo in English?",
          "a": "Pelirrojo means redheaded in English. It describes someone with red hair, from light strawberry blonde all the way to deep auburn — the word covers the whole spectrum of natural red hair."
        },
        {
          "q": "How do you say black hair in Spanish?",
          "a": "Negro means black. So pelo negro is black hair, and alguien tiene el pelo negro means someone has black hair. The word works exactly as you'd expect from its English cousin."
        },
        {
          "q": "What's the difference between el tinte and la tintura?",
          "a": "Both mean hair dye. El tinte is masculine and the more common salon word — it's what your stylist says when talking about a color service. La tintura is feminine and slightly more formal or clinical in tone. Use el tinte in everyday salon conversations."
        },
        {
          "q": "What does güero mean?",
          "a": "Güero means blond in Mexican Spanish slang. On top of referring to blond hair, it can also be used as a nickname for blond or white-skinned people. It's the word you'll hear at home, at the abuelita's house, and at neighborhood salons across the Valley — not in textbooks, but everywhere that matters."
        },
        {
          "q": "How do you talk about grey hair in Spanish?",
          "a": "Canoso means grey-haired. The word describes someone whose hair has turned grey or silver, and it's the standard term for that stage of life across most Spanish-speaking regions."
        }
      ]
    },
    "es": {
      "dek": "The Spanish phrase for hair color is el color de pelo — el because the noun color is masculine, and pelo because that's the word for hair in this context. This one phrase unlocks most of what you need at a salon or describing someone at a birthday party. Here's everything else.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Six core words cover every natural hair color — rubio, castaño, pelirrojo, negro, canoso, güero",
            "Two sentence formulas let you describe any hair color naturally: tener (what you have) and ser (what you are)",
            "Salon terms split by gender: el tinte is masculine, la tintura is feminine — both mean hair dye",
            "Güero is Valley/Mexican slang for blonde — your Tía actually uses it",
            "Regional vocabulary matters: rubio and güero both mean blonde but one is textbook, one is home"
          ]
        },
        {
          "h": "The Core Hair Color Words in Spanish",
          "p": "Here's the whole list in one place. No fluff."
        },
        {
          "list": [
            [
              "Rubio",
              "Blond"
            ],
            [
              "Güero",
              "Blond (Mexican slang)"
            ],
            [
              "Castaño",
              "Chestnut / Brown / Brunette"
            ],
            [
              "Pelirrojo",
              "Redheaded"
            ],
            [
              "Negro",
              "Black"
            ],
            [
              "Canoso",
              "Grey-haired"
            ]
          ]
        },
        {
          "p": "Rubio is the standard textbook word for blonde — both rubio and blond appear in Spanish-English dictionaries as direct translations. Güero means the same thing but it's Valley slang, the word your Tía actually uses, and it can also function as a nickname for fair-skinned people in general. Castaño covers a wide range — brown, chestnut, brunette — it's the word you reach for when someone isn't blonde or red, just about everything in between. Negro is black and it works exactly as you'd expect. Canoso is for grey or silver hair, and it's less common in casual conversation than the other terms but you'll hear it. Pelirrojo means redheaded — literally the person who has red hair."
        },
        {
          "h": "How to Say It: Two Sentence Formulas",
          "p": "Spanish gives you two ways to describe hair color, and once you know the pattern, you can build hundreds of sentences."
        },
        {
          "p": "Example: Tengo el pelo rubio. — I have blonde hair."
        },
        {
          "p": "This is the literal way to say it — you're stating a possession, which sounds natural in Spanish even though it sounds a little odd in English. María es pelirroja uses the ser formula — she's ginger. Both sentences say the same thing about the same person, just with different grammar."
        },
        {
          "p": "Formula two — what you are (ser): (pronoun or name) + ser (conjugated) + hair/skin color"
        },
        {
          "p": "This one drops the body part entirely. You're not saying \"I have blonde hair\" — you're saying \"I am blonde,\" which is how most people actually talk. María es pelirroja. That's it. Six words, done."
        },
        {
          "p": "Both formulas are correct. The tener version is more precise about the body part; the ser version is faster and more conversational."
        },
        {
          "h": "Salon Spanish: Hair Dye Vocabulary",
          "p": "When you're booking a color service or talking to your stylist, the vocabulary splits by grammatical gender — and knowing which word to use signals that you know what you're asking for."
        },
        {
          "bullets": [
            "el color de pelo — \"hair color\" (masculine noun)",
            "el color de cabello — \"hair color\" (also masculine, same meaning)",
            "el tinte — \"hair dye\" (masculine)",
            "la tintura — \"hair dye\" (feminine)"
          ]
        },
        {
          "p": "El tinte and la tintura both mean hair dye, but el tinte is what you'll hear in most salons and what most people say when they want to paint their hair a different color. La tintura shows up more in formal or medical contexts. El tinte is the word you want when you're in the chair."
        },
        {
          "h": "Practical Sentences for Real Conversations",
          "p": "Letty se quiere pintar el cabello rojo. — Letty wants to dye her hair red."
        },
        {
          "p": "Creo que Paola tiene el cabello castaño claro. — I think Paola has light chestnut hair."
        },
        {
          "p": "La novia de Paco tiene el cabello muy güero. — Paco's girlfriend has very blond hair."
        },
        {
          "p": "These three sentences cover three real scenarios — requesting a color change, describing someone you've just met, and commenting on someone's natural color at a family gathering. Castaño claro is a useful phrase because plain castaño can mean anything from medium brown to dark brunette; claro specifies the lighter end of that range."
        },
        {
          "h": "Frequently Asked Questions"
        },
        {
          "q": "What is the Spanish word for hair color?",
          "a": "The most common term is el color de pelo. El color de cabello means the same thing — both are masculine nouns. You might also hear el tinte used to mean hair dye specifically."
        },
        {
          "q": "What is rubio in English?",
          "a": "Rubio means blond or blonde in English. It's the standard word for light blonde to medium yellow hair. Güero is a Mexican slang alternative with the same meaning, commonly used in South Texas and the RGV."
        },
        {
          "q": "What is pelirrojo in English?",
          "a": "Pelirrojo means redheaded in English. It describes someone with red hair, from light strawberry blonde all the way to deep auburn — the word covers the whole spectrum of natural red hair."
        },
        {
          "q": "How do you say black hair in Spanish?",
          "a": "Negro means black. So pelo negro is black hair, and alguien tiene el pelo negro means someone has black hair. The word works exactly as you'd expect from its English cousin."
        },
        {
          "q": "What's the difference between el tinte and la tintura?",
          "a": "Both mean hair dye. El tinte is masculine and the more common salon word — it's what your stylist says when talking about a color service. La tintura is feminine and slightly more formal or clinical in tone. Use el tinte in everyday salon conversations."
        },
        {
          "q": "What does güero mean?",
          "a": "Güero means blond in Mexican Spanish slang. On top of referring to blond hair, it can also be used as a nickname for blond or white-skinned people. It's the word you'll hear at home, at the abuelita's house, and at neighborhood salons across the Valley — not in textbooks, but everywhere that matters."
        },
        {
          "q": "How do you talk about grey hair in Spanish?",
          "a": "Canoso means grey-haired. The word describes someone whose hair has turned grey or silver, and it's the standard term for that stage of life across most Spanish-speaking regions."
        }
      ]
    }
  },
  "4": {
    "en": {
      "dek": "You walk in, claim your chair, and the first thing anyone asks is what you're getting done. If you're requesting color in Spanglish or full Spanish, knowing the right words gets you a better result — and saves you the awkward hand gestures. Here's how to ask for hair color in Spanish, the way your Tía actually uses at her favorite salon on Military Highway.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Hair color is \"el color de pelo\"",
            "\"Teñir\" and \"pintar pelo\" both mean to dye your hair",
            "Describe your current color first, then the one you want",
            "\"Me quiero teñir de rubio\" is the go-to phrase for requesting a color",
            "Asking clarifying questions in Spanish keeps you in control of the outcome"
          ]
        },
        {
          "h": "What to Call Hair Color in Spanish",
          "p": "The basics are simple. Hair color is \"el color de pelo.\" Dye is \"el tinte.\" These two cover most conversations."
        },
        {
          "p": "When you're talking about the action, you have options. \"Teñir\" and \"pintar pelo\" both mean to dye your hair. Either works in a salon — \"teñir\" tends to feel more formal, \"pintar pelo\" more casual."
        },
        {
          "p": "Quick reference:"
        },
        {
          "bullets": [
            "Hair color — el color de pelo",
            "Dye — el tinte",
            "To dye — teñir / pintar pelo"
          ]
        },
        {
          "h": "How to Request a Color",
          "p": "Start with what you want. \"Me quiero teñir de rubio\" directly says you want to dye your hair blonde. Swap in your color — castaño for brown, negro for black, rojo for red."
        },
        {
          "p": "Another natural opener: Me gustaría teñirme el pelo — I would like to dye my hair. Your stylist will ask follow-up questions from there."
        },
        {
          "h": "Describing Your Current Hair",
          "p": "Before you get to the color you want, your stylist will want to know where you're starting. Here's how to describe your natural hair:"
        },
        {
          "bullets": [
            "Mi cabello es castaño y rizado — I have curly brown hair",
            "Su cabello es fino, liso y rubio — She has thin and straight blonde hair"
          ]
        },
        {
          "p": "For damaged or over-processed hair, say: Mi cabello está dañado, ¿puedo arreglarlo? That opens the conversation honestly so your colorist can plan a safe fix."
        },
        {
          "h": "Asking for Specific Services",
          "p": "Once you're in the chair, these phrases cover the most common follow-up requests:"
        },
        {
          "bullets": [
            "¿Me puede pintar y rizar el cabello? — Could you dye and curl my hair?",
            "Las raíces — the roots (the part near your scalp)",
            "¿Podrías alaciar mi cabello? — Could you straighten my hair?"
          ]
        },
        {
          "p": "If you want a look from a photo: ¿Puedes hacer que se vea como esta imagen?"
        },
        {
          "h": "Questions to Ask Before You Sit Down",
          "p": "Save yourself the surprise bill. Ask pricing questions before you commit:"
        },
        {
          "bullets": [
            "¿Este precio incluye lavado de cabello? — Does this price include a wash?",
            "¿Alrededor de qué hora terminaremos? — About what time will we be done?"
          ]
        },
        {
          "p": "These two questions alone prevent the two most common checkout surprises at Valley salons."
        },
        {
          "h": "Adjusting During the Appointment",
          "p": "Stylists expect you to speak up. These phrases cover mid-appointment adjustments:"
        },
        {
          "bullets": [
            "¿Podrías cortar un poco más? — Could you cut a little more?",
            "Quiero probar algo diferente hoy — I want to try something different today"
          ]
        },
        {
          "p": "If something isn't working, say it directly. Your stylist can't read your mind through the foil."
        },
        {
          "h": "Other Phrases Worth Knowing",
          "p": "A few more that come up regularly:"
        },
        {
          "bullets": [
            "Me gustaría un simple corte de pelo — I'd like a simple haircut",
            "¿Me puedes mostrar diferentes peinados? — Can you show me different hairstyles?",
            "¿Qué tipo de peinado me recomiendan? — What kind of hairstyle do you recommend?"
          ]
        },
        {
          "p": "If you're walking in without an appointment: No tengo cita, ¿tienes tiempo hoy?"
        },
        {
          "h": "Frequently Asked Questions"
        },
        {
          "q": "What's the difference between \"teñir\" and \"pintar pelo\"?",
          "a": "Both mean to dye your hair, and either works in a salon. \"Teñir\" sounds slightly more formal — useful when you're booking appointments or asking precise questions. \"Pintar pelo\" shows up more in everyday conversation."
        },
        {
          "q": "What if I don't understand the stylist's response?",
          "a": "Pull up a photo on your phone or ask to see one of theirs. Visuals work across language barriers and most Valley salons are used to mixed-language appointments."
        },
        {
          "q": "Can I book in Spanish and switch to English during the service?",
          "a": "Absolutely. Spanglish is normal here. Your stylist will follow your lead — switch whenever you're comfortable."
        },
        {
          "q": "How do I ask about correcting a bad dye job?",
          "a": "Use the same phrase from the *Describing Your Current Hair* section — it opens the conversation directly. Be honest about what was done previously so your colorist can plan a safe fix."
        },
        {
          "q": "How do I say \"balayage\" or \"highlights\" in Spanish?",
          "a": "Salon-specific terms vary by region, so when in doubt, show a photo and ask ¿Puedes hacer que se vea como esta imagen?"
        }
      ]
    },
    "es": {
      "dek": "You walk in, claim your chair, and the first thing anyone asks is what you're getting done. If you're requesting color in Spanglish or full Spanish, knowing the right words gets you a better result — and saves you the awkward hand gestures. Here's how to ask for hair color in Spanish, the way your Tía actually uses at her favorite salon on Military Highway.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Hair color is \"el color de pelo\"",
            "\"Teñir\" and \"pintar pelo\" both mean to dye your hair",
            "Describe your current color first, then the one you want",
            "\"Me quiero teñir de rubio\" is the go-to phrase for requesting a color",
            "Asking clarifying questions in Spanish keeps you in control of the outcome"
          ]
        },
        {
          "h": "What to Call Hair Color in Spanish",
          "p": "The basics are simple. Hair color is \"el color de pelo.\" Dye is \"el tinte.\" These two cover most conversations."
        },
        {
          "p": "When you're talking about the action, you have options. \"Teñir\" and \"pintar pelo\" both mean to dye your hair. Either works in a salon — \"teñir\" tends to feel more formal, \"pintar pelo\" more casual."
        },
        {
          "p": "Quick reference:"
        },
        {
          "bullets": [
            "Hair color — el color de pelo",
            "Dye — el tinte",
            "To dye — teñir / pintar pelo"
          ]
        },
        {
          "h": "How to Request a Color",
          "p": "Start with what you want. \"Me quiero teñir de rubio\" directly says you want to dye your hair blonde. Swap in your color — castaño for brown, negro for black, rojo for red."
        },
        {
          "p": "Another natural opener: Me gustaría teñirme el pelo — I would like to dye my hair. Your stylist will ask follow-up questions from there."
        },
        {
          "h": "Describing Your Current Hair",
          "p": "Before you get to the color you want, your stylist will want to know where you're starting. Here's how to describe your natural hair:"
        },
        {
          "bullets": [
            "Mi cabello es castaño y rizado — I have curly brown hair",
            "Su cabello es fino, liso y rubio — She has thin and straight blonde hair"
          ]
        },
        {
          "p": "For damaged or over-processed hair, say: Mi cabello está dañado, ¿puedo arreglarlo? That opens the conversation honestly so your colorist can plan a safe fix."
        },
        {
          "h": "Asking for Specific Services",
          "p": "Once you're in the chair, these phrases cover the most common follow-up requests:"
        },
        {
          "bullets": [
            "¿Me puede pintar y rizar el cabello? — Could you dye and curl my hair?",
            "Las raíces — the roots (the part near your scalp)",
            "¿Podrías alaciar mi cabello? — Could you straighten my hair?"
          ]
        },
        {
          "p": "If you want a look from a photo: ¿Puedes hacer que se vea como esta imagen?"
        },
        {
          "h": "Questions to Ask Before You Sit Down",
          "p": "Save yourself the surprise bill. Ask pricing questions before you commit:"
        },
        {
          "bullets": [
            "¿Este precio incluye lavado de cabello? — Does this price include a wash?",
            "¿Alrededor de qué hora terminaremos? — About what time will we be done?"
          ]
        },
        {
          "p": "These two questions alone prevent the two most common checkout surprises at Valley salons."
        },
        {
          "h": "Adjusting During the Appointment",
          "p": "Stylists expect you to speak up. These phrases cover mid-appointment adjustments:"
        },
        {
          "bullets": [
            "¿Podrías cortar un poco más? — Could you cut a little more?",
            "Quiero probar algo diferente hoy — I want to try something different today"
          ]
        },
        {
          "p": "If something isn't working, say it directly. Your stylist can't read your mind through the foil."
        },
        {
          "h": "Other Phrases Worth Knowing",
          "p": "A few more that come up regularly:"
        },
        {
          "bullets": [
            "Me gustaría un simple corte de pelo — I'd like a simple haircut",
            "¿Me puedes mostrar diferentes peinados? — Can you show me different hairstyles?",
            "¿Qué tipo de peinado me recomiendan? — What kind of hairstyle do you recommend?"
          ]
        },
        {
          "p": "If you're walking in without an appointment: No tengo cita, ¿tienes tiempo hoy?"
        },
        {
          "h": "Frequently Asked Questions"
        },
        {
          "q": "What's the difference between \"teñir\" and \"pintar pelo\"?",
          "a": "Both mean to dye your hair, and either works in a salon. \"Teñir\" sounds slightly more formal — useful when you're booking appointments or asking precise questions. \"Pintar pelo\" shows up more in everyday conversation."
        },
        {
          "q": "What if I don't understand the stylist's response?",
          "a": "Pull up a photo on your phone or ask to see one of theirs. Visuals work across language barriers and most Valley salons are used to mixed-language appointments."
        },
        {
          "q": "Can I book in Spanish and switch to English during the service?",
          "a": "Absolutely. Spanglish is normal here. Your stylist will follow your lead — switch whenever you're comfortable."
        },
        {
          "q": "How do I ask about correcting a bad dye job?",
          "a": "Use the same phrase from the *Describing Your Current Hair* section — it opens the conversation directly. Be honest about what was done previously so your colorist can plan a safe fix."
        },
        {
          "q": "How do I say \"balayage\" or \"highlights\" in Spanish?",
          "a": "Salon-specific terms vary by region, so when in doubt, show a photo and ask ¿Puedes hacer que se vea como esta imagen?"
        }
      ]
    }
  },
  "5": {
    "en": {
      "dek": "Whether you're booking a balayage appointment or explaining what mechas you want to your colorista, knowing hair color vocabulary in both languages makes everything smoother. Here's what you actually need to know.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Castaño and pelirrojo are your go-to terms — forget café for hair",
            "Color adjectives must agree in gender and number with the noun they modify",
            "All color nouns are masculine, even when they end in -a",
            "Güero is Valley/Mexican slang with broader meaning than just \"blond\"",
            "Las canas refers to grey or white hairs; canoso describes the person"
          ]
        },
        {
          "h": "How Do You Say Hair Colors in Spanish?",
          "p": "Here's the basic vocabulary you need at a salon:"
        },
        {
          "bullets": [
            "Rubio / rubia — blond or fair-haired",
            "Castaño / castaña — brown or chestnut",
            "Pelirrojo / pelirroja — redhead or red-haired",
            "Negro / negra — black-haired",
            "Gris — grey"
          ]
        },
        {
          "p": "The three primary colors — azul (blue), amarillo (yellow), and rojo (red) — also come up when describing undertones in your hair. Knowing them helps you describe whether your color runs cool or warm."
        },
        {
          "h": "Why Is Café Wrong for Hair Color?",
          "p": "Café does mean \"brown\", but is not used to describe hair color. Marrón (dark brown) or castaño (chestnut-colored) are better choices."
        },
        {
          "p": "At the salon, your stylist will understand castaño immediately. If you're describing highlights in brown hair, try \"mechas castañas\" or \"reflejos castaños.\""
        },
        {
          "h": "How Does Gender Agreement Work with Color Adjectives?",
          "p": "Color adjectives must agree in gender and number with the noun they modify."
        },
        {
          "p": "In practice:"
        },
        {
          "bullets": [
            "Cabello rubio (masculine noun, masculine adjective)",
            "Cabello castaño (masculine noun, masculine adjective)",
            "Cabello rojo (masculine noun, masculine adjective)"
          ]
        },
        {
          "p": "All color nouns are masculine, even when they end in -a. So you say \"el azul,\" not \"la azul.\" This trips people up because morado and rosa both end in -a but are grammatically masculine."
        },
        {
          "p": "This doesn't apply to colors that end with 'e', consonants, or 'a' — those stay the same for gender. Verde, gris, and marrón don't change form for gender, only for number (verde vs verdes)."
        },
        {
          "h": "What About Grey Hair?",
          "p": "White or grey hairs are called las canas and a white or grey haired person is referred to as being canoso. If you're booking color to cover your canas, say \"tinte para cubrir las canas\" or \"color para canas.\""
        },
        {
          "h": "What Regional Slang Should You Know?",
          "p": "Güero is a Mexican slang word that, on top of referring to blond hair, can also be used as a nickname for blond or white people. In the Valley, you'll hear güero and its feminine form güera used casually all the time — it's not offensive, just everyday talk."
        },
        {
          "h": "Where Do Spanish Color Words Come From?",
          "p": "Spanish colors have interesting roots:"
        },
        {
          "bullets": [
            "Rojo (red) comes from \"Russus\"",
            "Verde (green) comes from \"Viridus\" which links back to meanings of youth and life",
            "Azul comes from the precious blue stone \"lazawardy\" — the word was originally taken from Persian but entered Spanish through contact with Arabic",
            "Naranja (orange) comes from Persian originally, but was introduced to Spanish via Arabic"
          ]
        },
        {
          "p": "Knowing these origins helps you remember why colors work the way they do in Spanish."
        },
        {
          "h": "How Do You Describe Hair Techniques in Both Languages?",
          "p": "When booking appointments, these terms come up constantly:"
        },
        {
          "bullets": [
            "Highlights — mechas or reflejos",
            "Balayage — usually just called balayage in both languages",
            "Lowlights — reflejos oscuros or mechas oscuras",
            "Root touch-up — retoque de raíz",
            "Gloss — glos or baño de brillo"
          ]
        },
        {
          "p": "Your colorista will appreciate you using these terms correctly. It cuts down on the back-and-forth and gets you to the chair faster."
        },
        {
          "h": "Common Color Idioms in Spanish",
          "p": "Spanish uses color in expressions that don't translate literally:"
        },
        {
          "bullets": [
            "Estar verde is an informal expression used to describe that a person has no experience with something",
            "Ponerse rojo como un tomate is used to describe that a person is blushing because he or she is embarrassed about something",
            "Sacar canas verdes is a Latin American Spanish phrase used to describe that someone is upsetting or making another person worried because of their actions"
          ]
        },
        {
          "p": "These won't come up at the salon, but knowing them shows you're not just memorizing vocabulary — you're understanding how color works in real Spanish."
        },
        {
          "h": "Frequently Asked Questions"
        },
        {
          "q": "Can I use café to describe brown hair?",
          "a": "No. Café does mean \"brown\", but is not used to describe hair color. Use castaño for brown hair or marrón for darker brown tones instead."
        },
        {
          "q": "Do color adjectives change for masculine and feminine nouns?",
          "a": "Yes. Color adjectives must agree in gender and number with the noun they modify. Rubio becomes rubia when describing a feminine noun like mujer. Colors ending in -e, consonants, or -a (like rosa, morado) stay the same for gender but change for number."
        },
        {
          "q": "What do you call grey hairs in Spanish?",
          "a": "White or grey hairs are called las canas. A grey-haired person is canoso or canosa depending on gender."
        },
        {
          "q": "What does güero mean?",
          "a": "Güero is a Mexican slang word that, on top of referring to blond hair, can also be used as a nickname for blond or white people. It's common throughout South Texas and northern Mexico."
        },
        {
          "q": "How do I ask for highlights in Spanish?",
          "a": "Say \"mechas\" for highlights or \"reflejos\" for a more natural, sun-kissed look. \"Balayage\" is used in both languages now. Describe the color with the base term — \"mechas rubias\" for blonde highlights, \"mechas castañas\" for brown."
        }
      ]
    },
    "es": {
      "dek": "Whether you're booking a balayage appointment or explaining what mechas you want to your colorista, knowing hair color vocabulary in both languages makes everything smoother. Here's what you actually need to know.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Castaño and pelirrojo are your go-to terms — forget café for hair",
            "Color adjectives must agree in gender and number with the noun they modify",
            "All color nouns are masculine, even when they end in -a",
            "Güero is Valley/Mexican slang with broader meaning than just \"blond\"",
            "Las canas refers to grey or white hairs; canoso describes the person"
          ]
        },
        {
          "h": "How Do You Say Hair Colors in Spanish?",
          "p": "Here's the basic vocabulary you need at a salon:"
        },
        {
          "bullets": [
            "Rubio / rubia — blond or fair-haired",
            "Castaño / castaña — brown or chestnut",
            "Pelirrojo / pelirroja — redhead or red-haired",
            "Negro / negra — black-haired",
            "Gris — grey"
          ]
        },
        {
          "p": "The three primary colors — azul (blue), amarillo (yellow), and rojo (red) — also come up when describing undertones in your hair. Knowing them helps you describe whether your color runs cool or warm."
        },
        {
          "h": "Why Is Café Wrong for Hair Color?",
          "p": "Café does mean \"brown\", but is not used to describe hair color. Marrón (dark brown) or castaño (chestnut-colored) are better choices."
        },
        {
          "p": "At the salon, your stylist will understand castaño immediately. If you're describing highlights in brown hair, try \"mechas castañas\" or \"reflejos castaños.\""
        },
        {
          "h": "How Does Gender Agreement Work with Color Adjectives?",
          "p": "Color adjectives must agree in gender and number with the noun they modify."
        },
        {
          "p": "In practice:"
        },
        {
          "bullets": [
            "Cabello rubio (masculine noun, masculine adjective)",
            "Cabello castaño (masculine noun, masculine adjective)",
            "Cabello rojo (masculine noun, masculine adjective)"
          ]
        },
        {
          "p": "All color nouns are masculine, even when they end in -a. So you say \"el azul,\" not \"la azul.\" This trips people up because morado and rosa both end in -a but are grammatically masculine."
        },
        {
          "p": "This doesn't apply to colors that end with 'e', consonants, or 'a' — those stay the same for gender. Verde, gris, and marrón don't change form for gender, only for number (verde vs verdes)."
        },
        {
          "h": "What About Grey Hair?",
          "p": "White or grey hairs are called las canas and a white or grey haired person is referred to as being canoso. If you're booking color to cover your canas, say \"tinte para cubrir las canas\" or \"color para canas.\""
        },
        {
          "h": "What Regional Slang Should You Know?",
          "p": "Güero is a Mexican slang word that, on top of referring to blond hair, can also be used as a nickname for blond or white people. In the Valley, you'll hear güero and its feminine form güera used casually all the time — it's not offensive, just everyday talk."
        },
        {
          "h": "Where Do Spanish Color Words Come From?",
          "p": "Spanish colors have interesting roots:"
        },
        {
          "bullets": [
            "Rojo (red) comes from \"Russus\"",
            "Verde (green) comes from \"Viridus\" which links back to meanings of youth and life",
            "Azul comes from the precious blue stone \"lazawardy\" — the word was originally taken from Persian but entered Spanish through contact with Arabic",
            "Naranja (orange) comes from Persian originally, but was introduced to Spanish via Arabic"
          ]
        },
        {
          "p": "Knowing these origins helps you remember why colors work the way they do in Spanish."
        },
        {
          "h": "How Do You Describe Hair Techniques in Both Languages?",
          "p": "When booking appointments, these terms come up constantly:"
        },
        {
          "bullets": [
            "Highlights — mechas or reflejos",
            "Balayage — usually just called balayage in both languages",
            "Lowlights — reflejos oscuros or mechas oscuras",
            "Root touch-up — retoque de raíz",
            "Gloss — glos or baño de brillo"
          ]
        },
        {
          "p": "Your colorista will appreciate you using these terms correctly. It cuts down on the back-and-forth and gets you to the chair faster."
        },
        {
          "h": "Common Color Idioms in Spanish",
          "p": "Spanish uses color in expressions that don't translate literally:"
        },
        {
          "bullets": [
            "Estar verde is an informal expression used to describe that a person has no experience with something",
            "Ponerse rojo como un tomate is used to describe that a person is blushing because he or she is embarrassed about something",
            "Sacar canas verdes is a Latin American Spanish phrase used to describe that someone is upsetting or making another person worried because of their actions"
          ]
        },
        {
          "p": "These won't come up at the salon, but knowing them shows you're not just memorizing vocabulary — you're understanding how color works in real Spanish."
        },
        {
          "h": "Frequently Asked Questions"
        },
        {
          "q": "Can I use café to describe brown hair?",
          "a": "No. Café does mean \"brown\", but is not used to describe hair color. Use castaño for brown hair or marrón for darker brown tones instead."
        },
        {
          "q": "Do color adjectives change for masculine and feminine nouns?",
          "a": "Yes. Color adjectives must agree in gender and number with the noun they modify. Rubio becomes rubia when describing a feminine noun like mujer. Colors ending in -e, consonants, or -a (like rosa, morado) stay the same for gender but change for number."
        },
        {
          "q": "What do you call grey hairs in Spanish?",
          "a": "White or grey hairs are called las canas. A grey-haired person is canoso or canosa depending on gender."
        },
        {
          "q": "What does güero mean?",
          "a": "Güero is a Mexican slang word that, on top of referring to blond hair, can also be used as a nickname for blond or white people. It's common throughout South Texas and northern Mexico."
        },
        {
          "q": "How do I ask for highlights in Spanish?",
          "a": "Say \"mechas\" for highlights or \"reflejos\" for a more natural, sun-kissed look. \"Balayage\" is used in both languages now. Describe the color with the base term — \"mechas rubias\" for blonde highlights, \"mechas castañas\" for brown."
        }
      ]
    }
  },
  "6": {
    "en": {
      "dek": "The standard tip for hairstylists is 15%–20% of the total service cost. Going with 20% is the easiest math — fair to the stylist and easy to do in your head across most services.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Basic cuts: 15%–20%",
            "Color and highlights: 20%–30%",
            "Balayage and complex color: 22%–30%",
            "Tip assistants separately: $5–$10",
            "Never skip the tip — even if you're not thrilled"
          ]
        },
        {
          "h": "How much should you tip for a haircut?",
          "p": "For a basic haircut, 15%–20% is standard. At a $50 service, that's $7.50–$10. It's acceptable to tip closer to 15% for simpler styles, like a routine barber cut."
        },
        {
          "h": "How much should you tip for color or highlights?",
          "p": "Color and highlights call for 20%–30%. For a $150 color service, that's $22.50–$30. If you're getting balayage or another complex color, tip on the higher end — 22%–30% for premium or complex styles. On a $200 balayage, that puts you at $30–$40."
        },
        {
          "h": "Should you tip the shampoo assistant separately?",
          "p": "Yes. A general rule is to tip anyone who touches your hair. Tip shampoo assistants separately if possible: $5–$10 is standard, depending on how much they did. If multiple people worked on your service, split the tip accordingly."
        },
        {
          "h": "What if the service wasn't great?",
          "p": "If you're not pleased with how your hair turned out, it's OK to leave closer to 15% — but do not skip the tip. Many stylists rely on tips as a meaningful portion of their income. Tips are always appreciated, but never expected. If money is tight, leave what you can — 15% is fair."
        },
        {
          "h": "Cash or card — does it matter?",
          "p": "Cash is king in most salons, but card and digital tips work fine too. Most salons add a tip line at checkout; some stylists also accept Venmo or Zelle. Either way, leave something."
        },
        {
          "h": "How to figure 20% fast",
          "p": "Move the decimal one place left, then double it. For a $75 service: $7.50 doubled = $15. For a $150 color: $30. For a $200 balayage at 25%: $50. Round up if you're paying cash."
        },
        {
          "h": "Frequently Asked Questions"
        },
        {
          "q": "Should you tip more for a complex style?",
          "a": "If your stylist is doing color correction, balayage, or precision work, lean to the higher end of the range — 22%–30% for premium or complex services."
        },
        {
          "q": "What if you can't afford to tip 20%?",
          "a": "15% is acceptable. The point is don't skip — leave what you can. Tips are always appreciated, but never expected."
        },
        {
          "q": "Should you tip cash or on the card?",
          "a": "Either works. Cash goes straight to the stylist the same day; card tips usually process with the salon's payroll cycle. If you want the stylist to have it in hand right away, cash is better."
        }
      ]
    },
    "es": {
      "dek": "The standard tip for hairstylists is 15%–20% of the total service cost. Going with 20% is the easiest math — fair to the stylist and easy to do in your head across most services.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Basic cuts: 15%–20%",
            "Color and highlights: 20%–30%",
            "Balayage and complex color: 22%–30%",
            "Tip assistants separately: $5–$10",
            "Never skip the tip — even if you're not thrilled"
          ]
        },
        {
          "h": "How much should you tip for a haircut?",
          "p": "For a basic haircut, 15%–20% is standard. At a $50 service, that's $7.50–$10. It's acceptable to tip closer to 15% for simpler styles, like a routine barber cut."
        },
        {
          "h": "How much should you tip for color or highlights?",
          "p": "Color and highlights call for 20%–30%. For a $150 color service, that's $22.50–$30. If you're getting balayage or another complex color, tip on the higher end — 22%–30% for premium or complex styles. On a $200 balayage, that puts you at $30–$40."
        },
        {
          "h": "Should you tip the shampoo assistant separately?",
          "p": "Yes. A general rule is to tip anyone who touches your hair. Tip shampoo assistants separately if possible: $5–$10 is standard, depending on how much they did. If multiple people worked on your service, split the tip accordingly."
        },
        {
          "h": "What if the service wasn't great?",
          "p": "If you're not pleased with how your hair turned out, it's OK to leave closer to 15% — but do not skip the tip. Many stylists rely on tips as a meaningful portion of their income. Tips are always appreciated, but never expected. If money is tight, leave what you can — 15% is fair."
        },
        {
          "h": "Cash or card — does it matter?",
          "p": "Cash is king in most salons, but card and digital tips work fine too. Most salons add a tip line at checkout; some stylists also accept Venmo or Zelle. Either way, leave something."
        },
        {
          "h": "How to figure 20% fast",
          "p": "Move the decimal one place left, then double it. For a $75 service: $7.50 doubled = $15. For a $150 color: $30. For a $200 balayage at 25%: $50. Round up if you're paying cash."
        },
        {
          "h": "Frequently Asked Questions"
        },
        {
          "q": "Should you tip more for a complex style?",
          "a": "If your stylist is doing color correction, balayage, or precision work, lean to the higher end of the range — 22%–30% for premium or complex services."
        },
        {
          "q": "What if you can't afford to tip 20%?",
          "a": "15% is acceptable. The point is don't skip — leave what you can. Tips are always appreciated, but never expected."
        },
        {
          "q": "Should you tip cash or on the card?",
          "a": "Either works. Cash goes straight to the stylist the same day; card tips usually process with the salon's payroll cycle. If you want the stylist to have it in hand right away, cash is better."
        }
      ]
    }
  },
  "7": {
    "en": {
      "dek": "Brazilian Blowouts and Keratin Treatments are semi-permanent smoothing treatments that eliminate frizz and enhance shine. The key difference is what coats your hair: Brazilian Blowouts use amino acids and proteins to create a protective layer around each strand, while Keratin Treatments use pure keratin protein that penetrates inside the hair to rebuild it from within. One lets you wash the same day; the other asks for three days of patience. Here's how to pick.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Brazilian Blowouts coat the strand; Keratin Treatments penetrate and repair from inside",
            "Brazilian Blowout: wash same day, lasts 2–3 months",
            "Keratin: 72-hour wait before first wash, lasts 3–5 months",
            "Keratin is healthier long-term because it rebuilds rather than coats",
            "Both need sulfate-free shampoo and pool avoidance to last"
          ]
        },
        {
          "h": "What is a Brazilian Blowout?",
          "p": "A Brazilian Blowout is a professional hair-smoothing treatment that uses amino acids and proteins. It works by creating a protective protein layer around each hair strand, sealing the cuticle and smoothing the surface. Think of it like a topcoat — it sits on the outside of your hair rather than soaking in."
        },
        {
          "p": "Results are immediate: you can wash, exercise, and put your hair in a ponytail the same day."
        },
        {
          "p": "The treatment is customizable — you can choose from a gentle reduction in frizz up to three levels of curl reduction, depending on how sleek you want to go."
        },
        {
          "h": "What is a Keratin Treatment?",
          "p": "A Keratin Treatment is a semi-permanent smoothing process that uses keratin — a natural protein already in your hair, skin, and nails. The keratin molecules are small enough to penetrate the individual hair strands, replenishing and repairing them from the inside out. That's the structural difference: keratin rebuilds, Brazilian coats."
        },
        {
          "p": "Keratin treatments offer deeper conditioning and smoothing benefits than a Brazilian Blowout. They're also gentler on hair if you use hot tools or a blow dryer afterward."
        },
        {
          "p": "The tradeoff: you must wait 72 hours before shampooing to let the treatment fully set. During that window, avoid swimming, heavy exercise, or anything that causes sweat or moisture. Headbands and clips can also dent the hair while it's setting."
        },
        {
          "h": "Downtime and aftercare",
          "p": "Brazilian Blowouts win on convenience — no waiting period."
        },
        {
          "p": "Keratin needs the full 72-hour pause before the first wash. Skip the gym, the pool, and clips that might leave impressions while it sets."
        },
        {
          "p": "After the initial window, both treatments share the same maintenance habits:"
        },
        {
          "bullets": [
            "Use sulfate-free shampoo to extend the life of either treatment",
            "Avoid swimming in pools — chlorine compromises both",
            "Skip heavy conditioners near the scalp; focus on the lengths"
          ]
        },
        {
          "h": "How long do results last?",
          "p": "Brazilian Blowout typically lasts 2 to 3 months with proper aftercare. Keratin lasts 3 to 5 months. The longer lifespan comes from the keratin actually repairing the hair rather than coating it."
        },
        {
          "p": "Results are cumulative with either treatment — the more you do them, the healthier your hair becomes over time."
        },
        {
          "p": "Longevity depends on how you care for your hair after leaving the salon. Sulfate-free shampoo and skipping pools push either treatment toward the longer end of its range. Daily heat styling or weekly swimming cut that timeline short."
        },
        {
          "h": "Which is healthier for your hair?",
          "p": "Keratin treatments are the healthier long-term choice. Because the keratin molecule fortifies hair internally and externally, you're actually rebuilding the hair with each treatment. Brazilian Blowouts smooth without rebuilding — fine for shine, less useful for structural repair."
        },
        {
          "p": "Both treatments work well for curly hair. Keep in mind these are smoothing, not straightening — curly hair will still have movement and wave after either option."
        },
        {
          "p": "If your goal is stronger, healthier hair over time, keratin is the better investment. If you want same-day results and shorter total downtime, Brazilian Blowout is the call."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Which lasts longer — Keratin or Brazilian Blowout?",
          "a": "Keratin. With proper aftercare it typically holds for 3 to 5 months; Brazilian Blowout sits at 2 to 3 months."
        },
        {
          "q": "Will either treatment make my hair completely straight?",
          "a": "No — both are smoothing, not straightening. You'll still have natural wave and movement. If you want bone-straight hair, ask your stylist about Japanese thermal straightening instead."
        },
        {
          "q": "Can I swim after either treatment?",
          "a": "Not right away. For keratin, wait the full 72 hours. For Brazilian Blowout, you can technically wash immediately but should still avoid pools for the first few days. Long-term, chlorine in pools compromises both treatments."
        }
      ]
    },
    "es": {
      "dek": "Brazilian Blowouts and Keratin Treatments are semi-permanent smoothing treatments that eliminate frizz and enhance shine. The key difference is what coats your hair: Brazilian Blowouts use amino acids and proteins to create a protective layer around each strand, while Keratin Treatments use pure keratin protein that penetrates inside the hair to rebuild it from within. One lets you wash the same day; the other asks for three days of patience. Here's how to pick.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Brazilian Blowouts coat the strand; Keratin Treatments penetrate and repair from inside",
            "Brazilian Blowout: wash same day, lasts 2–3 months",
            "Keratin: 72-hour wait before first wash, lasts 3–5 months",
            "Keratin is healthier long-term because it rebuilds rather than coats",
            "Both need sulfate-free shampoo and pool avoidance to last"
          ]
        },
        {
          "h": "What is a Brazilian Blowout?",
          "p": "A Brazilian Blowout is a professional hair-smoothing treatment that uses amino acids and proteins. It works by creating a protective protein layer around each hair strand, sealing the cuticle and smoothing the surface. Think of it like a topcoat — it sits on the outside of your hair rather than soaking in."
        },
        {
          "p": "Results are immediate: you can wash, exercise, and put your hair in a ponytail the same day."
        },
        {
          "p": "The treatment is customizable — you can choose from a gentle reduction in frizz up to three levels of curl reduction, depending on how sleek you want to go."
        },
        {
          "h": "What is a Keratin Treatment?",
          "p": "A Keratin Treatment is a semi-permanent smoothing process that uses keratin — a natural protein already in your hair, skin, and nails. The keratin molecules are small enough to penetrate the individual hair strands, replenishing and repairing them from the inside out. That's the structural difference: keratin rebuilds, Brazilian coats."
        },
        {
          "p": "Keratin treatments offer deeper conditioning and smoothing benefits than a Brazilian Blowout. They're also gentler on hair if you use hot tools or a blow dryer afterward."
        },
        {
          "p": "The tradeoff: you must wait 72 hours before shampooing to let the treatment fully set. During that window, avoid swimming, heavy exercise, or anything that causes sweat or moisture. Headbands and clips can also dent the hair while it's setting."
        },
        {
          "h": "Downtime and aftercare",
          "p": "Brazilian Blowouts win on convenience — no waiting period."
        },
        {
          "p": "Keratin needs the full 72-hour pause before the first wash. Skip the gym, the pool, and clips that might leave impressions while it sets."
        },
        {
          "p": "After the initial window, both treatments share the same maintenance habits:"
        },
        {
          "bullets": [
            "Use sulfate-free shampoo to extend the life of either treatment",
            "Avoid swimming in pools — chlorine compromises both",
            "Skip heavy conditioners near the scalp; focus on the lengths"
          ]
        },
        {
          "h": "How long do results last?",
          "p": "Brazilian Blowout typically lasts 2 to 3 months with proper aftercare. Keratin lasts 3 to 5 months. The longer lifespan comes from the keratin actually repairing the hair rather than coating it."
        },
        {
          "p": "Results are cumulative with either treatment — the more you do them, the healthier your hair becomes over time."
        },
        {
          "p": "Longevity depends on how you care for your hair after leaving the salon. Sulfate-free shampoo and skipping pools push either treatment toward the longer end of its range. Daily heat styling or weekly swimming cut that timeline short."
        },
        {
          "h": "Which is healthier for your hair?",
          "p": "Keratin treatments are the healthier long-term choice. Because the keratin molecule fortifies hair internally and externally, you're actually rebuilding the hair with each treatment. Brazilian Blowouts smooth without rebuilding — fine for shine, less useful for structural repair."
        },
        {
          "p": "Both treatments work well for curly hair. Keep in mind these are smoothing, not straightening — curly hair will still have movement and wave after either option."
        },
        {
          "p": "If your goal is stronger, healthier hair over time, keratin is the better investment. If you want same-day results and shorter total downtime, Brazilian Blowout is the call."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Which lasts longer — Keratin or Brazilian Blowout?",
          "a": "Keratin. With proper aftercare it typically holds for 3 to 5 months; Brazilian Blowout sits at 2 to 3 months."
        },
        {
          "q": "Will either treatment make my hair completely straight?",
          "a": "No — both are smoothing, not straightening. You'll still have natural wave and movement. If you want bone-straight hair, ask your stylist about Japanese thermal straightening instead."
        },
        {
          "q": "Can I swim after either treatment?",
          "a": "Not right away. For keratin, wait the full 72 hours. For Brazilian Blowout, you can technically wash immediately but should still avoid pools for the first few days. Long-term, chlorine in pools compromises both treatments."
        }
      ]
    }
  },
  "8": {
    "en": {
      "dek": "Most lash extensions last 3 to 6 weeks before they're due for a fill. Some sets push 6–8 weeks under ideal conditions, but that's the exception. The catch: natural lashes shed 1 to 5 a day, so you'll lose 50% to 60% of your extensions within three weeks. Plan for fills every 2–3 weeks or expect gaps.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Most extensions hold 3–6 weeks with normal care",
            "Fills every 2–3 weeks keep the line full",
            "Classic extensions last longer than volume sets",
            "Oil-based products are the biggest enemy of retention",
            "A fill takes 45–60 minutes; a fresh full set takes longer"
          ]
        },
        {
          "h": "What decides how long your extensions last?",
          "p": "A few factors set the ceiling — what your stylist applies and what you do at home."
        },
        {
          "bullets": [
            "Adhesive quality. The bond used matters most. Better glue means better retention from day one.",
            "Material grade. Premium extensions last longer than budget options. Cheap ones break down faster.",
            "Your lash health. Each extension bonds to one natural lash. Weak or damaged natural lashes won't hold.",
            "Daily habits. Rubbing your eyes, sleeping face-down on a cotton pillowcase, or using oil-based skincare near your eye area all shorten lifespan. Switching to a silk pillowcase and oil-free products extends it."
          ]
        },
        {
          "p": "Some people get 6 weeks. Others see gaps by week two. The difference usually comes down to what they're doing at home."
        },
        {
          "h": "Classic vs volume vs hybrid: which lasts longest?",
          "p": "Not all extensions wear the same way."
        },
        {
          "bullets": [
            "Classic. One extension per natural lash. Less weight, less stress — the longest-lasting of the three types.",
            "Volume. Multiple thinner extensions per lash. Dramatic, fuller look, but the added weight shortens lifespan.",
            "Hybrid. Mixes classic and volume techniques. Falls in the middle for lifespan."
          ]
        },
        {
          "p": "If retention is your priority, classic wins. If fullness is, volume is worth the shorter window between fills."
        },
        {
          "h": "What to expect as your lashes shed",
          "p": "Here's the honest week-by-week:"
        },
        {
          "bullets": [
            "Weeks 1–2: Full set looks its best. Some shedding starts but gaps are minimal.",
            "Week 3: Most of the visible shedding happens. Without a fill scheduled, gaps start to appear.",
            "Week 4: Most clients notice visible thinning. A fill is overdue for most people at this point.",
            "Weeks 5–6: Significant gaps without fills. If you're past the halfway mark, a fresh full set may make more sense than a fill."
          ]
        },
        {
          "p": "Gradual loss isn't a problem — extensions shed naturally with your lash cycle. That's the system working."
        },
        {
          "h": "Fill or fresh set?",
          "p": "A fill takes 45–60 minutes and costs less than starting over. That's the baseline maintenance and what keeps your line consistent between visits."
        },
        {
          "p": "If most of your extensions have shed, a fresh full set is the better call. Trying to fill what's barely there often leaves you with a patchy, uneven result."
        },
        {
          "p": "Regular fills also prevent overloading your natural lashes — stacking too many heavy extensions on recovering lashes causes damage over time."
        },
        {
          "h": "Aftercare that actually extends retention",
          "p": "After your appointment, keep lashes dry for at least 4 hours and possibly up to 48 hours while the adhesive cures."
        },
        {
          "p": "Oil breaks down lash adhesive — that's the single biggest aftercare mistake. Oil-based removers, serums, and heavy creams near the eye area all work against you."
        },
        {
          "p": "A simple at-home routine adds a week or two of wear between fills:"
        },
        {
          "bullets": [
            "Brush daily with a clean spoolie",
            "Sleep on a silk pillowcase",
            "Cleanse with oil-free products",
            "Avoid rubbing your eyes"
          ]
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Does the lash type change how often I need fills?",
          "a": "Indirectly, yes. Classic extensions hold longer, so you can stretch fills toward the 3-week mark. Volume sets shed faster from the added weight — plan closer to 2 weeks if you want the look to stay consistent."
        },
        {
          "q": "When should I get a full set instead of a fill?",
          "a": "If more than half your extensions have shed, book a fresh full set. Filling sparse extensions usually looks patchy. A full set gives you a clean baseline to maintain from."
        },
        {
          "q": "Can I keep using my regular skincare?",
          "a": "Probably not — at least not around your eyes. Most face creams, eye creams, and oil-based cleansers contain ingredients that break down lash adhesive. Audit your routine for any oils within an inch of your lash line. That one change usually adds a full week to retention."
        }
      ]
    },
    "es": {
      "dek": "Most lash extensions last 3 to 6 weeks before they're due for a fill. Some sets push 6–8 weeks under ideal conditions, but that's the exception. The catch: natural lashes shed 1 to 5 a day, so you'll lose 50% to 60% of your extensions within three weeks. Plan for fills every 2–3 weeks or expect gaps.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Most extensions hold 3–6 weeks with normal care",
            "Fills every 2–3 weeks keep the line full",
            "Classic extensions last longer than volume sets",
            "Oil-based products are the biggest enemy of retention",
            "A fill takes 45–60 minutes; a fresh full set takes longer"
          ]
        },
        {
          "h": "What decides how long your extensions last?",
          "p": "A few factors set the ceiling — what your stylist applies and what you do at home."
        },
        {
          "bullets": [
            "Adhesive quality. The bond used matters most. Better glue means better retention from day one.",
            "Material grade. Premium extensions last longer than budget options. Cheap ones break down faster.",
            "Your lash health. Each extension bonds to one natural lash. Weak or damaged natural lashes won't hold.",
            "Daily habits. Rubbing your eyes, sleeping face-down on a cotton pillowcase, or using oil-based skincare near your eye area all shorten lifespan. Switching to a silk pillowcase and oil-free products extends it."
          ]
        },
        {
          "p": "Some people get 6 weeks. Others see gaps by week two. The difference usually comes down to what they're doing at home."
        },
        {
          "h": "Classic vs volume vs hybrid: which lasts longest?",
          "p": "Not all extensions wear the same way."
        },
        {
          "bullets": [
            "Classic. One extension per natural lash. Less weight, less stress — the longest-lasting of the three types.",
            "Volume. Multiple thinner extensions per lash. Dramatic, fuller look, but the added weight shortens lifespan.",
            "Hybrid. Mixes classic and volume techniques. Falls in the middle for lifespan."
          ]
        },
        {
          "p": "If retention is your priority, classic wins. If fullness is, volume is worth the shorter window between fills."
        },
        {
          "h": "What to expect as your lashes shed",
          "p": "Here's the honest week-by-week:"
        },
        {
          "bullets": [
            "Weeks 1–2: Full set looks its best. Some shedding starts but gaps are minimal.",
            "Week 3: Most of the visible shedding happens. Without a fill scheduled, gaps start to appear.",
            "Week 4: Most clients notice visible thinning. A fill is overdue for most people at this point.",
            "Weeks 5–6: Significant gaps without fills. If you're past the halfway mark, a fresh full set may make more sense than a fill."
          ]
        },
        {
          "p": "Gradual loss isn't a problem — extensions shed naturally with your lash cycle. That's the system working."
        },
        {
          "h": "Fill or fresh set?",
          "p": "A fill takes 45–60 minutes and costs less than starting over. That's the baseline maintenance and what keeps your line consistent between visits."
        },
        {
          "p": "If most of your extensions have shed, a fresh full set is the better call. Trying to fill what's barely there often leaves you with a patchy, uneven result."
        },
        {
          "p": "Regular fills also prevent overloading your natural lashes — stacking too many heavy extensions on recovering lashes causes damage over time."
        },
        {
          "h": "Aftercare that actually extends retention",
          "p": "After your appointment, keep lashes dry for at least 4 hours and possibly up to 48 hours while the adhesive cures."
        },
        {
          "p": "Oil breaks down lash adhesive — that's the single biggest aftercare mistake. Oil-based removers, serums, and heavy creams near the eye area all work against you."
        },
        {
          "p": "A simple at-home routine adds a week or two of wear between fills:"
        },
        {
          "bullets": [
            "Brush daily with a clean spoolie",
            "Sleep on a silk pillowcase",
            "Cleanse with oil-free products",
            "Avoid rubbing your eyes"
          ]
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Does the lash type change how often I need fills?",
          "a": "Indirectly, yes. Classic extensions hold longer, so you can stretch fills toward the 3-week mark. Volume sets shed faster from the added weight — plan closer to 2 weeks if you want the look to stay consistent."
        },
        {
          "q": "When should I get a full set instead of a fill?",
          "a": "If more than half your extensions have shed, book a fresh full set. Filling sparse extensions usually looks patchy. A full set gives you a clean baseline to maintain from."
        },
        {
          "q": "Can I keep using my regular skincare?",
          "a": "Probably not — at least not around your eyes. Most face creams, eye creams, and oil-based cleansers contain ingredients that break down lash adhesive. Audit your routine for any oils within an inch of your lash line. That one change usually adds a full week to retention."
        }
      ]
    }
  },
  "9": {
    "en": {
      "dek": "Gel nails are painted on and cured under UV light for a glossy, natural finish. Acrylic mixes liquid and powder into a hard layer you can sculpt longer and bolder. Most standard sets fall in the $30 to $70 range either way. The real choice comes down to what your hands do all day: gel for a lighter, gentler set; acrylic for strength and dramatic length.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Gel lasts 2–3 weeks; acrylic stretches to 3 weeks or longer",
            "Standard set runs $30–$70; designs and length push higher",
            "Gel feels lighter and flexes with your nail; acrylic feels firmer and sculpts longer",
            "Gel removal: 10–15 minutes; acrylic removal: 20–30 minutes",
            "Acrylic is stronger for rough hands; gel is gentler on natural nails"
          ]
        },
        {
          "h": "How do gel and acrylic nails differ?",
          "p": "The application process is where they diverge. For gel manicures, the product is painted onto the nail from a pot of gel then cured under a UV light to harden it. Acrylics combine liquid and powder into a sort of dough, which is then painted onto the nail and air-dried."
        },
        {
          "p": "The finish reads differently too. Gel nails have that smooth, glossy finish that looks super natural — like your own nails, but better. Acrylics are firmer and can be sculpted into longer, bolder shapes, which is great if you want drama."
        },
        {
          "h": "Which lasts longer?",
          "p": "A typical gel manicure lasts two to three weeks, depending on your nail growth and how well you care for them. With good care, acrylic nails can last three weeks or sometimes longer."
        },
        {
          "p": "Gel is more flexible than acrylic — that flexibility makes it more forgiving of small impacts and less likely to crack. Acrylic, on the other hand, is extremely strong and holds up to harder wear. If your nails break easily or you do manual work, acrylic is the more durable pick."
        },
        {
          "h": "What does it cost?",
          "p": "Most standard sets fall in the $30 to $70 range. Once you add design work, extreme length, or premium salon pricing, the ceiling rises — acrylic sets can climb to $120 and gel sets to $100, depending on color, art, and shape."
        },
        {
          "p": "Fills usually cost around $20 to $40 and extend the life of your set. One catch worth knowing: acrylics allow for fills as your natural nails grow out, while Gel X typically requires a complete replacement when maintenance is needed. That changes the long-term math if you're choosing between them."
        },
        {
          "h": "Which is gentler on your natural nails?",
          "p": "Gel is the gentler of the two overall. It doesn't involve as much filing, so there's less wear on your natural nail surface. Acrylic uses stronger chemicals and needs more shaping, which can wear down your natural nails over time if you skip breaks or remove them aggressively."
        },
        {
          "p": "Both are safe when applied and removed correctly — the difference is the margin for error. Acrylic punishes bad technique harder, which is why it's generally recommended to take breaks between acrylic nail sets to let your natural nails recover."
        },
        {
          "h": "How does removal work?",
          "p": "Gel is the simpler of the two. To safely remove gel nails, soak them in acetone for about 10 to 15 minutes — the product softens and lifts off."
        },
        {
          "p": "Acrylic takes longer — around 20 to 30 minutes of acetone soak, often with gentle filing on the top layer to help the acetone penetrate. Removing acrylic nails at home can be challenging and may result in damage to the natural nails if not done correctly. For acrylic, the salon visit is the safer call."
        },
        {
          "h": "Which should you pick?",
          "p": "Quick decision rules:"
        },
        {
          "bullets": [
            "Pick gel if you want a lighter feel, more natural look, easier removal, and gentler maintenance on your actual nails.",
            "Pick acrylic if you need serious strength, want dramatic length, or do hands-on work that would crack a flexible set.",
            "Either way, plan for fills or a full replacement around the 2–3 week mark."
          ]
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I switch from acrylic to gel (or vice versa)?",
          "a": "Yes, but plan it around a removal session. Acrylic can't sit under gel comfortably — your tech will fully remove the acrylic, give your nails a short break if they're thin, then apply gel. Same the other direction. Don't try to fill across product types; it cracks and lifts."
        },
        {
          "q": "Do gel UV lamps damage your hands?",
          "a": "Most modern salons use LED lamps with very short cure times and exposure that's far below sunburn levels. If you're concerned, ask for SPF on the backs of your hands before the lamp, or look for lamp-free structured gels that air-cure."
        },
        {
          "q": "How long should I wait between full acrylic sets?",
          "a": "If you're getting regular fills you don't need to remove the full set every cycle. The break recommendation kicks in if your natural nails start looking thin or peeling — at that point, 2 to 4 weeks bare gives them time to recover before the next set."
        },
        {
          "q": "Is dip powder a better middle ground?",
          "a": "Different product entirely — dip uses adhesive and powder instead of UV-cured gel or liquid monomer. It's stronger than gel polish but doesn't sculpt like acrylic, and it doesn't take fills the way acrylic does. Good option if you want longevity without UV light and don't need dramatic length."
        }
      ]
    },
    "es": {
      "dek": "Gel nails are painted on and cured under UV light for a glossy, natural finish. Acrylic mixes liquid and powder into a hard layer you can sculpt longer and bolder. Most standard sets fall in the $30 to $70 range either way. The real choice comes down to what your hands do all day: gel for a lighter, gentler set; acrylic for strength and dramatic length.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Gel lasts 2–3 weeks; acrylic stretches to 3 weeks or longer",
            "Standard set runs $30–$70; designs and length push higher",
            "Gel feels lighter and flexes with your nail; acrylic feels firmer and sculpts longer",
            "Gel removal: 10–15 minutes; acrylic removal: 20–30 minutes",
            "Acrylic is stronger for rough hands; gel is gentler on natural nails"
          ]
        },
        {
          "h": "How do gel and acrylic nails differ?",
          "p": "The application process is where they diverge. For gel manicures, the product is painted onto the nail from a pot of gel then cured under a UV light to harden it. Acrylics combine liquid and powder into a sort of dough, which is then painted onto the nail and air-dried."
        },
        {
          "p": "The finish reads differently too. Gel nails have that smooth, glossy finish that looks super natural — like your own nails, but better. Acrylics are firmer and can be sculpted into longer, bolder shapes, which is great if you want drama."
        },
        {
          "h": "Which lasts longer?",
          "p": "A typical gel manicure lasts two to three weeks, depending on your nail growth and how well you care for them. With good care, acrylic nails can last three weeks or sometimes longer."
        },
        {
          "p": "Gel is more flexible than acrylic — that flexibility makes it more forgiving of small impacts and less likely to crack. Acrylic, on the other hand, is extremely strong and holds up to harder wear. If your nails break easily or you do manual work, acrylic is the more durable pick."
        },
        {
          "h": "What does it cost?",
          "p": "Most standard sets fall in the $30 to $70 range. Once you add design work, extreme length, or premium salon pricing, the ceiling rises — acrylic sets can climb to $120 and gel sets to $100, depending on color, art, and shape."
        },
        {
          "p": "Fills usually cost around $20 to $40 and extend the life of your set. One catch worth knowing: acrylics allow for fills as your natural nails grow out, while Gel X typically requires a complete replacement when maintenance is needed. That changes the long-term math if you're choosing between them."
        },
        {
          "h": "Which is gentler on your natural nails?",
          "p": "Gel is the gentler of the two overall. It doesn't involve as much filing, so there's less wear on your natural nail surface. Acrylic uses stronger chemicals and needs more shaping, which can wear down your natural nails over time if you skip breaks or remove them aggressively."
        },
        {
          "p": "Both are safe when applied and removed correctly — the difference is the margin for error. Acrylic punishes bad technique harder, which is why it's generally recommended to take breaks between acrylic nail sets to let your natural nails recover."
        },
        {
          "h": "How does removal work?",
          "p": "Gel is the simpler of the two. To safely remove gel nails, soak them in acetone for about 10 to 15 minutes — the product softens and lifts off."
        },
        {
          "p": "Acrylic takes longer — around 20 to 30 minutes of acetone soak, often with gentle filing on the top layer to help the acetone penetrate. Removing acrylic nails at home can be challenging and may result in damage to the natural nails if not done correctly. For acrylic, the salon visit is the safer call."
        },
        {
          "h": "Which should you pick?",
          "p": "Quick decision rules:"
        },
        {
          "bullets": [
            "Pick gel if you want a lighter feel, more natural look, easier removal, and gentler maintenance on your actual nails.",
            "Pick acrylic if you need serious strength, want dramatic length, or do hands-on work that would crack a flexible set.",
            "Either way, plan for fills or a full replacement around the 2–3 week mark."
          ]
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I switch from acrylic to gel (or vice versa)?",
          "a": "Yes, but plan it around a removal session. Acrylic can't sit under gel comfortably — your tech will fully remove the acrylic, give your nails a short break if they're thin, then apply gel. Same the other direction. Don't try to fill across product types; it cracks and lifts."
        },
        {
          "q": "Do gel UV lamps damage your hands?",
          "a": "Most modern salons use LED lamps with very short cure times and exposure that's far below sunburn levels. If you're concerned, ask for SPF on the backs of your hands before the lamp, or look for lamp-free structured gels that air-cure."
        },
        {
          "q": "How long should I wait between full acrylic sets?",
          "a": "If you're getting regular fills you don't need to remove the full set every cycle. The break recommendation kicks in if your natural nails start looking thin or peeling — at that point, 2 to 4 weeks bare gives them time to recover before the next set."
        },
        {
          "q": "Is dip powder a better middle ground?",
          "a": "Different product entirely — dip uses adhesive and powder instead of UV-cured gel or liquid monomer. It's stronger than gel polish but doesn't sculpt like acrylic, and it doesn't take fills the way acrylic does. Good option if you want longevity without UV light and don't need dramatic length."
        }
      ]
    }
  },
  "10": {
    "en": {
      "dek": "Most people should book a professional facial every 4 to 6 weeks. That range aligns with your skin's natural renewal cycle of about 28 days. Your specific schedule shifts based on your skin type, your age, and any active concerns you're working on — here's how to dial it in.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Baseline for healthy skin: every 4–6 weeks",
            "Oily or acne-prone: every 3–4 weeks (closer during active breakouts)",
            "Dry or sensitive: every 6 weeks",
            "Mature skin: every 3–4 weeks as cell turnover slows",
            "Minimum if budget is tight: 4 facials a year, one per season"
          ]
        },
        {
          "h": "Why every 4 to 6 weeks?",
          "p": "Your skin renews itself in about a 28-day cycle. Booking a professional facial in that window keeps the momentum going — your esthetician works on your skin health as old cells turn over and new ones emerge. Wait much longer and each session resets a depleted canvas instead of building on the last one."
        },
        {
          "h": "How skin type changes the schedule",
          "p": "Different skin needs different timing."
        },
        {
          "p": "Oily or acne-prone — every 3 to 4 weeks. Acne-prone or oily skin requires more upkeep to clear congestion. Around every 3 to 4 weeks usually keeps breakouts and clogged pores in check. In an active flare, your esthetician may bump you to every two weeks for a short clearing phase, then drop you back to monthly maintenance once the problem skin calms down."
        },
        {
          "p": "Dry or sensitive — every 6 weeks. A facial every 6 weeks is often sufficient to maintain hydration, comfort, and healthy-looking skin without overstressing it. Push further than that and you lose the cumulative benefit; do it more often and sensitive skin can react."
        },
        {
          "p": "Mature skin — every 3 to 4 weeks. Cell turnover naturally slows with age, so mature skin often benefits from more frequent visits to keep things moving and the barrier supported."
        },
        {
          "h": "How your age changes the schedule",
          "p": "Your skin's needs shift over time:"
        },
        {
          "bullets": [
            "Teens. The epidermis sheds and renews itself about every 16 days. If you're dealing with breakouts, you may need more frequent attention.",
            "20s. Collagen production is at its peak and cell turnover is efficient. A facial every 5–6 weeks focused on maintenance, deep cleansing, and prevention is usually sufficient.",
            "30s. Cell turnover begins to slow and early signs of aging appear. Moving to a 4-week schedule and adding treatments like light chemical peels or LED therapy helps maintain the momentum your skin is starting to lose on its own.",
            "40s and beyond. Every 4–6 weeks works well for most people, with deeper treatments folded in to support the slowing renewal cycle."
          ]
        },
        {
          "h": "Special cases",
          "p": "Brides. Estheticians typically recommend monthly facials for six months before the big day to work on concerns like acne or hyperpigmentation, or one to two months out if you just want a radiance boost."
        },
        {
          "p": "Active breakouts. Weekly or bi-weekly facials are recommended for people in active breakout phases. Reduce the frequency as your skin clears up."
        },
        {
          "p": "Pigmentation concerns. Facials every 3 to 4 weeks help treat discoloration, promote cell turnover, and brighten the complexion."
        },
        {
          "p": "Tight budget. Aim for at least four facials a year — one at each seasonal change."
        },
        {
          "h": "Can you overdo it?",
          "p": "Yes. Too many abrasive treatments can disrupt your skin barrier and cause more harm down the line. The right schedule is the one your skin responds well to — and the only way to find that is to talk to your esthetician so they can build a treatment plan around your specific concerns and how your skin is reacting."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How long after a facial can I work out or wear makeup?",
          "a": "Most estheticians recommend skipping the gym and makeup for the rest of the day — sweat and heavy products can clog freshly extracted pores. By the next morning you're back to normal routine."
        },
        {
          "q": "Can I do at-home treatments between professional facials?",
          "a": "Yes, but gently. Keep your home routine focused on cleansing, hydration, and SPF. Heavy exfoliation or strong actives between professional treatments often pushes your barrier past what it can recover from before the next session."
        },
        {
          "q": "What's the difference between a facial and a HydraFacial?",
          "a": "A standard facial relies on manual extraction, masks, and steam. A HydraFacial uses a machine that simultaneously cleanses, exfoliates, and infuses serums. HydraFacials tend to be gentler with less downtime, but a skilled esthetician can match or exceed them on results in a regular facial."
        },
        {
          "q": "Will my schedule change with the seasons?",
          "a": "It can. Cold weather often dries skin out, so winter calls for hydration-focused sessions. Summer humidity tends to bring more congestion, so you may want to shift to a clearing focus for a few months. Talk to your esthetician at the season change — most adjust the treatment plan more than the frequency."
        }
      ]
    },
    "es": {
      "dek": "Most people should book a professional facial every 4 to 6 weeks. That range aligns with your skin's natural renewal cycle of about 28 days. Your specific schedule shifts based on your skin type, your age, and any active concerns you're working on — here's how to dial it in.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Baseline for healthy skin: every 4–6 weeks",
            "Oily or acne-prone: every 3–4 weeks (closer during active breakouts)",
            "Dry or sensitive: every 6 weeks",
            "Mature skin: every 3–4 weeks as cell turnover slows",
            "Minimum if budget is tight: 4 facials a year, one per season"
          ]
        },
        {
          "h": "Why every 4 to 6 weeks?",
          "p": "Your skin renews itself in about a 28-day cycle. Booking a professional facial in that window keeps the momentum going — your esthetician works on your skin health as old cells turn over and new ones emerge. Wait much longer and each session resets a depleted canvas instead of building on the last one."
        },
        {
          "h": "How skin type changes the schedule",
          "p": "Different skin needs different timing."
        },
        {
          "p": "Oily or acne-prone — every 3 to 4 weeks. Acne-prone or oily skin requires more upkeep to clear congestion. Around every 3 to 4 weeks usually keeps breakouts and clogged pores in check. In an active flare, your esthetician may bump you to every two weeks for a short clearing phase, then drop you back to monthly maintenance once the problem skin calms down."
        },
        {
          "p": "Dry or sensitive — every 6 weeks. A facial every 6 weeks is often sufficient to maintain hydration, comfort, and healthy-looking skin without overstressing it. Push further than that and you lose the cumulative benefit; do it more often and sensitive skin can react."
        },
        {
          "p": "Mature skin — every 3 to 4 weeks. Cell turnover naturally slows with age, so mature skin often benefits from more frequent visits to keep things moving and the barrier supported."
        },
        {
          "h": "How your age changes the schedule",
          "p": "Your skin's needs shift over time:"
        },
        {
          "bullets": [
            "Teens. The epidermis sheds and renews itself about every 16 days. If you're dealing with breakouts, you may need more frequent attention.",
            "20s. Collagen production is at its peak and cell turnover is efficient. A facial every 5–6 weeks focused on maintenance, deep cleansing, and prevention is usually sufficient.",
            "30s. Cell turnover begins to slow and early signs of aging appear. Moving to a 4-week schedule and adding treatments like light chemical peels or LED therapy helps maintain the momentum your skin is starting to lose on its own.",
            "40s and beyond. Every 4–6 weeks works well for most people, with deeper treatments folded in to support the slowing renewal cycle."
          ]
        },
        {
          "h": "Special cases",
          "p": "Brides. Estheticians typically recommend monthly facials for six months before the big day to work on concerns like acne or hyperpigmentation, or one to two months out if you just want a radiance boost."
        },
        {
          "p": "Active breakouts. Weekly or bi-weekly facials are recommended for people in active breakout phases. Reduce the frequency as your skin clears up."
        },
        {
          "p": "Pigmentation concerns. Facials every 3 to 4 weeks help treat discoloration, promote cell turnover, and brighten the complexion."
        },
        {
          "p": "Tight budget. Aim for at least four facials a year — one at each seasonal change."
        },
        {
          "h": "Can you overdo it?",
          "p": "Yes. Too many abrasive treatments can disrupt your skin barrier and cause more harm down the line. The right schedule is the one your skin responds well to — and the only way to find that is to talk to your esthetician so they can build a treatment plan around your specific concerns and how your skin is reacting."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How long after a facial can I work out or wear makeup?",
          "a": "Most estheticians recommend skipping the gym and makeup for the rest of the day — sweat and heavy products can clog freshly extracted pores. By the next morning you're back to normal routine."
        },
        {
          "q": "Can I do at-home treatments between professional facials?",
          "a": "Yes, but gently. Keep your home routine focused on cleansing, hydration, and SPF. Heavy exfoliation or strong actives between professional treatments often pushes your barrier past what it can recover from before the next session."
        },
        {
          "q": "What's the difference between a facial and a HydraFacial?",
          "a": "A standard facial relies on manual extraction, masks, and steam. A HydraFacial uses a machine that simultaneously cleanses, exfoliates, and infuses serums. HydraFacials tend to be gentler with less downtime, but a skilled esthetician can match or exceed them on results in a regular facial."
        },
        {
          "q": "Will my schedule change with the seasons?",
          "a": "It can. Cold weather often dries skin out, so winter calls for hydration-focused sessions. Summer humidity tends to bring more congestion, so you may want to shift to a clearing focus for a few months. Talk to your esthetician at the season change — most adjust the treatment plan more than the frequency."
        }
      ]
    }
  },
  "11": {
    "en": {
      "dek": "Microblading and powder brows are the two main brow tattoo techniques Valley clients ask about. Microblading uses a manual blade to draw individual hair-like strokes. Powder brows use a machine to deposit soft, filled-in pigment like brow makeup. The right choice comes down to your skin type, lifestyle, and how much definition you want.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Microblading creates hair-stroke detail; powder brows create a soft, filled-in look",
            "Powder brows last longer on oily skin; microblading works best on dry to normal skin",
            "Microblading heals in 10–14 days with scabbing; powder brows heal in 7–10 days with less trauma",
            "Both take 2–3 hours per session and need a touch-up at 6–8 weeks",
            "Both last 1–3 years depending on skin type and aftercare"
          ]
        },
        {
          "h": "How each technique works",
          "p": "Microblading uses a handheld microblade tool with ultra-fine needles to deposit pigment into the skin's upper layers, one stroke at a time. The result mimics individual eyebrow hairs."
        },
        {
          "p": "Powder brows use a PMU machine to deliver pigment as tiny dots. The dots build up into a soft, airbrushed effect that reads like brow makeup — more uniform and less hair-textured than microblading."
        },
        {
          "h": "Healing time and what to expect",
          "p": "Both techniques deposit pigment into the upper skin layers, but the trauma profile is different."
        },
        {
          "bullets": [
            "Microblading heals in 10–14 days with scabbing along the individual strokes as the cuts close. You'll see darker, more intense brows during the first week, then they lighten as the scabs flake off.",
            "Powder brows heal in 7–10 days with mild redness and flaking but no incisions to scab over — the application is gentler so recovery is faster."
          ]
        },
        {
          "p": "Either way, keep your brows dry for at least a week after the procedure. Moisture pulls the scabs prematurely and affects the final pigment."
        },
        {
          "h": "How long do they last?",
          "p": "Both microblading and powder brows last 1–3 years depending on your skin type, aftercare, and exposure to sun and exfoliants."
        },
        {
          "p": "The first appointment is just the start — both techniques require a touch-up at the 6–8 week mark to set the pigment properly. After that, an annual or biannual color refresh keeps the look from fading patchy."
        },
        {
          "p": "A full session runs 2–3 hours including consultation, mapping, and the procedure itself."
        },
        {
          "h": "Which is best for your skin type?",
          "p": "Skin type is the single biggest factor in which technique holds up for you."
        },
        {
          "p": "Oily or acne-prone skin → powder brows. Powder brows are the preferred choice for oily or sensitive skin types — the technique seals the pigment more effectively against excess oil production and creates less trauma for sensitive skin."
        },
        {
          "p": "Dry to normal skin → microblading. Microblading works best on normal to dry skin; the fine strokes can blur or fade more quickly on oily skin as the natural oils push the pigment out."
        },
        {
          "p": "If you're not sure about your skin type, ask your artist at consultation. They'll assess your T-zone oil production and pore behavior and recommend the technique that'll hold longest on you."
        },
        {
          "h": "Combo brows: a middle option",
          "p": "Combo brows mix microblading at the front and tail with the soft shading of powder brows. You get a few fine, natural-looking hair strokes at the head of the brow, then ombre fill through the body and tail."
        },
        {
          "p": "This is the call if you want natural texture in the front but more polish toward the tail — or if your skin sits somewhere between dry and oily."
        },
        {
          "h": "Time saved on your daily routine",
          "p": "If you fill in your brows every morning, powder brows can replace that step entirely. The shaded effect means you wake up with brows that already look made up."
        },
        {
          "p": "Microblading also reduces daily routine time but reads more natural than \"done\" — better if you don't want anyone to know you got something done."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How do I know if I have oily, dry, or normal skin?",
          "a": "Ask your artist at consultation — they'll assess your T-zone oil production, pore size, and how your skin reacts to products. Quick at-home tells: oily skin shows shine by midday; dry skin feels tight or flaky after washing."
        },
        {
          "q": "Will my brows look too dark right after?",
          "a": "Yes. During the first 1–2 weeks, brows appear darker and more defined than the final result. This lightens as the skin heals and the pigment settles into the deeper layer."
        },
        {
          "q": "Can I switch techniques at my touch-up?",
          "a": "Yes. If microblading faded unevenly because you have oilier skin than expected, your artist may switch you to powder brows at the 6–8 week touch-up. Same the other direction."
        },
        {
          "q": "Does it hurt?",
          "a": "Most artists apply a topical numbing cream before either procedure. Powder brows cause less trauma overall because there are no incisions, but microblading clients usually report it as mild discomfort, not pain."
        },
        {
          "q": "How soon can I work out after?",
          "a": "Skip the gym for at least a week. Sweat and salt both interfere with pigment settling and can pull scabs early, causing premature fading or patches."
        }
      ]
    },
    "es": {
      "dek": "Microblading and powder brows are the two main brow tattoo techniques Valley clients ask about. Microblading uses a manual blade to draw individual hair-like strokes. Powder brows use a machine to deposit soft, filled-in pigment like brow makeup. The right choice comes down to your skin type, lifestyle, and how much definition you want.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Microblading creates hair-stroke detail; powder brows create a soft, filled-in look",
            "Powder brows last longer on oily skin; microblading works best on dry to normal skin",
            "Microblading heals in 10–14 days with scabbing; powder brows heal in 7–10 days with less trauma",
            "Both take 2–3 hours per session and need a touch-up at 6–8 weeks",
            "Both last 1–3 years depending on skin type and aftercare"
          ]
        },
        {
          "h": "How each technique works",
          "p": "Microblading uses a handheld microblade tool with ultra-fine needles to deposit pigment into the skin's upper layers, one stroke at a time. The result mimics individual eyebrow hairs."
        },
        {
          "p": "Powder brows use a PMU machine to deliver pigment as tiny dots. The dots build up into a soft, airbrushed effect that reads like brow makeup — more uniform and less hair-textured than microblading."
        },
        {
          "h": "Healing time and what to expect",
          "p": "Both techniques deposit pigment into the upper skin layers, but the trauma profile is different."
        },
        {
          "bullets": [
            "Microblading heals in 10–14 days with scabbing along the individual strokes as the cuts close. You'll see darker, more intense brows during the first week, then they lighten as the scabs flake off.",
            "Powder brows heal in 7–10 days with mild redness and flaking but no incisions to scab over — the application is gentler so recovery is faster."
          ]
        },
        {
          "p": "Either way, keep your brows dry for at least a week after the procedure. Moisture pulls the scabs prematurely and affects the final pigment."
        },
        {
          "h": "How long do they last?",
          "p": "Both microblading and powder brows last 1–3 years depending on your skin type, aftercare, and exposure to sun and exfoliants."
        },
        {
          "p": "The first appointment is just the start — both techniques require a touch-up at the 6–8 week mark to set the pigment properly. After that, an annual or biannual color refresh keeps the look from fading patchy."
        },
        {
          "p": "A full session runs 2–3 hours including consultation, mapping, and the procedure itself."
        },
        {
          "h": "Which is best for your skin type?",
          "p": "Skin type is the single biggest factor in which technique holds up for you."
        },
        {
          "p": "Oily or acne-prone skin → powder brows. Powder brows are the preferred choice for oily or sensitive skin types — the technique seals the pigment more effectively against excess oil production and creates less trauma for sensitive skin."
        },
        {
          "p": "Dry to normal skin → microblading. Microblading works best on normal to dry skin; the fine strokes can blur or fade more quickly on oily skin as the natural oils push the pigment out."
        },
        {
          "p": "If you're not sure about your skin type, ask your artist at consultation. They'll assess your T-zone oil production and pore behavior and recommend the technique that'll hold longest on you."
        },
        {
          "h": "Combo brows: a middle option",
          "p": "Combo brows mix microblading at the front and tail with the soft shading of powder brows. You get a few fine, natural-looking hair strokes at the head of the brow, then ombre fill through the body and tail."
        },
        {
          "p": "This is the call if you want natural texture in the front but more polish toward the tail — or if your skin sits somewhere between dry and oily."
        },
        {
          "h": "Time saved on your daily routine",
          "p": "If you fill in your brows every morning, powder brows can replace that step entirely. The shaded effect means you wake up with brows that already look made up."
        },
        {
          "p": "Microblading also reduces daily routine time but reads more natural than \"done\" — better if you don't want anyone to know you got something done."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How do I know if I have oily, dry, or normal skin?",
          "a": "Ask your artist at consultation — they'll assess your T-zone oil production, pore size, and how your skin reacts to products. Quick at-home tells: oily skin shows shine by midday; dry skin feels tight or flaky after washing."
        },
        {
          "q": "Will my brows look too dark right after?",
          "a": "Yes. During the first 1–2 weeks, brows appear darker and more defined than the final result. This lightens as the skin heals and the pigment settles into the deeper layer."
        },
        {
          "q": "Can I switch techniques at my touch-up?",
          "a": "Yes. If microblading faded unevenly because you have oilier skin than expected, your artist may switch you to powder brows at the 6–8 week touch-up. Same the other direction."
        },
        {
          "q": "Does it hurt?",
          "a": "Most artists apply a topical numbing cream before either procedure. Powder brows cause less trauma overall because there are no incisions, but microblading clients usually report it as mild discomfort, not pain."
        },
        {
          "q": "How soon can I work out after?",
          "a": "Skip the gym for at least a week. Sweat and salt both interfere with pigment settling and can pull scabs early, causing premature fading or patches."
        }
      ]
    }
  },
  "12": {
    "en": {
      "dek": "A lash lift curls your own lashes. Extensions add synthetic fibers to each lash. Lifts last 6–8 weeks. Extensions need fills every 2–3 weeks. Lifts take 45–60 minutes. Extensions take 1.5–2 hours. Here's how to pick.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Lifts last 6–8 weeks; extensions need touch-ups every 2–3 weeks",
            "Lifts take under an hour; full extensions take up to 2 hours",
            "Lift costs around $100 per visit; extensions add ongoing refill costs",
            "Lifts work only with your natural lashes; extensions add length and volume",
            "Extensions limit your makeup products; lifts let you use anything after 24 hours"
          ]
        },
        {
          "h": "How does a lash lift work?",
          "p": "A lash lift is a semi-permanent process. Your natural lashes are safely lifted and permed using a silicone lifting rod and gentle adhesive to reach the desired curl. A perm solution breaks down the disulphide bonds in the hairs, allowing the lashes to be reshaped. The result is a lifted, longer-looking effect without extensions or daily mascara."
        },
        {
          "p": "The outcome depends heavily on what your natural lashes are like to start with. If your lashes are long and reasonably full, a lift gives strong results. If they're shorter, finer, or sparse, the results can feel underwhelming. Lifts curl your lashes upward and darken them with a tint — you can't add length, you're working only with what you have."
        },
        {
          "h": "How do lash extensions work?",
          "p": "Lash extensions are individual synthetic, silk, or mink fibers applied to each natural lash by a trained technician using special adhesive. The goal is to enhance the length, thickness, and curl of your natural lashes for a fuller, more defined look without daily mascara."
        },
        {
          "p": "Special effects open up with extensions — staggered, doll eye, cat eye, and bold volume styles are all on the table. You can't combine lifts and extensions in the same appointment — they use conflicting techniques."
        },
        {
          "h": "How long does each take?",
          "bullets": [
            "Lash lift: 45–60 minutes. Add a tint and you're still under an hour.",
            "Lash extensions: 1.5–2 hours for a full set."
          ]
        },
        {
          "p": "That gap matters if you're squeezing it in around work or pickup time."
        },
        {
          "h": "How long do the results last?",
          "bullets": [
            "Lift results last 6–8 weeks. Your lashes grow out naturally and the curl fades as new hair comes in.",
            "Extensions can last up to 6 weeks with proper care — but because natural lashes shed continuously, you need touch-up fills every 2–3 weeks to keep your lash line looking full."
          ]
        },
        {
          "h": "Maintenance and product restrictions",
          "p": "Lifts and extensions wear very differently day-to-day."
        },
        {
          "p": "After a lift sets for 24 hours, you can use almost anything on your eyes — oily makeup remover, gel eyeliner, mascara, all fine."
        },
        {
          "p": "Extensions need more care. Avoid oily products, sticky gel pot eyeliner, and mascara on volume sets — they break down the adhesive and shorten the life of your extensions."
        },
        {
          "h": "Who is each option best for?",
          "p": "Choose a lash lift if:"
        },
        {
          "bullets": [
            "Your natural lashes are healthy and short to medium-length",
            "You want a natural, low-maintenance look",
            "You want to keep using all your usual makeup products",
            "You'd rather skip daily curling and mascara"
          ]
        },
        {
          "p": "Choose lash extensions if:"
        },
        {
          "bullets": [
            "You want a more dramatic transformation",
            "Your lashes are long but straight or grow downward",
            "You want length and volume beyond what your lashes can provide",
            "You don't mind the product restrictions and refill schedule"
          ]
        },
        {
          "h": "Allergies, sensitivities, and medications",
          "p": "Lash lifts are a good option for people with allergies or sensitivities to extension adhesives — the glue can cause irritation or reactions in some clients."
        },
        {
          "p": "A separate note: medications like Accutane compromise hair and skin integrity, and a lift on lashes affected by such medications can cause frizzing. Tell your technician about any medications before booking."
        },
        {
          "h": "Cost",
          "p": "Lash lifts average around $100 per treatment. No ongoing fills required."
        },
        {
          "p": "Extensions cost more upfront for the full set, plus refill appointments every 2–3 weeks. Over a year, extensions typically run higher because of the ongoing maintenance."
        },
        {
          "h": "Will extensions damage my natural lashes?",
          "p": "When applied correctly by a trained technician, extensions don't damage your natural lashes. Even after years of wear, most clients show no noticeable difference in their natural lashes once extensions are removed."
        },
        {
          "p": "Lifts work for nearly everyone, but about 1% of clients see no results even after a repeat attempt."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How do I know which one I'll like better?",
          "a": "Pull up reference photos. Lifts give you a \"your lashes but better\" look — natural shape, just curled up. Extensions give you a \"wearing eye makeup\" look — more length, more drama. If your reference shots all look like you're wearing mascara, you want extensions."
        },
        {
          "q": "Do they hurt?",
          "a": "Neither should. Lifts use a perm solution near (not on) your eye — you keep your eyes closed and feel pressure but no pain. Extensions involve attaching fibers one by one to closed eyes — most clients fall asleep during the appointment."
        },
        {
          "q": "What if I have an event in two weeks?",
          "a": "Either works. For a lift, book 2–3 weeks out so the curl has settled. For extensions, book 1 week out so any redness has cleared and your tech has time for a quick touch-up the day before if needed."
        },
        {
          "q": "Will my insurance cover anything?",
          "a": "No. Both are cosmetic services. If you have an allergic reaction to extensions, urgent care may be covered but the service itself never is."
        }
      ]
    },
    "es": {
      "dek": "A lash lift curls your own lashes. Extensions add synthetic fibers to each lash. Lifts last 6–8 weeks. Extensions need fills every 2–3 weeks. Lifts take 45–60 minutes. Extensions take 1.5–2 hours. Here's how to pick.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Lifts last 6–8 weeks; extensions need touch-ups every 2–3 weeks",
            "Lifts take under an hour; full extensions take up to 2 hours",
            "Lift costs around $100 per visit; extensions add ongoing refill costs",
            "Lifts work only with your natural lashes; extensions add length and volume",
            "Extensions limit your makeup products; lifts let you use anything after 24 hours"
          ]
        },
        {
          "h": "How does a lash lift work?",
          "p": "A lash lift is a semi-permanent process. Your natural lashes are safely lifted and permed using a silicone lifting rod and gentle adhesive to reach the desired curl. A perm solution breaks down the disulphide bonds in the hairs, allowing the lashes to be reshaped. The result is a lifted, longer-looking effect without extensions or daily mascara."
        },
        {
          "p": "The outcome depends heavily on what your natural lashes are like to start with. If your lashes are long and reasonably full, a lift gives strong results. If they're shorter, finer, or sparse, the results can feel underwhelming. Lifts curl your lashes upward and darken them with a tint — you can't add length, you're working only with what you have."
        },
        {
          "h": "How do lash extensions work?",
          "p": "Lash extensions are individual synthetic, silk, or mink fibers applied to each natural lash by a trained technician using special adhesive. The goal is to enhance the length, thickness, and curl of your natural lashes for a fuller, more defined look without daily mascara."
        },
        {
          "p": "Special effects open up with extensions — staggered, doll eye, cat eye, and bold volume styles are all on the table. You can't combine lifts and extensions in the same appointment — they use conflicting techniques."
        },
        {
          "h": "How long does each take?",
          "bullets": [
            "Lash lift: 45–60 minutes. Add a tint and you're still under an hour.",
            "Lash extensions: 1.5–2 hours for a full set."
          ]
        },
        {
          "p": "That gap matters if you're squeezing it in around work or pickup time."
        },
        {
          "h": "How long do the results last?",
          "bullets": [
            "Lift results last 6–8 weeks. Your lashes grow out naturally and the curl fades as new hair comes in.",
            "Extensions can last up to 6 weeks with proper care — but because natural lashes shed continuously, you need touch-up fills every 2–3 weeks to keep your lash line looking full."
          ]
        },
        {
          "h": "Maintenance and product restrictions",
          "p": "Lifts and extensions wear very differently day-to-day."
        },
        {
          "p": "After a lift sets for 24 hours, you can use almost anything on your eyes — oily makeup remover, gel eyeliner, mascara, all fine."
        },
        {
          "p": "Extensions need more care. Avoid oily products, sticky gel pot eyeliner, and mascara on volume sets — they break down the adhesive and shorten the life of your extensions."
        },
        {
          "h": "Who is each option best for?",
          "p": "Choose a lash lift if:"
        },
        {
          "bullets": [
            "Your natural lashes are healthy and short to medium-length",
            "You want a natural, low-maintenance look",
            "You want to keep using all your usual makeup products",
            "You'd rather skip daily curling and mascara"
          ]
        },
        {
          "p": "Choose lash extensions if:"
        },
        {
          "bullets": [
            "You want a more dramatic transformation",
            "Your lashes are long but straight or grow downward",
            "You want length and volume beyond what your lashes can provide",
            "You don't mind the product restrictions and refill schedule"
          ]
        },
        {
          "h": "Allergies, sensitivities, and medications",
          "p": "Lash lifts are a good option for people with allergies or sensitivities to extension adhesives — the glue can cause irritation or reactions in some clients."
        },
        {
          "p": "A separate note: medications like Accutane compromise hair and skin integrity, and a lift on lashes affected by such medications can cause frizzing. Tell your technician about any medications before booking."
        },
        {
          "h": "Cost",
          "p": "Lash lifts average around $100 per treatment. No ongoing fills required."
        },
        {
          "p": "Extensions cost more upfront for the full set, plus refill appointments every 2–3 weeks. Over a year, extensions typically run higher because of the ongoing maintenance."
        },
        {
          "h": "Will extensions damage my natural lashes?",
          "p": "When applied correctly by a trained technician, extensions don't damage your natural lashes. Even after years of wear, most clients show no noticeable difference in their natural lashes once extensions are removed."
        },
        {
          "p": "Lifts work for nearly everyone, but about 1% of clients see no results even after a repeat attempt."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How do I know which one I'll like better?",
          "a": "Pull up reference photos. Lifts give you a \"your lashes but better\" look — natural shape, just curled up. Extensions give you a \"wearing eye makeup\" look — more length, more drama. If your reference shots all look like you're wearing mascara, you want extensions."
        },
        {
          "q": "Do they hurt?",
          "a": "Neither should. Lifts use a perm solution near (not on) your eye — you keep your eyes closed and feel pressure but no pain. Extensions involve attaching fibers one by one to closed eyes — most clients fall asleep during the appointment."
        },
        {
          "q": "What if I have an event in two weeks?",
          "a": "Either works. For a lift, book 2–3 weeks out so the curl has settled. For extensions, book 1 week out so any redness has cleared and your tech has time for a quick touch-up the day before if needed."
        },
        {
          "q": "Will my insurance cover anything?",
          "a": "No. Both are cosmetic services. If you have an allergic reaction to extensions, urgent care may be covered but the service itself never is."
        }
      ]
    }
  },
  "13": {
    "en": {
      "dek": "Botox typically lasts 3–4 months for most people. Results show as early as 3–4 days after treatment, with full effects visible within 10–14 days. Some patients see effects fade around 2 months; others hold results for 5–6 months. Your provider can help you figure out your personal timeline after your first visit.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Botox usually lasts 3–4 months before muscle movement returns",
            "First treatment often fades faster than later sessions",
            "Faster metabolism and expressive muscles can shorten results",
            "Most patients book maintenance every 3–4 months",
            "Full results show around 10–14 days"
          ]
        },
        {
          "h": "How long does Botox actually last?",
          "p": "The baseline is 3 to 4 months. There's a range: some patients see facial movement returning in about 2 months, while others hold results closer to 5 to 6 months. The longevity depends on the dosage used, the area treated, and your individual muscle strength and metabolism."
        },
        {
          "p": "The forehead tends to run a bit shorter than other areas — Botox in the forehead typically has a duration of approximately 4 months. Most patients schedule maintenance appointments every 3 to 4 months to keep results consistent."
        },
        {
          "h": "When does Botox kick in?",
          "p": "You won't walk out of your appointment looking frozen. Neurotoxins generally take effect in 3–5 days, but it's common to not see your full and final results for 7–10 days. Most people notice the desired effects around the third or fourth day."
        },
        {
          "p": "Typically it takes about 10–14 days to see the maximum results. A practical rule of thumb: if you're unhappy at day 10, wait a few more days. If it's still not right by day 14, call your provider."
        },
        {
          "h": "What shortens or lengthens Botox duration?",
          "p": "A few factors set your personal timeline:"
        },
        {
          "bullets": [
            "Metabolism. Each person's body metabolizes Botox at a different rate — those with a faster metabolism may notice effects wearing off sooner, while individuals with a slower metabolism enjoy longer-lasting results.",
            "Muscle activity. People with more expressive facial muscles may metabolize Botox faster.",
            "Treatment area. Some areas maintain results longer than others based on muscle strength and movement patterns.",
            "Dosage. The amount used plays a direct role in how long effects hold.",
            "Consistency. With consistent treatments, your muscles may eventually train themselves to contract less. As a result, treatments can be spaced out over longer periods of time."
          ]
        },
        {
          "h": "First-timers: what to expect",
          "p": "If this is your first Botox treatment, don't be alarmed if results feel brief. Patients often note that their first treatment doesn't last as long as expected — but later treatments tend to have longer-lasting effects."
        },
        {
          "p": "Set a calendar reminder for 90 days after your first treatment — that's roughly the 3-month mark when most people notice movement coming back."
        },
        {
          "h": "When to book your next appointment",
          "p": "Plan ahead rather than waiting until your lines fully return. Over time, the treated muscles gradually regain their activity, leading to the return of wrinkles and lines. Botox wears off gradually, not overnight."
        },
        {
          "p": "To maintain results, treatments should be repeated every three to six months for most people. Some patients may experience longer results, as much as 6 months — though that's less common."
        },
        {
          "p": "A short checklist for your next visit:"
        },
        {
          "bullets": [
            "Set a calendar reminder at 90 days post-treatment",
            "Note which areas started fading first",
            "Tell your provider if you want a stronger or lighter result next time",
            "Ask about touch-up timing if you're unhappy at the 2-week mark"
          ]
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Does Botox last longer with consistent treatments?",
          "a": "Yes. Your muscles eventually train themselves to contract less, which means longer windows between appointments after the first year or two of consistent treatment."
        },
        {
          "q": "Can exercise make Botox wear off faster?",
          "a": "Possibly. A faster metabolism — which avid exercisers often have — can shorten how long Botox holds. The difference is usually small and varies by individual."
        },
        {
          "q": "What if my first treatment didn't last very long?",
          "a": "That's normal for first-timers. Book your second treatment around the 3-month mark and your results should hold longer the second time."
        },
        {
          "q": "Can I work out the same day as my Botox appointment?",
          "a": "Most providers recommend skipping vigorous exercise for the first 24 hours so the Botox stays where it was injected. Light activity is generally fine."
        },
        {
          "q": "Is there a maximum how long Botox can last?",
          "a": "Around 6 months is the practical ceiling for most people. If you're consistently lasting beyond that, your provider may be using more product than you need — worth asking about lower-dose touch-ups instead."
        }
      ]
    },
    "es": {
      "dek": "Botox typically lasts 3–4 months for most people. Results show as early as 3–4 days after treatment, with full effects visible within 10–14 days. Some patients see effects fade around 2 months; others hold results for 5–6 months. Your provider can help you figure out your personal timeline after your first visit.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Botox usually lasts 3–4 months before muscle movement returns",
            "First treatment often fades faster than later sessions",
            "Faster metabolism and expressive muscles can shorten results",
            "Most patients book maintenance every 3–4 months",
            "Full results show around 10–14 days"
          ]
        },
        {
          "h": "How long does Botox actually last?",
          "p": "The baseline is 3 to 4 months. There's a range: some patients see facial movement returning in about 2 months, while others hold results closer to 5 to 6 months. The longevity depends on the dosage used, the area treated, and your individual muscle strength and metabolism."
        },
        {
          "p": "The forehead tends to run a bit shorter than other areas — Botox in the forehead typically has a duration of approximately 4 months. Most patients schedule maintenance appointments every 3 to 4 months to keep results consistent."
        },
        {
          "h": "When does Botox kick in?",
          "p": "You won't walk out of your appointment looking frozen. Neurotoxins generally take effect in 3–5 days, but it's common to not see your full and final results for 7–10 days. Most people notice the desired effects around the third or fourth day."
        },
        {
          "p": "Typically it takes about 10–14 days to see the maximum results. A practical rule of thumb: if you're unhappy at day 10, wait a few more days. If it's still not right by day 14, call your provider."
        },
        {
          "h": "What shortens or lengthens Botox duration?",
          "p": "A few factors set your personal timeline:"
        },
        {
          "bullets": [
            "Metabolism. Each person's body metabolizes Botox at a different rate — those with a faster metabolism may notice effects wearing off sooner, while individuals with a slower metabolism enjoy longer-lasting results.",
            "Muscle activity. People with more expressive facial muscles may metabolize Botox faster.",
            "Treatment area. Some areas maintain results longer than others based on muscle strength and movement patterns.",
            "Dosage. The amount used plays a direct role in how long effects hold.",
            "Consistency. With consistent treatments, your muscles may eventually train themselves to contract less. As a result, treatments can be spaced out over longer periods of time."
          ]
        },
        {
          "h": "First-timers: what to expect",
          "p": "If this is your first Botox treatment, don't be alarmed if results feel brief. Patients often note that their first treatment doesn't last as long as expected — but later treatments tend to have longer-lasting effects."
        },
        {
          "p": "Set a calendar reminder for 90 days after your first treatment — that's roughly the 3-month mark when most people notice movement coming back."
        },
        {
          "h": "When to book your next appointment",
          "p": "Plan ahead rather than waiting until your lines fully return. Over time, the treated muscles gradually regain their activity, leading to the return of wrinkles and lines. Botox wears off gradually, not overnight."
        },
        {
          "p": "To maintain results, treatments should be repeated every three to six months for most people. Some patients may experience longer results, as much as 6 months — though that's less common."
        },
        {
          "p": "A short checklist for your next visit:"
        },
        {
          "bullets": [
            "Set a calendar reminder at 90 days post-treatment",
            "Note which areas started fading first",
            "Tell your provider if you want a stronger or lighter result next time",
            "Ask about touch-up timing if you're unhappy at the 2-week mark"
          ]
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Does Botox last longer with consistent treatments?",
          "a": "Yes. Your muscles eventually train themselves to contract less, which means longer windows between appointments after the first year or two of consistent treatment."
        },
        {
          "q": "Can exercise make Botox wear off faster?",
          "a": "Possibly. A faster metabolism — which avid exercisers often have — can shorten how long Botox holds. The difference is usually small and varies by individual."
        },
        {
          "q": "What if my first treatment didn't last very long?",
          "a": "That's normal for first-timers. Book your second treatment around the 3-month mark and your results should hold longer the second time."
        },
        {
          "q": "Can I work out the same day as my Botox appointment?",
          "a": "Most providers recommend skipping vigorous exercise for the first 24 hours so the Botox stays where it was injected. Light activity is generally fine."
        },
        {
          "q": "Is there a maximum how long Botox can last?",
          "a": "Around 6 months is the practical ceiling for most people. If you're consistently lasting beyond that, your provider may be using more product than you need — worth asking about lower-dose touch-ups instead."
        }
      ]
    }
  },
  "14": {
    "en": {
      "dek": "A spray tan gives you color without UV exposure. A tanning bed gives you color while emitting concentrated UV rays the World Health Organization classifies as carcinogenic. That's the core split — quick glow versus long-term skin damage.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Spray tans last 5–10 days with zero UV exposure",
            "Tanning beds emit concentrated UVA and UVB rays linked to skin cancer",
            "More people are diagnosed with skin cancer each year in the U.S. than all other cancers combined",
            "Spray tans work for all skin types; fair skin that burns easily should steer clear of sunbeds",
            "Tanning bed results can last up to 12 days but require ongoing maintenance sessions"
          ]
        },
        {
          "h": "How they work",
          "p": "Tanning beds emit concentrated UVA and UVB rays that penetrate your skin's outer layer and stimulate melanin production. Each session runs up to 10 minutes depending on your skin tone. UVA oxidizes existing melanin to darken your pigment; UVB triggers your skin to produce more melanin for a deeper effect."
        },
        {
          "p": "Spray tans work differently. A technician sprays a solution containing Dihydroxyacetone (DHA) onto your skin — DHA reacts with your skin's chemistry to turn it tan or bronze without UV. The result sits on the outer layer of skin, which is why it fades as that layer naturally sheds."
        },
        {
          "h": "Health risks: what the research shows",
          "p": "The WHO classifies tanning beds as carcinogenic. One of the most well-documented consequences of indoor tanning is its link to skin cancer, particularly melanoma and basal cell carcinoma. Some data equate the danger of tanning beds to tobacco when it comes to cancer development."
        },
        {
          "p": "UV exposure is cumulative — while you might not see the effects of sun damage now, exposure increases your skin cancer risk over time. High-risk exposure happens more commonly in teens, which is why nineteen states have banned the use of tanning beds for minors."
        },
        {
          "p": "Spray tans skip the UV entirely. The benefits are eliminating burn risk and avoiding the premature wrinkling that comes with UV damage."
        },
        {
          "h": "How long does each last?",
          "p": "A spray tan typically lasts 5 to 10 days depending on your skin type, daily activity, and post-tan care. You can rinse off the guide color after 2–4 hours, with full results appearing at the 24-hour mark. Rapid-rinse formulas let you shower within 1–3 hours if you're short on time."
        },
        {
          "p": "Tanning bed results can last up to 12 days, but only with ongoing sessions. It typically takes about 2–3 sessions to build up a noticeable tan. Most programs recommend 2–3 sessions per week to build color, then weekly maintenance to hold it."
        },
        {
          "h": "Cost and maintenance",
          "p": "Spray tans are a single appointment with a clear unit cost. The main upkeep is moisturizing daily to extend the life of your tan as your skin exfoliates."
        },
        {
          "p": "Tanning beds compound. Most people need 2–3 sessions just to see a noticeable result, then weekly sessions to maintain. Add the cost of indoor tanning lotion and protective eyewear, and the per-month total adds up faster than most people expect."
        },
        {
          "h": "Which should you choose?",
          "p": "If your skin burns easily, steer clear of sunbeds. UV damage compounds with every session and the consequences (skin cancer risk, accelerated wrinkling) don't show up until years later."
        },
        {
          "p": "Spray tans work for all skin types because they don't involve UV. If you want color without the cancer risk and skip the long-term tradeoffs, spray tans win on health every time."
        },
        {
          "p": "If you're still weighing a tanning bed, the question is whether up to 12 days of color is worth the documented links to melanoma and premature wrinkling. You can rebook a spray tan. You can't undo cumulative UV damage."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can spray tans look natural?",
          "a": "Yes. Modern DHA formulas produce an even, bronze tone that mimics a natural sun tan. The key is proper prep — exfoliate beforehand and avoid pooling in dry areas like elbows, knees, and the backs of your hands."
        },
        {
          "q": "Are tanning beds ever safe?",
          "a": "No. The WHO classifies them as carcinogenic. Even short sessions and \"controlled\" use add to cumulative UV exposure, which is the actual mechanism behind the cancer risk."
        },
        {
          "q": "Do spray tans damage your skin?",
          "a": "Spray tans are radiation-free. The FDA-approved DHA reacts with the outer skin layer only, so no UV exposure, no cumulative damage, and no increased skin cancer risk. The main caveat is to avoid inhaling the spray during application — most salons provide nose plugs."
        },
        {
          "q": "How do I make my spray tan last longer?",
          "a": "Moisturize daily with an oil-free lotion. Avoid long hot showers, chlorinated pools, and exfoliating products. All three speed up skin cell turnover and fade your tan faster."
        },
        {
          "q": "What about self-tanner from a bottle?",
          "a": "DIY drugstore self-tanner uses the same DHA but is harder to apply evenly. If you've never done one before, start with a tinted gradual tanner (so mistakes show subtly) before stepping up to a full-strength foam or mousse."
        }
      ]
    },
    "es": {
      "dek": "A spray tan gives you color without UV exposure. A tanning bed gives you color while emitting concentrated UV rays the World Health Organization classifies as carcinogenic. That's the core split — quick glow versus long-term skin damage.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Spray tans last 5–10 days with zero UV exposure",
            "Tanning beds emit concentrated UVA and UVB rays linked to skin cancer",
            "More people are diagnosed with skin cancer each year in the U.S. than all other cancers combined",
            "Spray tans work for all skin types; fair skin that burns easily should steer clear of sunbeds",
            "Tanning bed results can last up to 12 days but require ongoing maintenance sessions"
          ]
        },
        {
          "h": "How they work",
          "p": "Tanning beds emit concentrated UVA and UVB rays that penetrate your skin's outer layer and stimulate melanin production. Each session runs up to 10 minutes depending on your skin tone. UVA oxidizes existing melanin to darken your pigment; UVB triggers your skin to produce more melanin for a deeper effect."
        },
        {
          "p": "Spray tans work differently. A technician sprays a solution containing Dihydroxyacetone (DHA) onto your skin — DHA reacts with your skin's chemistry to turn it tan or bronze without UV. The result sits on the outer layer of skin, which is why it fades as that layer naturally sheds."
        },
        {
          "h": "Health risks: what the research shows",
          "p": "The WHO classifies tanning beds as carcinogenic. One of the most well-documented consequences of indoor tanning is its link to skin cancer, particularly melanoma and basal cell carcinoma. Some data equate the danger of tanning beds to tobacco when it comes to cancer development."
        },
        {
          "p": "UV exposure is cumulative — while you might not see the effects of sun damage now, exposure increases your skin cancer risk over time. High-risk exposure happens more commonly in teens, which is why nineteen states have banned the use of tanning beds for minors."
        },
        {
          "p": "Spray tans skip the UV entirely. The benefits are eliminating burn risk and avoiding the premature wrinkling that comes with UV damage."
        },
        {
          "h": "How long does each last?",
          "p": "A spray tan typically lasts 5 to 10 days depending on your skin type, daily activity, and post-tan care. You can rinse off the guide color after 2–4 hours, with full results appearing at the 24-hour mark. Rapid-rinse formulas let you shower within 1–3 hours if you're short on time."
        },
        {
          "p": "Tanning bed results can last up to 12 days, but only with ongoing sessions. It typically takes about 2–3 sessions to build up a noticeable tan. Most programs recommend 2–3 sessions per week to build color, then weekly maintenance to hold it."
        },
        {
          "h": "Cost and maintenance",
          "p": "Spray tans are a single appointment with a clear unit cost. The main upkeep is moisturizing daily to extend the life of your tan as your skin exfoliates."
        },
        {
          "p": "Tanning beds compound. Most people need 2–3 sessions just to see a noticeable result, then weekly sessions to maintain. Add the cost of indoor tanning lotion and protective eyewear, and the per-month total adds up faster than most people expect."
        },
        {
          "h": "Which should you choose?",
          "p": "If your skin burns easily, steer clear of sunbeds. UV damage compounds with every session and the consequences (skin cancer risk, accelerated wrinkling) don't show up until years later."
        },
        {
          "p": "Spray tans work for all skin types because they don't involve UV. If you want color without the cancer risk and skip the long-term tradeoffs, spray tans win on health every time."
        },
        {
          "p": "If you're still weighing a tanning bed, the question is whether up to 12 days of color is worth the documented links to melanoma and premature wrinkling. You can rebook a spray tan. You can't undo cumulative UV damage."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can spray tans look natural?",
          "a": "Yes. Modern DHA formulas produce an even, bronze tone that mimics a natural sun tan. The key is proper prep — exfoliate beforehand and avoid pooling in dry areas like elbows, knees, and the backs of your hands."
        },
        {
          "q": "Are tanning beds ever safe?",
          "a": "No. The WHO classifies them as carcinogenic. Even short sessions and \"controlled\" use add to cumulative UV exposure, which is the actual mechanism behind the cancer risk."
        },
        {
          "q": "Do spray tans damage your skin?",
          "a": "Spray tans are radiation-free. The FDA-approved DHA reacts with the outer skin layer only, so no UV exposure, no cumulative damage, and no increased skin cancer risk. The main caveat is to avoid inhaling the spray during application — most salons provide nose plugs."
        },
        {
          "q": "How do I make my spray tan last longer?",
          "a": "Moisturize daily with an oil-free lotion. Avoid long hot showers, chlorinated pools, and exfoliating products. All three speed up skin cell turnover and fade your tan faster."
        },
        {
          "q": "What about self-tanner from a bottle?",
          "a": "DIY drugstore self-tanner uses the same DHA but is harder to apply evenly. If you've never done one before, start with a tinted gradual tanner (so mistakes show subtly) before stepping up to a full-strength foam or mousse."
        }
      ]
    }
  },
  "15": {
    "en": {
      "dek": "Most people find visiting every 4–6 weeks works well for root touch-ups on permanent color. Balayage stretches longer — typically 3 months between visits. The exact timing depends on the type of color you have, how fast your hair grows, and how much contrast you want between your roots and the rest.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Permanent root touch-ups: every 4–6 weeks",
            "Balayage / ombre: every 3–6 months",
            "Gray coverage: every 4–6 weeks",
            "Bleach / double process: every 6–8 weeks minimum",
            "Semi-permanent fades in 6–12 washes; reapply whenever it fades"
          ]
        },
        {
          "h": "How long does permanent color last?",
          "p": "Permanent color lasts 6–12 weeks before noticeable fading. Most people are back in the chair at the 4–6 week mark for root touch-ups — hair grows about half an inch per month, which is enough new growth to show your natural color at the line."
        },
        {
          "p": "All-over color processes (full-head, no separation) should be done every 3–5 weeks for best results. Double process color — bleaching plus toning — needs monthly maintenance because the lighter your base, the faster it fades."
        },
        {
          "p": "The opposite extreme: dyeing your hair no more than once every three months — four times a year — is what some colorists recommend for minimizing long-term damage."
        },
        {
          "h": "What about highlights, foils, and balayage?",
          "p": "These techniques don't move at the same pace because the color isn't sitting at your roots."
        },
        {
          "bullets": [
            "Foil highlights: Every 6–8 weeks depending on the contrast between your highlights and your natural color. The bigger the gap between base and highlights, the sooner regrowth shows.",
            "Balayage: Strategically places color away from the roots, creating a low-maintenance look that needs less frequent touch-ups. Most clients stretch to 3 months between visits.",
            "Ombre: Even longer — 3 to 6 months because the color is concentrated at the ends, not the roots."
          ]
        },
        {
          "p": "For bright reds and pastels specifically, plan on 4–6 weeks because vivid fashion colors fade fast regardless of placement."
        },
        {
          "h": "Gray coverage",
          "p": "If you're coloring to cover gray, you'll notice regrowth sooner. Gray coverage needs touch-ups every 4–6 weeks — gray hair shows through at the line faster than darker pigments."
        },
        {
          "p": "For full transformation sessions (changing color level dramatically), space at least 8 weeks apart to prevent excessive damage. The middle ground: book your next root touch-up at checkout so you don't let it slide past six weeks."
        },
        {
          "h": "Semi-permanent and demi-permanent: how often is safe?",
          "p": "These are the gentler tiers and they wear differently."
        },
        {
          "bullets": [
            "Semi-permanent color coats the hair shaft rather than penetrating it, lasting about 6–12 washes. Because there's no ammonia or alcohol involved, semi-permanent color can be safely used as often as your whims change.",
            "Demi-permanent color lasts up to 24 washes — longer than semi but gentler than permanent. Demi isn't harsh on brunettes and reds, so you can come in often without concern."
          ]
        },
        {
          "p": "These are the products to use between permanent appointments if you want to refresh color without the damage tradeoff."
        },
        {
          "h": "Bleach and lightening",
          "p": "Bleach demands the most recovery time between sessions. Space retouches 6–8 weeks apart and avoid overlapping onto previously lightened hair. Double processing breaks hair down faster than any other technique, and constant bleaching is the main route to long-term blonde damage."
        },
        {
          "p": "If your natural color is much darker than your target, you may need more frequent attention to keep roots from showing — but balance that against giving your hair time to recover."
        },
        {
          "h": "When premium pays",
          "p": "Permanent dyes and bleaches require more topping up to maintain even color and carry a higher risk of hair damage. The cheaper the product, the harsher the chemicals — and damage accumulates over time."
        },
        {
          "p": "Pay for the years in the chair, not the chandeliers in the lobby. A good colorist tracks your history, avoids overlapping bleach, and uses bond-building treatments that let you come back sooner without compounding damage."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I color my hair every 2 weeks?",
          "a": "Not safely with permanent color. The minimum cadence for permanent treatments is around 4 weeks. Semi-permanent can be reapplied more often because it doesn't penetrate the hair shaft."
        },
        {
          "q": "Does hair grow faster in summer?",
          "a": "Slightly, but not enough to change your color schedule. The average growth rate stays around half an inch per month."
        },
        {
          "q": "How do I make my hair color last longer?",
          "a": "Sulfate-free shampoo, cool water washes, and a gloss treatment between appointments. Color-safe products slow fading so you can stretch the time between visits."
        },
        {
          "q": "What's the safest way to color hair frequently?",
          "a": "Use demi-permanent or semi-permanent products between permanent appointments. Glosses and demi colors can be done whenever you feel you need it — they're designed to be gentler alternatives to permanent dye."
        },
        {
          "q": "Should I book my next appointment before leaving the salon?",
          "a": "Yes. It keeps you on schedule, and most colorists prefer the predictability — they can plan bond-building treatments and tone refreshes around your booking cadence."
        }
      ]
    },
    "es": {
      "dek": "Most people find visiting every 4–6 weeks works well for root touch-ups on permanent color. Balayage stretches longer — typically 3 months between visits. The exact timing depends on the type of color you have, how fast your hair grows, and how much contrast you want between your roots and the rest.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Permanent root touch-ups: every 4–6 weeks",
            "Balayage / ombre: every 3–6 months",
            "Gray coverage: every 4–6 weeks",
            "Bleach / double process: every 6–8 weeks minimum",
            "Semi-permanent fades in 6–12 washes; reapply whenever it fades"
          ]
        },
        {
          "h": "How long does permanent color last?",
          "p": "Permanent color lasts 6–12 weeks before noticeable fading. Most people are back in the chair at the 4–6 week mark for root touch-ups — hair grows about half an inch per month, which is enough new growth to show your natural color at the line."
        },
        {
          "p": "All-over color processes (full-head, no separation) should be done every 3–5 weeks for best results. Double process color — bleaching plus toning — needs monthly maintenance because the lighter your base, the faster it fades."
        },
        {
          "p": "The opposite extreme: dyeing your hair no more than once every three months — four times a year — is what some colorists recommend for minimizing long-term damage."
        },
        {
          "h": "What about highlights, foils, and balayage?",
          "p": "These techniques don't move at the same pace because the color isn't sitting at your roots."
        },
        {
          "bullets": [
            "Foil highlights: Every 6–8 weeks depending on the contrast between your highlights and your natural color. The bigger the gap between base and highlights, the sooner regrowth shows.",
            "Balayage: Strategically places color away from the roots, creating a low-maintenance look that needs less frequent touch-ups. Most clients stretch to 3 months between visits.",
            "Ombre: Even longer — 3 to 6 months because the color is concentrated at the ends, not the roots."
          ]
        },
        {
          "p": "For bright reds and pastels specifically, plan on 4–6 weeks because vivid fashion colors fade fast regardless of placement."
        },
        {
          "h": "Gray coverage",
          "p": "If you're coloring to cover gray, you'll notice regrowth sooner. Gray coverage needs touch-ups every 4–6 weeks — gray hair shows through at the line faster than darker pigments."
        },
        {
          "p": "For full transformation sessions (changing color level dramatically), space at least 8 weeks apart to prevent excessive damage. The middle ground: book your next root touch-up at checkout so you don't let it slide past six weeks."
        },
        {
          "h": "Semi-permanent and demi-permanent: how often is safe?",
          "p": "These are the gentler tiers and they wear differently."
        },
        {
          "bullets": [
            "Semi-permanent color coats the hair shaft rather than penetrating it, lasting about 6–12 washes. Because there's no ammonia or alcohol involved, semi-permanent color can be safely used as often as your whims change.",
            "Demi-permanent color lasts up to 24 washes — longer than semi but gentler than permanent. Demi isn't harsh on brunettes and reds, so you can come in often without concern."
          ]
        },
        {
          "p": "These are the products to use between permanent appointments if you want to refresh color without the damage tradeoff."
        },
        {
          "h": "Bleach and lightening",
          "p": "Bleach demands the most recovery time between sessions. Space retouches 6–8 weeks apart and avoid overlapping onto previously lightened hair. Double processing breaks hair down faster than any other technique, and constant bleaching is the main route to long-term blonde damage."
        },
        {
          "p": "If your natural color is much darker than your target, you may need more frequent attention to keep roots from showing — but balance that against giving your hair time to recover."
        },
        {
          "h": "When premium pays",
          "p": "Permanent dyes and bleaches require more topping up to maintain even color and carry a higher risk of hair damage. The cheaper the product, the harsher the chemicals — and damage accumulates over time."
        },
        {
          "p": "Pay for the years in the chair, not the chandeliers in the lobby. A good colorist tracks your history, avoids overlapping bleach, and uses bond-building treatments that let you come back sooner without compounding damage."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I color my hair every 2 weeks?",
          "a": "Not safely with permanent color. The minimum cadence for permanent treatments is around 4 weeks. Semi-permanent can be reapplied more often because it doesn't penetrate the hair shaft."
        },
        {
          "q": "Does hair grow faster in summer?",
          "a": "Slightly, but not enough to change your color schedule. The average growth rate stays around half an inch per month."
        },
        {
          "q": "How do I make my hair color last longer?",
          "a": "Sulfate-free shampoo, cool water washes, and a gloss treatment between appointments. Color-safe products slow fading so you can stretch the time between visits."
        },
        {
          "q": "What's the safest way to color hair frequently?",
          "a": "Use demi-permanent or semi-permanent products between permanent appointments. Glosses and demi colors can be done whenever you feel you need it — they're designed to be gentler alternatives to permanent dye."
        },
        {
          "q": "Should I book my next appointment before leaving the salon?",
          "a": "Yes. It keeps you on schedule, and most colorists prefer the predictability — they can plan bond-building treatments and tone refreshes around your booking cadence."
        }
      ]
    }
  },
  "16": {
    "en": {
      "dek": "Acrylic nails mix liquid monomer with powder polymer into a hard sculpted layer. Dip powder coats your nail in pigmented powder activated by a bonder. Both give you length and color but differ in durability, cost, and impact on your natural nail. For everyday wear, most nail techs lean toward dip powder as the gentler option. For maximum durability and sculpted extensions, acrylic wins.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Acrylics use liquid monomer + powder polymer; dip powder uses pigmented powder + bonder",
            "Acrylics last 6–8 weeks with fills every 3–4 weeks; dip powder lasts 3–4 weeks",
            "Acrylics run $35–$80; dip powder runs $30–$60",
            "Dip powder is generally gentler because it skips primer and heavy filing",
            "Always check that salons use single-use cups or pour-over methods for dip powder"
          ]
        },
        {
          "h": "How do acrylic and dip powder differ?",
          "p": "They aren't the same thing, but both contain acrylates that react differently with their application methods. Acrylics use a liquid monomer mixed with powder and require heavy filing. Dip powder uses a pigmented powder activated by a bonder — less filing, no primer. That difference is why most nail techs lean toward dip powder for everyday wear."
        },
        {
          "h": "Which lasts longer?",
          "p": "Acrylics are the more durable of the two. They typically hold for 6–8 weeks before needing a full reset, with fills every 3–4 weeks to keep growth from showing. Dip powder generally lasts 3–4 weeks before refreshing — and unlike acrylics, dip doesn't take fills, so each refresh is a full reapplication."
        },
        {
          "p": "If you want maximum wear time, acrylics win. If you want simpler maintenance and a less aggressive removal, dip powder is the call."
        },
        {
          "h": "What does each cost?",
          "p": "Acrylic prices vary by length and design. A standard acrylic set typically runs $35 to $45, climbing to $50 to $80 once you add length extensions or complex art. An infill touch-up — needed every 3 to 4 weeks — typically runs $30 to $50."
        },
        {
          "p": "Dip powder runs $30 to $50 at most salons, with higher-end shops reaching $50 to $60. Because dip powder doesn't support fills, you pay the full set price each cycle instead of the cheaper fill rate."
        },
        {
          "p": "Over a year, the cost comparison depends on your cadence. Acrylic with regular fills can come out cheaper if you can stretch to 6 weeks; dip powder costs more frequently but in smaller amounts each time."
        },
        {
          "h": "Which is healthier for your natural nails?",
          "p": "Dip powder is the gentler option for most clients. Acrylic is harsher because more chemicals are involved in the process, and dip powders typically contain fewer harsh chemicals — they avoid formaldehyde, toluene, and DBP."
        },
        {
          "p": "Weight matters too. Acrylic nails can put pressure and stress on the natural nail, and removal takes a toll because they need to be soaked in acetone and then buffed away."
        },
        {
          "p": "The bigger concern with acrylics is MMA — a harsh chemical sometimes found in cheaper liquid monomers, linked to nail damage and allergic reactions. Dip powder avoids this category entirely. If your nails are already weak or damaged, dip powder is the better starting point."
        },
        {
          "h": "What about hygiene at the salon?",
          "p": "This one matters. Dermatologists warn that reusing materials — especially double-dipping into shared dip powder jars — can lead to infections. Never accept a double-dip. The correct practice is single-use cups or pour-over methods so each client gets fresh powder."
        },
        {
          "p": "A clean salon won't hesitate to explain their protocol. If your tech can't, that's the warning sign."
        },
        {
          "h": "Which should you choose?",
          "bullets": [
            "Pick acrylic if you want maximum durability, long length, or complex sculpted art.",
            "Pick dip powder if you want something gentler on your natural nails, easier removal, and simpler maintenance."
          ]
        },
        {
          "p": "For most everyday clients, dip powder covers the need. Acrylic makes more sense when you're prepping for a wedding, growing out a specific shape, or doing manual work that would crack a softer set."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can you mix acrylic monomer with dip powder?",
          "a": "No. The powders are chemically different. If you've attempted to use a monomer with dip powder, you might have noticed the powder marbled and the white separated from the color. They don't combine."
        },
        {
          "q": "How often do you need fills for acrylics?",
          "a": "Every 3 to 4 weeks. Fills cost $30 to $50 each — skipping them lets growth show and weakens the structural integrity of the set."
        },
        {
          "q": "Is dip powder safer for weak natural nails?",
          "a": "Generally yes. Less filing, no primer, less weight on the natural nail. Most techs recommend it as the starting point for clients with thin or peeling nails."
        },
        {
          "q": "Does dip powder offer fills?",
          "a": "No — full reapplication only. Plan on paying the full set price (typically $30–$60) at each visit instead of the cheaper fill rate you'd pay for acrylics."
        },
        {
          "q": "What should I watch for at the salon?",
          "a": "Hygiene first. Never accept double-dipping into shared dip jars. Ask for single-use cups or pour-over application. If the tech can't explain their hygiene protocol, find a different salon."
        }
      ]
    },
    "es": {
      "dek": "Acrylic nails mix liquid monomer with powder polymer into a hard sculpted layer. Dip powder coats your nail in pigmented powder activated by a bonder. Both give you length and color but differ in durability, cost, and impact on your natural nail. For everyday wear, most nail techs lean toward dip powder as the gentler option. For maximum durability and sculpted extensions, acrylic wins.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Acrylics use liquid monomer + powder polymer; dip powder uses pigmented powder + bonder",
            "Acrylics last 6–8 weeks with fills every 3–4 weeks; dip powder lasts 3–4 weeks",
            "Acrylics run $35–$80; dip powder runs $30–$60",
            "Dip powder is generally gentler because it skips primer and heavy filing",
            "Always check that salons use single-use cups or pour-over methods for dip powder"
          ]
        },
        {
          "h": "How do acrylic and dip powder differ?",
          "p": "They aren't the same thing, but both contain acrylates that react differently with their application methods. Acrylics use a liquid monomer mixed with powder and require heavy filing. Dip powder uses a pigmented powder activated by a bonder — less filing, no primer. That difference is why most nail techs lean toward dip powder for everyday wear."
        },
        {
          "h": "Which lasts longer?",
          "p": "Acrylics are the more durable of the two. They typically hold for 6–8 weeks before needing a full reset, with fills every 3–4 weeks to keep growth from showing. Dip powder generally lasts 3–4 weeks before refreshing — and unlike acrylics, dip doesn't take fills, so each refresh is a full reapplication."
        },
        {
          "p": "If you want maximum wear time, acrylics win. If you want simpler maintenance and a less aggressive removal, dip powder is the call."
        },
        {
          "h": "What does each cost?",
          "p": "Acrylic prices vary by length and design. A standard acrylic set typically runs $35 to $45, climbing to $50 to $80 once you add length extensions or complex art. An infill touch-up — needed every 3 to 4 weeks — typically runs $30 to $50."
        },
        {
          "p": "Dip powder runs $30 to $50 at most salons, with higher-end shops reaching $50 to $60. Because dip powder doesn't support fills, you pay the full set price each cycle instead of the cheaper fill rate."
        },
        {
          "p": "Over a year, the cost comparison depends on your cadence. Acrylic with regular fills can come out cheaper if you can stretch to 6 weeks; dip powder costs more frequently but in smaller amounts each time."
        },
        {
          "h": "Which is healthier for your natural nails?",
          "p": "Dip powder is the gentler option for most clients. Acrylic is harsher because more chemicals are involved in the process, and dip powders typically contain fewer harsh chemicals — they avoid formaldehyde, toluene, and DBP."
        },
        {
          "p": "Weight matters too. Acrylic nails can put pressure and stress on the natural nail, and removal takes a toll because they need to be soaked in acetone and then buffed away."
        },
        {
          "p": "The bigger concern with acrylics is MMA — a harsh chemical sometimes found in cheaper liquid monomers, linked to nail damage and allergic reactions. Dip powder avoids this category entirely. If your nails are already weak or damaged, dip powder is the better starting point."
        },
        {
          "h": "What about hygiene at the salon?",
          "p": "This one matters. Dermatologists warn that reusing materials — especially double-dipping into shared dip powder jars — can lead to infections. Never accept a double-dip. The correct practice is single-use cups or pour-over methods so each client gets fresh powder."
        },
        {
          "p": "A clean salon won't hesitate to explain their protocol. If your tech can't, that's the warning sign."
        },
        {
          "h": "Which should you choose?",
          "bullets": [
            "Pick acrylic if you want maximum durability, long length, or complex sculpted art.",
            "Pick dip powder if you want something gentler on your natural nails, easier removal, and simpler maintenance."
          ]
        },
        {
          "p": "For most everyday clients, dip powder covers the need. Acrylic makes more sense when you're prepping for a wedding, growing out a specific shape, or doing manual work that would crack a softer set."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can you mix acrylic monomer with dip powder?",
          "a": "No. The powders are chemically different. If you've attempted to use a monomer with dip powder, you might have noticed the powder marbled and the white separated from the color. They don't combine."
        },
        {
          "q": "How often do you need fills for acrylics?",
          "a": "Every 3 to 4 weeks. Fills cost $30 to $50 each — skipping them lets growth show and weakens the structural integrity of the set."
        },
        {
          "q": "Is dip powder safer for weak natural nails?",
          "a": "Generally yes. Less filing, no primer, less weight on the natural nail. Most techs recommend it as the starting point for clients with thin or peeling nails."
        },
        {
          "q": "Does dip powder offer fills?",
          "a": "No — full reapplication only. Plan on paying the full set price (typically $30–$60) at each visit instead of the cheaper fill rate you'd pay for acrylics."
        },
        {
          "q": "What should I watch for at the salon?",
          "a": "Hygiene first. Never accept double-dipping into shared dip jars. Ask for single-use cups or pour-over application. If the tech can't explain their hygiene protocol, find a different salon."
        }
      ]
    }
  },
  "17": {
    "en": {
      "dek": "A chemical peel's results last anywhere from one month to many years, depending on how deep the treatment goes. Light peels fade within a couple months as your skin cells regenerate. Medium peels hold for a few months. Deep peels can last a decade or longer.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Light peels last 1–2 months; plan maintenance every 2–5 weeks",
            "Medium peels hold for 2–6 months; follow-up every 6–12 months",
            "Deep peels can last 10 years or longer — and you only get one",
            "Healing ranges from 1 week (light) to 3 weeks (deep)",
            "Aftercare and sun protection directly extend how long results last"
          ]
        },
        {
          "h": "How long does each peel depth last?"
        },
        {
          "h": "Light (superficial) peels: 1–2 months",
          "p": "Light peels use gentler acids like glycolic or salicylic to target the outermost skin layer. The results fade as your skin's natural turnover cycle replaces those cells. You can repeat the application every 2–5 weeks depending on your skin condition and how fast your cells renew."
        },
        {
          "h": "Medium peels: 2–6 months",
          "p": "Medium peels reach into the middle layer and last a few months. You can typically repeat the application with medium peels after a few months to maintain or build results — most maintenance schedules land at a follow-up peel every 6–12 months. You may need repeat applications to maintain your desired result."
        },
        {
          "h": "Deep peels: 10 years or longer",
          "p": "Deep peels penetrate further into the dermis and can last up to 10 years or longer. These are designed as a one-time treatment for results that hold years to come — and a person can only have one deep peel in their lifetime."
        },
        {
          "h": "How long does recovery take?",
          "p": "Healing time scales with peel depth:"
        },
        {
          "bullets": [
            "Light peels: 1 to 7 days",
            "Medium peels: 7 to 14 days",
            "Deep peels: 14 to 21 days"
          ]
        },
        {
          "p": "Most patients can see smooth, glowing skin in about 2 to 5 days after treatment, though redness can linger for several months after deeper peels. Most patients get the results they want with just 1 to 2 treatments."
        },
        {
          "h": "What affects how long results last?",
          "p": "The depth of the peel determines how many skin cell layers are removed, and because skin cells continuously renew, results will only last as long as your next skin cell renewal cycle. The variance for superficial and medium peels depends on your skin type, aftercare routine, and the type of acid used."
        },
        {
          "p": "Aftercare matters more than people expect. People who maintain results well with at-home skincare and consistent sun protection may not need treatments as frequently."
        },
        {
          "p": "Important caveat: most results are not permanent because your skin continues to age. If you have sun-damaged skin or precancerous growths called AKs, you'll likely continue to see new spots and growths over time."
        },
        {
          "h": "How often do you need maintenance?",
          "bullets": [
            "Light peels: Every 2–5 weeks. Some people with frequent acne breakouts or chronically dry skin may need treatment as often as biweekly.",
            "Medium peels: Every 6–12 months.",
            "Deep peels: Once. A second deep peel is not recommended."
          ]
        },
        {
          "p": "For light peel programs specifically, you may need a series of 3 to 5 peels to get the result you're after."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How long do chemical peel results last overall?",
          "a": "Anywhere from one month for the lightest peels to a decade or more for the deepest. Peel depth is the single biggest factor."
        },
        {
          "q": "Can chemical peel results be permanent?",
          "a": "Not exactly — your skin continues aging regardless. Deep peels come close (10+ years), but you can only have one in your lifetime, so plan that decision carefully."
        },
        {
          "q": "What factors affect how long results last?",
          "a": "Peel depth is the biggest factor. After that: your skin type, the specific acid used, and how consistently you protect your skin from sun after treatment."
        },
        {
          "q": "How often should I schedule light peel maintenance?",
          "a": "Light peels can be repeated every 2 to 5 weeks. The exact cadence depends on your skin condition and how fast your skin naturally regenerates — your provider will adjust based on how you respond."
        },
        {
          "q": "Can I get a chemical peel if I already use retinol?",
          "a": "Most providers ask you to pause retinol and other strong actives 5–7 days before a peel so your skin barrier isn't already compromised. Resume them after your skin has fully healed — your provider will tell you when based on the depth of peel."
        }
      ]
    },
    "es": {
      "dek": "A chemical peel's results last anywhere from one month to many years, depending on how deep the treatment goes. Light peels fade within a couple months as your skin cells regenerate. Medium peels hold for a few months. Deep peels can last a decade or longer.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Light peels last 1–2 months; plan maintenance every 2–5 weeks",
            "Medium peels hold for 2–6 months; follow-up every 6–12 months",
            "Deep peels can last 10 years or longer — and you only get one",
            "Healing ranges from 1 week (light) to 3 weeks (deep)",
            "Aftercare and sun protection directly extend how long results last"
          ]
        },
        {
          "h": "How long does each peel depth last?"
        },
        {
          "h": "Light (superficial) peels: 1–2 months",
          "p": "Light peels use gentler acids like glycolic or salicylic to target the outermost skin layer. The results fade as your skin's natural turnover cycle replaces those cells. You can repeat the application every 2–5 weeks depending on your skin condition and how fast your cells renew."
        },
        {
          "h": "Medium peels: 2–6 months",
          "p": "Medium peels reach into the middle layer and last a few months. You can typically repeat the application with medium peels after a few months to maintain or build results — most maintenance schedules land at a follow-up peel every 6–12 months. You may need repeat applications to maintain your desired result."
        },
        {
          "h": "Deep peels: 10 years or longer",
          "p": "Deep peels penetrate further into the dermis and can last up to 10 years or longer. These are designed as a one-time treatment for results that hold years to come — and a person can only have one deep peel in their lifetime."
        },
        {
          "h": "How long does recovery take?",
          "p": "Healing time scales with peel depth:"
        },
        {
          "bullets": [
            "Light peels: 1 to 7 days",
            "Medium peels: 7 to 14 days",
            "Deep peels: 14 to 21 days"
          ]
        },
        {
          "p": "Most patients can see smooth, glowing skin in about 2 to 5 days after treatment, though redness can linger for several months after deeper peels. Most patients get the results they want with just 1 to 2 treatments."
        },
        {
          "h": "What affects how long results last?",
          "p": "The depth of the peel determines how many skin cell layers are removed, and because skin cells continuously renew, results will only last as long as your next skin cell renewal cycle. The variance for superficial and medium peels depends on your skin type, aftercare routine, and the type of acid used."
        },
        {
          "p": "Aftercare matters more than people expect. People who maintain results well with at-home skincare and consistent sun protection may not need treatments as frequently."
        },
        {
          "p": "Important caveat: most results are not permanent because your skin continues to age. If you have sun-damaged skin or precancerous growths called AKs, you'll likely continue to see new spots and growths over time."
        },
        {
          "h": "How often do you need maintenance?",
          "bullets": [
            "Light peels: Every 2–5 weeks. Some people with frequent acne breakouts or chronically dry skin may need treatment as often as biweekly.",
            "Medium peels: Every 6–12 months.",
            "Deep peels: Once. A second deep peel is not recommended."
          ]
        },
        {
          "p": "For light peel programs specifically, you may need a series of 3 to 5 peels to get the result you're after."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How long do chemical peel results last overall?",
          "a": "Anywhere from one month for the lightest peels to a decade or more for the deepest. Peel depth is the single biggest factor."
        },
        {
          "q": "Can chemical peel results be permanent?",
          "a": "Not exactly — your skin continues aging regardless. Deep peels come close (10+ years), but you can only have one in your lifetime, so plan that decision carefully."
        },
        {
          "q": "What factors affect how long results last?",
          "a": "Peel depth is the biggest factor. After that: your skin type, the specific acid used, and how consistently you protect your skin from sun after treatment."
        },
        {
          "q": "How often should I schedule light peel maintenance?",
          "a": "Light peels can be repeated every 2 to 5 weeks. The exact cadence depends on your skin condition and how fast your skin naturally regenerates — your provider will adjust based on how you respond."
        },
        {
          "q": "Can I get a chemical peel if I already use retinol?",
          "a": "Most providers ask you to pause retinol and other strong actives 5–7 days before a peel so your skin barrier isn't already compromised. Resume them after your skin has fully healed — your provider will tell you when based on the depth of peel."
        }
      ]
    }
  },
  "18": {
    "en": {
      "dek": "A Brazilian wax keeps you smooth for about three to four weeks. The first 7 to 10 days you're completely hair-free; light regrowth typically appears in two to three weeks, and most people book the next appointment around the 3–4 week mark. Consistent waxing stretches that window over time.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Smooth results last 3–4 weeks on average",
            "Completely hair-free for the first 7–10 days; light regrowth starts at 2–3 weeks",
            "Hair grows back slower than after shaving — and finer over time with consistent waxing",
            "Genetics, hormones, age, and consistency all shift your personal timeline",
            "Shaving between waxes resets the cycle and undoes your progress"
          ]
        },
        {
          "h": "How long does smooth skin actually last?",
          "p": "Skin stays hair-free for about 7 to 10 days after your appointment. Most people then enjoy smooth-looking skin for the full 3–4 weeks because initial regrowth is fine and softer than it was before waxing. Compared to shaving, regrowth takes much longer to come back in."
        },
        {
          "p": "Results vary person to person based on hair type, growth rate, thickness, and hormones. Your friend's timeline isn't yours, and that's normal."
        },
        {
          "h": "What changes how long your wax lasts?",
          "p": "A few factors set your personal cycle:"
        },
        {
          "bullets": [
            "Genetics. The speed at which your hair grows is largely hereditary.",
            "Age. As you age, you might find that you enjoy longer-lasting results.",
            "Hormones, stress, diet, and medical conditions. Any of these can speed up or slow down regrowth.",
            "The hair growth cycle itself. Hair grows in three phases — anagen (growing), catagen (transition), and telogen (resting), and waxing only works during the anagen phase. At any given time, about 90% of your hair follicles are in the growth phase, which is why most hairs get pulled — but the dormant ones come in later, which is why first-timers often see uneven regrowth."
          ]
        },
        {
          "h": "Does regular waxing make results last longer?",
          "p": "Yes. You might see up to 50 percent less regrowth after a few sessions. When hair grows back after waxing, it grows back weaker — finer, softer, and more sparse. That said, waxing won't stop hair growth completely; it slows and thins it."
        },
        {
          "p": "The cycle sync is the bigger benefit: after three to four waxes, all your hairs should be growing in the same cycle. That means longer stretches of smooth skin and less random regrowth between appointments. First-timers see shorter smoothness windows precisely because their hairs are still on different phases."
        },
        {
          "h": "What ruins your wax results fastest?",
          "p": "Shaving between waxes resets the cycle — and not in a good way. It encourages thick regrowth, throws off the hair phases, and makes your next wax more painful and less effective. Once you commit to waxing, the next shave undoes weeks of progress."
        },
        {
          "p": "The sweet spot for booking is every 3 to 5 weeks. By then, hair reaches at least ½ inch — the ideal length for effective removal — while still keeping the growth cycles in sync for smoother, longer-lasting results."
        },
        {
          "h": "What should you do right after a wax?",
          "p": "The first 24 hours matter most."
        },
        {
          "bullets": [
            "Skip exercise, heat, and friction for 24 hours. Sweating or sauna time too soon causes irritation.",
            "Redness fades within 24 hours. Mild post-wax redness is normal and clears overnight.",
            "By day three, skin feels significantly smoother — the irritation is gone and the soft, hair-free result settles in.",
            "It gets easier. The more frequently you wax, the less sensitive your skin becomes."
          ]
        },
        {
          "h": "When should you book your next wax?",
          "p": "Hair needs to be about ¼ to ½ inch long — about two to three weeks of growth — for the wax to grip properly. If hair is too short, the wax can't pick it up, and you'll have to come back later."
        },
        {
          "p": "Practically: book your next appointment around the 3–5 week mark depending on your regrowth pattern. If you've been waxing consistently for a few months and your cycles are synced, you may be able to stretch to 5 or 6 weeks. First-timers should plan closer to 3 weeks."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Will waxing eventually stop hair growth?",
          "a": "No. Regular waxing reduces regrowth and makes hair finer over time, but it won't eliminate it. For permanent removal, look at laser or electrolysis — different treatment categories entirely."
        },
        {
          "q": "Does waxing make hair grow back thicker?",
          "a": "No — the opposite. Waxing removes hair from the root, so regrowth comes in thinner and softer over time. Shaving cuts hair at an angle and can make it feel coarser as it grows back, which is where the \"shaving makes hair thicker\" myth comes from. With waxing, that's not the case."
        },
        {
          "q": "Why does my first wax last shorter than my fifth?",
          "a": "First waxes catch your hairs at random points in their growth phases. After three to four sessions, those phases sync up — all your hairs enter the growth phase together, which means longer smoothness windows and less random regrowth."
        },
        {
          "q": "Is six weeks between waxes realistic?",
          "a": "For some people, yes. After a few sessions with consistent timing, regular clients sometimes stretch to five or six weeks with minimal regrowth. It's not universal, and your hair still needs to be at least ¼ inch when you arrive — but consistency makes it possible."
        },
        {
          "q": "Can I work out the same day as my wax?",
          "a": "Give it at least 24 hours. Sweat, heat, and friction within that window cause irritation and ingrown hairs. Once the redness clears, you're back to normal routine."
        }
      ]
    },
    "es": {
      "dek": "A Brazilian wax keeps you smooth for about three to four weeks. The first 7 to 10 days you're completely hair-free; light regrowth typically appears in two to three weeks, and most people book the next appointment around the 3–4 week mark. Consistent waxing stretches that window over time.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Smooth results last 3–4 weeks on average",
            "Completely hair-free for the first 7–10 days; light regrowth starts at 2–3 weeks",
            "Hair grows back slower than after shaving — and finer over time with consistent waxing",
            "Genetics, hormones, age, and consistency all shift your personal timeline",
            "Shaving between waxes resets the cycle and undoes your progress"
          ]
        },
        {
          "h": "How long does smooth skin actually last?",
          "p": "Skin stays hair-free for about 7 to 10 days after your appointment. Most people then enjoy smooth-looking skin for the full 3–4 weeks because initial regrowth is fine and softer than it was before waxing. Compared to shaving, regrowth takes much longer to come back in."
        },
        {
          "p": "Results vary person to person based on hair type, growth rate, thickness, and hormones. Your friend's timeline isn't yours, and that's normal."
        },
        {
          "h": "What changes how long your wax lasts?",
          "p": "A few factors set your personal cycle:"
        },
        {
          "bullets": [
            "Genetics. The speed at which your hair grows is largely hereditary.",
            "Age. As you age, you might find that you enjoy longer-lasting results.",
            "Hormones, stress, diet, and medical conditions. Any of these can speed up or slow down regrowth.",
            "The hair growth cycle itself. Hair grows in three phases — anagen (growing), catagen (transition), and telogen (resting), and waxing only works during the anagen phase. At any given time, about 90% of your hair follicles are in the growth phase, which is why most hairs get pulled — but the dormant ones come in later, which is why first-timers often see uneven regrowth."
          ]
        },
        {
          "h": "Does regular waxing make results last longer?",
          "p": "Yes. You might see up to 50 percent less regrowth after a few sessions. When hair grows back after waxing, it grows back weaker — finer, softer, and more sparse. That said, waxing won't stop hair growth completely; it slows and thins it."
        },
        {
          "p": "The cycle sync is the bigger benefit: after three to four waxes, all your hairs should be growing in the same cycle. That means longer stretches of smooth skin and less random regrowth between appointments. First-timers see shorter smoothness windows precisely because their hairs are still on different phases."
        },
        {
          "h": "What ruins your wax results fastest?",
          "p": "Shaving between waxes resets the cycle — and not in a good way. It encourages thick regrowth, throws off the hair phases, and makes your next wax more painful and less effective. Once you commit to waxing, the next shave undoes weeks of progress."
        },
        {
          "p": "The sweet spot for booking is every 3 to 5 weeks. By then, hair reaches at least ½ inch — the ideal length for effective removal — while still keeping the growth cycles in sync for smoother, longer-lasting results."
        },
        {
          "h": "What should you do right after a wax?",
          "p": "The first 24 hours matter most."
        },
        {
          "bullets": [
            "Skip exercise, heat, and friction for 24 hours. Sweating or sauna time too soon causes irritation.",
            "Redness fades within 24 hours. Mild post-wax redness is normal and clears overnight.",
            "By day three, skin feels significantly smoother — the irritation is gone and the soft, hair-free result settles in.",
            "It gets easier. The more frequently you wax, the less sensitive your skin becomes."
          ]
        },
        {
          "h": "When should you book your next wax?",
          "p": "Hair needs to be about ¼ to ½ inch long — about two to three weeks of growth — for the wax to grip properly. If hair is too short, the wax can't pick it up, and you'll have to come back later."
        },
        {
          "p": "Practically: book your next appointment around the 3–5 week mark depending on your regrowth pattern. If you've been waxing consistently for a few months and your cycles are synced, you may be able to stretch to 5 or 6 weeks. First-timers should plan closer to 3 weeks."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Will waxing eventually stop hair growth?",
          "a": "No. Regular waxing reduces regrowth and makes hair finer over time, but it won't eliminate it. For permanent removal, look at laser or electrolysis — different treatment categories entirely."
        },
        {
          "q": "Does waxing make hair grow back thicker?",
          "a": "No — the opposite. Waxing removes hair from the root, so regrowth comes in thinner and softer over time. Shaving cuts hair at an angle and can make it feel coarser as it grows back, which is where the \"shaving makes hair thicker\" myth comes from. With waxing, that's not the case."
        },
        {
          "q": "Why does my first wax last shorter than my fifth?",
          "a": "First waxes catch your hairs at random points in their growth phases. After three to four sessions, those phases sync up — all your hairs enter the growth phase together, which means longer smoothness windows and less random regrowth."
        },
        {
          "q": "Is six weeks between waxes realistic?",
          "a": "For some people, yes. After a few sessions with consistent timing, regular clients sometimes stretch to five or six weeks with minimal regrowth. It's not universal, and your hair still needs to be at least ¼ inch when you arrive — but consistency makes it possible."
        },
        {
          "q": "Can I work out the same day as my wax?",
          "a": "Give it at least 24 hours. Sweat, heat, and friction within that window cause irritation and ingrown hairs. Once the redness clears, you're back to normal routine."
        }
      ]
    }
  },
  "19": {
    "en": {
      "dek": "Laser hair removal and waxing are the two heavy hitters for getting rid of unwanted body hair — but they work in completely different ways. Laser uses concentrated light to destroy hair follicles and prevent regrowth; waxing yanks hair out from the root with warm wax. The right choice comes down to your skin tone, hair color, budget, and how much upkeep you'll tolerate.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Waxing works on any hair color or skin type; laser works best on dark hair and light skin",
            "Waxing lasts 3–6 weeks; laser cuts up to 90% of hair after a few sessions",
            "Waxing costs $50–$100 per session indefinitely; laser costs more upfront but less over a lifetime",
            "Laser needs 6–10 sessions spaced weeks apart, then occasional maintenance",
            "Waxing causes more skin irritation; laser feels like a quick rubber-band snap"
          ]
        },
        {
          "h": "How does each method work?",
          "p": "Laser hair removal uses concentrated light to target and destroy the pigment in your hair follicles. Dark hairs absorb that light most effectively, which damages the follicle enough to stop future growth. It's non-invasive and performed in-office with FDA-approved devices."
        },
        {
          "p": "Waxing takes the opposite approach. A technician applies warm wax to the area, lets it cool slightly, then pulls it off quickly against the direction of hair growth — yanking the hair out from the root in one motion."
        },
        {
          "h": "Who is a good candidate?",
          "p": "This is where the two diverge sharply."
        },
        {
          "p": "Waxing is essentially universal. It works on any skin tone and any hair color, regardless of texture."
        },
        {
          "p": "Laser is pickier. The technology targets pigment, so dark, coarse hairs on light skin respond best. People with pale skin and dark hair — thick, easy-to-spot strands — get the most dramatic results. Laser is less effective on white, gray, blonde, and peach-fuzz hair. Modern devices have improved on darker skin tones, but lighter hair colors remain challenging across the board."
        },
        {
          "h": "How long do results last?",
          "p": "Waxing gives you smooth skin for about 3–6 weeks before you rebook. You have to let hair grow back to at least a quarter-inch before the next session, so you're never fully hair-free — just cycling through grow-out periods."
        },
        {
          "p": "Laser shows results with minimal regrowth after the first treatment. Most people need 6 to 10 sessions spaced 4 to 6 weeks apart for the initial round, then maintenance treatments every 6 months or so. It cuts up to 90% of hair after a few sessions — significant reduction, though not technically permanent."
        },
        {
          "h": "What's the real cost over time?",
          "p": "A single waxing session runs $50 to $100 depending on the area. That sounds cheap until you run the lifetime math: the average person spends over $23,000 on waxing across their life."
        },
        {
          "p": "Laser costs more per session upfront, but once the initial treatment period is complete, your spending drops off dramatically. Over a decade or two, laser usually costs less than waxing every few weeks indefinitely."
        },
        {
          "h": "Does it hurt?",
          "p": "Waxing pulls hair out from the root — especially stinging on sensitive areas like the bikini line or underarms, and the sting repeats with each strip. It tends to be the more irritating of the two because hairs pull against their growth direction and can break at the surface, leading to redness, bumps, and ingrown hairs."
        },
        {
          "p": "Laser feels like a rubber band snapping against the skin — a quick burst of heat that fades fast. It gets less painful as sessions continue and there's less hair to target."
        },
        {
          "h": "Prep and aftercare",
          "p": "The prep rules are nearly opposite for the two methods:"
        },
        {
          "bullets": [
            "Before laser: Shaving is fine and actually recommended. Do NOT wax — waxing removes the follicle the laser needs to target, so it sabotages your treatment plan. Shave between sessions if you need to.",
            "Skin condition: Laser should never be performed on tanned skin, which raises the chance of a poor cosmetic outcome."
          ]
        },
        {
          "h": "Risks and side effects",
          "p": "Waxing is generally safe but carries a risk of burns from overheated wax, plus irritation and ingrown hairs — rougher on sensitive skin."
        },
        {
          "p": "Laser is FDA-approved and non-invasive with minimal side effects when performed correctly. The light targets pigment at the skin's surface and doesn't penetrate deeply enough to reach organs."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can you do laser hair removal on dark skin?",
          "a": "Modern lasers have improved significantly for darker skin tones — many clinics now run devices calibrated for a wider range. Effectiveness still depends on enough contrast between your skin and hair color, since the laser needs pigment to target."
        },
        {
          "q": "How many laser sessions do you really need?",
          "a": "Plan on 6 to 10 sessions for the initial series, spaced 4 to 6 weeks apart, then maintenance every 6 months to a year depending on your hair growth and hormones."
        },
        {
          "q": "Is laser hair removal actually permanent?",
          "a": "Not technically. It produces significant long-term reduction — up to 90% — but some regrowth can occur over years, which is why maintenance sessions exist. \"Permanent reduction\" is the accurate term, not \"permanent removal.\""
        },
        {
          "q": "Which is cheaper in the long run?",
          "a": "Laser. It costs more upfront but the average lifetime cost of waxing runs about $23,000, and laser spending drops sharply once your initial series is done. For most people laser comes out ahead after three to five years of skipped wax appointments."
        },
        {
          "q": "Can you switch from waxing to laser?",
          "a": "Yes, but plan ahead. Stop waxing at least four weeks before your first laser session so the follicles recover and produce hair the laser can target. Switch to shaving in the meantime."
        }
      ]
    },
    "es": {
      "dek": "Laser hair removal and waxing are the two heavy hitters for getting rid of unwanted body hair — but they work in completely different ways. Laser uses concentrated light to destroy hair follicles and prevent regrowth; waxing yanks hair out from the root with warm wax. The right choice comes down to your skin tone, hair color, budget, and how much upkeep you'll tolerate.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Waxing works on any hair color or skin type; laser works best on dark hair and light skin",
            "Waxing lasts 3–6 weeks; laser cuts up to 90% of hair after a few sessions",
            "Waxing costs $50–$100 per session indefinitely; laser costs more upfront but less over a lifetime",
            "Laser needs 6–10 sessions spaced weeks apart, then occasional maintenance",
            "Waxing causes more skin irritation; laser feels like a quick rubber-band snap"
          ]
        },
        {
          "h": "How does each method work?",
          "p": "Laser hair removal uses concentrated light to target and destroy the pigment in your hair follicles. Dark hairs absorb that light most effectively, which damages the follicle enough to stop future growth. It's non-invasive and performed in-office with FDA-approved devices."
        },
        {
          "p": "Waxing takes the opposite approach. A technician applies warm wax to the area, lets it cool slightly, then pulls it off quickly against the direction of hair growth — yanking the hair out from the root in one motion."
        },
        {
          "h": "Who is a good candidate?",
          "p": "This is where the two diverge sharply."
        },
        {
          "p": "Waxing is essentially universal. It works on any skin tone and any hair color, regardless of texture."
        },
        {
          "p": "Laser is pickier. The technology targets pigment, so dark, coarse hairs on light skin respond best. People with pale skin and dark hair — thick, easy-to-spot strands — get the most dramatic results. Laser is less effective on white, gray, blonde, and peach-fuzz hair. Modern devices have improved on darker skin tones, but lighter hair colors remain challenging across the board."
        },
        {
          "h": "How long do results last?",
          "p": "Waxing gives you smooth skin for about 3–6 weeks before you rebook. You have to let hair grow back to at least a quarter-inch before the next session, so you're never fully hair-free — just cycling through grow-out periods."
        },
        {
          "p": "Laser shows results with minimal regrowth after the first treatment. Most people need 6 to 10 sessions spaced 4 to 6 weeks apart for the initial round, then maintenance treatments every 6 months or so. It cuts up to 90% of hair after a few sessions — significant reduction, though not technically permanent."
        },
        {
          "h": "What's the real cost over time?",
          "p": "A single waxing session runs $50 to $100 depending on the area. That sounds cheap until you run the lifetime math: the average person spends over $23,000 on waxing across their life."
        },
        {
          "p": "Laser costs more per session upfront, but once the initial treatment period is complete, your spending drops off dramatically. Over a decade or two, laser usually costs less than waxing every few weeks indefinitely."
        },
        {
          "h": "Does it hurt?",
          "p": "Waxing pulls hair out from the root — especially stinging on sensitive areas like the bikini line or underarms, and the sting repeats with each strip. It tends to be the more irritating of the two because hairs pull against their growth direction and can break at the surface, leading to redness, bumps, and ingrown hairs."
        },
        {
          "p": "Laser feels like a rubber band snapping against the skin — a quick burst of heat that fades fast. It gets less painful as sessions continue and there's less hair to target."
        },
        {
          "h": "Prep and aftercare",
          "p": "The prep rules are nearly opposite for the two methods:"
        },
        {
          "bullets": [
            "Before laser: Shaving is fine and actually recommended. Do NOT wax — waxing removes the follicle the laser needs to target, so it sabotages your treatment plan. Shave between sessions if you need to.",
            "Skin condition: Laser should never be performed on tanned skin, which raises the chance of a poor cosmetic outcome."
          ]
        },
        {
          "h": "Risks and side effects",
          "p": "Waxing is generally safe but carries a risk of burns from overheated wax, plus irritation and ingrown hairs — rougher on sensitive skin."
        },
        {
          "p": "Laser is FDA-approved and non-invasive with minimal side effects when performed correctly. The light targets pigment at the skin's surface and doesn't penetrate deeply enough to reach organs."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can you do laser hair removal on dark skin?",
          "a": "Modern lasers have improved significantly for darker skin tones — many clinics now run devices calibrated for a wider range. Effectiveness still depends on enough contrast between your skin and hair color, since the laser needs pigment to target."
        },
        {
          "q": "How many laser sessions do you really need?",
          "a": "Plan on 6 to 10 sessions for the initial series, spaced 4 to 6 weeks apart, then maintenance every 6 months to a year depending on your hair growth and hormones."
        },
        {
          "q": "Is laser hair removal actually permanent?",
          "a": "Not technically. It produces significant long-term reduction — up to 90% — but some regrowth can occur over years, which is why maintenance sessions exist. \"Permanent reduction\" is the accurate term, not \"permanent removal.\""
        },
        {
          "q": "Which is cheaper in the long run?",
          "a": "Laser. It costs more upfront but the average lifetime cost of waxing runs about $23,000, and laser spending drops sharply once your initial series is done. For most people laser comes out ahead after three to five years of skipped wax appointments."
        },
        {
          "q": "Can you switch from waxing to laser?",
          "a": "Yes, but plan ahead. Stop waxing at least four weeks before your first laser session so the follicles recover and produce hair the laser can target. Switch to shaving in the meantime."
        }
      ]
    }
  },
  "20": {
    "en": {
      "dek": "Brow lamination lasts 4 to 8 weeks. Most clients land around the 6-week mark with average aftercare. Skip the aftercare steps and you'll be back in the chair closer to 4 weeks — or sooner.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Brow lamination holds for 4–8 weeks depending on aftercare and hair growth",
            "Results typically peak around 6 weeks before new growth disrupts the shape",
            "Keep brows dry and away from steam and oil-based products for the first 24 hours",
            "Wait 6–8 weeks between appointments to avoid weakening the hair",
            "Pair lamination with a tint or wax to extend the visual impact"
          ]
        },
        {
          "h": "What is brow lamination?",
          "p": "Brow lamination is a non-invasive treatment that uses solutions to shape and set the eyebrow hairs in place. It pushes each hair forward and upward, creating a fuller, lifted look without filler or microblading."
        },
        {
          "p": "Right after your appointment you get fuller, bolder brows, easier daily styling, and better symmetry between both sides."
        },
        {
          "h": "How long does it actually last?",
          "p": "The honest answer: 4 to 8 weeks, depending on how well you care for your brows. Most people land around 6 weeks; diligent aftercare pushes you toward the 8-week end, and skipping it pulls you back toward 4."
        },
        {
          "h": "What affects how long results last?",
          "p": "Two factors set your window:"
        },
        {
          "bullets": [
            "Your hair growth cycle. As new brow hairs grow in, the laminated hairs slowly return to their natural direction — which is why maintenance is required. This happens on its own schedule regardless of aftercare."
          ]
        },
        {
          "bullets": [
            "Your first 24 hours. This is the make-or-break window for the set. Right after your appointment:",
            "Keep brows dry for 24 hours",
            "Avoid steam baths and saunas for 24 hours",
            "Skip oil-based brow products for the first day"
          ]
        },
        {
          "p": "Skipping these doesn't just fade the look — it can soften the set before it fully locks in."
        },
        {
          "h": "Aftercare tips to reach the 8-week mark",
          "p": "To push past the 6-week baseline:"
        },
        {
          "bullets": [
            "Keep brows completely dry for the full 24 hours",
            "Avoid steamy showers, saunas, and hot yoga for at least a day",
            "Wait 7 to 14 days before getting a facial",
            "Brush brows upward each morning with a spoolie to keep the set intact",
            "Skip heavy oils and serums around the brow area"
          ]
        },
        {
          "h": "When to book your next appointment",
          "p": "When your brows no longer hold their lifted shape and start growing in random directions, it's time to rebook. Don't laminate more often than every 6 to 8 weeks, though — over-lamination weakens the hair and leads to brittle, fragile brow hairs that break off, which defeats the whole purpose."
        },
        {
          "h": "Can you pair lamination with other services?",
          "p": "Yes — pairing is one of the smartest ways to extend your look without booking more often. Pairing lamination with a brow wax or tint enhances the final result: a tint fills sparse areas and adds depth so brows still read full as the lamination softens, and a wax cleans up strays for a sharp shape. Many clients also keep a clear brow gel at home to refresh the hold between appointments."
        },
        {
          "h": "How does it compare to other brow treatments?",
          "p": "Where lamination sits against the alternatives:"
        },
        {
          "bullets": [
            "Microblading: Semi-permanent (1–3 years), more expensive upfront, requires touch-ups. The committed option.",
            "Brow tinting alone: 3–4 weeks. Adds color but no shape or lift.",
            "Brow lamination: 4–8 weeks, shapes and lifts, mid-range price — and generally easier on the wallet than microblading."
          ]
        },
        {
          "p": "If you're not ready to commit to permanent brows, lamination is the middle ground: transformative but reversible."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How often can you get brow lamination?",
          "a": "Wait at least 6 to 8 weeks between appointments. More frequent sessions risk weakening the hair over time."
        },
        {
          "q": "Does brow lamination damage your natural brows?",
          "a": "Done correctly by a trained professional, it's safe — the solutions are semi-permanent and don't penetrate the skin. The main risk is over-lamination, which is why spacing sessions matters."
        },
        {
          "q": "Can I get my brows wet after lamination?",
          "a": "Not for the first 24 hours. Water and steam in that window break down the set before it locks in. After 24 hours, normal washing is fine."
        },
        {
          "q": "What should I avoid after brow lamination?",
          "a": "For the first 24 hours: water, steam, saunas, and oil-based products on the brows. For the first week or two: facials and aggressive scrubbing around the brow area."
        },
        {
          "q": "Can I still use brow gel after lamination?",
          "a": "Yes. A clear brow gel or a morning spoolie helps maintain the lifted shape. Keep it light — heavy products weigh the hairs back down over time."
        }
      ]
    },
    "es": {
      "dek": "Brow lamination lasts 4 to 8 weeks. Most clients land around the 6-week mark with average aftercare. Skip the aftercare steps and you'll be back in the chair closer to 4 weeks — or sooner.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Brow lamination holds for 4–8 weeks depending on aftercare and hair growth",
            "Results typically peak around 6 weeks before new growth disrupts the shape",
            "Keep brows dry and away from steam and oil-based products for the first 24 hours",
            "Wait 6–8 weeks between appointments to avoid weakening the hair",
            "Pair lamination with a tint or wax to extend the visual impact"
          ]
        },
        {
          "h": "What is brow lamination?",
          "p": "Brow lamination is a non-invasive treatment that uses solutions to shape and set the eyebrow hairs in place. It pushes each hair forward and upward, creating a fuller, lifted look without filler or microblading."
        },
        {
          "p": "Right after your appointment you get fuller, bolder brows, easier daily styling, and better symmetry between both sides."
        },
        {
          "h": "How long does it actually last?",
          "p": "The honest answer: 4 to 8 weeks, depending on how well you care for your brows. Most people land around 6 weeks; diligent aftercare pushes you toward the 8-week end, and skipping it pulls you back toward 4."
        },
        {
          "h": "What affects how long results last?",
          "p": "Two factors set your window:"
        },
        {
          "bullets": [
            "Your hair growth cycle. As new brow hairs grow in, the laminated hairs slowly return to their natural direction — which is why maintenance is required. This happens on its own schedule regardless of aftercare."
          ]
        },
        {
          "bullets": [
            "Your first 24 hours. This is the make-or-break window for the set. Right after your appointment:",
            "Keep brows dry for 24 hours",
            "Avoid steam baths and saunas for 24 hours",
            "Skip oil-based brow products for the first day"
          ]
        },
        {
          "p": "Skipping these doesn't just fade the look — it can soften the set before it fully locks in."
        },
        {
          "h": "Aftercare tips to reach the 8-week mark",
          "p": "To push past the 6-week baseline:"
        },
        {
          "bullets": [
            "Keep brows completely dry for the full 24 hours",
            "Avoid steamy showers, saunas, and hot yoga for at least a day",
            "Wait 7 to 14 days before getting a facial",
            "Brush brows upward each morning with a spoolie to keep the set intact",
            "Skip heavy oils and serums around the brow area"
          ]
        },
        {
          "h": "When to book your next appointment",
          "p": "When your brows no longer hold their lifted shape and start growing in random directions, it's time to rebook. Don't laminate more often than every 6 to 8 weeks, though — over-lamination weakens the hair and leads to brittle, fragile brow hairs that break off, which defeats the whole purpose."
        },
        {
          "h": "Can you pair lamination with other services?",
          "p": "Yes — pairing is one of the smartest ways to extend your look without booking more often. Pairing lamination with a brow wax or tint enhances the final result: a tint fills sparse areas and adds depth so brows still read full as the lamination softens, and a wax cleans up strays for a sharp shape. Many clients also keep a clear brow gel at home to refresh the hold between appointments."
        },
        {
          "h": "How does it compare to other brow treatments?",
          "p": "Where lamination sits against the alternatives:"
        },
        {
          "bullets": [
            "Microblading: Semi-permanent (1–3 years), more expensive upfront, requires touch-ups. The committed option.",
            "Brow tinting alone: 3–4 weeks. Adds color but no shape or lift.",
            "Brow lamination: 4–8 weeks, shapes and lifts, mid-range price — and generally easier on the wallet than microblading."
          ]
        },
        {
          "p": "If you're not ready to commit to permanent brows, lamination is the middle ground: transformative but reversible."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How often can you get brow lamination?",
          "a": "Wait at least 6 to 8 weeks between appointments. More frequent sessions risk weakening the hair over time."
        },
        {
          "q": "Does brow lamination damage your natural brows?",
          "a": "Done correctly by a trained professional, it's safe — the solutions are semi-permanent and don't penetrate the skin. The main risk is over-lamination, which is why spacing sessions matters."
        },
        {
          "q": "Can I get my brows wet after lamination?",
          "a": "Not for the first 24 hours. Water and steam in that window break down the set before it locks in. After 24 hours, normal washing is fine."
        },
        {
          "q": "What should I avoid after brow lamination?",
          "a": "For the first 24 hours: water, steam, saunas, and oil-based products on the brows. For the first week or two: facials and aggressive scrubbing around the brow area."
        },
        {
          "q": "Can I still use brow gel after lamination?",
          "a": "Yes. A clear brow gel or a morning spoolie helps maintain the lifted shape. Keep it light — heavy products weigh the hairs back down over time."
        }
      ]
    }
  },
  "21": {
    "en": {
      "dek": "Brassy hair shows up when the warm undertones in your hair — red, orange, and yellow — become visible as your color fades. It happens to blondes, brunettes with highlights, and anyone who's gone lighter than their natural shade. The fix is color theory: purple pigments cancel yellow, blue pigments cancel orange. Mild brassiness responds to at-home shampoos and glosses; severe cases need a stylist.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Brassiness is your color fading and revealing warm undertones",
            "Yellow tones need purple shampoo; orange tones need blue shampoo",
            "Hard water and chlorine accelerate brassiness in Valley hair",
            "Glosses and toners are gentler than re-dyeing",
            "Wait 1–2 weeks after bleaching before applying toning products"
          ]
        },
        {
          "h": "What actually causes brassy hair?",
          "p": "Your hair isn't one solid color — it contains layers of pigment. Red, orange, and yellow tones sit underneath and are more dominant the darker your natural hair. When you lighten with dye or bleach, the darker pigments lift but some warm ones stay behind, and the result is brassiness."
        },
        {
          "p": "Hair color doesn't just turn brassy — it fades brassy. When yellow or orange tones start shining through, that's usually a sign your shade is fading and letting the underlying warm pigments show."
        },
        {
          "p": "Everyday factors speed up that fade:"
        },
        {
          "bullets": [
            "Hard water. The RGV has mineral-heavy water — it deposits minerals like iron and copper on your hair, making brassiness more visible.",
            "Chlorine. Swimming in chlorinated pools triggers chemical reactions that pull your hair toward brassy tones.",
            "Sulfate shampoos. Products with sulfates or harsh ingredients accelerate fading, which leads to brassiness.",
            "Sun exposure. UV light lifts color the same way bleach does.",
            "Product buildup. Hair overloaded with product, oil, and impurities is more likely to look brassy and dull."
          ]
        },
        {
          "h": "How color theory fixes brassiness",
          "p": "It's simply a matter of color theory — complementary colors cancel out unwanted warm tones. Purple sits opposite yellow on the color wheel; blue sits opposite orange. Apply those pigments to brassy hair and they neutralize the warmth, pulling your color back toward cool."
        },
        {
          "p": "The rule is straightforward:"
        },
        {
          "bullets": [
            "Yellow tones → purple. A purple toner contains violet pigments that neutralize the yellow undertone for an even color.",
            "Orange tones → blue. A blue toner contains blue pigments that neutralize orange tones."
          ]
        },
        {
          "p": "Blondes and brunettes with highlights typically deal with yellow; darker brunette hair tends to show orange. Violet masks and purple shampoos are best for the yellow tones common in blondes and highlighted brunettes, while a brown tint with a hint of chocolatey coolness calms orange tones in darker brunette hair."
        },
        {
          "h": "At-home fixes"
        },
        {
          "h": "Purple or blue shampoo",
          "p": "Blue and purple shampoos neutralize brassy tones to reveal a cooler blonde or light brown. Match the color to your tone: if your bleached hair looks more yellow than orange, use a purple shampoo to neutralize the yellow; if it's turned orange, use a blue shampoo to cancel it. Limit use to 1–2 times a week — overuse can leave a tint, and some stylists caution that the dyes in these shampoos can irritate the scalp with heavy long-term use, so don't overdo it."
        },
        {
          "h": "Glosses and toners",
          "p": "Glosses and toners are gentler than re-dyeing, and they add shine while correcting brassy color. Unlike permanent dye, a gloss coats the outside of the hair shaft rather than penetrating it, and your stylist can mix a custom shade to match your goal color."
        },
        {
          "h": "Color-depositing shampoo and conditioner",
          "p": "Use a color-treated shampoo and conditioner matched to your desired shade. These deposit a small amount of color each wash, topping up your tone between dye jobs. It won't fix severe brassiness, but it maintains results after a salon treatment."
        },
        {
          "h": "Going darker",
          "p": "If your brassy damage is extensive and your hair can handle more processing, dyeing darker can be the healthier solution — a darker color covers unwanted tones. Worth discussing with your stylist."
        },
        {
          "h": "How to prevent brassiness"
        },
        {
          "h": "Filter your shower water",
          "p": "Hard water's minerals — most commonly copper from the pipes — deposit on your hair and make brassiness more visible. A filtered shower head helps keep those impurities from being absorbed."
        },
        {
          "h": "Switch to sulfate-free products",
          "p": "Sulfate shampoos strip color faster. A gentle, sulfate-free formula made for color-treated hair can extend the life of your color by weeks."
        },
        {
          "h": "Rinse with cool water",
          "p": "Turn down the shower temperature — rinsing in cool water maintains color longer because it closes the cuticle and locks in pigment."
        },
        {
          "h": "Deep condition weekly",
          "p": "Use a deep conditioning treatment at least once a week. Color-treated hair needs the extra moisture; dry, damaged hair reflects light poorly and makes brassiness more obvious."
        },
        {
          "h": "Rinse after swimming",
          "p": "Rinse your hair immediately after the pool. Better yet, wet it with clean water before swimming — your hair acts like a sponge and can only soak up so much, so pre-soaked hair absorbs less chlorinated water."
        },
        {
          "h": "Wait before toning after bleaching",
          "p": "To avoid serious post-bleach damage, wait at least a week or two to restore your hair's moisture balance before toning. Toners and glosses applied too soon can cause breakage."
        },
        {
          "h": "When to see a stylist instead",
          "p": "At-home products handle mild brassiness; severe cases need professional help. A stylist's correction usually means re-lightening to fully remove the orange, then toning with an ash or light beige to neutralize the brassiness."
        },
        {
          "p": "This matters most for big lightening jumps. If you've got darker hair and chose a permanent color more than two shades lighter than your natural shade, it'll likely come out brassy orange — permanent color can generally only lighten about two shades, so anything lighter just exposes the underlying warm pigment without covering it. That's a job for a professional, not a box dye."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Will purple shampoo fix orange hair?",
          "a": "No. Purple cancels yellow, not orange. Orange needs a blue shampoo. If your hair reads orange rather than yellow, reach for blue."
        },
        {
          "q": "How often should I use purple shampoo?",
          "a": "Two to three times a week is typical. Overuse can leave a purple tint, especially on lighter shades — alternate with your regular sulfate-free shampoo."
        },
        {
          "q": "Can hard water in the RGV cause brassy hair?",
          "a": "Yes. Valley water carries minerals like iron and copper that deposit on your hair and accelerate brassiness. A filtered shower head is one of the most effective fixes for residents here."
        },
        {
          "q": "How long does brassiness take to fade naturally?",
          "a": "It doesn't really fade on its own — it persists until you recolor or grow it out. At-home toning products usually show results within 1–2 weeks of consistent use."
        },
        {
          "q": "Should I bleach my hair again to fix brassiness?",
          "a": "Only if a professional recommends it. Re-bleaching at home risks severe damage. A stylist can assess whether lightening followed by a toner is the right move for your hair's current condition."
        }
      ]
    },
    "es": {
      "dek": "Brassy hair shows up when the warm undertones in your hair — red, orange, and yellow — become visible as your color fades. It happens to blondes, brunettes with highlights, and anyone who's gone lighter than their natural shade. The fix is color theory: purple pigments cancel yellow, blue pigments cancel orange. Mild brassiness responds to at-home shampoos and glosses; severe cases need a stylist.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Brassiness is your color fading and revealing warm undertones",
            "Yellow tones need purple shampoo; orange tones need blue shampoo",
            "Hard water and chlorine accelerate brassiness in Valley hair",
            "Glosses and toners are gentler than re-dyeing",
            "Wait 1–2 weeks after bleaching before applying toning products"
          ]
        },
        {
          "h": "What actually causes brassy hair?",
          "p": "Your hair isn't one solid color — it contains layers of pigment. Red, orange, and yellow tones sit underneath and are more dominant the darker your natural hair. When you lighten with dye or bleach, the darker pigments lift but some warm ones stay behind, and the result is brassiness."
        },
        {
          "p": "Hair color doesn't just turn brassy — it fades brassy. When yellow or orange tones start shining through, that's usually a sign your shade is fading and letting the underlying warm pigments show."
        },
        {
          "p": "Everyday factors speed up that fade:"
        },
        {
          "bullets": [
            "Hard water. The RGV has mineral-heavy water — it deposits minerals like iron and copper on your hair, making brassiness more visible.",
            "Chlorine. Swimming in chlorinated pools triggers chemical reactions that pull your hair toward brassy tones.",
            "Sulfate shampoos. Products with sulfates or harsh ingredients accelerate fading, which leads to brassiness.",
            "Sun exposure. UV light lifts color the same way bleach does.",
            "Product buildup. Hair overloaded with product, oil, and impurities is more likely to look brassy and dull."
          ]
        },
        {
          "h": "How color theory fixes brassiness",
          "p": "It's simply a matter of color theory — complementary colors cancel out unwanted warm tones. Purple sits opposite yellow on the color wheel; blue sits opposite orange. Apply those pigments to brassy hair and they neutralize the warmth, pulling your color back toward cool."
        },
        {
          "p": "The rule is straightforward:"
        },
        {
          "bullets": [
            "Yellow tones → purple. A purple toner contains violet pigments that neutralize the yellow undertone for an even color.",
            "Orange tones → blue. A blue toner contains blue pigments that neutralize orange tones."
          ]
        },
        {
          "p": "Blondes and brunettes with highlights typically deal with yellow; darker brunette hair tends to show orange. Violet masks and purple shampoos are best for the yellow tones common in blondes and highlighted brunettes, while a brown tint with a hint of chocolatey coolness calms orange tones in darker brunette hair."
        },
        {
          "h": "At-home fixes"
        },
        {
          "h": "Purple or blue shampoo",
          "p": "Blue and purple shampoos neutralize brassy tones to reveal a cooler blonde or light brown. Match the color to your tone: if your bleached hair looks more yellow than orange, use a purple shampoo to neutralize the yellow; if it's turned orange, use a blue shampoo to cancel it. Limit use to 1–2 times a week — overuse can leave a tint, and some stylists caution that the dyes in these shampoos can irritate the scalp with heavy long-term use, so don't overdo it."
        },
        {
          "h": "Glosses and toners",
          "p": "Glosses and toners are gentler than re-dyeing, and they add shine while correcting brassy color. Unlike permanent dye, a gloss coats the outside of the hair shaft rather than penetrating it, and your stylist can mix a custom shade to match your goal color."
        },
        {
          "h": "Color-depositing shampoo and conditioner",
          "p": "Use a color-treated shampoo and conditioner matched to your desired shade. These deposit a small amount of color each wash, topping up your tone between dye jobs. It won't fix severe brassiness, but it maintains results after a salon treatment."
        },
        {
          "h": "Going darker",
          "p": "If your brassy damage is extensive and your hair can handle more processing, dyeing darker can be the healthier solution — a darker color covers unwanted tones. Worth discussing with your stylist."
        },
        {
          "h": "How to prevent brassiness"
        },
        {
          "h": "Filter your shower water",
          "p": "Hard water's minerals — most commonly copper from the pipes — deposit on your hair and make brassiness more visible. A filtered shower head helps keep those impurities from being absorbed."
        },
        {
          "h": "Switch to sulfate-free products",
          "p": "Sulfate shampoos strip color faster. A gentle, sulfate-free formula made for color-treated hair can extend the life of your color by weeks."
        },
        {
          "h": "Rinse with cool water",
          "p": "Turn down the shower temperature — rinsing in cool water maintains color longer because it closes the cuticle and locks in pigment."
        },
        {
          "h": "Deep condition weekly",
          "p": "Use a deep conditioning treatment at least once a week. Color-treated hair needs the extra moisture; dry, damaged hair reflects light poorly and makes brassiness more obvious."
        },
        {
          "h": "Rinse after swimming",
          "p": "Rinse your hair immediately after the pool. Better yet, wet it with clean water before swimming — your hair acts like a sponge and can only soak up so much, so pre-soaked hair absorbs less chlorinated water."
        },
        {
          "h": "Wait before toning after bleaching",
          "p": "To avoid serious post-bleach damage, wait at least a week or two to restore your hair's moisture balance before toning. Toners and glosses applied too soon can cause breakage."
        },
        {
          "h": "When to see a stylist instead",
          "p": "At-home products handle mild brassiness; severe cases need professional help. A stylist's correction usually means re-lightening to fully remove the orange, then toning with an ash or light beige to neutralize the brassiness."
        },
        {
          "p": "This matters most for big lightening jumps. If you've got darker hair and chose a permanent color more than two shades lighter than your natural shade, it'll likely come out brassy orange — permanent color can generally only lighten about two shades, so anything lighter just exposes the underlying warm pigment without covering it. That's a job for a professional, not a box dye."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Will purple shampoo fix orange hair?",
          "a": "No. Purple cancels yellow, not orange. Orange needs a blue shampoo. If your hair reads orange rather than yellow, reach for blue."
        },
        {
          "q": "How often should I use purple shampoo?",
          "a": "Two to three times a week is typical. Overuse can leave a purple tint, especially on lighter shades — alternate with your regular sulfate-free shampoo."
        },
        {
          "q": "Can hard water in the RGV cause brassy hair?",
          "a": "Yes. Valley water carries minerals like iron and copper that deposit on your hair and accelerate brassiness. A filtered shower head is one of the most effective fixes for residents here."
        },
        {
          "q": "How long does brassiness take to fade naturally?",
          "a": "It doesn't really fade on its own — it persists until you recolor or grow it out. At-home toning products usually show results within 1–2 weeks of consistent use."
        },
        {
          "q": "Should I bleach my hair again to fix brassiness?",
          "a": "Only if a professional recommends it. Re-bleaching at home risks severe damage. A stylist can assess whether lightening followed by a toner is the right move for your hair's current condition."
        }
      ]
    }
  },
  "22": {
    "en": {
      "dek": "The standard guidance: wait at least 24 hours before any kissing after lip filler, hold off on gentle pecks until the tenderness eases (most providers say 24–48 hours), and wait a full 72 hours before anything passionate. The reason comes down to pressure, healing, and bacteria.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "No kissing of any kind for the first 24 hours",
            "Gentle pecks: once initial tenderness eases, around 24–48 hours",
            "Passionate or French kissing: 72 hours",
            "Pressure can shift filler and ruin your shape",
            "Bacteria in saliva raises infection risk at injection sites"
          ]
        },
        {
          "h": "Why the wait matters",
          "p": "Fillers need time to integrate into the tissue, and any pressure — like kissing — can risk filler migration or uneven results. The first 24 to 48 hours are the most sensitive, when swelling, bruising, and tenderness are most common. Kissing puts pressure on lips that are still healing, which can increase swelling and bruising around the injection sites."
        },
        {
          "p": "There's also an infection angle. Kissing can transfer bacteria from your partner's lips or saliva, and if the injection site hasn't fully closed, even a little smooch can introduce germs. Your mouth carries over 700 species of bacteria — roughly 6 million of them living in your kisser at any time."
        },
        {
          "p": "And the cosmetic risk is real: pressure on the lips in the first few days can cause filler to shift from where it was placed, leading to uneven results. In the worst case, the migration or lumpiness requires retreatment to fix."
        },
        {
          "h": "The timeline in practice",
          "bullets": [
            "First 24 hours: Avoid all kissing, including gentle pecks. This gives the hyaluronic acid gel time to settle.",
            "24–48 hours: Light, gentle pecks are generally safer once the initial tenderness eases — keep it soft and brief.",
            "72 hours: Wait the full three days before any passionate kissing."
          ]
        },
        {
          "p": "The same logic covers anything that puckers your lips. Shaping your mouth into a pucker — to kiss or to drink through a straw — can interfere with the placement of the injection material, so skip straws for the first day or two as well."
        },
        {
          "h": "What affects your timeline",
          "p": "Swelling usually settles within a day or so, though some people see swelling and bruising linger from a few days up to a week. Mild swelling and soreness are normal — but pain that worsens, swelling that won't improve, or changes in lip shape warrant a call to your provider."
        },
        {
          "p": "Practically, your lips feel natural for kissing again after about a week. And honestly, they'll likely be tender and swollen enough in the first couple of days that kissing won't be that appealing anyway."
        },
        {
          "h": "First 48 hours: do's and don'ts",
          "bullets": [
            "Apply ice packs wrapped in cloth to reduce swelling and discomfort.",
            "Skip lipstick, gloss, and balm for 24 hours post-treatment.",
            "Steer clear of sun, saunas, and hot drinks for at least 24 hours.",
            "Avoid straws — sucking applies the same pucker pressure.",
            "Sleep on your back; pressure on your face can shift filler.",
            "Wash your face gently, using upward strokes and avoiding direct lip contact.",
            "Don't touch your lips unless necessary."
          ]
        },
        {
          "h": "Can you kiss sooner if swelling is minimal?",
          "p": "Maybe — light air kisses or soft pecks may be okay sooner if your swelling is minimal, but still wait at least 24 hours to let the tiny injection points heal and reduce infection risk. Gentle pecks are safer after the first day; intense contact should wait until the lips feel less sore and swollen. Keep in mind lip movement can affect blood flow and potentially slow healing in the early phase, so when in doubt, give it the full window."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I kiss my partner 24 hours after lip filler?",
          "a": "A soft peck is generally okay after the first 24 hours if swelling is minimal, but if you're unsure, waiting toward the 48-hour mark further reduces infection risk while the injection points close."
        },
        {
          "q": "Does kissing ruin lip filler?",
          "a": "It can if you go too hard too soon. Pressure in the first 48 hours can shift filler, leading to uneven results or lumpiness that needs correction. Gentle, brief contact after 24 hours is much lower risk."
        },
        {
          "q": "When do lips feel normal after filler?",
          "a": "Most people feel natural kissing again after about a week. Mild tenderness usually resolves within a few days."
        },
        {
          "q": "What counts as 'passionate' kissing?",
          "a": "French kissing, deep kissing, or anything with strong, sustained pressure on the lips. Wait the full 72 hours for that level of contact."
        },
        {
          "q": "Can I drink from a straw while healing?",
          "a": "Skip it for the first day or two. Sucking from a straw puckers your lips, applying the same pressure that can disrupt filler placement."
        }
      ]
    },
    "es": {
      "dek": "The standard guidance: wait at least 24 hours before any kissing after lip filler, hold off on gentle pecks until the tenderness eases (most providers say 24–48 hours), and wait a full 72 hours before anything passionate. The reason comes down to pressure, healing, and bacteria.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "No kissing of any kind for the first 24 hours",
            "Gentle pecks: once initial tenderness eases, around 24–48 hours",
            "Passionate or French kissing: 72 hours",
            "Pressure can shift filler and ruin your shape",
            "Bacteria in saliva raises infection risk at injection sites"
          ]
        },
        {
          "h": "Why the wait matters",
          "p": "Fillers need time to integrate into the tissue, and any pressure — like kissing — can risk filler migration or uneven results. The first 24 to 48 hours are the most sensitive, when swelling, bruising, and tenderness are most common. Kissing puts pressure on lips that are still healing, which can increase swelling and bruising around the injection sites."
        },
        {
          "p": "There's also an infection angle. Kissing can transfer bacteria from your partner's lips or saliva, and if the injection site hasn't fully closed, even a little smooch can introduce germs. Your mouth carries over 700 species of bacteria — roughly 6 million of them living in your kisser at any time."
        },
        {
          "p": "And the cosmetic risk is real: pressure on the lips in the first few days can cause filler to shift from where it was placed, leading to uneven results. In the worst case, the migration or lumpiness requires retreatment to fix."
        },
        {
          "h": "The timeline in practice",
          "bullets": [
            "First 24 hours: Avoid all kissing, including gentle pecks. This gives the hyaluronic acid gel time to settle.",
            "24–48 hours: Light, gentle pecks are generally safer once the initial tenderness eases — keep it soft and brief.",
            "72 hours: Wait the full three days before any passionate kissing."
          ]
        },
        {
          "p": "The same logic covers anything that puckers your lips. Shaping your mouth into a pucker — to kiss or to drink through a straw — can interfere with the placement of the injection material, so skip straws for the first day or two as well."
        },
        {
          "h": "What affects your timeline",
          "p": "Swelling usually settles within a day or so, though some people see swelling and bruising linger from a few days up to a week. Mild swelling and soreness are normal — but pain that worsens, swelling that won't improve, or changes in lip shape warrant a call to your provider."
        },
        {
          "p": "Practically, your lips feel natural for kissing again after about a week. And honestly, they'll likely be tender and swollen enough in the first couple of days that kissing won't be that appealing anyway."
        },
        {
          "h": "First 48 hours: do's and don'ts",
          "bullets": [
            "Apply ice packs wrapped in cloth to reduce swelling and discomfort.",
            "Skip lipstick, gloss, and balm for 24 hours post-treatment.",
            "Steer clear of sun, saunas, and hot drinks for at least 24 hours.",
            "Avoid straws — sucking applies the same pucker pressure.",
            "Sleep on your back; pressure on your face can shift filler.",
            "Wash your face gently, using upward strokes and avoiding direct lip contact.",
            "Don't touch your lips unless necessary."
          ]
        },
        {
          "h": "Can you kiss sooner if swelling is minimal?",
          "p": "Maybe — light air kisses or soft pecks may be okay sooner if your swelling is minimal, but still wait at least 24 hours to let the tiny injection points heal and reduce infection risk. Gentle pecks are safer after the first day; intense contact should wait until the lips feel less sore and swollen. Keep in mind lip movement can affect blood flow and potentially slow healing in the early phase, so when in doubt, give it the full window."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I kiss my partner 24 hours after lip filler?",
          "a": "A soft peck is generally okay after the first 24 hours if swelling is minimal, but if you're unsure, waiting toward the 48-hour mark further reduces infection risk while the injection points close."
        },
        {
          "q": "Does kissing ruin lip filler?",
          "a": "It can if you go too hard too soon. Pressure in the first 48 hours can shift filler, leading to uneven results or lumpiness that needs correction. Gentle, brief contact after 24 hours is much lower risk."
        },
        {
          "q": "When do lips feel normal after filler?",
          "a": "Most people feel natural kissing again after about a week. Mild tenderness usually resolves within a few days."
        },
        {
          "q": "What counts as 'passionate' kissing?",
          "a": "French kissing, deep kissing, or anything with strong, sustained pressure on the lips. Wait the full 72 hours for that level of contact."
        },
        {
          "q": "Can I drink from a straw while healing?",
          "a": "Skip it for the first day or two. Sucking from a straw puckers your lips, applying the same pressure that can disrupt filler placement."
        }
      ]
    }
  },
  "23": {
    "en": {
      "dek": "The right massage frequency depends entirely on what you're using it for — there's no universal standard. For general maintenance, once a month keeps most people on track. For injury recovery or chronic pain, weekly or biweekly sessions are the clinical sweet spot. Athletes and high-stress workers usually land between every two weeks and weekly.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Maintenance for healthy adults: every 4–8 weeks",
            "Injury recovery or chronic pain: weekly or biweekly, in a short series of 3–8 sessions",
            "Athletes and high-stress jobs: every 2–4 weeks",
            "Allow at least 48 hours between deep tissue sessions",
            "Benefits build on each other — consistency matters more than intensity"
          ]
        },
        {
          "h": "What determines how often you need a massage?",
          "p": "There are no standard guidelines for how many massages you can get, but a massage therapist or doctor can recommend a frequency that fits your needs. It always comes down to your personal situation — lifestyle, daily habits, overall health, occupation, and budget all factor in."
        },
        {
          "p": "The biggest variable is your goal. Massages for injury are typically more frequent, while massages for relaxation can happen less often. If you're chasing a specific outcome — pain relief, better sleep, faster recovery — your schedule needs to be tighter than someone who just wants to decompress."
        },
        {
          "h": "How often for general relaxation and stress relief?",
          "p": "For general relaxation, every two to four weeks is a comfortable rhythm. A monthly massage brings a real range of benefits — reduced stress, more energy, and relief from muscle tension — and keeps you feeling grounded between sessions."
        },
        {
          "p": "If you're specifically targeting stress and anxiety, going more often early on helps. Physical touch and massage can relieve feelings of anxiety and loneliness by reducing cortisol levels. Starting with a tighter cadence for a few weeks helps interrupt the body's stress-holding patterns before you taper to maintenance."
        },
        {
          "h": "How often for injury recovery and chronic pain?",
          "p": "If you're dealing with aches and pains from an injury or something chronic, weekly massage helps get you back on track. For pain relief after an injury, it's most often used more frequently at first — once or twice per week — tapering to once a week or every other week through recovery."
        },
        {
          "p": "When dealing with active pain, aim for a short series spaced no more than two weeks apart. Most clients need 3–8 sessions to reset dysfunctional patterns and restore movement. A practical gauge: if pain returns within a few days, it's time to go back; if you're pain-free a week later, start adding time between sessions. For chronic conditions, once a week is the typical starting point depending on how your body responds."
        },
        {
          "p": "One hard rule: it takes a good 48 hours for the system to rebalance after a deep massage, so leave at least a two-day gap between deep tissue sessions. Massage stimulates blood flow, which helps muscles and joints recover faster."
        },
        {
          "h": "How often for athletes?",
          "p": "Competitive athletes often go one to two times a week. The common recommendation is bi-weekly massage to loosen tight muscles, increase flexibility, and keep you on top of your training — scaling up to weekly around an event or competition for a speedier recovery."
        },
        {
          "h": "The maintenance zone: what's enough to stay pain-free?",
          "p": "For most healthy adults, every 4–8 weeks is enough to stay pain-free. For people with high-stress jobs or intense workout schedules, every 2–4 weeks works better. Relaxation massage is lighter and less invasive than sports massage, so it can be tolerated more often — as often as you find useful."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can you get a massage too often?",
          "a": "For deep tissue work, yes — your body needs at least 48 hours between sessions to rebalance. Lighter relaxation massage can be done more frequently based on what your body tolerates."
        },
        {
          "q": "How many sessions do you need to feel results?",
          "a": "For active pain or injury, most people need 3–8 sessions to reset dysfunctional patterns. For general maintenance, you may feel the benefit after the first session."
        },
        {
          "q": "What's the minimum effective frequency?",
          "a": "If you're not chasing a specific outcome, once a month is a solid baseline. Budget-conscious? Stretching to every 4–8 weeks still gives meaningful maintenance for healthy adults with lower physical demand."
        },
        {
          "q": "How soon after an injury can you get a massage?",
          "a": "Work with your therapist or doctor on timing. Early recovery often means frequent sessions — once or twice a week — that taper as you heal, supporting recovery without overtaxing the injured area."
        }
      ]
    },
    "es": {
      "dek": "The right massage frequency depends entirely on what you're using it for — there's no universal standard. For general maintenance, once a month keeps most people on track. For injury recovery or chronic pain, weekly or biweekly sessions are the clinical sweet spot. Athletes and high-stress workers usually land between every two weeks and weekly.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Maintenance for healthy adults: every 4–8 weeks",
            "Injury recovery or chronic pain: weekly or biweekly, in a short series of 3–8 sessions",
            "Athletes and high-stress jobs: every 2–4 weeks",
            "Allow at least 48 hours between deep tissue sessions",
            "Benefits build on each other — consistency matters more than intensity"
          ]
        },
        {
          "h": "What determines how often you need a massage?",
          "p": "There are no standard guidelines for how many massages you can get, but a massage therapist or doctor can recommend a frequency that fits your needs. It always comes down to your personal situation — lifestyle, daily habits, overall health, occupation, and budget all factor in."
        },
        {
          "p": "The biggest variable is your goal. Massages for injury are typically more frequent, while massages for relaxation can happen less often. If you're chasing a specific outcome — pain relief, better sleep, faster recovery — your schedule needs to be tighter than someone who just wants to decompress."
        },
        {
          "h": "How often for general relaxation and stress relief?",
          "p": "For general relaxation, every two to four weeks is a comfortable rhythm. A monthly massage brings a real range of benefits — reduced stress, more energy, and relief from muscle tension — and keeps you feeling grounded between sessions."
        },
        {
          "p": "If you're specifically targeting stress and anxiety, going more often early on helps. Physical touch and massage can relieve feelings of anxiety and loneliness by reducing cortisol levels. Starting with a tighter cadence for a few weeks helps interrupt the body's stress-holding patterns before you taper to maintenance."
        },
        {
          "h": "How often for injury recovery and chronic pain?",
          "p": "If you're dealing with aches and pains from an injury or something chronic, weekly massage helps get you back on track. For pain relief after an injury, it's most often used more frequently at first — once or twice per week — tapering to once a week or every other week through recovery."
        },
        {
          "p": "When dealing with active pain, aim for a short series spaced no more than two weeks apart. Most clients need 3–8 sessions to reset dysfunctional patterns and restore movement. A practical gauge: if pain returns within a few days, it's time to go back; if you're pain-free a week later, start adding time between sessions. For chronic conditions, once a week is the typical starting point depending on how your body responds."
        },
        {
          "p": "One hard rule: it takes a good 48 hours for the system to rebalance after a deep massage, so leave at least a two-day gap between deep tissue sessions. Massage stimulates blood flow, which helps muscles and joints recover faster."
        },
        {
          "h": "How often for athletes?",
          "p": "Competitive athletes often go one to two times a week. The common recommendation is bi-weekly massage to loosen tight muscles, increase flexibility, and keep you on top of your training — scaling up to weekly around an event or competition for a speedier recovery."
        },
        {
          "h": "The maintenance zone: what's enough to stay pain-free?",
          "p": "For most healthy adults, every 4–8 weeks is enough to stay pain-free. For people with high-stress jobs or intense workout schedules, every 2–4 weeks works better. Relaxation massage is lighter and less invasive than sports massage, so it can be tolerated more often — as often as you find useful."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can you get a massage too often?",
          "a": "For deep tissue work, yes — your body needs at least 48 hours between sessions to rebalance. Lighter relaxation massage can be done more frequently based on what your body tolerates."
        },
        {
          "q": "How many sessions do you need to feel results?",
          "a": "For active pain or injury, most people need 3–8 sessions to reset dysfunctional patterns. For general maintenance, you may feel the benefit after the first session."
        },
        {
          "q": "What's the minimum effective frequency?",
          "a": "If you're not chasing a specific outcome, once a month is a solid baseline. Budget-conscious? Stretching to every 4–8 weeks still gives meaningful maintenance for healthy adults with lower physical demand."
        },
        {
          "q": "How soon after an injury can you get a massage?",
          "a": "Work with your therapist or doctor on timing. Early recovery often means frequent sessions — once or twice a week — that taper as you heal, supporting recovery without overtaxing the injured area."
        }
      ]
    }
  },
  "24": {
    "en": {
      "dek": "An ingrown hair is a strand of hair that grows back into your skin after shaving, tweezing, or waxing. It happens when the hair gets trapped and curls back into the skin instead of growing outward, showing up as raised, itchy bumps — more likely if you have thick, curly, or coarse hair. Most clear up on their own within one to two weeks, but a few simple steps speed things along and keep them from coming back.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Ingrown hairs happen when trapped hair curls back into the skin",
            "Gentle exfoliation and warm compresses help release them",
            "Don't pick or pop them — that risks infection and scarring",
            "Shave in the direction of growth and keep skin moisturized to prevent them",
            "See a dermatologist if one becomes painful, warm, or red"
          ]
        },
        {
          "h": "What does an ingrown hair look like?",
          "p": "An ingrown hair can look like a tiny, flesh-colored bump, or sometimes a black spot just under your skin. If it gets irritated, the bump can grow bigger and turn pink or red, resembling a pimple. On lighter skin the bumps may look red; on black or brown skin the redness can be harder to see, but the bump may look a different color than the surrounding skin."
        },
        {
          "p": "The usual trigger is hair removal — shaving, waxing, tweezing, plucking, or threading can all cause ingrown hairs. You're more likely to get them if you have coarse or curly hair."
        },
        {
          "h": "How to get rid of an ingrown hair at home"
        },
        {
          "h": "Apply a warm compress",
          "p": "Warm compresses open your pores and make it easier for the trapped hair to release. Press one on the spot and move it in gentle circles for 5 to 10 minutes."
        },
        {
          "h": "Gently exfoliate",
          "p": "Exfoliation removes the dead skin cells blocking the hair from growing out. Use warm — not hot — water and small, circular motions with a washcloth, exfoliating brush, or a gentle scrub. Sloughing off that outer layer helps the hair grow out properly instead of curling back in."
        },
        {
          "h": "Try to release the hair",
          "p": "If the compress and exfoliation don't work, you can gently pull out a hair that's looped or curled back into the skin using a sterile needle, pin, or tweezers — then apply rubbing alcohol to the surrounding skin to prevent infection. If the hair doesn't come out easily, leave it alone for at least a few days. Don't dig for it."
        },
        {
          "h": "Keep skin moisturized",
          "p": "Keep your skin soft and elastic with a moisturizing lotion or oil, especially after exfoliating. Dryness worsens irritation and raises the risk of more ingrowns."
        },
        {
          "h": "What NOT to do",
          "p": "Don't pick at, scratch, or pop your ingrown hairs. Popping one exposes the follicle to bacteria, which can lead to infection or scarring."
        },
        {
          "h": "How to prevent ingrown hairs"
        },
        {
          "h": "Change your shaving routine",
          "p": "Shave in the direction of hair growth to minimize the risk of hair curling back into the skin. Use a good shaving cream to reduce friction and protect the skin, and replace your razor regularly — a dull blade makes hair grow back incorrectly."
        },
        {
          "h": "Exfoliate before hair removal",
          "p": "Exfoliating before you shave or wax lowers the risk of hairs getting trapped. Use a gentle scrub with fine granules, or a chemical exfoliant like glycolic or salicylic acid."
        },
        {
          "h": "Keep skin moisturized",
          "p": "Hydrated skin keeps its elasticity, which reduces the chance of hairs becoming trapped."
        },
        {
          "h": "Wear loose clothing",
          "p": "Tight clothes irritate the skin and can cause ingrown hairs — go for loose-fitting garments, especially right after shaving or waxing."
        },
        {
          "h": "Reconsider your hair removal method",
          "p": "Wax strips remove hair from the root for longer-lasting smoothness. If you shave, an electric shaver held just above the skin avoids the close cuts that lead to ingrowns."
        },
        {
          "h": "When to see a doctor",
          "p": "If an ingrown hair hurts to the touch, feels warm, or looks red, see a dermatologist. They may prescribe an antibiotic for infection, or a retinoid to help clear dead skin and prevent recurrence."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How long does an ingrown hair take to go away?",
          "a": "Most heal on their own within one to two weeks as the hair grows out and releases from the skin. The home steps above can speed that up."
        },
        {
          "q": "Can I pop an ingrown hair?",
          "a": "No. Popping it exposes the follicle to bacteria and risks infection or scarring. If it won't release on its own, leave it alone for a few days and keep the area exfoliated."
        },
        {
          "q": "Why do I keep getting ingrown hairs in the same spot?",
          "a": "Coarse or curly hair in high-friction areas (bikini line, neck, underarms) is most prone. Consistent exfoliation, shaving with the grain, and looser clothing in those areas usually breaks the cycle. If it persists, a dermatologist can help."
        },
        {
          "q": "Does waxing cause more ingrowns than shaving?",
          "a": "Both can cause them. Waxing pulls from the root so regrowth is slower, but the regrowing hair can still curl back in. Exfoliating between sessions is the key prevention either way."
        },
        {
          "q": "When should I worry about an ingrown hair?",
          "a": "If it's painful, warm, swollen, or filled with pus, it may be infected — see a dermatologist rather than treating it at home."
        }
      ]
    },
    "es": {
      "dek": "An ingrown hair is a strand of hair that grows back into your skin after shaving, tweezing, or waxing. It happens when the hair gets trapped and curls back into the skin instead of growing outward, showing up as raised, itchy bumps — more likely if you have thick, curly, or coarse hair. Most clear up on their own within one to two weeks, but a few simple steps speed things along and keep them from coming back.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Ingrown hairs happen when trapped hair curls back into the skin",
            "Gentle exfoliation and warm compresses help release them",
            "Don't pick or pop them — that risks infection and scarring",
            "Shave in the direction of growth and keep skin moisturized to prevent them",
            "See a dermatologist if one becomes painful, warm, or red"
          ]
        },
        {
          "h": "What does an ingrown hair look like?",
          "p": "An ingrown hair can look like a tiny, flesh-colored bump, or sometimes a black spot just under your skin. If it gets irritated, the bump can grow bigger and turn pink or red, resembling a pimple. On lighter skin the bumps may look red; on black or brown skin the redness can be harder to see, but the bump may look a different color than the surrounding skin."
        },
        {
          "p": "The usual trigger is hair removal — shaving, waxing, tweezing, plucking, or threading can all cause ingrown hairs. You're more likely to get them if you have coarse or curly hair."
        },
        {
          "h": "How to get rid of an ingrown hair at home"
        },
        {
          "h": "Apply a warm compress",
          "p": "Warm compresses open your pores and make it easier for the trapped hair to release. Press one on the spot and move it in gentle circles for 5 to 10 minutes."
        },
        {
          "h": "Gently exfoliate",
          "p": "Exfoliation removes the dead skin cells blocking the hair from growing out. Use warm — not hot — water and small, circular motions with a washcloth, exfoliating brush, or a gentle scrub. Sloughing off that outer layer helps the hair grow out properly instead of curling back in."
        },
        {
          "h": "Try to release the hair",
          "p": "If the compress and exfoliation don't work, you can gently pull out a hair that's looped or curled back into the skin using a sterile needle, pin, or tweezers — then apply rubbing alcohol to the surrounding skin to prevent infection. If the hair doesn't come out easily, leave it alone for at least a few days. Don't dig for it."
        },
        {
          "h": "Keep skin moisturized",
          "p": "Keep your skin soft and elastic with a moisturizing lotion or oil, especially after exfoliating. Dryness worsens irritation and raises the risk of more ingrowns."
        },
        {
          "h": "What NOT to do",
          "p": "Don't pick at, scratch, or pop your ingrown hairs. Popping one exposes the follicle to bacteria, which can lead to infection or scarring."
        },
        {
          "h": "How to prevent ingrown hairs"
        },
        {
          "h": "Change your shaving routine",
          "p": "Shave in the direction of hair growth to minimize the risk of hair curling back into the skin. Use a good shaving cream to reduce friction and protect the skin, and replace your razor regularly — a dull blade makes hair grow back incorrectly."
        },
        {
          "h": "Exfoliate before hair removal",
          "p": "Exfoliating before you shave or wax lowers the risk of hairs getting trapped. Use a gentle scrub with fine granules, or a chemical exfoliant like glycolic or salicylic acid."
        },
        {
          "h": "Keep skin moisturized",
          "p": "Hydrated skin keeps its elasticity, which reduces the chance of hairs becoming trapped."
        },
        {
          "h": "Wear loose clothing",
          "p": "Tight clothes irritate the skin and can cause ingrown hairs — go for loose-fitting garments, especially right after shaving or waxing."
        },
        {
          "h": "Reconsider your hair removal method",
          "p": "Wax strips remove hair from the root for longer-lasting smoothness. If you shave, an electric shaver held just above the skin avoids the close cuts that lead to ingrowns."
        },
        {
          "h": "When to see a doctor",
          "p": "If an ingrown hair hurts to the touch, feels warm, or looks red, see a dermatologist. They may prescribe an antibiotic for infection, or a retinoid to help clear dead skin and prevent recurrence."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How long does an ingrown hair take to go away?",
          "a": "Most heal on their own within one to two weeks as the hair grows out and releases from the skin. The home steps above can speed that up."
        },
        {
          "q": "Can I pop an ingrown hair?",
          "a": "No. Popping it exposes the follicle to bacteria and risks infection or scarring. If it won't release on its own, leave it alone for a few days and keep the area exfoliated."
        },
        {
          "q": "Why do I keep getting ingrown hairs in the same spot?",
          "a": "Coarse or curly hair in high-friction areas (bikini line, neck, underarms) is most prone. Consistent exfoliation, shaving with the grain, and looser clothing in those areas usually breaks the cycle. If it persists, a dermatologist can help."
        },
        {
          "q": "Does waxing cause more ingrowns than shaving?",
          "a": "Both can cause them. Waxing pulls from the root so regrowth is slower, but the regrowing hair can still curl back in. Exfoliating between sessions is the key prevention either way."
        },
        {
          "q": "When should I worry about an ingrown hair?",
          "a": "If it's painful, warm, swollen, or filled with pus, it may be infected — see a dermatologist rather than treating it at home."
        }
      ]
    }
  },
  "25": {
    "en": {
      "dek": "Blackheads are clogged pores that look dark because the trapped oil and dead skin cells oxidize from air exposure — not because your skin is dirty. You can treat most of them at home with salicylic acid, retinoids, and gentle exfoliation. Deep, stubborn ones are safest removed by a dermatologist or medical aesthetician.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Salicylic acid cleansers are the first-line at-home treatment",
            "Retinoids prevent new blackheads by speeding skin cell turnover",
            "Never squeeze blackheads at home — you risk scarring and infection",
            "Oil-free, noncomedogenic products help prevent future clogs",
            "Professional extraction is the safest option for deep blackheads"
          ]
        },
        {
          "h": "What are blackheads?",
          "p": "Blackheads are small, dark spots that form when pores clog with excess oil and dead skin cells, then oxidize from air exposure. They're open comedones — the pore opening dilates, exposing its contents to the air, which is what turns the plug dark. They show up most on the nose, chin, and forehead."
        },
        {
          "p": "The dark color doesn't mean your skin is dirty — it's just oxygen reacting with oil and dead cells in the pore. The nose has more oil glands than other parts of the face, which is why it's especially prone."
        },
        {
          "h": "What causes blackheads?",
          "p": "Blackheads form when excess oil mixes with dead skin cells and clogs the pore, and people prone to them tend to produce more sebum. Genetics play a role too — one study put the chance of inheriting acne risk through genes at around 80%."
        },
        {
          "p": "Outside factors add to it: ingredients in hair, makeup, and skincare products can be comedogenic and clog pores, and oil- or alcohol-based cleansers can make things worse. Picking at them only makes blackheads more painful and noticeable."
        },
        {
          "h": "How to treat blackheads at home"
        },
        {
          "h": "Salicylic acid cleansers",
          "p": "Salicylic acid is the first-line home treatment — it dissolves dead skin cells to keep follicles from clogging. Products range from 0.5% to 5% strength; a cleanser with 0.5–2% used once or twice daily is the sweet spot for most people."
        },
        {
          "h": "Retinoids",
          "p": "Retinoids break up blackheads and help prevent new clogged pores by increasing cellular renewal and generating a fresher skin layer. Start with two or three nights a week, a pea-sized amount for the whole face. Most retinoids are prescription, but adapalene is available over the counter."
        },
        {
          "h": "Benzoyl peroxide",
          "p": "Benzoyl peroxide targets surface bacteria — but blackheads don't contain bacteria, so it may or may not help. If you use it, a 2.5–5% cleanser left on for 1–2 minutes then rinsed well is the standard approach."
        },
        {
          "h": "Chemical exfoliants",
          "p": "Chemical exfoliants remove the dead skin cells that clog pores. Glycolic acid gently exfoliates to prevent blackheads from forming, niacinamide helps control oil, and BHAs penetrate the pore to break down the plug."
        },
        {
          "h": "At-home scrubs",
          "p": "Gentle physical options can help in a pinch:"
        },
        {
          "bullets": [
            "Sugar or salt scrub: wet your face, massage into affected areas in small circles for up to 30 seconds, then rinse.",
            "Wet green tea leaves: mix dry leaves with water and massage in for up to 30 seconds to help reduce oil, then rinse.",
            "Pore strips: use sparingly — they can irritate the skin."
          ]
        },
        {
          "h": "When to see a professional",
          "p": "Deep blackheads are best removed by a dermatologist or medical aesthetician, who uses a small tool with rigid metal loops — a comedo extractor — to apply even pressure. That's the safest method for the stubborn ones."
        },
        {
          "p": "Whatever you do, don't squeeze at home: squeezing pushes debris deeper, causing inflammation, infection, and scarring. And there's no harm in simply leaving blackheads alone if you'd rather not treat them."
        },
        {
          "h": "How to prevent blackheads",
          "bullets": [
            "Use oil-free, noncomedogenic moisturizers",
            "Avoid oil-based and alcohol-based cleansers",
            "Cleanse regularly with salicylic acid",
            "Use a retinoid to maintain cell turnover",
            "Always remove makeup before bed",
            "Skip pore-clogging hair and skincare products"
          ]
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I squeeze blackheads at home?",
          "a": "No. Squeezing pushes debris deeper, risking inflammation, infection, and scarring. Deep blackheads should be extracted by a professional with the right tool."
        },
        {
          "q": "Do blackheads mean my skin is dirty?",
          "a": "No. The dark color is oxidation — oxygen reacting with oil and dead cells inside the pore. Blackheads are a form of acne, not a hygiene problem, and over-scrubbing to 'clean' them usually backfires."
        },
        {
          "q": "How fast will treatment work?",
          "a": "Salicylic acid and retinoids work gradually — expect a few weeks of consistent use before real change, and longer to prevent new ones. Piling on products faster just irritates the skin barrier."
        },
        {
          "q": "Are pore strips worth it?",
          "a": "They lift surface blackheads temporarily but don't stop new ones forming, and frequent use irritates skin. Treat them as an occasional touch-up, not a routine."
        },
        {
          "q": "What's the single best prevention habit?",
          "a": "Consistency with a salicylic acid cleanser plus a nightly retinoid does more than any one-off treatment. Pair it with noncomedogenic products and removing makeup before bed."
        }
      ]
    },
    "es": {
      "dek": "Blackheads are clogged pores that look dark because the trapped oil and dead skin cells oxidize from air exposure — not because your skin is dirty. You can treat most of them at home with salicylic acid, retinoids, and gentle exfoliation. Deep, stubborn ones are safest removed by a dermatologist or medical aesthetician.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Salicylic acid cleansers are the first-line at-home treatment",
            "Retinoids prevent new blackheads by speeding skin cell turnover",
            "Never squeeze blackheads at home — you risk scarring and infection",
            "Oil-free, noncomedogenic products help prevent future clogs",
            "Professional extraction is the safest option for deep blackheads"
          ]
        },
        {
          "h": "What are blackheads?",
          "p": "Blackheads are small, dark spots that form when pores clog with excess oil and dead skin cells, then oxidize from air exposure. They're open comedones — the pore opening dilates, exposing its contents to the air, which is what turns the plug dark. They show up most on the nose, chin, and forehead."
        },
        {
          "p": "The dark color doesn't mean your skin is dirty — it's just oxygen reacting with oil and dead cells in the pore. The nose has more oil glands than other parts of the face, which is why it's especially prone."
        },
        {
          "h": "What causes blackheads?",
          "p": "Blackheads form when excess oil mixes with dead skin cells and clogs the pore, and people prone to them tend to produce more sebum. Genetics play a role too — one study put the chance of inheriting acne risk through genes at around 80%."
        },
        {
          "p": "Outside factors add to it: ingredients in hair, makeup, and skincare products can be comedogenic and clog pores, and oil- or alcohol-based cleansers can make things worse. Picking at them only makes blackheads more painful and noticeable."
        },
        {
          "h": "How to treat blackheads at home"
        },
        {
          "h": "Salicylic acid cleansers",
          "p": "Salicylic acid is the first-line home treatment — it dissolves dead skin cells to keep follicles from clogging. Products range from 0.5% to 5% strength; a cleanser with 0.5–2% used once or twice daily is the sweet spot for most people."
        },
        {
          "h": "Retinoids",
          "p": "Retinoids break up blackheads and help prevent new clogged pores by increasing cellular renewal and generating a fresher skin layer. Start with two or three nights a week, a pea-sized amount for the whole face. Most retinoids are prescription, but adapalene is available over the counter."
        },
        {
          "h": "Benzoyl peroxide",
          "p": "Benzoyl peroxide targets surface bacteria — but blackheads don't contain bacteria, so it may or may not help. If you use it, a 2.5–5% cleanser left on for 1–2 minutes then rinsed well is the standard approach."
        },
        {
          "h": "Chemical exfoliants",
          "p": "Chemical exfoliants remove the dead skin cells that clog pores. Glycolic acid gently exfoliates to prevent blackheads from forming, niacinamide helps control oil, and BHAs penetrate the pore to break down the plug."
        },
        {
          "h": "At-home scrubs",
          "p": "Gentle physical options can help in a pinch:"
        },
        {
          "bullets": [
            "Sugar or salt scrub: wet your face, massage into affected areas in small circles for up to 30 seconds, then rinse.",
            "Wet green tea leaves: mix dry leaves with water and massage in for up to 30 seconds to help reduce oil, then rinse.",
            "Pore strips: use sparingly — they can irritate the skin."
          ]
        },
        {
          "h": "When to see a professional",
          "p": "Deep blackheads are best removed by a dermatologist or medical aesthetician, who uses a small tool with rigid metal loops — a comedo extractor — to apply even pressure. That's the safest method for the stubborn ones."
        },
        {
          "p": "Whatever you do, don't squeeze at home: squeezing pushes debris deeper, causing inflammation, infection, and scarring. And there's no harm in simply leaving blackheads alone if you'd rather not treat them."
        },
        {
          "h": "How to prevent blackheads",
          "bullets": [
            "Use oil-free, noncomedogenic moisturizers",
            "Avoid oil-based and alcohol-based cleansers",
            "Cleanse regularly with salicylic acid",
            "Use a retinoid to maintain cell turnover",
            "Always remove makeup before bed",
            "Skip pore-clogging hair and skincare products"
          ]
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I squeeze blackheads at home?",
          "a": "No. Squeezing pushes debris deeper, risking inflammation, infection, and scarring. Deep blackheads should be extracted by a professional with the right tool."
        },
        {
          "q": "Do blackheads mean my skin is dirty?",
          "a": "No. The dark color is oxidation — oxygen reacting with oil and dead cells inside the pore. Blackheads are a form of acne, not a hygiene problem, and over-scrubbing to 'clean' them usually backfires."
        },
        {
          "q": "How fast will treatment work?",
          "a": "Salicylic acid and retinoids work gradually — expect a few weeks of consistent use before real change, and longer to prevent new ones. Piling on products faster just irritates the skin barrier."
        },
        {
          "q": "Are pore strips worth it?",
          "a": "They lift surface blackheads temporarily but don't stop new ones forming, and frequent use irritates skin. Treat them as an occasional touch-up, not a routine."
        },
        {
          "q": "What's the single best prevention habit?",
          "a": "Consistency with a salicylic acid cleanser plus a nightly retinoid does more than any one-off treatment. Pair it with noncomedogenic products and removing makeup before bed."
        }
      ]
    }
  },
  "26": {
    "en": {
      "dek": "Balayage is low-maintenance by design, but it still needs maintenance. With the right aftercare — starting in the 48 hours right after your appointment — you can stretch a fresh balayage from about 12 weeks to a full 4–5 months. Here's how to make it last.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Wait 48 hours before washing so the color seals",
            "Wash only 2–3 times a week with sulfate-free shampoo",
            "Rinse cool, protect from heat and UV, and pre-soak before pools",
            "A gloss or toner at 6–8 weeks neutralizes brassiness and extends tone",
            "Trim every 8–12 weeks and plan a refresh around 3–4 months"
          ]
        },
        {
          "h": "What makes balayage fade?",
          "p": "The main culprits are sulfate shampoo, hard water, heat styling without protection, and UV exposure. In the Valley, hard water and relentless sun are hard to avoid — so the rest of this guide focuses on what you can control."
        },
        {
          "h": "The first 48 hours",
          "p": "Give the color 48 hours to fully oxidize and seal into the hair shaft. Don't wash, don't sweat it out at the gym, don't swim. That window is non-negotiable if you want the pigment to settle right."
        },
        {
          "h": "How often should you wash?",
          "p": "Wash your balayage 2–3 times a week — every wash is color escaping down the drain, so washing less often is the single most effective way to slow fading. When you need to stretch a day, dry shampoo buys you time. Spray it in before work and you're good until lunch."
        },
        {
          "h": "Switch to sulfate-free shampoo",
          "p": "Standard shampoos contain sulfates that strip color. Research published in the Journal of Cosmetic Science found that sulfate shampoos can cause significant color fading after just a few washes, as the sulfates penetrate the cuticle and strip color molecules along with dirt and oil. Choose sulfate-free, color-safe formulas instead."
        },
        {
          "p": "What to look for on the label:"
        },
        {
          "bullets": [
            "Sulfate-free",
            "Color-safe",
            "Bond-repair technology",
            "pH-balanced"
          ]
        },
        {
          "h": "Rinse with cooler water",
          "p": "Hot water opens the hair cuticle and lets color escape; cooler water seals the cuticle, reduces brassiness, and keeps the smooth, reflective finish. If you can't manage a full cold rinse, at least finish with 30 seconds of cool. Your Tía has been saying this for years — she was right."
        },
        {
          "h": "Don't skip heat protectant",
          "p": "Excessive heat styling can cut color retention by as much as 25%. Never skip heat protectant — think of it as SPF for your hair. You don't need 400°F: start at 300°F and only go higher if you have to. Air dry whenever you can, and keep heat tools on low settings."
        },
        {
          "h": "Protect it from the RGV sun",
          "p": "Texas sun is the fastest way to turn a beautiful balayage brassy — UV breaks down the color molecules that keep your tone cool and dimensional. Use UV-protective products and wear a hat anytime you'll be outside for a few hours. At the farmers market on Nolana, at the kids' soccer games on Conway — hat on, balayage intact."
        },
        {
          "h": "Chlorine and pool water",
          "p": "Before you jump in, soak your hair with clean water. Wet hair absorbs less chlorine than dry hair — a five-minute trick that saves you an emergency gloss."
        },
        {
          "h": "When to get a gloss or toner refresh",
          "p": "A gloss or toner refresh at the 6-to-8-week mark neutralizes warmth and restores your tone without re-lightening, and it's what stretches a balayage from ~12 weeks to 4–5 months. Using professional-grade products at home prolongs the time between salon visits."
        },
        {
          "p": "For brassiness between glosses, purple shampoo acts as a toner to pull brassy tones back to a cooler blonde:"
        },
        {
          "bullets": [
            "Bright blondes: 1–2 times a week",
            "Beige balayage: every 1–2 weeks"
          ]
        },
        {
          "h": "Bond repair and deep conditioning",
          "p": "Lightened hair weakens over time, especially with repeated coloring or heat. Bond-repair treatments strengthen the hair structure, reduce breakage, and improve how long your balayage lasts. Pair that with a weekly deep-conditioning treatment to restore moisture and shine."
        },
        {
          "h": "How your hair type affects longevity",
          "p": "Your starting hair changes the math:"
        },
        {
          "bullets": [
            "Thickness: Thicker, denser strands hold pigment longer than fine hair.",
            "Porosity: High-porosity hair takes color fast but loses it fast; low-porosity hair colors slowly but holds longer.",
            "Target shade: Going much lighter than your natural color needs more lifting, which fades faster; darker shades fade more slowly."
          ]
        },
        {
          "h": "How often to trim and refresh",
          "p": "Trim every 8–12 weeks to prevent split ends and keep the color looking healthy through grow-out. As for the color itself, most people only need a balayage touch-up every 3–4 months, and with good home care you can often stretch to 4 months between salon visits."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I wash my hair every day after balayage?",
          "a": "No. Wash 2–3 times a week — washing less is the single most effective way to slow fading. Dry shampoo covers the in-between days."
        },
        {
          "q": "Does hard water affect balayage in the Valley?",
          "a": "Yes — it's one of the main fade culprits alongside sulfates and UV. A shower filter helps, and sulfate-free products offset some of the damage."
        },
        {
          "q": "How many weeks until I need a gloss?",
          "a": "A gloss or toner at 6–8 weeks neutralizes warmth and refreshes tone without re-lightening, stretching your balayage toward 4–5 months total."
        },
        {
          "q": "Is heat protectant really necessary every time?",
          "a": "Every time. Excessive heat styling can cut color retention by about 25%. Start at 300°F and only go hotter if you must."
        },
        {
          "q": "How do I fight brassiness between appointments?",
          "a": "Purple shampoo — 1–2 times a week for bright blondes, every 1–2 weeks for beige tones. It works like a toner to pull warmth back to a cooler shade."
        }
      ]
    },
    "es": {
      "dek": "Balayage is low-maintenance by design, but it still needs maintenance. With the right aftercare — starting in the 48 hours right after your appointment — you can stretch a fresh balayage from about 12 weeks to a full 4–5 months. Here's how to make it last.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Wait 48 hours before washing so the color seals",
            "Wash only 2–3 times a week with sulfate-free shampoo",
            "Rinse cool, protect from heat and UV, and pre-soak before pools",
            "A gloss or toner at 6–8 weeks neutralizes brassiness and extends tone",
            "Trim every 8–12 weeks and plan a refresh around 3–4 months"
          ]
        },
        {
          "h": "What makes balayage fade?",
          "p": "The main culprits are sulfate shampoo, hard water, heat styling without protection, and UV exposure. In the Valley, hard water and relentless sun are hard to avoid — so the rest of this guide focuses on what you can control."
        },
        {
          "h": "The first 48 hours",
          "p": "Give the color 48 hours to fully oxidize and seal into the hair shaft. Don't wash, don't sweat it out at the gym, don't swim. That window is non-negotiable if you want the pigment to settle right."
        },
        {
          "h": "How often should you wash?",
          "p": "Wash your balayage 2–3 times a week — every wash is color escaping down the drain, so washing less often is the single most effective way to slow fading. When you need to stretch a day, dry shampoo buys you time. Spray it in before work and you're good until lunch."
        },
        {
          "h": "Switch to sulfate-free shampoo",
          "p": "Standard shampoos contain sulfates that strip color. Research published in the Journal of Cosmetic Science found that sulfate shampoos can cause significant color fading after just a few washes, as the sulfates penetrate the cuticle and strip color molecules along with dirt and oil. Choose sulfate-free, color-safe formulas instead."
        },
        {
          "p": "What to look for on the label:"
        },
        {
          "bullets": [
            "Sulfate-free",
            "Color-safe",
            "Bond-repair technology",
            "pH-balanced"
          ]
        },
        {
          "h": "Rinse with cooler water",
          "p": "Hot water opens the hair cuticle and lets color escape; cooler water seals the cuticle, reduces brassiness, and keeps the smooth, reflective finish. If you can't manage a full cold rinse, at least finish with 30 seconds of cool. Your Tía has been saying this for years — she was right."
        },
        {
          "h": "Don't skip heat protectant",
          "p": "Excessive heat styling can cut color retention by as much as 25%. Never skip heat protectant — think of it as SPF for your hair. You don't need 400°F: start at 300°F and only go higher if you have to. Air dry whenever you can, and keep heat tools on low settings."
        },
        {
          "h": "Protect it from the RGV sun",
          "p": "Texas sun is the fastest way to turn a beautiful balayage brassy — UV breaks down the color molecules that keep your tone cool and dimensional. Use UV-protective products and wear a hat anytime you'll be outside for a few hours. At the farmers market on Nolana, at the kids' soccer games on Conway — hat on, balayage intact."
        },
        {
          "h": "Chlorine and pool water",
          "p": "Before you jump in, soak your hair with clean water. Wet hair absorbs less chlorine than dry hair — a five-minute trick that saves you an emergency gloss."
        },
        {
          "h": "When to get a gloss or toner refresh",
          "p": "A gloss or toner refresh at the 6-to-8-week mark neutralizes warmth and restores your tone without re-lightening, and it's what stretches a balayage from ~12 weeks to 4–5 months. Using professional-grade products at home prolongs the time between salon visits."
        },
        {
          "p": "For brassiness between glosses, purple shampoo acts as a toner to pull brassy tones back to a cooler blonde:"
        },
        {
          "bullets": [
            "Bright blondes: 1–2 times a week",
            "Beige balayage: every 1–2 weeks"
          ]
        },
        {
          "h": "Bond repair and deep conditioning",
          "p": "Lightened hair weakens over time, especially with repeated coloring or heat. Bond-repair treatments strengthen the hair structure, reduce breakage, and improve how long your balayage lasts. Pair that with a weekly deep-conditioning treatment to restore moisture and shine."
        },
        {
          "h": "How your hair type affects longevity",
          "p": "Your starting hair changes the math:"
        },
        {
          "bullets": [
            "Thickness: Thicker, denser strands hold pigment longer than fine hair.",
            "Porosity: High-porosity hair takes color fast but loses it fast; low-porosity hair colors slowly but holds longer.",
            "Target shade: Going much lighter than your natural color needs more lifting, which fades faster; darker shades fade more slowly."
          ]
        },
        {
          "h": "How often to trim and refresh",
          "p": "Trim every 8–12 weeks to prevent split ends and keep the color looking healthy through grow-out. As for the color itself, most people only need a balayage touch-up every 3–4 months, and with good home care you can often stretch to 4 months between salon visits."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can I wash my hair every day after balayage?",
          "a": "No. Wash 2–3 times a week — washing less is the single most effective way to slow fading. Dry shampoo covers the in-between days."
        },
        {
          "q": "Does hard water affect balayage in the Valley?",
          "a": "Yes — it's one of the main fade culprits alongside sulfates and UV. A shower filter helps, and sulfate-free products offset some of the damage."
        },
        {
          "q": "How many weeks until I need a gloss?",
          "a": "A gloss or toner at 6–8 weeks neutralizes warmth and refreshes tone without re-lightening, stretching your balayage toward 4–5 months total."
        },
        {
          "q": "Is heat protectant really necessary every time?",
          "a": "Every time. Excessive heat styling can cut color retention by about 25%. Start at 300°F and only go hotter if you must."
        },
        {
          "q": "How do I fight brassiness between appointments?",
          "a": "Purple shampoo — 1–2 times a week for bright blondes, every 1–2 weeks for beige tones. It works like a toner to pull warmth back to a cooler shade."
        }
      ]
    }
  },
  "27": {
    "en": {
      "dek": "Most adults should get a haircut every 4 to 8 weeks — but the right number depends heavily on your length, texture, and how much chemical processing your hair has been through.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Short styles (pixie, fade) need trimming every 3–5 weeks to hold their shape",
            "Medium-length hair holds up 6–8 weeks between appointments",
            "Long hair can stretch 8–12 weeks, longer if you're growing it out",
            "Curly and textured hair does best every 6–10 weeks",
            "Split ends spread — no product reverses them, so timing matters"
          ]
        },
        {
          "h": "Why timing actually matters",
          "p": "Split ends don't stop at the tip. Once the ends split, the break travels up the shaft, causing breakage that makes your hair look thinner and shorter overall — and there's no magic potion that reverses split ends. By the time the damage shows, you often end up cutting off more than you planned. Waiting too long doesn't save money; it costs more later when you're reviving a shape that's lost its structure."
        },
        {
          "h": "Haircut frequency by length"
        },
        {
          "h": "Short hair (pixie, fade, buzzcut)",
          "p": "Short styles need the most attention because shape defines their impact — pixie cuts and fades lose structure fast, so most clients visit every 3 to 5 weeks. Clipper cuts like fades and tapers need fresh edges about every 3 weeks to stay sharp."
        },
        {
          "h": "Medium-length hair",
          "p": "Medium styles allow more flexibility — these shapes usually last 6 to 8 weeks. You can stretch toward 8–10 weeks if you're not fighting split ends."
        },
        {
          "h": "Long hair",
          "p": "Long hair needs less maintenance than shorter styles. Many clients wait 8 to 12 weeks, though a trim every 6–8 weeks keeps split ends at bay if your ends are prone to them."
        },
        {
          "h": "Haircut frequency by texture"
        },
        {
          "h": "Curly and textured hair",
          "p": "Curls can disguise uneven ends, but without maintenance, dryness and breakage build. Visiting every 6 to 10 weeks maintains curl definition and makes styling easier."
        },
        {
          "h": "Fine hair",
          "p": "Fine hair shows regrowth faster and loses shape sooner — medium-length fine hair every 6 to 8 weeks, long fine hair 8 to 12 weeks."
        },
        {
          "h": "Thick or coarse hair",
          "p": "Thick hair holds a style longer but still needs attention at the ends. The same general bands apply, though you may push closer to 10–12 weeks if your ends are holding up."
        },
        {
          "h": "When your hair needs more frequent trims",
          "p": "Some situations call for shorter intervals:"
        },
        {
          "bullets": [
            "Split-end-prone or damaged hair: every 4–6 weeks.",
            "Bangs or fringe: every 2–4 weeks, since they grow fast and frame your face.",
            "Chemically treated hair: color, lightening, and chemical treatments open the cuticle and increase vulnerability, so trims every 4 to 6 weeks help. If you also heat-style colored hair, every 6 to 8 weeks protects it from both stressors."
          ]
        },
        {
          "h": "Trim vs. cut: what's the difference?",
          "p": "A trim takes off an inch or two at the ends; a cut is more drastic, with two to three inches or more chopped off. A trim usually removes about ¼ to ½ inch to clean up split ends and maintain your shape. Getting it done by a professional ensures an even result customized to your face shape and hair health — when you trim your own hair, you tend to miss split ends or leave your length uneven."
        },
        {
          "h": "Can you skip the salon?",
          "p": "The frequency that's right for you depends on your cut, texture, lifestyle, and grooming habits. When you skip haircuts, weakness builds gradually, and by the time it's noticeable you end up cutting off more than you planned. If your hair is healthy and strong, you can sometimes stretch to every 10 to 12 weeks — but if you're growing it out, never exceed 12 weeks between trims."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How often should I get a haircut if I'm growing it out?",
          "a": "Stretch to 8–12 weeks between trims, but never exceed 12 weeks — split ends travel up the shaft and cost you more length in the long run."
        },
        {
          "q": "Does cutting hair make it grow faster?",
          "a": "Not directly, but trims prevent breakage at the ends. Less breakage means your hair looks longer and fuller over time."
        },
        {
          "q": "What if I can't afford to go every 6 weeks?",
          "a": "If your hair is healthy, you can often stretch to 10–12 weeks. Just watch for split ends — once they show up, book a trim."
        },
        {
          "q": "Do curly-haired people really need trims as often?",
          "a": "Yes. Curly hair hides uneven ends visually, but dryness and breakage still happen underneath. Every 6 to 10 weeks keeps curls defined."
        },
        {
          "q": "How do I know it's time even if it's been under 6 weeks?",
          "a": "If your hair looks dry or starts losing its shape, it's time. Split ends, frizz at the ends, and lost shape are all signals — don't wait for the calendar."
        }
      ]
    },
    "es": {
      "dek": "Most adults should get a haircut every 4 to 8 weeks — but the right number depends heavily on your length, texture, and how much chemical processing your hair has been through.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Short styles (pixie, fade) need trimming every 3–5 weeks to hold their shape",
            "Medium-length hair holds up 6–8 weeks between appointments",
            "Long hair can stretch 8–12 weeks, longer if you're growing it out",
            "Curly and textured hair does best every 6–10 weeks",
            "Split ends spread — no product reverses them, so timing matters"
          ]
        },
        {
          "h": "Why timing actually matters",
          "p": "Split ends don't stop at the tip. Once the ends split, the break travels up the shaft, causing breakage that makes your hair look thinner and shorter overall — and there's no magic potion that reverses split ends. By the time the damage shows, you often end up cutting off more than you planned. Waiting too long doesn't save money; it costs more later when you're reviving a shape that's lost its structure."
        },
        {
          "h": "Haircut frequency by length"
        },
        {
          "h": "Short hair (pixie, fade, buzzcut)",
          "p": "Short styles need the most attention because shape defines their impact — pixie cuts and fades lose structure fast, so most clients visit every 3 to 5 weeks. Clipper cuts like fades and tapers need fresh edges about every 3 weeks to stay sharp."
        },
        {
          "h": "Medium-length hair",
          "p": "Medium styles allow more flexibility — these shapes usually last 6 to 8 weeks. You can stretch toward 8–10 weeks if you're not fighting split ends."
        },
        {
          "h": "Long hair",
          "p": "Long hair needs less maintenance than shorter styles. Many clients wait 8 to 12 weeks, though a trim every 6–8 weeks keeps split ends at bay if your ends are prone to them."
        },
        {
          "h": "Haircut frequency by texture"
        },
        {
          "h": "Curly and textured hair",
          "p": "Curls can disguise uneven ends, but without maintenance, dryness and breakage build. Visiting every 6 to 10 weeks maintains curl definition and makes styling easier."
        },
        {
          "h": "Fine hair",
          "p": "Fine hair shows regrowth faster and loses shape sooner — medium-length fine hair every 6 to 8 weeks, long fine hair 8 to 12 weeks."
        },
        {
          "h": "Thick or coarse hair",
          "p": "Thick hair holds a style longer but still needs attention at the ends. The same general bands apply, though you may push closer to 10–12 weeks if your ends are holding up."
        },
        {
          "h": "When your hair needs more frequent trims",
          "p": "Some situations call for shorter intervals:"
        },
        {
          "bullets": [
            "Split-end-prone or damaged hair: every 4–6 weeks.",
            "Bangs or fringe: every 2–4 weeks, since they grow fast and frame your face.",
            "Chemically treated hair: color, lightening, and chemical treatments open the cuticle and increase vulnerability, so trims every 4 to 6 weeks help. If you also heat-style colored hair, every 6 to 8 weeks protects it from both stressors."
          ]
        },
        {
          "h": "Trim vs. cut: what's the difference?",
          "p": "A trim takes off an inch or two at the ends; a cut is more drastic, with two to three inches or more chopped off. A trim usually removes about ¼ to ½ inch to clean up split ends and maintain your shape. Getting it done by a professional ensures an even result customized to your face shape and hair health — when you trim your own hair, you tend to miss split ends or leave your length uneven."
        },
        {
          "h": "Can you skip the salon?",
          "p": "The frequency that's right for you depends on your cut, texture, lifestyle, and grooming habits. When you skip haircuts, weakness builds gradually, and by the time it's noticeable you end up cutting off more than you planned. If your hair is healthy and strong, you can sometimes stretch to every 10 to 12 weeks — but if you're growing it out, never exceed 12 weeks between trims."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "How often should I get a haircut if I'm growing it out?",
          "a": "Stretch to 8–12 weeks between trims, but never exceed 12 weeks — split ends travel up the shaft and cost you more length in the long run."
        },
        {
          "q": "Does cutting hair make it grow faster?",
          "a": "Not directly, but trims prevent breakage at the ends. Less breakage means your hair looks longer and fuller over time."
        },
        {
          "q": "What if I can't afford to go every 6 weeks?",
          "a": "If your hair is healthy, you can often stretch to 10–12 weeks. Just watch for split ends — once they show up, book a trim."
        },
        {
          "q": "Do curly-haired people really need trims as often?",
          "a": "Yes. Curly hair hides uneven ends visually, but dryness and breakage still happen underneath. Every 6 to 10 weeks keeps curls defined."
        },
        {
          "q": "How do I know it's time even if it's been under 6 weeks?",
          "a": "If your hair looks dry or starts losing its shape, it's time. Split ends, frizz at the ends, and lost shape are all signals — don't wait for the calendar."
        }
      ]
    }
  },
  "28": {
    "en": {
      "dek": "Here's the hard truth upfront: damaged hair can't truly be repaired. Hair is mostly keratin, a protein that forms the protective outer cuticle — once that structure breaks down, the damage is done. The only real cure is time, a pair of shears, and preventing new damage. The good news: you have more control over how your hair looks and feels than you'd think.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Damaged hair can't be repaired — only trimmed off and protected from further harm",
            "Signs of damage: dryness, split ends, dullness, breakage, and tangles",
            "Weekly deep conditioning and penetrating oils restore moisture and smoothness",
            "Heat, chemical treatments, and tight styles are the main culprits",
            "A professional colorist minimizes damage better than any box dye"
          ]
        },
        {
          "h": "What does damaged hair look like?",
          "p": "Extremely damaged hair develops cracks in the outer cuticle layer. Once the cuticle lifts, the strand is open to further damage and breakage. Warning signs:"
        },
        {
          "bullets": [
            "Dryness that doesn't respond to conditioner",
            "Split ends that travel up the shaft",
            "Dull color even after a fresh dye job",
            "Breakage near the crown and nape",
            "Tangling that worsens through the day"
          ]
        },
        {
          "p": "If these sound familiar, your hair isn't beyond hope — the cuticle just needs attention, and that's manageable."
        },
        {
          "h": "The three main causes of hair damage"
        },
        {
          "h": "Chemical damage",
          "p": "Color, perms, and relaxers penetrate the cuticle to alter your hair's structure. To limit it, experts suggest choosing a dye within three shades of your natural color and going darker rather than lighter, and waiting 8–10 weeks (or longer) between dye jobs so the cuticle can recover. There's no substitute for an experienced pro painting your strands — salon technique and products measurably reduce how much damage your hair absorbs."
        },
        {
          "h": "Heat damage",
          "p": "Blow dryers, flat irons, and curling wands weaken the cuticle over time. One study found that holding the blow dryer about 15 cm (six inches) away and keeping it moving reduces damage. Apply heat protectant a few minutes before heat-styling — it coats the shaft and buys protection, but it's not a license to crank the heat to max."
        },
        {
          "h": "Mechanical damage",
          "p": "Mechanical damage comes from excessive physical stress on the hair. Wet hair is more fragile than dry, so handle it gently and minimize rough brushing. Tight styles like high ponytails or braids pull on the hair and can cause traction alopecia, where hair is pulled from the roots — looser styles protect your hairline."
        },
        {
          "h": "How to restore moisture and smooth the cuticle",
          "p": "You can't reverse damage, but the right products restore the look and feel of your hair."
        },
        {
          "h": "Penetrating oils",
          "bullets": [
            "Coconut oil: its molecules are small enough to penetrate the cuticle and hydrate from the inside out. Apply a small amount to damp mid-lengths and ends.",
            "Olive oil: shown to rehydrate hair and smooth the cuticle.",
            "Almond oil: softens and strengthens; a dime-sized amount on the ends before drying cuts frizz."
          ]
        },
        {
          "h": "Weekly treatments",
          "p": "Use a deep conditioner or mask once a week to restore moisture — leave it the recommended time, since over-saturating can weigh hair down. A rice water rinse can help too: inositol in rice water penetrates damaged hair and strengthens it from within. Use it as a final rinse after shampooing."
        },
        {
          "h": "How to handle hair without making it worse"
        },
        {
          "h": "Drying",
          "p": "Never rub — blot and squeeze gently when towel-drying. Rough friction lifts the cuticle and creates frizz; a microfiber towel or cotton t-shirt is gentler."
        },
        {
          "h": "Detangling",
          "p": "Use a wide-tooth comb on wet hair and skip vigorous towel drying. The flexible bristles yield to tension instead of tearing through knots. Start at the bottom and work up to clear snags safely — forcing a brush from root to tip through knots is a fast track to breakage."
        },
        {
          "h": "Sleeping",
          "p": "Silk or satin pillowcases lessen frizz and breakage because silk creates less friction than cotton. No silk pillowcase? A silk bonnet works too."
        },
        {
          "h": "Trims",
          "p": "Going too long between cuts leads to dry split ends, and you can't put a split end back together. Regular trims remove split ends and prevent the damage from spreading — every 8–12 weeks is a good baseline, or sooner if you see splits climbing the shaft."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can damaged hair be repaired at home?",
          "a": "No. Hair is a collection of dead cells, so the damaged portion is beyond repair. You can mask the look of damage with oils, deep conditioners, and protective styling, but the damaged part has to grow out or be cut off."
        },
        {
          "q": "How can I repair damaged hair naturally?",
          "a": "Coconut, olive, or almond oil to hydrate and smooth the cuticle, plus a weekly rice-water rinse for strength. Pair them with gentle handling — no rough towel drying, no tight styles, minimal heat."
        },
        {
          "q": "How often should I trim damaged hair?",
          "a": "Every 8 to 12 weeks, or sooner if split ends start traveling up the shaft. Trims remove the damage before it spreads."
        },
        {
          "q": "What products help color-treated damaged hair?",
          "a": "Color-safe shampoo and conditioner, formulated at the right pH to keep the shaft from swelling and leaking dye. Add a weekly deep-conditioning mask and a silk pillowcase to cut overnight breakage."
        }
      ]
    },
    "es": {
      "dek": "Here's the hard truth upfront: damaged hair can't truly be repaired. Hair is mostly keratin, a protein that forms the protective outer cuticle — once that structure breaks down, the damage is done. The only real cure is time, a pair of shears, and preventing new damage. The good news: you have more control over how your hair looks and feels than you'd think.",
      "author": "The Glossi Editors",
      "authorRole": "Rio Grande Valley, TX",
      "sections": [
        {
          "h": "Key takeaways",
          "bullets": [
            "Damaged hair can't be repaired — only trimmed off and protected from further harm",
            "Signs of damage: dryness, split ends, dullness, breakage, and tangles",
            "Weekly deep conditioning and penetrating oils restore moisture and smoothness",
            "Heat, chemical treatments, and tight styles are the main culprits",
            "A professional colorist minimizes damage better than any box dye"
          ]
        },
        {
          "h": "What does damaged hair look like?",
          "p": "Extremely damaged hair develops cracks in the outer cuticle layer. Once the cuticle lifts, the strand is open to further damage and breakage. Warning signs:"
        },
        {
          "bullets": [
            "Dryness that doesn't respond to conditioner",
            "Split ends that travel up the shaft",
            "Dull color even after a fresh dye job",
            "Breakage near the crown and nape",
            "Tangling that worsens through the day"
          ]
        },
        {
          "p": "If these sound familiar, your hair isn't beyond hope — the cuticle just needs attention, and that's manageable."
        },
        {
          "h": "The three main causes of hair damage"
        },
        {
          "h": "Chemical damage",
          "p": "Color, perms, and relaxers penetrate the cuticle to alter your hair's structure. To limit it, experts suggest choosing a dye within three shades of your natural color and going darker rather than lighter, and waiting 8–10 weeks (or longer) between dye jobs so the cuticle can recover. There's no substitute for an experienced pro painting your strands — salon technique and products measurably reduce how much damage your hair absorbs."
        },
        {
          "h": "Heat damage",
          "p": "Blow dryers, flat irons, and curling wands weaken the cuticle over time. One study found that holding the blow dryer about 15 cm (six inches) away and keeping it moving reduces damage. Apply heat protectant a few minutes before heat-styling — it coats the shaft and buys protection, but it's not a license to crank the heat to max."
        },
        {
          "h": "Mechanical damage",
          "p": "Mechanical damage comes from excessive physical stress on the hair. Wet hair is more fragile than dry, so handle it gently and minimize rough brushing. Tight styles like high ponytails or braids pull on the hair and can cause traction alopecia, where hair is pulled from the roots — looser styles protect your hairline."
        },
        {
          "h": "How to restore moisture and smooth the cuticle",
          "p": "You can't reverse damage, but the right products restore the look and feel of your hair."
        },
        {
          "h": "Penetrating oils",
          "bullets": [
            "Coconut oil: its molecules are small enough to penetrate the cuticle and hydrate from the inside out. Apply a small amount to damp mid-lengths and ends.",
            "Olive oil: shown to rehydrate hair and smooth the cuticle.",
            "Almond oil: softens and strengthens; a dime-sized amount on the ends before drying cuts frizz."
          ]
        },
        {
          "h": "Weekly treatments",
          "p": "Use a deep conditioner or mask once a week to restore moisture — leave it the recommended time, since over-saturating can weigh hair down. A rice water rinse can help too: inositol in rice water penetrates damaged hair and strengthens it from within. Use it as a final rinse after shampooing."
        },
        {
          "h": "How to handle hair without making it worse"
        },
        {
          "h": "Drying",
          "p": "Never rub — blot and squeeze gently when towel-drying. Rough friction lifts the cuticle and creates frizz; a microfiber towel or cotton t-shirt is gentler."
        },
        {
          "h": "Detangling",
          "p": "Use a wide-tooth comb on wet hair and skip vigorous towel drying. The flexible bristles yield to tension instead of tearing through knots. Start at the bottom and work up to clear snags safely — forcing a brush from root to tip through knots is a fast track to breakage."
        },
        {
          "h": "Sleeping",
          "p": "Silk or satin pillowcases lessen frizz and breakage because silk creates less friction than cotton. No silk pillowcase? A silk bonnet works too."
        },
        {
          "h": "Trims",
          "p": "Going too long between cuts leads to dry split ends, and you can't put a split end back together. Regular trims remove split ends and prevent the damage from spreading — every 8–12 weeks is a good baseline, or sooner if you see splits climbing the shaft."
        },
        {
          "h": "Frequently asked questions"
        },
        {
          "q": "Can damaged hair be repaired at home?",
          "a": "No. Hair is a collection of dead cells, so the damaged portion is beyond repair. You can mask the look of damage with oils, deep conditioners, and protective styling, but the damaged part has to grow out or be cut off."
        },
        {
          "q": "How can I repair damaged hair naturally?",
          "a": "Coconut, olive, or almond oil to hydrate and smooth the cuticle, plus a weekly rice-water rinse for strength. Pair them with gentle handling — no rough towel drying, no tight styles, minimal heat."
        },
        {
          "q": "How often should I trim damaged hair?",
          "a": "Every 8 to 12 weeks, or sooner if split ends start traveling up the shaft. Trims remove the damage before it spreads."
        },
        {
          "q": "What products help color-treated damaged hair?",
          "a": "Color-safe shampoo and conditioner, formulated at the right pH to keep the shaft from swelling and leaking dye. Add a weekly deep-conditioning mask and a silk pillowcase to cut overnight breakage."
        }
      ]
    }
  }
};

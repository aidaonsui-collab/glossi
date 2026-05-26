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
  }
};

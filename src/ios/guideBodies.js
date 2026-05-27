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
  }
};

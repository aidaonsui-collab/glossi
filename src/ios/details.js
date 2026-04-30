// Salon details + sample inbox threads. Keyed by bid id.

export const SALON_DETAILS = {
  b1: {
    gallery: [0, 5, 6, 2],
    about_en: "Two chairs, real warmth, and twelve years of color in Pharr. Marisol works small-batch — usually three clients a day — so every appointment ends with a blow-dry and a shoulder squeeze.",
    about_es: 'Dos sillas, calidez de verdad, y doce años de color en Pharr. Marisol trabaja en grupos pequeños — usualmente tres citas al día.',
    services: [
      { name_en: 'Color & balayage', name_es: 'Color y balayage', from: 90, to: 160, dur: '2–3 hrs' },
      { name_en: 'Cut & style', name_es: 'Corte y peinado', from: 45, to: 75, dur: '45 min' },
      { name_en: 'Toner refresh', name_es: 'Tonalizar', from: 35, to: 55, dur: '30 min' },
      { name_en: 'Blowout', name_es: 'Secado', from: 30, to: 45, dur: '40 min' },
    ],
    hours: { Mon: '9–6', Tue: '9–6', Wed: '9–6', Thu: '9–8', Fri: '9–8', Sat: '10–4', Sun: 'closed' },
    address: '1612 N Cage Blvd · Pharr, TX 78577',
    phone: '(956) 555-0142',
    reviews: [
      { name: 'Daniela R.', rating: 5, date: 'Mar 12', body_en: 'Marisol nailed the caramel I\'ve been chasing for three years. Walking out, my hair looked expensive. Worth every penny.', body_es: 'Marisol clavó el caramelo que llevaba tres años buscando. Al salir, mi pelo se veía caro.' },
      { name: 'Ana V.', rating: 5, date: 'Mar 5', body_en: 'Booked a touch-up — got an honest "you don\'t need this yet, come back in a month" instead. That\'s rare.', body_es: 'Reservé un retoque — y me dijo "no lo necesitas todavía, vuelve en un mes". Eso es raro.' },
      { name: 'Maritza C.', rating: 4, date: 'Feb 28', body_en: 'Great work, ran 20 min late starting. Worth the wait but worth a heads up.', body_es: 'Excelente trabajo, empezó 20 min tarde. Vale la pena pero un aviso ayudaría.' },
    ],
  },
  b2: {
    gallery: [3, 7, 1, 4],
    about_en: 'Premium salon in north McAllen. Private chairs, Olaplex on every service, and Diego\'s editorial portfolio on the wall. First-time clients get a free deep condition.',
    about_es: 'Salón premium en el norte de McAllen. Sillas privadas, Olaplex en cada servicio.',
    services: [
      { name_en: 'Color & balayage', name_es: 'Color y balayage', from: 145, to: 220, dur: '3 hrs' },
      { name_en: 'Cut & style', name_es: 'Corte y peinado', from: 65, to: 95, dur: '1 hr' },
      { name_en: 'Olaplex treatment', name_es: 'Tratamiento Olaplex', from: 55, to: 85, dur: '45 min' },
    ],
    hours: { Mon: 'closed', Tue: '10–7', Wed: '10–7', Thu: '10–8', Fri: '10–8', Sat: '9–5', Sun: 'closed' },
    address: '4108 N 10th St · McAllen, TX 78504',
    phone: '(956) 555-0188',
    reviews: [
      { name: 'Jasmin O.', rating: 5, date: 'Mar 14', body_en: 'Diego\'s color is the best in McAllen. Pricey but the cut grows out clean for 8 weeks.', body_es: 'El color de Diego es el mejor de McAllen.' },
      { name: 'Camila P.', rating: 5, date: 'Mar 2', body_en: 'Quiet, clean, and they actually listen. The Olaplex add-on changed my hair.', body_es: 'Tranquilo, limpio, y escuchan de verdad.' },
    ],
  },
  b3: {
    gallery: [5, 1, 6, 0],
    about_en: 'New on Glossi, not new to the chair. Luz did six years at a Houston salon before opening La Reina with her sister. Currently 30% off to introduce themselves.',
    about_es: 'Nuevas en Glossi pero no en la silla. Luz tiene seis años en salones de Houston.',
    services: [
      { name_en: 'Color & balayage', name_es: 'Color y balayage', from: 78, to: 130, dur: '2.5 hrs' },
      { name_en: 'Cut & style', name_es: 'Corte y peinado', from: 40, to: 60, dur: '45 min' },
      { name_en: 'Bridal trial', name_es: 'Prueba de novia', from: 85, to: 130, dur: '1.5 hrs' },
    ],
    hours: { Mon: 'closed', Tue: '11–7', Wed: '11–7', Thu: '11–7', Fri: '11–8', Sat: '9–5', Sun: '11–4' },
    address: '218 W University Dr · Edinburg, TX 78539',
    phone: '(956) 555-0103',
    reviews: [
      { name: 'Maritza C.', rating: 5, date: 'Mar 10', body_en: 'Luz answered me in two minutes flat. Color came out exactly like the inspo. New favorite.', body_es: 'Luz me contestó en dos minutos. El color salió igual a la inspiración.' },
    ],
  },
  b4: {
    gallery: [1, 0, 7, 3],
    about_en: 'Senior stylists with editorial credits. Loyalty rewards after three bookings. Long-time Mission shop with the smoothest blowouts in the Valley.',
    about_es: 'Estilistas senior con créditos editoriales.',
    services: [
      { name_en: 'Full balayage', name_es: 'Balayage completo', from: 165, to: 240, dur: '3.5 hrs' },
      { name_en: 'Color refresh', name_es: 'Color', from: 95, to: 130, dur: '2 hrs' },
      { name_en: 'Cut & style', name_es: 'Corte y peinado', from: 60, to: 85, dur: '1 hr' },
    ],
    hours: { Mon: '10–6', Tue: '10–6', Wed: '10–6', Thu: '10–7', Fri: '10–7', Sat: '9–4', Sun: 'closed' },
    address: '722 E Tom Landry St · Mission, TX 78572',
    phone: '(956) 555-0177',
    reviews: [
      { name: 'Ana V.', rating: 5, date: 'Feb 24', body_en: 'Ana the stylist is a magician. Asked for editorial, got editorial.', body_es: 'Ana es una maga.' },
    ],
  },
  b5: {
    gallery: [4, 7, 2, 5],
    about_en: 'Bilingual top to bottom. Free parking. Walk-ins welcome on weekdays. Carmen specializes in fine, color-treated hair.',
    about_es: 'Bilingüe de pies a cabeza. Estacionamiento gratis.',
    services: [
      { name_en: 'Cut & style', name_es: 'Corte y peinado', from: 50, to: 70, dur: '45 min' },
      { name_en: 'Color & gloss', name_es: 'Color y brillo', from: 110, to: 150, dur: '2 hrs' },
      { name_en: 'Keratin treatment', name_es: 'Tratamiento keratina', from: 180, to: 240, dur: '3 hrs' },
    ],
    hours: { Mon: '9–7', Tue: '9–7', Wed: '9–7', Thu: '9–8', Fri: '9–8', Sat: '8–4', Sun: 'closed' },
    address: '901 S Texas Blvd · Weslaco, TX 78596',
    phone: '(956) 555-0166',
    reviews: [
      { name: 'Kevin O.', rating: 4, date: 'Mar 8', body_en: 'Solid cut, easy parking, friendly front desk.', body_es: 'Buen corte, fácil estacionar.' },
    ],
  },
};

export const THREADS = {
  b1: {
    salon: 'Casa de Belleza',
    salonId: 'b1',
    online: true,
    messages: [
      { from: 'salon', t: '10:42 AM', en: 'Hi Sofia! Got your request — caramel balayage, soft and low-maintenance, right?', es: '¡Hola Sofia! Recibí tu solicitud — balayage caramelo, suave y de bajo mantenimiento, ¿correcto?' },
      { from: 'me', t: '10:43 AM', en: 'Yes! Looking for something I won\'t need to retouch every 4 weeks 🤞', es: '¡Sí! Que no tenga que retocar cada 4 semanas 🤞' },
      { from: 'salon', t: '10:44 AM', en: 'Easy — we\'ll keep the contrast soft so the grow-out stays pretty for 8–10 weeks. I have today at 4 or tomorrow at 11. Both 3 hr slots.', es: 'Fácil — mantengo el contraste suave para que crezca bonito 8–10 semanas. Tengo hoy 4pm o mañana 11am.' },
      { from: 'salon', t: '10:44 AM', en: '$92 includes wash + blow dry. Hope to see you!', es: '$92 incluye lavado y secado.' },
      { from: 'me', t: '10:46 AM', en: 'Today at 4 works! Sending the booking now.', es: '¡Hoy a las 4 me sirve!' },
      { from: 'salon', t: '10:46 AM', en: 'Confirmed: Today at 4:00 PM ✓ See you soon!', es: 'Confirmado: Hoy 4:00 PM ✓' },
    ],
    suggestions_en: ['Sounds good, thanks!', 'Can I bring a reference photo?', 'How early should I arrive?'],
    suggestions_es: ['¡Suena bien!', '¿Puedo traer foto?', '¿Qué tan temprano llegar?'],
  },
  b2: {
    salon: 'Studio Onyx',
    salonId: 'b2',
    online: false,
    messages: [
      { from: 'salon', t: '9:30 AM', en: 'Hey Sofia — quick question about your reference photo 2. Is that the warmth you\'re going for, or cooler?', es: 'Hola Sofia — pregunta rápida sobre la foto 2. ¿Esa es la calidez que quieres?' },
      { from: 'me', t: '9:42 AM', en: 'A little cooler! That photo is too brassy for me.', es: '¡Un poco más fría! Esa foto se ve demasiado bronceada.' },
      { from: 'salon', t: '9:43 AM', en: 'Got it. I\'ll plan a tonalizer at the end to neutralize.', es: 'Entendido. Plan: tonalizer al final para neutralizar.' },
    ],
    suggestions_en: ['Sounds good', 'Send me a price update', 'When can you book me?'],
    suggestions_es: ['Me parece', 'Mándame precio actualizado', '¿Cuándo me puedes agendar?'],
  },
  b3: {
    salon: 'La Reina Salon',
    salonId: 'b3',
    online: true,
    messages: [
      { from: 'salon', t: '8:15 AM', en: '🌅 Morning! Reminder our 30% off intro promo expires tonight at midnight. Lock in $78 if you want.', es: '🌅 ¡Recordatorio! Nuestro 30% de descuento vence esta noche.' },
    ],
    suggestions_en: ['Lock in $78', 'Tell me more', 'Maybe next time'],
    suggestions_es: ['Reservar a $78', 'Más info', 'Tal vez después'],
  },
};

export const INBOX_LIST = [
  { id: 'b1', salon: 'Casa de Belleza', last_en: 'Confirmation: Today at 4:00 PM ✓', last_es: 'Confirmación: Hoy a las 4:00 PM ✓', t: '2m', unread: false },
  { id: 'b2', salon: 'Studio Onyx', last_en: 'Got it. I\'ll plan a tonalizer at the end to neutralize.', last_es: 'Entendido. Plan: tonalizer al final.', t: '14m', unread: true },
  { id: 'b3', salon: 'La Reina Salon', last_en: '30% off intro promo expires tonight at midnight.', last_es: '30% de descuento vence esta noche.', t: '1h', unread: true },
  { id: 'b4', salon: 'The Beauty Loft', last_en: 'Thanks for considering us! Let us know if anything.', last_es: 'Gracias por considerarnos.', t: '3h', unread: false },
  { id: 'b5', salon: 'Brisa Hair Bar', last_en: 'See you Saturday at 11 — parking is on the side.', last_es: 'Nos vemos sábado a las 11.', t: '2d', unread: false },
];

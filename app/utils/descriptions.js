// Translations of the seeded Catalan space descriptions, keyed by the exact
// Catalan text. These are DB free-text values (green_spaces.description);
// translating them here client-side keeps the schema untouched (no per-language
// column). translateDescription() returns the original text for Catalan (the
// source language) or when no translation exists, so unseen/new descriptions
// never break.
const DESCRIPTIONS = {
  en: {
    'El parc més gran del centre de Barcelona': 'The largest park in central Barcelona',
    'El parc més antic de Barcelona, amb laberint de xiprers': "Barcelona's oldest park, with a cypress maze",
    'Parc amb llac artificial al turó de Collserola': 'Park with an artificial lake on the Collserola hill',
    'Espai verd al nord de Nou Barris': 'Green space in the north of Nou Barris',
    'Famós pels seus jardins de roses': 'Famous for its rose gardens',
    'Jardins en terrasses al turó de Montjuïc': 'Terraced gardens on the Montjuïc hill',
    'Jardins tranquils al cor de Gràcia': 'Quiet gardens in the heart of Gràcia',
    "Jardins modernistes a l'avinguda Tibidabo": 'Modernist gardens on Avinguda Tibidabo',
    'Jardins del Palau Reial de Pedralbes': 'Gardens of the Royal Palace of Pedralbes',
    "Hort urbà comunitari al cor de l'Eixample": 'Community urban garden in the heart of the Eixample',
    'Hort comunitari gestionat per veïns de Sants': 'Community garden run by Sants residents',
    'Hort urbà al barri del Clot': 'Urban garden in the El Clot neighbourhood',
    'Hort comunitari al nord de la ciutat': 'Community garden in the north of the city',
    'Plaça central de Gràcia amb arbres centenaris': 'Central square in Gràcia with century-old trees',
    'Plaça icònica del barri de Gràcia': 'Iconic square in the Gràcia neighbourhood',
    'Avinguda arboritzada al cor del Poblenou': 'Tree-lined avenue in the heart of Poblenou',
    "Punt d'informació al mercat més famós de Barcelona": "Info point at Barcelona's most famous market",
    "Punt d'informació al mercat de Gràcia": 'Info point at the Gràcia market',
    "Punt de difusió: Centre d'atenció primària": 'Outreach Point: Primary Care Centre',
    "Punt d'informació: Biblioteca municipal": 'Info Point: Municipal Library',
    "Punt d'informació a la Universitat de Barcelona": 'Info point at the University of Barcelona',
    "Punt d'informació a la Universitat Pompeu Fabra": 'Info point at Pompeu Fabra University',
    "Punt d'informació a l'institut Jaume Balmes": 'Info point at Jaume Balmes secondary school',
    'Punt de difusió al centre cívic Pati Llimona': 'Outreach point at the Pati Llimona civic centre',
    'Solar municipal cedit, naturalitzat com a refugi de biodiversitat urbana': 'Municipal plot handed over and rewilded as an urban biodiversity refuge',
    'Espai cedit a una entitat per crear un refugi de fauna i flora autòctona': 'Space handed over to an organisation to create a refuge for native wildlife and plants',
    // Legacy keys (pre patch-004): keep the lookup working until the live DB is updated.
    "Centre d'atenció primària — punt de difusió": 'Outreach Point: Primary Care Centre',
    'Biblioteca municipal — punt d\'informació': 'Info Point: Municipal Library',
  },

  es: {
    'El parc més gran del centre de Barcelona': 'El parque más grande del centro de Barcelona',
    'El parc més antic de Barcelona, amb laberint de xiprers': 'El parque más antiguo de Barcelona, con laberinto de cipreses',
    'Parc amb llac artificial al turó de Collserola': 'Parque con lago artificial en la colina de Collserola',
    'Espai verd al nord de Nou Barris': 'Espacio verde al norte de Nou Barris',
    'Famós pels seus jardins de roses': 'Famoso por sus jardines de rosas',
    'Jardins en terrasses al turó de Montjuïc': 'Jardines en terrazas en la colina de Montjuïc',
    'Jardins tranquils al cor de Gràcia': 'Jardines tranquilos en el corazón de Gràcia',
    "Jardins modernistes a l'avinguda Tibidabo": 'Jardines modernistas en la avenida Tibidabo',
    'Jardins del Palau Reial de Pedralbes': 'Jardines del Palacio Real de Pedralbes',
    "Hort urbà comunitari al cor de l'Eixample": 'Huerto urbano comunitario en el corazón del Eixample',
    'Hort comunitari gestionat per veïns de Sants': 'Huerto comunitario gestionado por vecinos de Sants',
    'Hort urbà al barri del Clot': 'Huerto urbano en el barrio del Clot',
    'Hort comunitari al nord de la ciutat': 'Huerto comunitario al norte de la ciudad',
    'Plaça central de Gràcia amb arbres centenaris': 'Plaza central de Gràcia con árboles centenarios',
    'Plaça icònica del barri de Gràcia': 'Plaza icónica del barrio de Gràcia',
    'Avinguda arboritzada al cor del Poblenou': 'Avenida arbolada en el corazón del Poblenou',
    "Punt d'informació al mercat més famós de Barcelona": 'Punto de información en el mercado más famoso de Barcelona',
    "Punt d'informació al mercat de Gràcia": 'Punto de información en el mercado de Gràcia',
    "Punt de difusió: Centre d'atenció primària": 'Punto de difusión: Centro de atención primaria',
    "Punt d'informació: Biblioteca municipal": 'Punto de información: Biblioteca municipal',
    "Punt d'informació a la Universitat de Barcelona": 'Punto de información en la Universidad de Barcelona',
    "Punt d'informació a la Universitat Pompeu Fabra": 'Punto de información en la Universidad Pompeu Fabra',
    "Punt d'informació a l'institut Jaume Balmes": 'Punto de información en el instituto Jaume Balmes',
    'Punt de difusió al centre cívic Pati Llimona': 'Punto de difusión en el centro cívico Pati Llimona',
    'Solar municipal cedit, naturalitzat com a refugi de biodiversitat urbana': 'Solar municipal cedido, naturalizado como refugio de biodiversidad urbana',
    'Espai cedit a una entitat per crear un refugi de fauna i flora autòctona': 'Espacio cedido a una entidad para crear un refugio de fauna y flora autóctona',
    // Legacy keys (pre patch-004): keep the lookup working until the live DB is updated.
    "Centre d'atenció primària — punt de difusió": 'Punto de difusión: Centro de atención primaria',
    'Biblioteca municipal — punt d\'informació': 'Punto de información: Biblioteca municipal',
  },
}

export function translateDescription(text, locale) {
  if (!text) return text
  const map = DESCRIPTIONS[locale]
  return map ? (map[text] ?? text) : text
}

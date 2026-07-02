// English translations of the seeded Catalan space descriptions, keyed by the
// exact Catalan text. These are DB free-text values (green_spaces.description);
// translating them here client-side keeps the schema untouched (no description_en
// column). translateDescription() returns the original text when the locale is
// Catalan or when no translation exists, so unseen/new descriptions never break.
const DESCRIPTION_EN = {
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
  // Legacy keys (pre patch-004): keep the EN lookup working until the live DB is updated.
  "Centre d'atenció primària — punt de difusió": 'Outreach Point: Primary Care Centre',
  'Biblioteca municipal — punt d\'informació': 'Info Point: Municipal Library',
  'Solar municipal cedit, naturalitzat com a refugi de biodiversitat urbana': 'Municipal plot handed over and rewilded as an urban biodiversity refuge',
  "Espai cedit a una entitat per crear un refugi de fauna i flora autòctona": 'Space handed over to an organisation to create a refuge for native wildlife and plants',
}

export function translateDescription(text, locale) {
  if (locale !== 'en' || !text) return text
  return DESCRIPTION_EN[text] ?? text
}

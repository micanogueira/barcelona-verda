// UI string dictionary for the Catalan (default) / English toggle.
// Real data (space names, neighbourhoods, entity names) and official program
// proper names stay untranslated on purpose — only the UI chrome is localised.
// Looked up by dotted key via useLocale().t('nav.home'); {tokens} are filled by t()'s params.
export const translations = {
  ca: {
    nav: {
      home: 'Inici',
      participate: 'Com Participar',
      about: 'Sobre',
      login: 'Entrar',
      stats: {
        trees: 'Àrbres',
        mediators: 'Mediadors actius',
        participants: 'Participants',
        needsHelp: 'Cal ajuda',
      },
    },

    common: {
      participants: 'participants',
      close: 'Tancar',
      month: 'mes',
      months: 'mesos',
    },

    types: {
      park: 'Parc',
      garden: 'Jardí',
      hort: 'Hort urbà',
      mediator: "Punt d'informació",
      tree: 'Escocell',
      reserva: 'Reserva de biodiversitat',
    },

    filters: {
      all: 'Tots els espais',
      tree: 'Àrbres (escocells)',
      hort: 'Horts urbans',
      park: 'Parcs i jardins',
      reserva: 'Reserves de biodiversitat',
      mediator: "Punts d'informació",
      help: 'On cal ajuda',
    },

    status: {
      needsHelp: 'Cal ajuda',
      available: 'Disponible',
      openCall: 'Convocatòria oberta',
    },

    map: {
      loadingMap: 'Carregant mapa...',
      loadingSpaces: 'Carregant espais...',
      emptyFilter: 'Cap espai trobat per a aquest filtre.',
      viewMap: 'Mapa',
      viewList: 'Llista',
      panelTitle: 'Espais verds',
    },

    home: {
      heroTitle: "La porta d'entrada als espais verds de Barcelona",
      heroDesc: 'Descobreix parcs, horts, jardins i programes oficials: tot en un sol mapa interactiu.',
    },

    escocell: {
      sponsoredBy: 'Apadrinat per {name}',
    },

    cession: {
      managedBy: 'Gestionat per {name}',
      managedByLabel: 'Gestionat per',
    },

    cogestio: {
      comanagedBy: 'Cogestionat per {name}',
      comanagedByLabel: 'Cogestionat per',
    },

    popup: {
      needsHelpTitle: 'Cal ajuda en aquest espai',
      needsHelpText: 'Aquest espai necessita més veïns implicats per mantenir-se actiu i ben cuidat.',
      helpCta: 'Vull ajudar →',
      viewCall: 'Veure convocatòria →',
      officialProgram: 'Programa oficial:',
      escocellAvailable: 'Escocell disponible',
      requestIt: 'Sol·licitar-lo →',
      sponsoredSince: 'Apadrinat per {name}, des de fa {n} {unit}',
      photo: 'Foto: {credit}',
      health: 'Estat: {health}',
      escocellAlt: 'Escocell apadrinat',
    },

    about: {
      badge: 'Projecte acadèmic · EuroTeQ 2026',
      title: 'Sobre Barcelona Verda',
      p1: 'Barcelona Verda és una plataforma ciutadana per implicar els residents en la cocreació i el manteniment dels espais verds urbans de Barcelona.',
      p2: "El projecte neix d'una recerca acadèmica sobre la bretxa de participació en les iniciatives de verd urbà: les polítiques existents sovint no arriben als grups més vulnerables, i els canals digitals actuals de l'Ajuntament no estan pensats per a la inclusió activa. Barcelona compta amb més de 250.000 arbres i programes de participació consolidats, però no disposa de cap eina digital unificada que els connecti entre si i amb la ciutadania.",
      p3: "La nostra proposta: una plataforma informativa, fàcil d'usar i amb un to acollidor, que redueix la barrera d'entrada a la participació. Hi introduïm:",
      li1: 'Un mapa interactiu que mostra tots els espais verds en temps real',
      li2: 'Una xarxa de mediadors locals (comerços, mercats, professionals) ja integrats al moviment verd',
      li3: 'Una xarxa de voluntaris centrada en la difusió: atreu nous participants i ajuda les persones amb menys facilitat digital a trobar el programa adequat',
      li4: 'Una capa de visibilitat que mostra quins espais necessiten més ajuda i com creix el moviment per tota la ciutat',
      p4: "Actua com a porta d'entrada als programes oficials ja existents, com la Cessió d'Espais, la XHM o Cuida l'escocell, fent-los més fàcils de trobar, d'iniciar i de mantenir en el temps.",
      teamLabel: 'Equip',
      course: 'Student challenge: Sustainable Smart Cities · EuroTeQ Universities · Juliol 2026',
    },

    participate: {
      title: 'Com pots participar?',
      intro1: 'El projecte Barcelona Verda connecta veïns, voluntaris i la ciutat per crear espais verds junts. Aquí trobaràs totes les formes de participació i els programes oficials, en un sol lloc.',
      intro2: 'Siguis voluntari/ària, mediador/a o ciutadà/ana actiu/va, hi ha un rol per a tothom.',
      officialTag: 'Programa oficial',
      whatsNew: 'Què hi ha de nou',
      accessProgram: 'Accedeix al programa →',
      howTitle: 'Com funciona?',
      roles: {
        mediator: {
          title: 'Mediador/a de Xarxa',
          description: 'Ets un comerç, mercat, metge, perruqueria o entitat local. Connectes els teus clients i veïns amb els espais verds i programes del barri, actuant com a punt de confiança.',
          actions: [
            'Rep kit de comunicació (pòsters, flyers)',
            'Accés a formació de 30 minuts',
            "Aparèixes al mapa com a punt d'informació",
            'Reconeixement per al mediador/a més actiu/va',
          ],
          cta: 'Unir-me com a mediador/a',
        },
        volunteer: {
          title: 'Voluntari/ària',
          description: 'Acompanyes veïns que volen participar però no saben per on començar, ajudant-los a connectar amb Barcelona Verda i amb els programes oficials.',
          actions: [
            'Integres els nouvinguts a la plataforma',
            "Proveeixes de material els punts d'informació i formes els mediadors/ores de la xarxa",
            'Orientes cap al programa oficial més adequat',
            'Certificat de voluntariat oficial',
          ],
          cta: 'Apuntar-me com a voluntari/ària',
        },
      },
      programs: {
        1: {
          description: "Programa municipal d'adopció d'escocells (els espais de terra al voltant dels arbres). Qualsevol veí +18 anys pot apadrinar fins a 3 escocells.",
          bvAdds: "Al mapa veus de seguida quins escocells del teu barri ja tenen padrí i quins t'esperen. Quan un queda lliure, te'l destaquem perquè el pots demanar directament.",
        },
        2: {
          description: '15 horts municipals repartits pels 10 districtes, amb parcel·les per a persones +65 anys i entitats. Sorteig per a persones, concurs per a entitats.',
          bvAdds: "Marquem els horts amb convocatòria oberta perquè no se't passi per alt cap oportunitat al teu barri.",
        },
        3: {
          description: "Solars municipals inactius cedits a entitats sense ànim de lucre per crear-hi horts, jardins comunitaris o reserves de biodiversitat.",
          bvAdds: 'Més transparència per a la comunitat: al mapa veus quina entitat sense ànim de lucre gestiona cada espai verd cedit.',
        },
        4: {
          description: 'Entitats sense ànim de lucre poden cogestionar parterres i jardineres dels parcs urbans durant 2 anys, via formulari.',
          bvAdds: 'Més transparència per a la comunitat: al mapa veus quina entitat sense ànim de lucre cogestiona cada parc cogestionat.',
        },
      },
      steps: [
        { title: 'Explora', text: 'Obre el mapa interactiu i descobreix els espais verds, horts i arbres del teu barri, sense necessitat de compte.' },
        { title: 'Tria com participar', text: "Vols ser voluntari, mediador de xarxa o accedir directament a un programa oficial de l'Ajuntament?" },
        { title: "Registra't o accedeix", text: "Crea el teu compte a Barcelona Verda per als rols de la plataforma, o accedeix al programa oficial que t'interessa." },
        { title: 'Fes créixer la xarxa', text: 'La teva participació és visible al mapa i inspira altres veïns dels 73 barris de Barcelona.' },
      ],
    },

    login: {
      back: "← Tornar a l'inici",
      loginTab: 'Entrar',
      registerTab: 'Registrar-me',
      email: 'Correu electrònic',
      emailPlaceholder: 'nom@exemple.com',
      password: 'Contrasenya',
      fullName: 'Nom complet',
      namePlaceholder: 'Maria García',
      passwordHintRegister: 'Mínim 8 caràcters',
      roleQuestion: 'Com vols participar?',
      roleMediator: 'Mediador/a de xarxa',
      roleVolunteer: 'Voluntari/ària',
      discoverDiff: 'Descobreix les diferències →',
      loggingIn: 'Entrant...',
      registering: 'Registrant...',
      createAccount: 'Crear compte',
      loginBtn: 'Entrar',
      sideTitle: 'Junts fem Barcelona més verda',
      side1: 'Explora tots els espais verds en un únic mapa',
      side2: 'Connecta els teus veïns amb els programes del barri',
      side3: "Accedeix als programes oficials de l'Ajuntament",
      side4: 'Fes créixer la xarxa de participació',
    },

    footer: {
      tagline: 'Una plataforma ciutadana per als espais verds urbans de Barcelona.',
      academic: 'Projecte acadèmic · Sustainable Smart Cities · EuroTeQ 2026',
      platformTitle: 'Plataforma',
      interactiveMap: 'Mapa interactiu',
      participate: 'Com Participar',
      aboutProject: 'Sobre el projecte',
      loginRegister: 'Entrar / Registrar-me',
      officialPrograms: 'Programes oficials',
    },

    error: {
      title404: 'Aquesta pàgina no surt al mapa',
      titleGeneric: 'Alguna cosa ha anat malament',
      desc404: "Sembla que t'has desviat del camí. Tornem als espais verds de Barcelona?",
      descGeneric: "Hi ha hagut un error inesperat. Torna a l'inici i continua explorant.",
      cta: 'Torna al mapa →',
    },
  },

  en: {
    nav: {
      home: 'Home',
      participate: 'Get involved',
      about: 'About',
      login: 'Log in',
      stats: {
        trees: 'Trees',
        mediators: 'Active mediators',
        participants: 'Participants',
        needsHelp: 'Need help',
      },
    },

    common: {
      participants: 'participants',
      close: 'Close',
      month: 'month',
      months: 'months',
    },

    types: {
      park: 'Park',
      garden: 'Garden',
      hort: 'Urban garden',
      mediator: 'Info point',
      tree: 'Tree pit',
      reserva: 'Biodiversity reserve',
    },

    filters: {
      all: 'All spaces',
      tree: 'Trees (tree pits)',
      hort: 'Urban gardens',
      park: 'Parks & gardens',
      reserva: 'Biodiversity reserves',
      mediator: 'Info points',
      help: 'Where help is needed',
    },

    status: {
      needsHelp: 'Needs help',
      available: 'Available',
      openCall: 'Open call',
    },

    map: {
      loadingMap: 'Loading map...',
      loadingSpaces: 'Loading spaces...',
      emptyFilter: 'No spaces found for this filter.',
      viewMap: 'Map',
      viewList: 'List',
      panelTitle: 'Green spaces',
    },

    home: {
      heroTitle: "Your gateway to Barcelona's green spaces",
      heroDesc: 'Discover parks, gardens, allotments and official programs, all on a single interactive map.',
    },

    escocell: {
      sponsoredBy: 'Sponsored by {name}',
    },

    cession: {
      managedBy: 'Managed by {name}',
      managedByLabel: 'Managed by',
    },

    cogestio: {
      comanagedBy: 'Co-managed by {name}',
      comanagedByLabel: 'Co-managed by',
    },

    popup: {
      needsHelpTitle: 'This space needs help',
      needsHelpText: 'This space needs more neighbours involved to stay active and well cared for.',
      helpCta: 'I want to help →',
      viewCall: 'View call →',
      officialProgram: 'Official program:',
      escocellAvailable: 'Tree pit available',
      requestIt: 'Request it →',
      sponsoredSince: 'Sponsored by {name} · {n} {unit} ago',
      photo: 'Photo: {credit}',
      health: 'Condition: {health}',
      escocellAlt: 'Sponsored tree pit',
    },

    about: {
      badge: 'Academic project · EuroTeQ 2026',
      title: 'About Barcelona Verda',
      p1: "Barcelona Verda is a citizen platform that involves residents in the co-creation and upkeep of Barcelona's urban green spaces.",
      p2: "The project grew out of academic research into the participation gap in urban-greening initiatives: existing policies often fail to reach the most vulnerable groups, and the city council's current digital channels aren't designed for active inclusion. Barcelona has more than 250,000 trees and well-established participation programs, yet no unified digital tool connects them to each other and to residents.",
      p3: 'Our proposal: an informative, easy-to-use platform with a welcoming tone that lowers the barrier to getting involved. It introduces:',
      li1: 'An interactive map showing every green space in real time',
      li2: 'A network of local mediators (shops, markets, professionals) already part of the green movement',
      li3: 'A volunteer network focused on outreach: it attracts new participants and helps people less comfortable with digital tools find the right program',
      li4: 'A visibility layer that shows which spaces need more help and how the movement is growing across the city',
      p4: "It acts as a gateway to existing official programs, such as Cessió d'Espais, the XHM or Cuida l'escocell, making them easier to find, to start and to keep going over time.",
      teamLabel: 'Team',
      course: 'Student challenge: Sustainable Smart Cities · EuroTeQ Universities · July 2026',
    },

    participate: {
      title: 'How can you get involved?',
      intro1: "Barcelona Verda connects neighbours, volunteers and the city to create green spaces together. Here you'll find every way to take part and all the official programs, in one place.",
      intro2: "Whether you're a volunteer, a mediator or an active resident, there's a role for everyone.",
      officialTag: 'Official program',
      whatsNew: "What's new",
      accessProgram: 'Go to the program →',
      howTitle: 'How does it work?',
      roles: {
        mediator: {
          title: 'Network Mediator',
          description: "You're a shop, market, doctor, hair salon or local organisation. You connect your customers and neighbours with the neighbourhood's green spaces and programs, acting as a point of trust.",
          actions: [
            'Get a communication kit (posters, flyers)',
            'Access to a 30-minute training',
            'Appear on the map as an info point',
            'Recognition for the most active mediator',
          ],
          cta: 'Join as a mediator',
        },
        volunteer: {
          title: 'Volunteer',
          description: "You support neighbours who want to take part but don't know where to start, helping them connect with Barcelona Verda and the official programs.",
          actions: [
            'Onboard newcomers to the platform',
            "Supply info points with materials and train the network's mediators",
            'Point people to the most suitable official program',
            'Official volunteering certificate',
          ],
          cta: 'Sign up as a volunteer',
        },
      },
      programs: {
        1: {
          description: 'Municipal program for adopting tree pits (the soil spaces around street trees). Any resident aged 18+ can sponsor up to 3 tree pits.',
          bvAdds: 'On the map you instantly see which tree pits in your neighbourhood already have a sponsor and which are waiting. When one becomes free, we highlight it so you can claim it directly.',
        },
        2: {
          description: '15 municipal allotment gardens across the 10 districts, with plots for people aged 65+ and organisations. A lottery for individuals, a competition for organisations.',
          bvAdds: 'We flag allotments with an open call so you never miss an opportunity in your neighbourhood.',
        },
        3: {
          description: 'Unused municipal plots handed over to non-profit organisations to create allotments, community gardens or biodiversity reserves.',
          bvAdds: 'More transparency for the community: on the map you see which non-profit manages each handed-over green space.',
        },
        4: {
          description: 'Non-profits can co-manage flower beds and planters in urban parks for 2 years, via an application form.',
          bvAdds: 'More transparency for the community: on the map you see which non-profit co-manages each co-managed park.',
        },
      },
      steps: [
        { title: 'Explore', text: 'Open the interactive map and discover the green spaces, allotments and trees in your neighbourhood, no account needed.' },
        { title: 'Choose how to take part', text: 'Do you want to be a volunteer, a network mediator, or go straight to an official city program?' },
        { title: 'Sign up or log in', text: "Create your Barcelona Verda account for the platform roles, or go to the official program you're interested in." },
        { title: 'Grow the network', text: "Your participation shows on the map and inspires other residents across Barcelona's 73 neighbourhoods." },
      ],
    },

    login: {
      back: '← Back to home',
      loginTab: 'Log in',
      registerTab: 'Sign up',
      email: 'Email',
      emailPlaceholder: 'name@example.com',
      password: 'Password',
      fullName: 'Full name',
      namePlaceholder: 'Maria García',
      passwordHintRegister: 'At least 8 characters',
      roleQuestion: 'How do you want to take part?',
      roleMediator: 'Network mediator',
      roleVolunteer: 'Volunteer',
      discoverDiff: 'See the differences →',
      loggingIn: 'Logging in...',
      registering: 'Signing up...',
      createAccount: 'Create account',
      loginBtn: 'Log in',
      sideTitle: 'Together we make Barcelona greener',
      side1: 'Explore every green space on a single map',
      side2: "Connect your neighbours with the neighbourhood's programs",
      side3: "Access the city council's official programs",
      side4: 'Grow the participation network',
    },

    footer: {
      tagline: "A citizen platform for Barcelona's urban green spaces.",
      academic: 'Academic project · Sustainable Smart Cities · EuroTeQ 2026',
      platformTitle: 'Platform',
      interactiveMap: 'Interactive map',
      participate: 'Get involved',
      aboutProject: 'About the project',
      loginRegister: 'Log in / Sign up',
      officialPrograms: 'Official programs',
    },

    error: {
      title404: "This page isn't on the map",
      titleGeneric: 'Something went wrong',
      desc404: "Looks like you've wandered off the path. Shall we head back to Barcelona's green spaces?",
      descGeneric: 'An unexpected error occurred. Head back home and keep exploring.',
      cta: 'Back to the map →',
    },
  },
}

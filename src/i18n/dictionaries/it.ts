import type { CaseStudy, Dictionary, Project } from "../types";

const newmannCaseStudy: CaseStudy = {
  tagline:
    "Un assistente email con AI che legge la posta come la leggeresti tu: scrive bozze di risposta con la tua voce e permette di automatizzare etichette e regole, costruendole a mano oppure descrivendole in chat.",
  role: "Founding Engineer & Tech Lead",
  client: "Newmann AI",
  timeline: "Dal 2024 a oggi",
  hero: {
    src: "/imgs/newmann-landing.webp",
    alt: "La dashboard della posta di Newmann mostrata su un mockup di laptop",
    aspect: "16/9",
  },
  overview: [
    "Newmann è una piattaforma SaaS B2B che si collega a Gmail o Outlook e rende gestibile la casella di posta: decide che cosa merita davvero attenzione, scrive bozze di risposta fondate su come hai risposto a email simili in passato e applica le etichette e le regole che definisci, in un rule builder oppure descrivendole a un chatbot. La piattaforma è attualmente in fase di test, in vista del primo rilascio.",
    "Ho partecipato al progetto dal primo giorno come Founding Engineer e Tech Lead. Ho la responsabilità dell'architettura e delle scelte tecnologiche, dalla selezione dello stack al design della REST API in Java Spring Boot, e dell'AI engineering dall'inizio alla fine: ogni prompt è scritto da zero e la pipeline di retrieval su Pinecone è mia. Lavoro insieme a due persone, una sul front-end e una sul back-end, che portano avanti l'implementazione, e le decisioni che danno forma al sistema passano da me.",
  ],
  challenge: {
    intro:
      "Un modello generico sa scrivere un'email educata. Non sa scrivere la tua email. Il prodotto funziona solo se la bozza suona come la persona che la manda e se l'assistente capisce quando è meglio tacere: due condizioni da rispettare elaborando ogni messaggio che arriva in casella, a un costo per email che un abbonamento possa assorbire.",
    constraints: [
      "Le bozze dovevano fondarsi sullo storico di ogni utente, non sulla voce generica di un modello",
      "Le notifiche push di Gmail possono arrivare più di una volta, quindi la pipeline doveva essere idempotente e non produrre mai bozze, etichette o vettori duplicati",
      "Newsletter e mittenti automatici sono una fetta enorme di qualsiasi casella: far girare un LLM su tutti avrebbe bruciato budget per nulla",
      "Due provider, Gmail e Microsoft, ognuno con il proprio flusso OAuth e la propria idea di che cosa sia un'etichetta",
      "Gli utenti avevano bisogno sia di un controllo preciso sulle automazioni sia di un modo per crearle senza imparare una sintassi di regole",
    ],
  },
  process: [
    {
      title: "L'architettura e la pipeline di ingestione",
      body: "Spring Boot espone la REST API, PostgreSQL su Supabase conserva i dati con row-level security e contenuti multilingua, e Next.js con React e TypeScript regge il front-end. La posta in arrivo passa da una pipeline a webhook costruita intorno a chiavi di idempotenza e deduplicazione, così lo stesso messaggio può essere consegnato due volte senza mai generare una seconda bozza. I provider sono modellati per singolo account email invece che per tipo di provider: è questo che ha reso l'aggiunta di Microsoft accanto a Gmail una modifica di configurazione anziché una riscrittura.",
      image: {
        src: "/imgs/newmann-architecture.png",
        alt: "Diagramma dell'architettura di Newmann: ingestione via webhook, API Spring Boot, Pinecone e Supabase",
        aspect: "16/9",
      },
    },
    {
      title: "Retrieval, prompt e la voce dell'utente",
      body: "Ogni email rilevante viene trasformata in embedding e salvata su Pinecone, così a un nuovo messaggio si risponde avendo in contesto gli scambi passati dell'utente. Tengo namespace separati per le email di contesto e per i segnali di feedback: quando condividevano lo stesso namespace, le bozze rifiutate inquinavano il retrieval e spingevano il modello proprio verso le risposte che l'utente aveva scartato. Anche i rifiuti sono categorizzati, perché «qui non serviva rispondere» e «il tono era sbagliato» sono due lezioni diverse e solo una delle due deve fermare le bozze future.",
      image: {
        src: "/imgs/newmann-draft.png",
        alt: "Una bozza di risposta generata dall'AI mostrata dentro l'interfaccia di Newmann",
        aspect: "3/2",
      },
    },
    {
      title: "Due modi per costruire un'automazione",
      body: "Il rule builder dà controllo totale: definisci l'etichetta, le condizioni e la descrizione testuale su cui lavora il modello, e vedi esattamente che cosa succederà. Accanto c'è un chatbot per tutto il resto: descrivi quello che vuoi e un flusso multi-turno con stato assembla la stessa regola, chiedendo i pezzi mancanti e fermandosi a chiedere conferma quando somiglia a una che esiste già. Entrambe le strade scrivono su un unico modello di regola, quindi niente si comporta in modo diverso a seconda di dove è stato creato.",
      image: {
        src: "/imgs/newmann-automation-chat.png",
        alt: "La chat di automazione di Newmann che crea un'etichetta a partire da una descrizione in linguaggio naturale",
        aspect: "3/2",
      },
    },
    {
      title: "Metterlo in produzione e tenerlo osservabile",
      body: "La CI gira su GitHub Actions per front-end e back-end, con branch protection; il front-end viene deployato su Vercel e la API Spring Boot gira su Azure, con migrazioni Flyway su Supabase. Ho impostato l'analytics di prodotto su PostHog EU e le email transazionali su Resend; la pipeline di deploy è stata costruita insieme a un'altra persona del team e la manteniamo insieme. Stabilizzare l'ambiente di deploy ha voluto dire lavorare su redirect OAuth, CORS, dimensionamento del pool HikariCP e routing delle connessioni Supabase attraverso il session pooler: la metà poco affascinante del gestire un'infrastruttura propria.",
      image: {
        src: "/imgs/newmann-dashboard.png",
        alt: "La dashboard di Newmann con gli account collegati e le regole di automazione",
        aspect: "16/9",
      },
    },
  ],
  decisions: [
    {
      title:
        "Riconoscere i mittenti automatici dagli header, l'AI solo come fallback",
      why: "Newsletter e mittenti no-reply si dichiarano negli header dell'email. Leggerli non costa nulla e copre circa il 95% dei casi, così il modello viene chiamato solo per quelli davvero ambigui. Quelle email finiscono comunque su Pinecone come contesto: si salta soltanto la generazione della bozza.",
      tradeoff:
        "Un'euristica scritta a mano da mantenere via via che i mittenti cambiano il modo di identificarsi.",
    },
    {
      title: "Namespace Pinecone separati per scopo di retrieval",
      why: "Contesto e feedback rispondono a domande diverse. Tenerli distinti è la differenza tra una bozza informata da come scrivi e una bozza che deriva verso ciò che hai già rifiutato.",
      tradeoff:
        "Più namespace da gestire, e ogni nuovo tipo di segnale richiede una decisione esplicita su dove collocarlo.",
    },
    {
      title: "Un rule builder e un chatbot, non l'uno o l'altro",
      why: "Chi sa esattamente che cosa vuole non dovrebbe dover trattare con una chat, e chi non lo sa non dovrebbe dover imparare un form. Entrambe le superfici producono la stessa regola, quindi la scelta riguarda la comodità, non le funzionalità.",
      tradeoff:
        "Due interfacce su un solo modello: ogni cambiamento a ciò che una regola può fare deve arrivare in entrambe, e le conversazioni multi-turno con stato sono molto più difficili da testare di un form.",
    },
    {
      title:
        "Parallelizzazione e caching invece di un framework AI più pesante",
      why: "Il tempo di risposta che gli utenti percepiscono dipende da quante chiamate al modello girano in parallelo e da quante vengono evitate del tutto. Parallelizzazione con CompletableFuture, batching e una cache lazy per la valutazione dell'importanza hanno spostato i numeri; un ulteriore livello di astrazione no.",
      tradeoff:
        "Più concorrenza da governare, e il caching impone di essere espliciti su quando un verdetto obsoleto è accettabile.",
    },
    {
      title: "Analytics e infrastruttura ospitate in UE fin dall'inizio",
      why: "Nel sistema passano contenuti di email e i clienti sono europei. Scegliere servizi ospitati in UE quando la codebase era ancora piccola ha reso la data residency un'impostazione invece che una migrazione.",
      tradeoff:
        "Una scelta di provider più ristretta, a volte a un prezzo più alto.",
    },
  ],
  results: [
    {
      value: "~95%",
      label:
        "dei mittenti automatici identificati in fase di test dai soli header dell'email, a costo zero di token",
    },
    {
      value: "Gmail · Outlook",
      label:
        "Entrambi i provider supportati con un modello per singolo account, ognuno con il proprio flusso OAuth2",
    },
    {
      value: "Idempotente",
      label:
        "Una pipeline a webhook con chiavi tali che consegne ripetute non possono produrre una seconda bozza, etichetta o vettore",
    },
    {
      value: "2 strade",
      label:
        "Un rule builder e un assistente conversazionale che scrivono su un unico modello di automazione",
    },
  ],
  gallery: [
    {
      src: "/imgs/newmann-onboarding.png",
      alt: "Onboarding di Newmann: il collegamento di un account email",
      aspect: "16/9",
    },
    {
      src: "/imgs/newmann-rules.png",
      alt: "L'elenco delle regole di automazione in Newmann",
      aspect: "4/3",
    },
    {
      src: "/imgs/newmann-landing.png",
      alt: "La landing page di Newmann",
      aspect: "4/3",
    },
  ],
  learnings: [
    "Decidere prima l'architettura significa che ogni scorciatoia diventa l'eredità di qualcun altro. Isolare i provider per account, tenere separati i namespace di retrieval e rendere idempotente la pipeline sembravano tutte scelte sovradimensionate il primo giorno, e sono il motivo per cui altre due persone hanno potuto costruirci sopra senza rinegoziare le fondamenta.",
    "La chiamata AI più economica è quella che non fai. Leggere un header prima di ricorrere a un modello ha cambiato l'economia unitaria del prodotto più di qualsiasi ottimizzazione dei prompt.",
    "Il feedback non è un segnale solo. Trattare «non serviva rispondere» e «tono sbagliato» come lo stesso rifiuto ha insegnato in silenzio al sistema a smettere di essere utile, e separarli è stato un problema di modellazione molto prima che di prompting.",
    "Offrire due strade verso la stessa funzionalità è valso la superficie duplicata, ma solo perché entrambe scrivono su un unico modello di regola. Se avessi lasciato che il chatbot costruisse la sua versione abbreviata, le due sarebbero divergute nel giro di un mese.",
  ],
};

const atlasCaseStudy: CaseStudy = {
  tagline:
    "Un travel planner con AI che trasforma una destinazione e qualche preferenza in un itinerario giorno per giorno, con dati di volo reali alle spalle.",
  role: "Full Stack Developer",
  client: "Progetto personale",
  timeline: "2024",
  hero: {
    src: "/imgs/mockupAtlas.jpeg",
    alt: "La dashboard di Atlas mostrata su un mockup di laptop",
    aspect: "16/9",
  },
  overview: [
    "Atlas è una piattaforma full-stack per pianificare viaggi che ho progettato e costruito dall'inizio alla fine. Scegli una destinazione, imposti date e preferenze e Atlas genera un itinerario completo con l'AI, poi ci sovrappone dati di volo reali perché il piano sia qualcosa che puoi davvero prenotare.",
    "Ho seguito tutto il prodotto: il front-end React, la REST API in Java Spring Boot, il database PostgreSQL su Supabase, l'autenticazione con JWT e Google OAuth e la pipeline AI. È nato come un modo per capire fin dove potessi spingere gli LLM dentro un'applicazione vera, ed è diventato il progetto in cui ho imparato di più sulla performance.",
  ],
  challenge: {
    intro:
      "Pianificare un viaggio è frammentato: i voli su un sito, le idee sparse tra blog e mappe, e nessun posto che trasformi un'idea vaga in un piano concreto. L'obiettivo era costruire quel posto. La parte difficile è stata rendere la generazione AI abbastanza veloce da sembrare una funzionalità di prodotto e non una demo.",
    constraints: [
      "Il primo stack AI impiegava oltre cinque minuti per generare un singolo itinerario",
      "I dati di volo dovevano essere reali, tramite l'API Amadeus, con il suo flusso di autenticazione e i suoi rate limit",
      "L'accesso doveva funzionare sia con email e password sia con Google OAuth, su un progetto portato avanti da sola e senza budget",
    ],
  },
  process: [
    {
      title: "Progettare il flusso",
      body: "Ho mappato il percorso prima di scrivere codice: accesso, scelta della destinazione, regolazione delle preferenze, generazione, rifinitura. Ogni schermata risponde a una domanda sola, così il passaggio AI non sembra mai una scatola nera.",
      image: {
        src: "/imgs/atlas-pages.png",
        alt: "Panoramica delle schermate principali di Atlas",
        aspect: "4/3",
      },
    },
    {
      title: "Costruire l'API e il modello dati",
      body: "Il back-end Spring Boot espone una REST API per utenti, viaggi e itinerari, con PostgreSQL su Supabase. Le ricerche voli tramite Amadeus vivono in un servizio a parte, isolate dalle chiamate AI, così ogni integrazione può cambiare senza toccare l'altra.",
      image: {
        src: "/imgs/atlas-dashboard.png",
        alt: "La dashboard di Atlas con i viaggi salvati",
        aspect: "3/2",
      },
    },
    {
      title: "Rendere veloce l'AI",
      body: "La prima versione girava in Python con Ollama e un modello Mistral locale. Funzionava, ma un itinerario richiedeva più di cinque minuti. Ho spostato l'inferenza su Groq e OpenAI e ho rivisto i prompt di conseguenza, portando il tempo di risposta a pochi secondi.",
      image: {
        src: "/imgs/atlas-itinerary-generator.png",
        alt: "La schermata del generatore di itinerari di Atlas",
        aspect: "3/2",
      },
    },
  ],
  decisions: [
    {
      title: "Groq e OpenAI al posto di un modello locale",
      why: "L'inferenza locale era gratuita ma troppo lenta per un flusso interattivo. I modelli ospitati hanno reso la generazione quasi istantanea e mi hanno permesso di scegliere il modello giusto per ogni passaggio.",
      tradeoff: "Ora l'app dipende da provider esterni e paga a richiesta.",
    },
    {
      title: "JWT più Google OAuth",
      why: "Email e password con JWT mantengono la API stateless, mentre Google OAuth toglie attrito a chi vuole solo provare l'app.",
      tradeoff:
        "Due strade di accesso significano il doppio dei casi limite da gestire e testare.",
    },
    {
      title: "Voli reali dall'API Amadeus",
      why: "Un itinerario è utile solo se puoi agirci. I dati di volo in tempo reale rendono il piano prenotabile invece che un elenco di ipotesi.",
      tradeoff:
        "Un'integrazione in più da mantenere, con rate limit e un'autenticazione propria.",
    },
  ],
  results: [
    {
      value: "5 min → secondi",
      label:
        "Generazione AI dell'itinerario, prima e dopo il passaggio a Groq e OpenAI",
    },
    {
      value: "2",
      label: "Metodi di accesso: email e password con JWT, e Google OAuth",
    },
    {
      value: "Reali",
      label: "Dati di volo dall'API Amadeus dentro ogni piano",
    },
  ],
  gallery: [
    {
      src: "/imgs/atlas-signin.png",
      alt: "La schermata di accesso di Atlas",
      aspect: "16/9",
    },
    {
      src: "/imgs/atlas-auth.png",
      alt: "La schermata di autenticazione di Atlas",
      aspect: "4/3",
    },
    {
      src: "/imgs/atlas-navigation.png",
      alt: "La navigazione e la vista mappa di Atlas",
      aspect: "4/3",
    },
  ],
  learnings: [
    "La performance è una funzionalità di prodotto. Un'attesa di cinque minuti faceva sembrare l'AI rotta anche quando il risultato era buono; pochi secondi hanno reso lo stesso risultato immediato.",
    "Tenere ogni servizio di terze parti dietro il proprio livello ha ripagato nel momento in cui ho cambiato provider AI. La prossima volta definirei la forma dei dati dell'itinerario prima di scrivere il primo prompt, così front-end e modello vanno d'accordo dal primo giorno.",
  ],
};

const sacithLabCaseStudy: CaseStudy = {
  tagline:
    "Una vetrina bilingue di lusso per uno sgabello brevettato e regolabile in altezza, disegnata in Figma e costruita per essere raffinata quanto il prodotto che presenta.",
  role: "Full Stack Developer & UI/UX Designer",
  client: "Sacith S.r.l.",
  timeline: "2025",
  hero: {
    src: "/imgs/mockupSacithLab.svg",
    alt: "Il sito di Sacith Lab mostrato su un mockup di laptop",
    aspect: "4/3",
  },
  overview: [
    "Il sito di Sacith Lab è stato pensato come una vetrina di prodotto di lusso, per mettere in risalto modernità, eleganza e il design innovativo dello sgabello.",
    "Il sito unisce racconto visivo e precisione tecnica, creando un'esperienza immersiva sia per il pubblico italiano sia per quello inglese.",
    "Dai prototipi Figma all'implementazione, la piattaforma è stata costruita per valorizzare l'estetica del prodotto garantendo insieme accessibilità, performance ed esperienza d'uso fluida.",
  ],
  challenge: {
    intro:
      "Il cliente voleva un sito che posizionasse lo sgabello come un oggetto di design di fascia alta, capace di riflettere artigianalità e lusso contemporaneo. La sfida era tenere insieme un design minimalista, contenuti visivi ricchi e interazioni fluide, senza sacrificare velocità di caricamento e usabilità.",
    constraints: [
      "Un'esperienza bilingue, italiano e inglese, con contenuti che restino facili da mantenere",
      "Un design visivamente ricco ma minimalista, ottimizzato per la performance e per un accesso mobile-first",
      "Animazioni e caroselli fluidi che non rallentino mai la pagina",
    ],
  },
  process: [
    {
      title: "Design UI/UX in Figma",
      body: "In Figma sono stati creati un design system completo e prototipi ad alta fedeltà, per garantire un'interfaccia curata e coerente: tipografia equilibrata, gerarchia visiva raffinata e transizioni morbide, tutto scelto per evocare sofisticatezza ed eleganza contemporanea.",
      image: {
        src: "/imgs/sacith-lab-phones.svg",
        alt: "Le schermate mobile di Sacith Lab",
        aspect: "4/3",
      },
    },
    {
      title: "Contenuti bilingue su una base PHP modulare",
      body: "Il backend gira su PHP e MySQL e gestisce i contenuti e il routing modulare delle pagine. I testi italiani e inglesi vivono in file di traduzione JSON, così il cambio lingua è immediato e aggiungerne una nuova è questione di aggiungere un file.",
      image: {
        src: "/imgs/sacithLab.png",
        alt: "La homepage di Sacith Lab con il selettore di lingua italiano e inglese",
        aspect: "16/9",
      },
    },
    {
      title: "Motion, performance e messa online",
      body: "HTML5, Tailwind CSS e JavaScript vanilla, con AOS.js e Swiper.js per effetti allo scroll e caroselli che presentano lo sgabello come un oggetto di design di lusso. Il sito è ospitato su Aruba Linux via cPanel, aggiornato tramite Git e FTP e ottimizzato con immagini WebP, caching e buone pratiche di accessibilità.",
      image: {
        src: "/imgs/sacith-lab-dimensions.jpeg",
        alt: "La sezione dimensioni di Sacith Lab su un tablet",
        aspect: "4/3",
      },
    },
  ],
  decisions: [
    {
      title: "File di traduzione JSON per due lingue",
      why: "Gestire i contenuti italiani e inglesi in file JSON tiene le traduzioni una accanto all'altra, facili da modificare e scalabili verso nuove lingue.",
      tradeoff:
        "Le modifiche ai testi passano comunque da chi sviluppa, perché non c'è un'interfaccia di redazione.",
    },
    {
      title: "JavaScript vanilla con AOS.js e Swiper.js",
      why: "Una vetrina ha bisogno di movimento, non di stato applicativo. Due librerie piccole danno effetti allo scroll e caroselli senza il peso di un framework.",
      tradeoff:
        "Meno struttura su cui appoggiarsi se il sito dovesse diventare qualcosa di più interattivo.",
    },
    {
      title: "Hosting Aruba Linux con cPanel, Git e FTP",
      why: "PHP e MySQL girano nativamente sull'hosting del cliente e gli aggiornamenti partono via Git e FTP senza infrastruttura aggiuntiva.",
      tradeoff:
        "I deploy sono manuali, quindi ogni rilascio richiede attenzione e una checklist.",
    },
  ],
  results: [
    {
      value: "IT · EN",
      label:
        "Un sito bilingue che posiziona lo sgabello come un prodotto di design premium",
    },
    {
      value: "WebP",
      label:
        "Immagini ottimizzate e caching mantengono veloci e reattive pagine ricche di contenuti visivi",
    },
    {
      value: "Scalabile",
      label:
        "Una piattaforma pronta per prodotti e sviluppi futuri, costruita con il cliente a ogni giro di feedback",
    },
  ],
  gallery: [
    {
      src: "/imgs/sacith-lab-contact.png",
      alt: "La sezione contatti di Sacith Lab",
      aspect: "16/9",
    },
    {
      src: "/imgs/sacith-lab-colors.png",
      alt: "La sezione dei colori disponibili su mobile",
      aspect: "16/9",
    },
  ],
  learnings: [
    "Questo progetto ha approfondito la mia comprensione del design digitale di fascia alta e dell'internazionalizzazione, unendo racconto visivo, performance e usabilità. Ha rafforzato la mia capacità di progettare siti guidati dall'immagine che tengono insieme estetica e prestazioni.",
    "Gestire i contenuti bilingue con file di traduzione JSON mi ha dato un approccio mantenibile all'internazionalizzazione, e tradurre i design Figma in interfacce responsive ed eleganti ha affinato il mio flusso di lavoro dal design all'implementazione.",
    "Il lavoro a stretto contatto con il cliente, l'apertura al feedback e il miglioramento iterativo hanno reso la collaborazione parte del risultato tanto quanto il codice.",
  ],
};

const projects: Project[] = [
  {
    slug: "newmann",
    title: "Newmann",
    subtitle: "Assistente Email AI",
    category: "Sviluppo Web · AI Engineering",
    year: "Dal 2024 a oggi",
    description:
      "Piattaforma SaaS B2B che scrive bozze di risposta con la tua voce e trasforma descrizioni in linguaggio naturale in automazioni per la casella di posta, su Gmail e Outlook.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Java Spring Boot",
      "OpenAI",
      "Pinecone",
      "Supabase",
      "PostgreSQL",
      "Gmail API",
      "Microsoft Graph",
      "OAuth2",
      "Azure",
      "PostHog",
      "Resend",
      "GitHub Actions",
      "Vercel",
    ],
    image: "/imgs/newmann-landing.webp",
    links: { live: "#" },
    color: "#0f766e",
    caseStudy: newmannCaseStudy,
  },
  {
    slug: "atlas",
    title: "Atlas",
    subtitle: "Piattaforma di Pianificazione Viaggi",
    category: "Sviluppo Web · Integrazione AI",
    year: "2025",
    description:
      "Piattaforma di viaggio di nuova generazione che integra mappe interattive, ricerca intelligente e raccomandazioni AI in tempo reale.",
    tech: [
      "React 19",
      "Java Spring Boot",
      "PostgreSQL",
      "Groq",
      "OpenAI",
      "Amadeus API",
      "Google OAuth",
      "Supabase",
      "Tailwind CSS",
      "Vite",
      "Docker",
    ],
    image: "/imgs/mockupAtlas.jpeg",
    links: { live: "#", repo: "#" },
    color: "#4f46e5",
    caseStudy: atlasCaseStudy,
  },
  {
    slug: "sacith-lab",
    title: "Sacith Lab",
    subtitle: "Vetrina Prodotto di Lusso",
    category: "Sviluppo Web",
    year: "2025",
    description:
      "Vetrina bilingue di fascia alta per uno sgabello di lusso brevettato, realizzata per Sacith S.r.l. Costruita con HTML, PHP e Tailwind CSS.",
    tech: [
      "HTML",
      "PHP",
      "Tailwind CSS",
      "Figma",
      "JavaScript",
      "MySQL",
      "AOS.js",
      "Swiper.js",
      "Aruba Linux",
    ],
    image: "/imgs/mockupSacithLab.svg",
    links: { live: "#" },
    color: "#d97706",
    caseStudy: sacithLabCaseStudy,
  },
  {
    slug: "sacith",
    title: "Sacith",
    subtitle: "Catalogo Prodotti",
    category: "Sviluppo Web · SEO",
    year: "2024–2025",
    description:
      "Catalogo prodotti bilingue e moderno per Sacith S.r.l., azienda italiana di sistemi di aeromassaggio. Ottimizzazione SEO completa con integrazione di Google Analytics.",
    tech: ["PHP", "MySQL", "JavaScript", "Tailwind CSS"],
    image: "/imgs/mockupSacith.png",
    links: { live: "#" },
    color: "#059669",
  },
  {
    slug: "novavice",
    title: "NovaVice",
    subtitle: "Sito per Studio di Architettura",
    category: "Sviluppo Web",
    year: "2025",
    description:
      "Sito di uno studio di architettura in cui il movimento è l'esperienza centrale. Animazioni GSAP fluide costruiscono un'esplorazione immersiva.",
    tech: ["HTML", "CSS", "JavaScript", "GSAP"],
    image: "/imgs/mockupNovaVice.png",
    links: { live: "#", repo: "#" },
    color: "#7c3aed",
  },
  {
    slug: "awwwards",
    title: "Awwwards",
    subtitle: "Universo Interattivo",
    category: "Sviluppo Web",
    year: "2024",
    description:
      "Universo immersivo con una ricca gamma di prodotti in un'esperienza a overlay interconnessi. Animazioni GSAP avanzate e integrazione video.",
    tech: ["React", "GSAP", "Video"],
    image: "/imgs/mockupAwwwards.png",
    links: { live: "#", repo: "#" },
    color: "#2563eb",
  },
];

const it: Dictionary = {
  // TODO: sostituire con il CV in italiano quando disponibile
  // (per ora punta alla versione inglese, l'unica presente in public/cv).
  cvUrl: "/cv/LuisaCerinOgbeiwi_cv_en.pdf",

  meta: {
    title: "Luisa Cerin Ogbeiwi — Software & AI Developer",
    description:
      "Full-stack developer: creo siti moderni e interfacce curate, unendo design e codice per dare vita a esperienze digitali uniche.",
    keywords: [
      "sviluppo web",
      "sviluppatore web",
      "sviluppatrice web",
      "designer",
      "full-stack",
      "React",
      "Next.js",
      "TypeScript",
      "Milano",
      "Gallarate",
      "freelance",
      "portfolio",
      "siti web moderni",
      "interfacce curate",
      "esperienze digitali",
      "Luisa Cerin Ogbeiwi",
      "integrazione AI",
      "UI/UX",
      "design responsive",
      "frontend",
      "backend",
    ],
    projectsTitle: "Progetti — Luisa Cerin Ogbeiwi",
    projectsDescription:
      "Una selezione di progetti tra sviluppo web, design UI/UX e applicazioni mobile.",
    contactTitle: "Contatti — Luisa Cerin Ogbeiwi",
    contactDescription:
      "Hai un progetto in mente, un'offerta di lavoro o vuoi solo salutare? Scrivimi.",
    caseStudySuffix: "Case study · Luisa Cerin Ogbeiwi",
    notFoundTitle: "Pagina non trovata — Luisa Cerin Ogbeiwi",
  },

  notFound: {
    label: "Errore 404",
    code: "404",
    title: "Pagina",
    titleAccent: "non trovata",
    body: "La pagina che cerchi non esiste, oppure si è spostata altrove. Da qui puoi tornare indietro.",
    home: "Torna alla home →",
    projects: "Vedi i progetti",
  },

  nav: {
    projects: "Progetti",
    services: "Servizi",
    skills: "Competenze",
    experience: "Esperienza",
    contact: "Contatti",
  },

  header: {
    getInTouch: "Scrivimi",
    menu: "Menu",
    close: "Chiudi",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
    switchLanguage: "Cambia lingua",
    info: {
      status: "Stato",
      statusValue: "Disponibile per progetti",
      email: "Email",
      linkedin: "Linkedin",
      cv: "CV",
      cvValue: "Apri il PDF ↗",
      location: "Sede",
      locationValue: "Gallarate, Italia",
    },
  },

  hero: {
    line1: "Software & AI",
    line2: "Developer",
    based: "Con base a Gallarate, Italia",
    availability: "Disponibile per freelance",
    blurb:
      "Creo siti moderni e interfacce curate — unendo design e codice per dare vita a esperienze digitali uniche.",
  },

  projectsBanner: {
    label: "Lavori selezionati",
    title: "Progetti",
    titleItalic: "& lavori",
  },

  services: {
    label: "Che cosa faccio",
    title: "Servizi",
    items: [
      {
        icon: "💻",
        title: "Sviluppo Software",
        subtitle: "Full Stack",
        description:
          "Do vita alla tua idea. Collaboro per sviluppare siti che rappresentino davvero la tua identità e il tuo stile — dal database all'interfaccia.",
        tech: ["React", "Next.js", "Node.js", "TypeScript", "Java Spring Boot"],
      },
      {
        icon: "✦",
        title: "Design UI/UX",
        subtitle: "Design System",
        description:
          "Costruisco la tua presenza online. Progetto siti che non solo sono belli da vedere, ma raccontano la tua storia con chiarezza ed eleganza.",
        tech: ["Figma", "Tailwind CSS", "GSAP", "Framer Motion"],
      },
      {
        icon: "◈",
        title: "Integrazione AI",
        subtitle: "Soluzioni Intelligenti",
        description:
          "Soluzioni intelligenti per esigenze moderne. Integro l'AI nel tuo prodotto per migliorare l'esperienza d'uso e semplificare le operazioni.",
        tech: ["OpenAI", "Groq", "Pinecone", "LangChain"],
      },
    ],
  },

  skills: {
    label: "Stack tecnologico",
    title: "Competenze",
    groups: {
      Frontend: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "SASS",
        "GSAP",
        "Framer Motion",
        "Redux",
        "React Query",
        "Bootstrap",
        "Material UI",
        "Zod",
        "Jest",
        "React Testing Library",
        "Axios",
        "Ant Design",
      ],
      Backend: [
        "Java Spring Boot",
        "Node.js",
        "Express.js",
        "PHP",
        "REST APIs",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Firebase",
        "Python",
      ],
      "Strumenti & Piattaforme": [
        "Figma",
        "Git",
        "GitHub",
        "Bitbucket",
        "Docker",
        "Vercel",
        "Render",
        "Supabase",
        "Firebase",
        "Postman",
        "GA",
        "GTM",
        "OpenAI API",
        "Pinecone",
        "PostHog",
        "GCP",
        "Azure",
        "PhpMyAdmin",
      ],
    },
  },

  about: {
    label: "Chi sono",
    bio: "Full-stack e AI developer con base a Gallarate. Costruisco esperienze digitali che uniscono un design pensato a codice pulito e scalabile, integrando modelli LLM nei prodotti: assistenti conversazionali, automazioni e funzionalità basate su RAG. Attualmente studio Comunicazione Digitale e Informatica all'Università degli Studi di Milano.",
    facts: {
      location: "Sede",
      locationValue: "Gallarate, Italia",
      university: "Università",
      universityValue: "Univ. degli Studi di Milano",
      languages: "Lingue",
      languagesValue: "Italiano · Inglese (B2)",
      status: "Stato",
      statusValue: "Disponibile per nuove opportunità",
      cv: "CV",
      cvValue: "Apri il PDF ↗",
    },
  },

  experience: {
    label: "Percorso",
    title: "Esperienza",
    items: [
      {
        role: "Frontend Developer",
        company: "Contactlab (Gruppo TeamSystem)",
        location: "Milano",
        period: "Marzo 2026 — oggi",
        tech: ["React", "TypeScript", "fp-ts", "Ant Design"],
        bullets: [
          "Sviluppo del front-end di una Customer Data Platform (CDP) con React, TypeScript e paradigmi di programmazione funzionale con fp-ts",
          "Realizzazione di componenti UI complessi con Ant Design",
          "Lavoro in un team Agile su una codebase enterprise, con attenzione alla qualità del codice e ai pattern riutilizzabili",
        ],
      },
      {
        role: "Junior Developer",
        company: "HRM Group",
        location: "Milano",
        period: "Novembre 2024 — Marzo 2026",
        tech: [
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "SCSS",
          "Ant Design",
          "Java Spring Boot",
        ],
        bullets: [
          "Costruzione e manutenzione da zero dell'architettura front-end del prodotto principale, traducendo i design Figma in interfacce completamente responsive",
          "Integrazione di funzionalità back-end con Java Spring Boot, migliorando i flussi di dati e l'affidabilità del sistema",
          "Contributo a più di due progetti Agile, con componenti riutilizzabili e ottimizzazione della cache del data layer",
          "Affiancamento di una persona in stage: documentazione e materiali di onboarding che hanno ridotto del 40% i tempi di inserimento",
        ],
      },
      {
        role: "Founding Engineer & Tech Lead",
        company: "Newmann AI",
        location: "Da remoto",
        period: "2024 — oggi",
        tech: [
          "Next.js",
          "TypeScript",
          "React",
          "fp-ts",
          "Java Spring Boot",
          "Spring AI",
          "Supabase",
          "PostgreSQL",
          "OpenAI",
          "Pinecone",
          "PostHog",
          "Resend",
          "GitHub Actions",
          "Vercel",
          "Render",
        ],
        bullets: [
          "Ingresso dal primo giorno come Founding Engineer e Tech Lead di una piattaforma AI (attualmente in MVP) che automatizza la gestione della posta con automazioni di etichette e regole guidate dall'NLP, integrata con Gmail e Microsoft/Azure",
          "Responsabilità dell'AI engineering con Spring AI: tutti i prompt scritti da zero e pipeline di retrieval progettata con Pinecone per la ricerca semantica",
          "Progettazione dell'intera architettura dello stack, dalla scelta delle tecnologie al design della REST API con Java Spring Boot; frontend Next.js/React con fp-ts e PostgreSQL su Supabase con RLS e supporto multilingua",
          "Allestimento e gestione dell'intera infrastruttura: CI/CD con GitHub Actions, deploy su Vercel e Render, analytics con PostHog EU ed email transazionali via Resend",
        ],
      },
      {
        role: "Founding Engineer",
        company: "Macrobite",
        period: "2025 — oggi",
        tech: ["React", "TypeScript", "Supabase", "Supabase Edge Functions"],
        bullets: [
          "Ingresso dal primo giorno come Founding Engineer, con contributo alla definizione di prodotto e allo sviluppo della web app",
          "Macrobite (attualmente in MVP) permette di ordinare cibo consegnato in armadietti refrigerati installati nelle palestre, con accesso tramite PIN o QR code generati automaticamente al checkout",
          "Valutazione di diverse soluzioni hardware (TTLock, Seam API, igloohome, Akiles) e implementazione della logica di accesso con Supabase Edge Functions e un frontend React",
        ],
      },
      {
        role: "Full Stack Developer freelance",
        company: "Sacith s.r.l.",
        location: "Cassano Magnago",
        period: "Febbraio 2025 — oggi",
        tech: [
          "PHP",
          "HTML",
          "Tailwind CSS",
          "JavaScript",
          "SQL",
          "GA4",
          "GTM",
          "Google Search Console",
        ],
        bullets: [
          "Gestione autonoma dell'intero ciclo di sviluppo del sito vetrina e del catalogo prodotti digitale",
          "Comunicazione diretta con il cliente per raccogliere i requisiti e iterare sul feedback UX in sprint bisettimanali",
          "Applicazione delle best practice SEO e integrazione di GA4, GTM e Search Console (+35% di traffico organico)",
          "Realizzazione di una dashboard interna in PHP + SQL per la gestione autonoma dei prodotti",
        ],
      },
    ],
  },

  footer: {
    line1: "Hai un progetto",
    line2: "in mente?",
    cta: "Scrivimi →",
    role: "Software & AI Developer · Gallarate, Italia",
    github: "GitHub",
    linkedin: "LinkedIn",
  },

  projectsPage: {
    label: "Tutti i progetti",
    title: "I miei",
    titleAccent: "Lavori",
    intro:
      "Una selezione di progetti tra sviluppo web, design UI/UX e applicazioni mobile.",
    caseStudy: "Case study →",
    viewSite: "Vai al sito ↗",
    github: "GitHub →",
  },

  contactPage: {
    label: "Mettiti in contatto",
    title: "Parliamo",
    titleAccent: "insieme",
    intro:
      "Hai un progetto in mente, un'offerta di lavoro o vuoi solo salutare? Mi fa piacere sentirti.",
    email: "Email",
    phone: "Telefono",
    location: "Sede",
    locationValue: "Gallarate, Italia",
    socials: "Social",
    cv: "CV",
    sentTitle: "Messaggio inviato!",
    sentBody: "Grazie per avermi scritto. Ti rispondo entro 24 ore.",
    nameLabel: "Nome *",
    namePlaceholder: "Il tuo nome",
    emailLabel: "Email *",
    emailPlaceholder: "tua@email.com",
    subjectLabel: "Oggetto",
    subjectPlaceholder: "Scegli un argomento",
    subjects: {
      landing: "Landing page",
      ecommerce: "E-commerce",
      fullstack: "Progetto full-stack",
      job: "Offerta di lavoro",
      other: "Altro",
    },
    messageLabel: "Messaggio *",
    messagePlaceholder: "Raccontami il tuo progetto o la tua idea...",
    sending: "Invio in corso...",
    send: "Invia il messaggio →",
  },

  caseStudy: {
    allProjects: "← Tutti i progetti",
    counter: "Case study",
    role: "Ruolo",
    type: "Tipo",
    year: "Anno",
    category: "Categoria",
    viewSite: "Vai al sito ↗",
    github: "GitHub →",
    overview: "Panoramica",
    challenge: "La sfida",
    process: "Processo",
    processTitle: "Come è nato",
    decisions: "Decisioni chiave",
    decisionsTitle: "Le scelte che hanno definito il prodotto",
    why: "Perché",
    tradeoff: "Compromesso",
    results: "Risultati",
    resultsTitle: "Che cosa è cambiato",
    gallery: "Galleria",
    learnings: "Che cosa ho imparato",
    nextProject: "Progetto successivo",
    moreWork: "Altri lavori",
  },

  projects,
};

export default it;

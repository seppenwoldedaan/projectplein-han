const baseProjects = [
  {
    id: "circulair-lab",
    title: "Ontwerp een circulair materialenlab",
    programme: "Bouwkunde",
    subject: "Duurzaamheid",
    location: "Arnhem",
    duration: "20 weken",
    deadline: "18 september 2026",
    client: "Gemeente Arnhem",
    skills: ["Onderzoek", "Ontwerpen", "Samenwerken"],
    spots: 4,
    intro: "Onderzoek hoe restmaterialen uit bouwprojecten opnieuw ingezet kunnen worden in de stad.",
    description: "De gemeente wil materialen uit renovatieprojecten beter hergebruiken. Je brengt materiaalstromen in kaart, spreekt betrokken organisaties en ontwikkelt een tastbaar concept voor een lokaal materialenlab.",
    result: "Een onderbouwd concept, een ruimtelijk voorstel en een praktisch advies voor de eerste pilot."
  },
  {
    id: "zorgapp",
    title: "Maak zorginformatie begrijpelijker",
    programme: "Communication & Multimedia Design",
    subject: "Digitale toegankelijkheid",
    location: "Nijmegen",
    duration: "10 weken",
    deadline: "22 september 2026",
    client: "Radboudumc",
    skills: ["UX-onderzoek", "Prototyping", "Testen"],
    spots: 3,
    intro: "Ontwerp een toegankelijk digitaal concept voor patiënten die moeite hebben met medische informatie.",
    description: "Veel patiënten vinden online zorginformatie ingewikkeld. Je onderzoekt hun behoeften, test bestaande informatie en maakt een klikbaar prototype dat de belangrijkste uitleg duidelijker aanbiedt.",
    result: "Een getest prototype met ontwerpprincipes die de opdrachtgever verder kan toepassen."
  },
  {
    id: "energie-dashboard",
    title: "Breng energiegebruik van de campus tot leven",
    programme: "HBO-ICT",
    subject: "Data en energie",
    location: "Arnhem",
    duration: "20 weken",
    deadline: "25 september 2026",
    client: "HAN Campusbeheer",
    skills: ["Frontend", "Datavisualisatie", "API's"],
    spots: 5,
    intro: "Bouw een dashboard waarmee studenten en medewerkers energiegebruik kunnen begrijpen en vergelijken.",
    description: "De campus verzamelt veel energiedata, maar deze data is nog niet zichtbaar voor gebruikers. Je ontwikkelt een helder dashboard met actuele inzichten en concrete handelingsperspectieven.",
    result: "Een werkende webapplicatie en een overdraagbaar technisch ontwerp."
  },
  {
    id: "beweegroute",
    title: "Een beweegroute voor iedere buurtbewoner",
    programme: "Sportkunde",
    subject: "Gezondheid",
    location: "Nijmegen",
    duration: "12 weken",
    deadline: "30 september 2026",
    client: "Sportbedrijf Nijmegen",
    skills: ["Co-creatie", "Organiseren", "Evalueren"],
    spots: 6,
    intro: "Ontwikkel samen met bewoners een toegankelijke route die dagelijks bewegen stimuleert.",
    description: "In een diverse wijk wil het sportbedrijf laagdrempelig bewegen stimuleren. Je werkt samen met bewoners, buurtsportcoaches en lokale organisaties aan een route en activiteitenprogramma.",
    result: "Een geteste route, communicatiemiddelen en een advies voor duurzame uitvoering."
  },
  {
    id: "slimme-logistiek",
    title: "Verminder lege kilometers in stadslogistiek",
    programme: "Logistics Management",
    subject: "Slimme mobiliteit",
    location: "Hybride",
    duration: "20 weken",
    deadline: "3 oktober 2026",
    client: "Logistiek Collectief Gelderland",
    skills: ["Data-analyse", "Procesontwerp", "Adviseren"],
    spots: 4,
    intro: "Onderzoek hoe lokale vervoerders ritten kunnen combineren en ontwikkel een haalbare aanpak.",
    description: "Kleine vervoerders rijden regelmatig met onbenutte capaciteit. Je analyseert ritgegevens, onderzoekt samenwerkingsmogelijkheden en ontwerpt een proces om vraag en aanbod slimmer te koppelen.",
    result: "Een doorgerekend scenario en een plan voor een gezamenlijke praktijkproef."
  },
  {
    id: "taalmaatjes",
    title: "Versterk het netwerk van taalmaatjes",
    programme: "Social Work",
    subject: "Inclusie",
    location: "Arnhem",
    duration: "10 weken",
    deadline: "7 oktober 2026",
    client: "Stichting Rijnstad",
    skills: ["Interviewen", "Netwerkvorming", "Communicatie"],
    spots: 3,
    intro: "Help een lokaal taalmaatjesprogramma meer deelnemers te bereiken en beter te ondersteunen.",
    description: "Het taalmaatjesprogramma groeit, maar deelnemers haken soms vroeg af. Je onderzoekt hun ervaringen en ontwikkelt samen met vrijwilligers een aanpak die betrokkenheid versterkt.",
    result: "Een praktisch verbeterplan en middelen die direct in de begeleiding gebruikt kunnen worden."
  }
];

const state = {
  user: JSON.parse(localStorage.getItem("projectplein-user") || "null"),
  applications: JSON.parse(localStorage.getItem("projectplein-applications") || "[]"),
  customProjects: JSON.parse(localStorage.getItem("projectplein-custom") || "[]"),
  pendingProject: sessionStorage.getItem("projectplein-pending") || null,
  filters: { query: "", programme: "", subject: "", location: "" }
};

const allProjects = () => [...state.customProjects, ...baseProjects];
const main = document.querySelector("#main");
const accountActions = document.querySelector("#account-actions");
const toast = document.querySelector("#toast");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function unique(key) {
  return [...new Set(allProjects().map((project) => project[key]))].sort();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function setAccountActions() {
  if (state.user) {
    accountActions.innerHTML = `
      <span class="account-name">${escapeHtml(state.user.name)}</span>
      <button class="button-light" id="logout-button" type="button">Uitloggen</button>
    `;
    document.querySelector("#logout-button").addEventListener("click", () => {
      state.user = null;
      localStorage.removeItem("projectplein-user");
      showToast("Je bent uitgelogd");
      route();
    });
  } else {
    accountActions.innerHTML = `<a class="button button-pink" href="#/login">Inloggen</a>`;
  }
}

function projectCard(project) {
  const isApplied = state.applications.includes(project.id);
  return `
    <article class="project-card">
      <div class="meta">
        <span class="tag tag-pink">${escapeHtml(project.programme)}</span>
        <span class="tag">${escapeHtml(project.location)}</span>
      </div>
      <h2>${escapeHtml(project.title)}</h2>
      <p>${escapeHtml(project.intro)}</p>
      <div class="tag-row">
        ${project.skills.slice(0, 2).map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <a class="button ${isApplied ? "button-light" : ""}" href="#/project/${project.id}">
          ${isApplied ? "Inschrijving bekijken" : "Bekijk project"}
        </a>
      </div>
    </article>
  `;
}

function homePage() {
  const count = allProjects().length;
  main.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Projecten uit de praktijk</p>
        <h1>Vind jouw volgende uitdaging.</h1>
        <p>Ontdek projecten van opleidingen en opdrachtgevers. Kies wat bij je past en schrijf je direct in.</p>
        <div class="hero-actions">
          <a class="button button-white" href="#/projects">Bekijk alle projecten</a>
          <a class="button" href="#/my-projects">Mijn inschrijvingen</a>
        </div>
      </div>
      <aside class="hero-side" aria-label="Projectplein in cijfers">
        <div class="hero-stat"><strong>${count}</strong><span>open projecten</span></div>
        <div class="hero-stat"><strong>${unique("programme").length}</strong><span>opleidingen</span></div>
      </aside>
    </section>
    <section class="intro-strip" aria-label="Zo werkt het">
      <article class="intro-step"><strong>01</strong><h2>Zoek</h2><p>Filter op opleiding, onderwerp en locatie.</p></article>
      <article class="intro-step"><strong>02</strong><h2>Kies</h2><p>Lees wat je gaat doen en wat er van je wordt verwacht.</p></article>
      <article class="intro-step"><strong>03</strong><h2>Schrijf je in</h2><p>Log in via de OSIRIS-demo en bevestig je plek.</p></article>
    </section>
  `;
}

function optionList(values, selected, placeholder) {
  return `<option value="">${placeholder}</option>${values
    .map((value) => `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>`)
    .join("")}`;
}

function projectsPage() {
  main.innerHTML = `
    <div class="page-shell">
      <div class="page-heading">
        <div><p class="eyebrow">Aanbod</p><h1 class="page-title">Projecten</h1><p>Vind een praktijkvraagstuk dat past bij jouw leerdoelen.</p></div>
      </div>
      <form class="filters" id="filter-form">
        <div class="field"><label for="query">Zoeken</label><input id="query" name="query" type="search" placeholder="Zoek op titel, opdrachtgever of vaardigheid" value="${escapeHtml(state.filters.query)}"></div>
        <div class="field"><label for="programme">Opleiding</label><select id="programme" name="programme">${optionList(unique("programme"), state.filters.programme, "Alle opleidingen")}</select></div>
        <div class="field"><label for="subject">Onderwerp</label><select id="subject" name="subject">${optionList(unique("subject"), state.filters.subject, "Alle onderwerpen")}</select></div>
        <div class="field"><label for="location">Locatie</label><select id="location" name="location">${optionList(unique("location"), state.filters.location, "Alle locaties")}</select></div>
      </form>
      <div class="results-bar"><strong id="result-count"></strong><button class="text-button" id="clear-filters" type="button">Wis filters</button></div>
      <div class="project-grid" id="project-grid"></div>
    </div>
  `;

  const filterForm = document.querySelector("#filter-form");
  const renderResults = () => {
    const query = state.filters.query.toLowerCase();
    const projects = allProjects().filter((project) => {
      const haystack = [project.title, project.client, project.intro, ...project.skills].join(" ").toLowerCase();
      return (!query || haystack.includes(query)) &&
        (!state.filters.programme || project.programme === state.filters.programme) &&
        (!state.filters.subject || project.subject === state.filters.subject) &&
        (!state.filters.location || project.location === state.filters.location);
    });
    document.querySelector("#result-count").textContent = `${projects.length} ${projects.length === 1 ? "project" : "projecten"} gevonden`;
    document.querySelector("#project-grid").innerHTML = projects.length
      ? projects.map(projectCard).join("")
      : `<div class="empty-state"><h2>Geen projecten gevonden</h2><p>Pas je zoekopdracht of filters aan.</p></div>`;
  };

  filterForm.addEventListener("input", (event) => {
    state.filters[event.target.name] = event.target.value;
    renderResults();
  });
  document.querySelector("#clear-filters").addEventListener("click", () => {
    state.filters = { query: "", programme: "", subject: "", location: "" };
    projectsPage();
  });
  renderResults();
}

function detailPage(id) {
  const project = allProjects().find((item) => item.id === id);
  if (!project) return notFoundPage();
  const isApplied = state.applications.includes(project.id);
  main.innerHTML = `
    <div class="page-shell">
      <a class="back-link" href="#/projects">Terug naar projecten</a>
      <div class="detail-layout">
        <article class="detail-main">
          <p class="eyebrow">${escapeHtml(project.programme)}</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="lead">${escapeHtml(project.intro)}</p>
          <h2>De opdracht</h2><p>${escapeHtml(project.description)}</p>
          <h2>Wat lever je op?</h2><p>${escapeHtml(project.result)}</p>
          <h2>Vaardigheden</h2><div class="tag-row">${project.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}</div>
        </article>
        <aside class="detail-panel">
          <h2>Projectinformatie</h2>
          <dl class="facts">
            <div><dt>Opleiding</dt><dd>${escapeHtml(project.programme)}</dd></div>
            <div><dt>Onderwerp</dt><dd>${escapeHtml(project.subject)}</dd></div>
            <div><dt>Locatie</dt><dd>${escapeHtml(project.location)}</dd></div>
            <div><dt>Duur</dt><dd>${escapeHtml(project.duration)}</dd></div>
            <div><dt>Deadline</dt><dd>${escapeHtml(project.deadline)}</dd></div>
            <div><dt>Opdrachtgever</dt><dd>${escapeHtml(project.client)}</dd></div>
            <div><dt>Plekken</dt><dd>${escapeHtml(project.spots)} beschikbaar</dd></div>
          </dl>
          ${isApplied
            ? `<div class="notice notice-success"><strong>Je bent ingeschreven</strong><br>Je plek is direct bevestigd.</div><a class="button button-white" href="#/my-projects">Bekijk inschrijving</a>`
            : `<button class="button button-pink" id="apply-button" type="button">Schrijf mij in</button>`}
        </aside>
      </div>
    </div>
  `;
  document.querySelector("#apply-button")?.addEventListener("click", () => applyForProject(project.id));
}

function applyForProject(id) {
  if (!state.user) {
    state.pendingProject = id;
    sessionStorage.setItem("projectplein-pending", id);
    location.hash = "#/login";
    return;
  }
  if (!state.applications.includes(id)) {
    state.applications.push(id);
    localStorage.setItem("projectplein-applications", JSON.stringify(state.applications));
  }
  sessionStorage.removeItem("projectplein-pending");
  state.pendingProject = null;
  location.hash = `#/success/${id}`;
}

function loginPage() {
  main.innerHTML = `
    <section class="auth-wrap">
      <div class="auth-copy"><p class="eyebrow">Studentenlogin</p><h1>Verder met OSIRIS HAN</h1><p>Log in om je direct voor een project in te schrijven.</p></div>
      <div class="auth-form">
        <div class="demo-note"><strong>Dit is een demonstratie.</strong><br>Er worden geen echte OSIRIS-gegevens gebruikt of verstuurd.</div>
        <form id="login-form">
          <div class="field"><label for="student-number">Studentnummer</label><input id="student-number" name="studentNumber" required placeholder="s1234567" autocomplete="username"></div>
          <div class="field"><label for="student-name">Naam</label><input id="student-name" name="name" required placeholder="Jouw naam" autocomplete="name"></div>
          <button class="button button-pink" type="submit">Inloggen via OSIRIS-demo</button>
        </form>
      </div>
    </section>
  `;
  document.querySelector("#login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    state.user = { studentNumber: data.get("studentNumber"), name: data.get("name") };
    localStorage.setItem("projectplein-user", JSON.stringify(state.user));
    setAccountActions();
    showToast("Je bent ingelogd");
    if (state.pendingProject) applyForProject(state.pendingProject);
    else location.hash = "#/projects";
  });
}

function successPage(id) {
  const project = allProjects().find((item) => item.id === id);
  if (!project) return notFoundPage();
  main.innerHTML = `
    <section class="success-wrap">
      <div class="success-card">
        <p class="eyebrow">Inschrijving definitief</p>
        <h1>Je doet mee.</h1>
        <p class="lead">Je bent ingeschreven voor <strong>${escapeHtml(project.title)}</strong>.</p>
        <div class="notice notice-success">De opleiding ziet je inschrijving direct. In een echte versie ontvang je nu ook een bevestiging per e-mail.</div>
        <div class="form-actions"><a class="button" href="#/my-projects">Mijn inschrijvingen</a><a class="button button-light" href="#/projects">Meer projecten</a></div>
      </div>
    </section>
  `;
}

function myProjectsPage() {
  if (!state.user) {
    main.innerHTML = `<div class="page-shell"><div class="empty-state"><p class="eyebrow">Mijn inschrijvingen</p><h1>Log in om verder te gaan</h1><p>Na het inloggen zie je hier alle projecten waarvoor je bent ingeschreven.</p><a class="button button-pink" href="#/login">Inloggen via OSIRIS-demo</a></div></div>`;
    return;
  }
  const projects = allProjects().filter((project) => state.applications.includes(project.id));
  main.innerHTML = `
    <div class="page-shell">
      <div class="page-heading"><div><p class="eyebrow">Welkom, ${escapeHtml(state.user.name)}</p><h1 class="page-title">Mijn inschrijvingen</h1></div></div>
      ${projects.length
        ? `<div class="notice notice-success"><strong>${projects.length} definitieve ${projects.length === 1 ? "inschrijving" : "inschrijvingen"}</strong><br>De opleiding kan deze inschrijvingen bekijken.</div><div class="project-grid">${projects.map(projectCard).join("")}</div>`
        : `<div class="empty-state"><h2>Nog geen inschrijvingen</h2><p>Bekijk het aanbod en kies een project dat bij je past.</p><a class="button button-pink" href="#/projects">Projecten bekijken</a></div>`}
    </div>
  `;
}

function educationPage() {
  const applications = state.applications.length;
  main.innerHTML = `
    <div class="page-shell">
      <div class="page-heading"><div><p class="eyebrow">Beheeromgeving demo</p><h1 class="page-title">Voor opleidingen</h1><p>Plaats een project en bekijk wat er gebeurt met het aanbod.</p></div></div>
      <div class="dashboard-grid">
        <aside class="dashboard-nav"><h2>Projectbeheer</h2><p>Deze kant van het prototype laat zien hoe een opleiding een nieuw project kan publiceren.</p><p><strong>Demo-organisatie</strong><br>HAN Academie</p></aside>
        <div>
          <div class="metric-grid">
            <div class="metric"><strong>${allProjects().length}</strong><span>projecten actief</span></div>
            <div class="metric"><strong>${applications}</strong><span>inschrijvingen</span></div>
            <div class="metric"><strong>${unique("programme").length}</strong><span>opleidingen</span></div>
          </div>
          <form class="editor-form" id="project-form">
            <h2>Nieuw project plaatsen</h2>
            <div class="field"><label for="title">Projecttitel</label><input id="title" name="title" required placeholder="Bijvoorbeeld: Ontwerp de campus van morgen"></div>
            <div class="form-row">
              <div class="field"><label for="new-programme">Opleiding</label><input id="new-programme" name="programme" required placeholder="Naam van de opleiding"></div>
              <div class="field"><label for="new-subject">Onderwerp</label><input id="new-subject" name="subject" required placeholder="Bijvoorbeeld: Duurzaamheid"></div>
            </div>
            <div class="form-row">
              <div class="field"><label for="new-location">Locatie</label><select id="new-location" name="location"><option>Arnhem</option><option>Nijmegen</option><option>Hybride</option><option>Online</option></select></div>
              <div class="field"><label for="new-duration">Duur</label><input id="new-duration" name="duration" required placeholder="Bijvoorbeeld: 10 weken"></div>
            </div>
            <div class="form-row">
              <div class="field"><label for="new-deadline">Deadline</label><input id="new-deadline" name="deadline" type="date" required></div>
              <div class="field"><label for="new-client">Opdrachtgever</label><input id="new-client" name="client" required placeholder="Naam organisatie"></div>
            </div>
            <div class="field"><label for="new-skills">Benodigde vaardigheden</label><input id="new-skills" name="skills" required placeholder="Scheid vaardigheden met een komma"></div>
            <div class="field"><label for="new-intro">Korte omschrijving</label><textarea id="new-intro" name="intro" required placeholder="Wat gaat de student onderzoeken, ontwerpen of uitvoeren?"></textarea></div>
            <button class="button button-pink" type="submit">Project direct publiceren</button>
          </form>
        </div>
      </div>
    </div>
  `;
  document.querySelector("#project-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const project = {
      id: `demo-${Date.now()}`,
      title: data.title,
      programme: data.programme,
      subject: data.subject,
      location: data.location,
      duration: data.duration,
      deadline: new Date(`${data.deadline}T12:00:00`).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }),
      client: data.client,
      skills: data.skills.split(",").map((item) => item.trim()).filter(Boolean),
      spots: 4,
      intro: data.intro,
      description: data.intro,
      result: "Een praktisch eindresultaat dat met de opdrachtgever wordt afgesproken."
    };
    state.customProjects.unshift(project);
    localStorage.setItem("projectplein-custom", JSON.stringify(state.customProjects));
    showToast("Project is gepubliceerd");
    location.hash = `#/project/${project.id}`;
  });
}

function notFoundPage() {
  main.innerHTML = `<div class="page-shell"><div class="empty-state"><h1>Pagina niet gevonden</h1><p>Deze pagina bestaat niet of is verplaatst.</p><a class="button button-pink" href="#/">Naar de startpagina</a></div></div>`;
}

function route() {
  setAccountActions();
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [page, id] = parts;
  if (!page) homePage();
  else if (page === "projects") projectsPage();
  else if (page === "project" && id) detailPage(id);
  else if (page === "login") loginPage();
  else if (page === "success" && id) successPage(id);
  else if (page === "my-projects") myProjectsPage();
  else if (page === "opleiding") educationPage();
  else notFoundPage();
  window.scrollTo({ top: 0, behavior: "instant" });
  main.focus({ preventScroll: true });
}

window.addEventListener("hashchange", route);
route();

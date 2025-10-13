let episodesData = [];
let currentLang = "en"; // idioma inicial

// Carrega JSON
fetch('episodes_local.json')
    .then(res => res.json())
    .then(data => episodesData = data)
    .catch(err => console.error("Erro ao carregar JSON:", err));

// Toggle EN/PT
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentLang = btn.dataset.lang;

        document.getElementById('title').textContent =
            currentLang === 'en'
                ? "One Piece Episodes on Your Birthday"
                : "Episódios de One Piece no seu aniversário";

        document.getElementById('searchBtn').textContent =
            currentLang === 'en' ? "Search" : "Buscar";

        document.getElementById('choseDay').textContent =
            currentLang === 'en' ? "Chose a Day" : "Escolha o dia";
        
        document.getElementById('choseMonth').textContent =
            currentLang === 'en' ? "Chose a Month" : "Escolha o mês";

        document.getElementById('jan').textContent = currentLang === 'en' ? 'January' : 'Janeiro';
        document.getElementById('feb').textContent = currentLang === 'en' ? 'February' : 'Fevereiro';
        document.getElementById('mar').textContent = currentLang === 'en' ? 'March' : 'Março';
        document.getElementById('api').textContent = currentLang === 'en' ? 'April' : 'Abril';
        document.getElementById('may').textContent = currentLang === 'en' ? 'May' : 'Maio';
        document.getElementById('jun').textContent = currentLang === 'en' ? 'June' : 'Junho';
        document.getElementById('jul').textContent = currentLang === 'en' ? 'July' : 'Julho';
        document.getElementById('aug').textContent = currentLang === 'en' ? 'August' : 'Agosto';
        document.getElementById('sep').textContent = currentLang === 'en' ? 'September' : 'Setembro';
        document.getElementById('oct').textContent = currentLang === 'en' ? 'October' : 'Outubro';
        document.getElementById('nov').textContent = currentLang === 'en' ? 'November' : 'Novembro';
        document.getElementById('dez').textContent = currentLang === 'en' ? 'December' : 'Dezembro';
                

        // Atualiza os resultados se já houver
        if (window.lastResults) displayResults(window.lastResults);
    });
});

// Buscar episódios
document.getElementById('searchBtn').addEventListener('click', () => {
    const dateInputDia = document.getElementById('dia').value;
    const dateInputMes = document.getElementById('mes').value;

    if (!dateInputDia) return alert(currentLang === "en" ? "Please select a day!" : "Por favor, escolha um dia!");
    if (!dateInputMes) return alert(currentLang === "en" ? "Please select a month!" : "Por favor, escolha um mês!");

    const day = dateInputDia.padStart(2, "0");
    const month = dateInputMes.padStart(2, "0");

    const foundEpisodes = episodesData.filter(ep => {
        if (!ep.air_date) return false;
        const [, epMonth, epDay] = ep.air_date.split("-");
        return epMonth === month && epDay === day;
    });

    // Ordenar do mais antigo para o mais recente
    foundEpisodes.sort((a, b) => new Date(a.air_date) - new Date(b.air_date));

    // Guarda para re-renderizar ao trocar idioma
    window.lastResults = foundEpisodes;

    displayResults(foundEpisodes);
});

// Mostrar resultados
function displayResults(episodes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    if (episodes.length === 0) {
        resultsDiv.innerHTML = `<p class="text-center">${
            currentLang === 'en' ? 'No episodes found for this date.' : 'Nenhum episódio encontrado para esta data.'
        }</p>`;
        return;
    }

    // Caixa de contagem
    const contEp = document.createElement('div');
    contEp.className = "d-flex flex-column justify-content-center align-items-center border border-primary rounded bg-light mb-3";
    contEp.style.width = "150px";
    contEp.style.height = "150px";
    contEp.innerHTML = `
        <div style="font-size: 3.5rem; font-weight: bold;">${episodes.length}</div>
        <div style="font-size: 1rem;">${currentLang === 'en' ? 'episode(s)<br>found' : 'episódio(s)<br>encontrado(s)'}</div>
    `;
    resultsDiv.appendChild(contEp);

   // Cards dos episódios
    episodes.forEach(ep => {
    const card = document.createElement('div');
    card.className = "col-12 mb-3";

    const title = currentLang === 'en' ? ep.episode_name_en : ep.episode_name_pt;
    const summary = currentLang === 'en' ? ep.episode_summary_en : ep.episode_summary_pt;
    const saga = currentLang === 'en' ? ep.saga_en : ep.saga_pt;
    const arc = currentLang === 'en' ? ep.arc_en : ep.arc_pt;
    const year = ep.air_date.split("-")[0];

    const isFiller = ep.Filler && ep.Filler.toString().toLowerCase() === "true"; 
    const fillerBadge = isFiller
        ? `<span class="filler-badge bg-primary ms-2">
            ${currentLang === 'en' ? 'Filler Episode' : 'Episódio Filler'}
           </span>`
        : "";

    // Botão Crunchyroll
    const watchButton = ep.watch_episode_url
        ? `<a href="${ep.watch_episode_url}" target="_blank"
              class="btn btn-warning btn-sm me-2 mb-1 fw-bold">
              🍿 ${currentLang === 'en' ? 'Watch Episode on Crunchyroll' : 'Assistir Episódio na Crunchyroll'}
           </a>`
        : "";

    // Botão Fandom
    const fandomButton = ep.episode_post_href
        ? `<a href="${ep.episode_post_href}" target="_blank"
              class="btn btn-info btn-sm mb-1 fw-bold">
              📖 ${currentLang === 'en' ? 'Fandom' : 'Fandom'}
           </a>`
        : "";

    card.innerHTML = `
    <div class="card shadow-sm p-3 d-flex flex-row align-items-start">
        <img src="${ep.episode_image}" alt="${title}" class="img-fluid rounded-start me-3 flex-shrink-0"
            style="width: 200px; height: 150px; object-fit: cover;">
        <div class="flex-grow-1">
            <h5 class="card-title mb-1" style="word-break: break-word;">Episode ${ep.episode} - ${title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${ep.episode_name_jp}</h6>
            <p class="card-text mb-2">${summary}</p>

            <div class="d-flex flex-wrap">
                ${watchButton}
                ${fandomButton}
            </div>

            <small class="text-secondary mt-2 d-block">
                ${year} — Saga ${saga} — ${currentLang === 'en' ? 'Arc' : 'Arco'} ${arc}
                ${fillerBadge}
            </small>
        </div>
    </div>
    `;

    resultsDiv.appendChild(card);
});
}


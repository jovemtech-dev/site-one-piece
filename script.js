let episodesData = {};
let currentLang = "en"; // idioma inicial

// Carrega JSON
fetch('episodes.json')
    .then(res => res.json())
    .then(data => episodesData = data)
    .catch(err => console.error("Erro ao carregar JSON:", err));

// Toggle EN/PT
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentLang = btn.dataset.lang;
        document.getElementById('title').textContent =
            currentLang === 'en' ? "One Piece Episodes on Your Birthday" : "Episódios de One Piece no seu aniversário";
        document.getElementById('searchBtn').textContent =
            currentLang === 'en' ? "Search" : "Buscar";
    });
});

// Buscar episódios
document.getElementById('searchBtn').addEventListener('click', () => {
    const dateInputDia = document.getElementById('dia').value;
    if (!dateInputDia) return alert("Por favor, escolha um dia!");
    const dateInputMes = document.getElementById('mes').value;
    if (!dateInputMes) return alert("Por favor, escolha um mês!");
    
    const day = dateInputDia
    const month = dateInputMes

    // alert (day)
    // alert (month)

    // const dateInput = document.getElementById('aniversario').value;
    // if (!dateInput) return alert("Please, chose a date!");
    
    // const [year, month, day] = dateInput.split("-"); // só mês e dia



    let foundEpisodes = [];

    // alert(day)
    // alert(month)

    Object.entries(episodesData).forEach(([sagaName, saga]) => {
    saga.forEach(ep => { 
        if (!ep.air_date) return;
        const [, epMonth, epDay] = ep.air_date.split("-");
        if (epMonth === month && epDay === day) {
            ep.saga = sagaName;
            foundEpisodes.push(ep);
        }
    });
});


    // ordenar do mais antigo para o mais recente
    foundEpisodes.sort((a, b) => new Date(a.air_date) - new Date(b.air_date));

    displayResults(foundEpisodes);
});

// Função para mostrar resultados
function displayResults(episodes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    if (episodes.length === 0) {
        resultsDiv.innerHTML = '<p class="text-center">No episodes found for this date.</p>';
        return;
    }

    // Caixa de contagem
    const contEp = document.createElement('div');
    contEp.className = "d-flex flex-column justify-content-center align-items-center border border-secondary rounded bg-light mb-5";
    contEp.style.width = "150px";
    contEp.style.height = "150px"
    contEp.innerHTML = `
            <div style="font-size: 3.5rem; font-weight: bold;">${episodes.length}</div>
            <div style="font-size: 1rem;">episode(s)<br>found</div>
        `;

    // Adiciona antes dos episódios
    resultsDiv.appendChild(contEp);

    episodes.forEach(ep => {
        const card = document.createElement('div');
        card.className = "col-12";

        const title = currentLang === 'en' ? ep.episode_name_en : ep.episode_name_en; // placeholder para futuro PT
        const summary = currentLang === 'en' ? ep.episode_sumary : ep.episode_sumary; // placeholder PT

        const year = ep.air_date.split("-")[0];

        
        card.innerHTML = `
            <a href="${ep.episode_post_href}" target="_blank" class="text-decoration-none">
            <div class="card shadow-sm p-3">
                <h5 class="card-title">Episode ${ep.episode}  -  ${title}</h5>
                <h6 class="card-subtitle mb-2">${ep.episode_name_jp}</h6>
                <p class="card-text">${summary}</p>
                <small>${year} — ${ep.saga}</small>
            </div>
            <a/>`;
            

        resultsDiv.appendChild(card);
    });
}
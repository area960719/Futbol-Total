document.addEventListener('DOMContentLoaded', async () => {
    loadMatches();
    loadStandings();
    loadTopScorers();
    setupSearch();
});

async function loadMatches() {
    const matches = await getMatches();
    const matchesList = document.getElementById('matchesList');

    matchesList.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="match-date">${formatDate(match.date)}</div>
            <div class="match-teams">
                <div>
                    <strong>${match.homeTeam}</strong>
                </div>
                <div class="score">${match.homeGoals} - ${match.awayGoals}</div>
                <div>
                    <strong>${match.awayTeam}</strong>
                </div>
            </div>
            <div>${match.league}</div>
        </div>
    `).join('');
}

async function loadStandings() {
    const standings = await getStandings();
    const standingsTable = document.getElementById('standingsTable');

    standingsTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Equipo</th>
                    <th>PJ</th>
                    <th>G</th>
                    <th>E</th>
                    <th>P</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>
                ${standings.map(team => `
                    <tr>
                        <td>${team.position}</td>
                        <td>${team.team}</td>
                        <td>${team.played}</td>
                        <td>${team.wins}</td>
                        <td>${team.draws}</td>
                        <td>${team.losses}</td>
                        <td>${team.goals}</td>
                        <td>${team.against}</td>
                        <td><strong>${team.points}</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function loadTopScorers() {
    const scorers = await getTopScorers();
    const scorersList = document.getElementById('scorersList');

    scorersList.innerHTML = scorers.map(scorer => `
        <div class="scorer-card">
            <div class="scorer-rank">#${scorer.rank}</div>
            <div class="scorer-name">${scorer.name}</div>
            <div class="scorer-goals">${scorer.goals}</div>
            <div>${scorer.team}</div>
        </div>
    `).join('');
}

function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const filterBtn = document.getElementById('filterBtn');
    const filterInput = document.getElementById('filterInput');
    const typeFilter = document.getElementById('typeFilter');
    const searchResults = document.getElementById('searchResults');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (!query) return;
        const results = searchData(query, '');
        renderResults(results);
    });

    filterBtn.addEventListener('click', () => {
        const query = filterInput.value.trim();
        const type = typeFilter.value;
        if (!query) return;
        const results = searchData(query, type);
        renderResults(results);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (!query) return;
            const results = searchData(query, '');
            renderResults(results);
        }
    });
}

function renderResults(results) {
    const searchResults = document.getElementById('searchResults');

    if (!results.length) {
        searchResults.innerHTML = '<p>No se encontraron resultados</p>';
        return;
    }

    searchResults.innerHTML = results.map(result => `
        <div class="result-card">
            <h3>${result.name || result.team}</h3>
            <p>Equipo: ${result.team || 'N/A'}</p>
            <p>Goles: ${result.goals || 'N/A'}</p>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}
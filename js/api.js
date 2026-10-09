// Configuración de APIs
const API_CONFIG = {
    // Usaremos APIs públicas y gratuitas
    footballData: 'https://api.football-data.org/v4',
    rapidSports: 'https://api.sportsdata.io/v3/soccer',
};

// Para desarrollo, usamos datos simulados
// En producción, necesitarás una API key

const mockData = {
    matches: [
        {
            id: 1,
            homeTeam: 'Real Madrid',
            awayTeam: 'Barcelona',
            homeGoals: 2,
            awayGoals: 1,
            date: '2024-10-08',
            league: 'La Liga'
        },
        {
            id: 2,
            homeTeam: 'Atlético Madrid',
            awayTeam: 'Sevilla',
            homeGoals: 3,
            awayGoals: 0,
            date: '2024-10-08',
            league: 'La Liga'
        },
        {
            id: 3,
            homeTeam: 'Manchester City',
            awayTeam: 'Liverpool',
            homeGoals: 1,
            awayGoals: 1,
            date: '2024-10-07',
            league: 'Premier League'
        }
    ],
    standings: [
        { position: 1, team: 'Real Madrid', played: 8, wins: 6, draws: 1, losses: 1, points: 19, goals: 18, against: 7 },
        { position: 2, team: 'Barcelona', played: 8, wins: 5, draws: 2, losses: 1, points: 17, goals: 16, against: 8 },
        { position: 3, team: 'Atlético Madrid', played: 8, wins: 5, draws: 1, losses: 2, points: 16, goals: 14, against: 9 },
        { position: 4, team: 'Sevilla', played: 8, wins: 4, draws: 2, losses: 2, points: 14, goals: 12, against: 10 },
        { position: 5, team: 'Real Sociedad', played: 8, wins: 4, draws: 1, losses: 3, points: 13, goals: 11, against: 11 },
    ],
    scorers: [
        { rank: 1, name: 'Vinícius Júnior', team: 'Real Madrid', goals: 8 },
        { rank: 2, name: 'Robert Lewandowski', team: 'Barcelona', goals: 7 },
        { rank: 3, name: 'Álvaro Morata', team: 'Atlético Madrid', goals: 6 },
        { rank: 4, name: 'Cristiano Ronaldo', team: 'Al-Nassr', goals: 5 },
        { rank: 5, name: 'Harry Kane', team: 'Bayern Munich', goals: 5 },
    ]
};

// Función para obtener partidos
async function getMatches() {
    try {
        // En producción, aquí iría la llamada a la API real
        // const response = await fetch(`${API_CONFIG.footballData}/matches`);
        // return await response.json();
        
        return mockData.matches;
    } catch (error) {
        console.error('Error obteniendo partidos:', error);
        return [];
    }
}

// Función para obtener clasificación
async function getStandings() {
    try {
        return mockData.standings;
    } catch (error) {
        console.error('Error obteniendo clasificación:', error);
        return [];
    }
}

// Función para obtener goleadores
async function getTopScorers() {
    try {
        return mockData.scorers;
    } catch (error) {
        console.error('Error obteniendo goleadores:', error);
        return [];
    }
}

// Función de búsqueda
function searchData(query, type) {
    query = query.toLowerCase();
    let results = [];

    if (type === 'jugador' || type === '') {
        results = mockData.scorers.filter(scorer =>
            scorer.name.toLowerCase().includes(query)
        );
    } else if (type === 'equipo' || type === '') {
        results = mockData.standings.filter(team =>
            team.team.toLowerCase().includes(query)
        );
    } else if (type === 'goleador') {
        results = mockData.scorers.filter(scorer =>
            scorer.name.toLowerCase().includes(query)
        );
    }

    return results;
}
const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
const LIGA_ID = "4335"; // LaLiga

async function pedir(ruta) {
    // Caché: si ya se pidió, se devuelve al instante
    const clave = "cache:" + ruta;
    try {
        const guardado = sessionStorage.getItem(clave);
        if (guardado) return JSON.parse(guardado);
    } catch (e) {}

    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), 20000);
    try {
        const r = await fetch(API_BASE + ruta, { signal: control.signal });
        if (!r.ok) throw new Error("El servidor respondió " + r.status);
        const datos = await r.json();
        try { sessionStorage.setItem(clave, JSON.stringify(datos)); } catch (e) {}
        return datos;
    } catch (e) {
        if (e.name === "AbortError") {
            throw new Error("La conexión tardó demasiado. Intenta de nuevo.");
        }
        throw new Error("No se pudo conectar con la fuente de datos (" + e.message + ")");
    } finally {
        clearTimeout(reloj);
    }
}

function temporadaActual() {
    const hoy = new Date();
    const a = hoy.getFullYear();
    return hoy.getMonth() >= 6 ? a + "-" + (a + 1) : (a - 1) + "-" + a;
}

// ---------- Búsquedas ----------
async function buscarJugador(nombre) {
    const d = await pedir("/searchplayers.php?p=" + encodeURIComponent(nombre));
    return d.player || [];
}

async function buscarEquipo(nombre) {
    const d = await pedir("/searchteams.php?t=" + encodeURIComponent(nombre));
    return d.teams || [];
}

// ---------- Fichas (al tocar un resultado) ----------
async function detalleJugador(id) {
    const d = await pedir("/lookupplayer.php?id=" + encodeURIComponent(id));
    return (d.players && d.players[0]) || null;
}

async function detalleEquipo(id) {
    const d = await pedir("/lookupteam.php?id=" + encodeURIComponent(id));
    return (d.teams && d.teams[0]) || null;
}

async function plantillaEquipo(id) {
    const d = await pedir("/lookup_all_players.php?id=" + encodeURIComponent(id));
    return d.player || [];
}

async function proximosPartidosEquipo(id) {
    const d = await pedir("/eventsnext.php?id=" + encodeURIComponent(id));
    return d.events || [];
}

async function ultimosPartidosEquipo(id) {
    const d = await pedir("/eventslast.php?id=" + encodeURIComponent(id));
    return d.results || [];
}

// ---------- Liga ----------
async function ultimosPartidos() {
    const d = await pedir("/eventspastleague.php?id=" + LIGA_ID);
    return d.events || [];
}

async function clasificacion() {
    const d = await pedir("/lookuptable.php?l=" + LIGA_ID + "&s=" + temporadaActual());
    return d.table || [];
}
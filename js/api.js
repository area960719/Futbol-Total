const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
const LIGA_ID = "4335"; // LaLiga

async function pedir(ruta) {
    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), 20000);
    try {
        const r = await fetch(API_BASE + ruta, { signal: control.signal });
        if (!r.ok) throw new Error("El servidor respondió " + r.status);
        return await r.json();
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

async function buscarJugador(nombre) {
    const d = await pedir("/searchplayers.php?p=" + encodeURIComponent(nombre));
    return d.player || [];
}

async function buscarEquipo(nombre) {
    const d = await pedir("/searchteams.php?t=" + encodeURIComponent(nombre));
    return d.teams || [];
}

async function ultimosPartidos() {
    const d = await pedir("/eventspastleague.php?id=" + LIGA_ID);
    return d.events || [];
}

async function clasificacion() {
    const d = await pedir("/lookuptable.php?l=" + LIGA_ID + "&s=" + temporadaActual());
    return d.table || [];
}
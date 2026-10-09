(function () {
    const estilo = document.createElement("style");
    estilo.textContent =
        ".card-x{background:#fff;border-radius:14px;padding:14px;margin:10px 0;box-shadow:0 2px 8px rgba(0,0,0,.08);color:#0f1b2d}" +
        ".card-x img{max-width:90px;border-radius:10px;display:block;margin-bottom:8px}" +
        ".card-x small{color:#556}" +
        ".msg-x{padding:12px 0;color:#c0392b}" +
        ".tabla-x{width:100%;border-collapse:collapse;color:#fff}" +
        ".tabla-x th,.tabla-x td{padding:8px 6px;text-align:left;border-bottom:1px solid rgba(255,255,255,.15)}";
    document.head.appendChild(estilo);

    const $ = (id) => document.getElementById(id);

    function esc(t) {
        return String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[c]));
    }

    function tarjetaJugador(j) {
        return '<div class="card-x">' +
            (j.strThumb ? '<img src="' + esc(j.strThumb) + '/small" alt="">' : "") +
            "<strong>" + esc(j.strPlayer) + "</strong><br>" +
            "<small>" + esc(j.strTeam) + " · " + esc(j.strPosition) + "</small><br>" +
            "<small>" + esc(j.strNationality) + (j.dateBorn ? " · " + esc(j.dateBorn) : "") + "</small></div>";
    }

    function tarjetaEquipo(e) {
        return '<div class="card-x">' +
            (e.strBadge ? '<img src="' + esc(e.strBadge) + '/small" alt="">' : "") +
            "<strong>" + esc(e.strTeam) + "</strong><br>" +
            "<small>" + esc(e.strLeague) + " · " + esc(e.strCountry) + "</small><br>" +
            "<small>Estadio: " + esc(e.strStadium) + "</small></div>";
    }

    async function ejecutarBusqueda(texto, tipo) {
        const caja = $("searchResults");
        texto = (texto || "").trim();
        if (!texto) {
            caja.innerHTML = '<p class="msg-x">Escribe un nombre para buscar.</p>';
            return;
        }
        caja.innerHTML = "<p>Buscando...</p>";
        try {
            let html = "";
            if (tipo === "equipo") {
                html = (await buscarEquipo(texto)).map(tarjetaEquipo).join("");
            } else if (tipo === "jugador" || tipo === "goleador") {
                html = (await buscarJugador(texto)).map(tarjetaJugador).join("");
            } else {
                const [js, es] = await Promise.all([buscarJugador(texto), buscarEquipo(texto)]);
                html = es.map(tarjetaEquipo).join("") + js.map(tarjetaJugador).join("");
            }
            caja.innerHTML = html || "<p>No se encontraron resultados</p>";
        } catch (e) {
            caja.innerHTML = '<p class="msg-x">' + esc(e.message) + "</p>";
        }
    }

    async function cargarPartidos() {
        const caja = $("matchesList");
        caja.innerHTML = "<p>Cargando partidos...</p>";
        try {
            const ev = await ultimosPartidos();
            caja.innerHTML = ev.length
                ? ev.slice(0, 10).map((p) =>
                    '<div class="card-x"><small>' + esc(p.strLeague) + " · " + esc(p.dateEvent) + "</small><br>" +
                    "<strong>" + esc(p.strHomeTeam) + " " + esc(p.intHomeScore) + " - " +
                    esc(p.intAwayScore) + " " + esc(p.strAwayTeam) + "</strong></div>").join("")
                : "<p>No hay partidos disponibles.</p>";
        } catch (e) {
            caja.innerHTML = '<p class="msg-x">' + esc(e.message) + "</p>";
        }
    }

    async function cargarTabla() {
        const caja = $("standingsTable");
        caja.innerHTML = "<p>Cargando clasificación...</p>";
        try {
            const t = await clasificacion();
            caja.innerHTML = t.length
                ? '<table class="tabla-x"><tr><th>#</th><th>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>Pts</th></tr>' +
                  t.map((f) => "<tr><td>" + esc(f.intRank) + "</td><td>" + esc(f.strTeam) + "</td><td>" +
                      esc(f.intPlayed) + "</td><td>" + esc(f.intWin) + "</td><td>" + esc(f.intDraw) +
                      "</td><td>" + esc(f.intLoss) + "</td><td><strong>" + esc(f.intPoints) +
                      "</strong></td></tr>").join("") + "</table>"
                : "<p>La clasificación aún no está disponible.</p>";
        } catch (e) {
            caja.innerHTML = '<p class="msg-x">' + esc(e.message) + "</p>";
        }
    }

    async function cargarDestacados() {
        const caja = $("scorersList");
        caja.innerHTML = "<p>Cargando jugadores...</p>";
        const nombres = ["Lamine Yamal", "Kylian Mbappe", "Erling Haaland", "Vinicius Junior"];
        try {
            const res = await Promise.all(nombres.map((n) => buscarJugador(n)));
            const html = res.map((r) => (r[0] ? tarjetaJugador(r[0]) : "")).join("");
            caja.innerHTML = html || "<p>No hay datos disponibles.</p>";
        } catch (e) {
            caja.innerHTML = '<p class="msg-x">' + esc(e.message) + "</p>";
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        $("searchBtn").addEventListener("click", () => ejecutarBusqueda($("searchInput").value, ""));
        $("searchInput").addEventListener("keydown", (e) => {
            if (e.key === "Enter") ejecutarBusqueda($("searchInput").value, "");
        });
        $("filterBtn").addEventListener("click", () => ejecutarBusqueda($("filterInput").value, $("typeFilter").value));
        $("filterInput").addEventListener("keydown", (e) => {
            if (e.key === "Enter") ejecutarBusqueda($("filterInput").value, $("typeFilter").value);
        });

        cargarPartidos();
        cargarTabla();
        cargarDestacados();
    });
})();
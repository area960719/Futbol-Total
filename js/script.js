(function () {
    const estilo = document.createElement("style");
    estilo.textContent =
        ".card-x{background:#fff;border-radius:14px;padding:14px;margin:10px 0;box-shadow:0 2px 8px rgba(0,0,0,.08);color:#0f1b2d}" +
        ".card-x[data-id]{cursor:pointer}" +
        ".card-x[data-id]:active{transform:scale(.98)}" +
        ".card-x img{max-width:90px;border-radius:10px;display:block;margin-bottom:8px}" +
        ".card-x small{color:#556}" +
        ".msg-x{padding:12px 0;color:#c0392b}" +
        ".tabla-x{width:100%;border-collapse:collapse;color:#fff}" +
        ".tabla-x th,.tabla-x td{padding:8px 6px;text-align:left;border-bottom:1px solid rgba(255,255,255,.15)}" +
        "#modal-x{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(10,20,40,.88);overflow-y:auto;z-index:9999;padding:12px;box-sizing:border-box}" +
        ".panel-x{background:#fff;color:#0f1b2d;border-radius:16px;max-width:520px;margin:0 auto;padding:16px}" +
        ".volver-x{background:#0f1b2d;color:#fff;border:0;border-radius:10px;padding:10px 14px;font-size:15px;margin-bottom:12px;cursor:pointer}" +
        ".ficha-img{max-width:160px;border-radius:12px;display:block;margin:0 auto 10px}" +
        ".ficha-x h2{margin:6px 0;text-align:center}" +
        ".ficha-x p{line-height:1.45}" +
        ".ficha-x h3{margin:16px 0 6px}" +
        ".fila-x{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #e3e7ee}" +
        ".fila-x[data-id]{cursor:pointer}" +
        ".fila-x img{width:40px;height:40px;object-fit:cover;border-radius:50%}";
    document.head.appendChild(estilo);

    const $ = (id) => document.getElementById(id);

    function esc(t) {
        return String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[c]));
    }

    function recortar(t, n) {
        t = t || "";
        return t.length > n ? t.slice(0, n).trim() + "…" : t;
    }

    // ---------- Tarjetas de resultados (tocables) ----------
    function tarjetaJugador(j) {
        return '<div class="card-x" data-tipo="jugador" data-id="' + esc(j.idPlayer) + '">' +
            (j.strThumb ? '<img src="' + esc(j.strThumb) + '/small" alt="">' : "") +
            "<strong>" + esc(j.strPlayer) + "</strong><br>" +
            "<small>" + esc(j.strTeam) + " · " + esc(j.strPosition) + "</small><br>" +
            "<small>" + esc(j.strNationality) + (j.dateBorn ? " · " + esc(j.dateBorn) : "") + "</small></div>";
    }

    function tarjetaEquipo(e) {
        return '<div class="card-x" data-tipo="equipo" data-id="' + esc(e.idTeam) + '">' +
            (e.strBadge ? '<img src="' + esc(e.strBadge) + '/small" alt="">' : "") +
            "<strong>" + esc(e.strTeam) + "</strong><br>" +
            "<small>" + esc(e.strLeague) + " · " + esc(e.strCountry) + "</small><br>" +
            "<small>Estadio: " + esc(e.strStadium) + "</small></div>";
    }

    // ---------- Ventana de ficha (con botón Volver) ----------
    const historial = [];

    function asegurarModal() {
        let m = $("modal-x");
        if (!m) {
            m = document.createElement("div");
            m.id = "modal-x";
            m.innerHTML = '<div class="panel-x"><button class="volver-x" data-volver="1">← Volver</button>' +
                '<div id="modal-cuerpo"></div></div>';
            document.body.appendChild(m);
        }
        return m;
    }

    function mostrarEnModal(html) {
        const m = asegurarModal();
        $("modal-cuerpo").innerHTML = html;
        m.style.display = "block";
        m.scrollTop = 0;
        document.body.style.overflow = "hidden";
    }

    function cerrarModal() {
        const m = $("modal-x");
        if (m) m.style.display = "none";
        document.body.style.overflow = "";
        historial.length = 0;
    }

    function volver() {
        if (historial.length) {
            mostrarEnModal(historial.pop());
        } else {
            cerrarModal();
        }
    }

    async function abrirFicha(tipo, id) {
        const m = $("modal-x");
        if (m && m.style.display === "block") {
            historial.push($("modal-cuerpo").innerHTML);
        } else {
            historial.length = 0;
        }
        mostrarEnModal("<p>Cargando ficha...</p>");
        try {
            const html = tipo === "equipo" ? await fichaEquipo(id) : await fichaJugador(id);
            mostrarEnModal(html);
        } catch (e) {
            mostrarEnModal('<p class="msg-x">' + esc(e.message) + "</p>");
        }
    }

    async function fichaJugador(id) {
        const j = await detalleJugador(id);
        if (!j) return "<p>No hay datos de este jugador.</p>";
        const img = j.strCutout || j.strThumb;
        const desc = recortar(j.strDescriptionES || j.strDescriptionEN, 700);
        return '<div class="ficha-x">' +
            (img ? '<img class="ficha-img" src="' + esc(img) + '/medium" alt="">' : "") +
            "<h2>" + esc(j.strPlayer) + "</h2>" +
            "<p><strong>Equipo:</strong> " + esc(j.strTeam) + "<br>" +
            "<strong>Posición:</strong> " + esc(j.strPosition) + "<br>" +
            "<strong
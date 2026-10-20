const express = require("express");
const db = require("./db");

const app = express();
app.enable("strict routing");

app.get("/konyvek", (req, res) => {
    const sql = `
        SELECT k.id, k. mufaj_id, k.cim, k.kiadasi_ev, k.oldalszam, k.kolcsonozheto
        FROM konyvek k INNER JOIN mufajok m ON k.mufaj_id = m.id ORDER BY k.kiadasi_ev ASC
    `;

    db.query(sql, (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(eredmeny);
    });
});

app.get("/konyvek/elerheto", (req, res) => {
    const sql = `
        SELECT *
        FROM konyvek
        WHERE kolcsonozheto = 1
        AND kiadasi_ev < 2000
    `;

    db.query(sql, (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(eredmeny);
    });
});

app.get("/mufajok/statisztika", (req, res) => {
    const sql = `
        SELECT cim, kiadasi_ev, oldalszam
        FROM konyvek
        WHERE oldalszam > 400
        ORDER BY oldalszam DESC
    `;

    db.query(sql, (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(eredmeny);
    });
});

app.get("/konyvek/hosszuak", (req, res) => {
    const sql = `
        SELECT cim, kiadasi_ev, oldalszam
        FROM konyvek
        WHERE oldalszam > 400
        ORDER BY oldalszam DESC
    `;

    db.query(sql, (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(eredmeny);
    });
});

app.use((req, res) => {
    res.status(404).json({ hiba: "Nincs ilyen vegpont" });
});

app.listen(2005, () => {
    console.log("Szerver fut");
});
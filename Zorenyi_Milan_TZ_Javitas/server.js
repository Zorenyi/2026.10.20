const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());
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
        SELECT m.nev AS mufaj,
        COUNT(k.id) AS konyvek_szama,
        ROUND(AVG(k.oldalszam)) AS atlagos_oldalszam
        FROM mufajok m
        LEFT JOIN konyvek k ON m.id = k.mufaj_id
        GROUP BY m.id, m.nev
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

app.get("/konyvek/kereses/:szoveg", (req, res) => {
    const szoveg = req.params.szoveg;

    const sql = `
        SELECT *
        FROM konyvek
        WHERE cim LIKE ?
    `;

    db.query(sql, [`%${szoveg}%`], (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(eredmeny);
    });
});

app.get("/konyvek/ujabbak", (req, res) => {
    const sql = `
        SELECT *
        FROM konyvek
        WHERE kiadasi_ev > 2000
        ORDER BY kiadasi_ev DESC
    `;

    db.query(sql, (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(eredmeny);
    });
});

app.get("/konyvek/leghosszabbak", (req, res) => {
    const sql = `
        SELECT *
        FROM konyvek
        ORDER BY oldalszam DESC
        LIMIT 3
    `;

    db.query(sql, (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(eredmeny);
    });
});

app.post("/konyvek", (req, res) => {
    const { mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto } = req.body;

    const sql = `
        INSERT INTO konyvek
        (mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto], (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json({ uzenet: "Könyv hozzáadva", id: eredmeny.insertId });
    });
});

app.post("/mufajok", (req, res) => {
    const { nev } = req.body;

    const sql = `
        INSERT INTO mufajok (nev)
        VALUES (?)
    `;

    db.query(sql, [nev], (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json({ uzenet: "Műfaj hozzáadva", id: eredmeny.insertId });
    });
});

app.delete("/konyvek/:id", (req, res) => {
    const id = req.params.id;

    const sql = `
        DELETE FROM konyvek
        WHERE id = ?
    `;

    db.query(sql, [id], (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }

        if (eredmeny.affectedRows === 0) {
            return res.status(404).json({ hiba: "Nincs ilyen könyv" });
        }

        res.json({ uzenet: "Könyv törölve" });
    });
});

app.delete("/mufajok/:id", (req, res) => {
    const id = req.params.id;

    const sql = `
        DELETE FROM mufajok
        WHERE id = ?
    `;

    db.query(sql, [id], (err, eredmeny) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }

        if (eredmeny.affectedRows === 0) {
            return res.status(404).json({ hiba: "Nincs ilyen műfaj" });
        }

        res.json({ uzenet: "Műfaj törölve" });
    });
});

app.listen(2005, () => {
    console.log("Szerver fut a 2005-os porton");
});
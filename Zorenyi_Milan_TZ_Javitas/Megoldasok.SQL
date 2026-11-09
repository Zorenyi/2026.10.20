1. Feladat:
SELECT k.id, k. mufaj_id, k.cim, k.kiadasi_ev, k.oldalszam, k.kolcsonozheto
        FROM konyvek k INNER JOIN mufajok m ON k.mufaj_id = m.id ORDER BY k.kiadasi_ev ASC

2. Feladat:
SELECT *
        FROM konyvek
        WHERE kolcsonozheto = 1
        AND kiadasi_ev < 2000

3. Feladat:
SELECT *
        FROM konyvek
        WHERE cim LIKE ?

4. Feladat:
SELECT m.nev AS mufaj,
        COUNT(k.id) AS konyvek_szama,
        ROUND(AVG(k.oldalszam)) AS atlagos_oldalszam
        FROM mufajok m
        LEFT JOIN konyvek k ON m.id = k.mufaj_id
        GROUP BY m.id, m.nev

5. Feladat:
SELECT cim, kiadasi_ev, oldalszam
        FROM konyvek
        WHERE oldalszam > 400
        ORDER BY oldalszam DESC

-----INSERT-----

INSERT INTO mufajok (nev)
VALUES ('Fantasy');

INSERT INTO konyvek (mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto)
VALUES (12, 'ÚjKönyv', 2026, 300, 1);

-----UPDATE-----

UPDATE konyvek
SET kiadasi_ev = 2016
WHERE id = 8;

UPDATE konyvek
SET kolcsonozheto = 0
WHERE id = 2;

-----DELETE----

DELETE FROM konyvek
WHERE id = 10;

DELETE FROM mufajok
WHERE id = 3;

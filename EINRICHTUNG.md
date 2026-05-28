# Anfragen-Tracker – Einrichtungsanleitung

## Inhaltsverzeichnis

1. [Überblick](#1-überblick)
2. [App-Icons generieren](#2-app-icons-generieren)
3. [Google Sheets Backend einrichten](#3-google-sheets-backend-einrichten)
4. [App auf GitHub Pages deployen](#4-app-auf-github-pages-deployen)
5. [App auf dem Handy installieren](#5-app-auf-dem-handy-installieren)
6. [Sync zwischen Geräten einrichten](#6-sync-zwischen-geräten-einrichten)
7. [Fehlerbehebung](#7-fehlerbehebung)

---

## 1. Überblick

Die App besteht aus drei Teilen:

```
┌─────────────────────┐     ┌──────────────────────┐     ┌───────────────────┐
│  GitHub Pages       │────▶│  Apps Script         │────▶│  Google Sheet     │
│  (die Web-App)      │     │  (das Backend)       │     │  (die Datenbank)  │
└─────────────────────┘     └──────────────────────┘     └───────────────────┘
        ↑
   wird auf Handy/PC
   installiert (PWA)
```

- **GitHub Pages** hostet die App kostenlos und liefert HTTPS (für PWA Pflicht)
- **Google Apps Script** ist die Brücke zwischen App und Sheet (keine eigene API nötig)
- **Google Sheet** speichert alle Anfragen – du kannst es auch direkt öffnen und bearbeiten

---

## 2. App-Icons generieren

Die App braucht zwei PNG-Icons (192×192 und 512×512 Pixel).

**Schritt 1:** Datei `anfragen-tracker/icons/generate-icons.html` im Browser öffnen
(Doppelklick auf die Datei reicht – kein Server nötig)

**Schritt 2:** Auf „⬇ icon-192.png" klicken → Datei speichern

**Schritt 3:** Auf „⬇ icon-512.png" klicken → Datei speichern

**Schritt 4:** Beide gespeicherten Dateien in den Ordner `anfragen-tracker/icons/` verschieben

Danach sollte der Ordner so aussehen:
```
anfragen-tracker/
└── icons/
    ├── generate-icons.html   ← das Tool
    ├── icon-192.png          ← neu
    └── icon-512.png          ← neu
```

---

## 3. Google Sheets Backend einrichten

### 3a. Google Sheet anlegen

1. Öffne [sheets.google.com](https://sheets.google.com) und melde dich an
2. Klicke auf **„+"** (Neue Tabelle)
3. Gib der Tabelle einen Namen, z. B. **„Anfragen-Tracker"**
4. Den ersten Tabellenreiter (unten, heißt „Tabelle1") kannst du so lassen – das Script benennt ihn selbst um

### 3b. Apps Script öffnen

1. Im Google Sheet oben im Menü: **Erweiterungen → Apps Script**
   - Es öffnet sich ein neuer Tab mit dem Script-Editor
   - Du siehst eine leere Funktion `function myFunction() {}`

### 3c. Code einfügen

1. Den gesamten Inhalt der leeren Funktion **markieren und löschen** (`Strg+A`, dann `Entf`)
2. Den Inhalt aus der Datei `anfragen-tracker/apps-script/Code.gs` kopieren
3. In den Script-Editor einfügen (`Strg+V`)
4. Oben links auf **Speichern** klicken (oder `Strg+S`)
   - Ein Dialogfeld erscheint: Projektnamen eingeben, z. B. „Anfragen API" → **OK**

### 3d. Als Web-App deployen

1. Oben rechts: **Deployen → Neue Deployment**

   > Falls der Button „Deployen" nicht sichtbar ist, erst einmal speichern und die Seite neu laden.

2. Im Dialogfeld bei **Typ** auf das Stift-Symbol klicken und **Web-App** wählen

3. Einstellungen setzen:
   | Feld | Wert |
   |---|---|
   | Beschreibung | `v1` (oder beliebig) |
   | Web-App ausführen als | **Ich** (dein Google-Konto) |
   | Wer hat Zugriff | **Jeder** |

   > **Wichtig:** „Jeder" bedeutet hier: Jeder mit der URL kann die Daten lesen/schreiben. Die URL ist ein langer, zufälliger Token – sie ist also nicht erratbar. Für eine private Nutzung ist das ausreichend sicher.

4. Auf **Deployen** klicken

5. Google fragt nach Berechtigungen:
   - **„Zugriff autorisieren"** klicken
   - Dein Google-Konto auswählen
   - „Diese App wurde nicht verifiziert" → **„Erweitert"** → **„Weiter zu Anfragen API (unsicher)"**
   - Auf **„Zulassen"** klicken

6. Die **Deployment-URL** erscheint – sie sieht so aus:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
   Diese URL jetzt **kopieren** (sie wird in Schritt 6 gebraucht)

---

## 4. App auf GitHub Pages deployen

### 4a. GitHub Repository vorbereiten

Falls du noch kein GitHub-Konto hast: [github.com/signup](https://github.com/signup)

1. Gehe zu [github.com](https://github.com) und melde dich an
2. Stelle sicher, dass dein Repo auf GitHub gepusht ist:
   ```powershell
   git remote -v
   ```
   Wenn kein Remote angezeigt wird, zuerst ein neues Repo auf GitHub anlegen und verknüpfen.

### 4b. Icons und alle Dateien committen

```powershell
git add anfragen-tracker .github
git commit -m "feat: Anfragen-Tracker PWA mit Sheets-Sync"
git push
```

### 4c. GitHub Pages aktivieren

1. Im GitHub-Repo auf **Settings** klicken (oben im Repo, nicht im Account)
2. Links im Menü: **Pages**
3. Unter **„Build and deployment"** → **Source**: **„GitHub Actions"** auswählen
4. Speichern

### 4d. Deployment abwarten

Nach dem Push startet der Workflow automatisch:

1. Im Repo auf **Actions** klicken
2. Den laufenden Workflow „Deploy Anfragen-Tracker" anklicken
3. Nach ca. 1–2 Minuten erscheint ein grüner Haken ✓

Die App ist jetzt erreichbar unter:
```
https://DEIN-USERNAME.github.io/REPO-NAME/
```

> Den genauen Link findest du unter Settings → Pages → „Your site is live at…"

---

## 5. App auf dem Handy installieren

### iOS (iPhone / iPad)

1. Die App-URL im **Safari** öffnen (andere Browser funktionieren für PWA-Installation nicht)
2. Unten in der Mitte auf das **Teilen-Symbol** tippen (Rechteck mit Pfeil nach oben)
3. Im Menü nach unten scrollen → **„Zum Home-Bildschirm"** tippen
4. Name kann so bleiben → **„Hinzufügen"**

Die App erscheint jetzt als Icon auf dem Home-Bildschirm und öffnet sich ohne Browser-Leiste, wie eine native App.

### Android (Chrome)

1. Die App-URL in **Chrome** öffnen
2. Oben rechts das **Drei-Punkte-Menü** tippen
3. **„App installieren"** oder **„Zum Startbildschirm hinzufügen"** tippen
4. **„Installieren"** bestätigen

Alternativ erscheint manchmal automatisch ein Banner am unteren Rand: **„App installieren"**.

### PC / Mac (Chrome oder Edge)

1. Die App-URL öffnen
2. In der Adressleiste ganz rechts erscheint ein **Install-Symbol** (Bildschirm mit Pfeil)
3. Darauf klicken → **„Installieren"**

Die App öffnet sich dann in einem eigenen Fenster ohne Browser-Leiste.

---

## 6. Sync zwischen Geräten einrichten

Dieser Schritt verbindet die App mit dem Google Sheet aus Schritt 3.

**Auf jedem Gerät einmalig:**

1. App öffnen
2. Oben rechts auf **⚙** tippen
3. Die URL aus Schritt 3d in das Textfeld einfügen
4. Auf **„Verbindung testen"** tippen
   - Grüner Text = Verbindung funktioniert
   - Roter Text = URL prüfen (kein Leerzeichen am Anfang/Ende?)
5. **„Speichern & verbinden"** tippen

Ab jetzt:
- Jede Änderung in der App wird automatisch ins Sheet geschrieben
- Beim Öffnen der App werden die neuesten Daten aus dem Sheet geladen
- Der **farbige Punkt** neben dem Titel zeigt den Sync-Status:
  | Farbe | Bedeutung |
  |---|---|
  | Grau | Kein Sync eingerichtet |
  | Gelb (blinkend) | Synchronisierung läuft |
  | Grün | Zuletzt erfolgreich synchronisiert |
  | Rot | Fehler – Punkt antippen zum Wiederholen |

---

## 7. Fehlerbehebung

### „Verbindung testen" schlägt fehl

- **URL korrekt?** Sie muss mit `https://script.google.com/macros/s/` beginnen und mit `/exec` enden
- **Berechtigungen?** Im Apps Script: Deployment öffnen → prüfen ob „Zugriff: Jeder" gesetzt ist
- **Neu deployen?** Nach Code-Änderungen immer neu deployen (nicht nur speichern): Deployen → Neue Deployment

### Das Sheet sieht seltsam aus (Datumsspalte als Zahl)

Das passiert wenn Google Sheets das Datum automatisch formatiert. Lösung:
1. Im Sheet die Spalte G (Datum) komplett markieren
2. Format → Zahl → **Nur Text**
3. In der App auf den Sync-Punkt tippen (manuell neu laden)

### Die App zeigt nach dem Update noch die alte Version

Der Service Worker cacht die App aggressiv. Um die neue Version zu laden:
1. In Chrome/Safari: **Seite hart neu laden** (`Strg+Shift+R` bzw. `Cmd+Shift+R`)
2. Oder: Browser-Einstellungen → Cache leeren → App neu öffnen

### Icons fehlen / App lässt sich nicht installieren

- Prüfen ob `icons/icon-192.png` und `icons/icon-512.png` im Ordner liegen und committed sind
- In den Browser-Devtools (F12) → Anwendung → Manifest prüfen – dort werden fehlende Icons angezeigt

### Änderungen auf Gerät A erscheinen nicht auf Gerät B

Der Sync ist nicht automatisch in Echtzeit – Gerät B lädt beim nächsten App-Start die neuesten Daten. Um sofort zu aktualisieren: **auf den Sync-Punkt tippen** (der farbige Kreis neben „Anfragen").

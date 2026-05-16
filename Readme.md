# MusGames / Arcade.IO

Dette er guiden til at klone projektet ned, installere alle nødvendige programmer og pakker, og starte projektet lokalt med Angular.

Denne guide er lavet til at kunne køre projektet lokalt med:

```powershell
ng serve
```

og åbne siden på:

```text
http://localhost:4200
```

Firebase login på hjemmesiden virker via Firebase config i projektet.

Man behøver derfor ikke installere Firebase CLI eller logge ind med Firebase CLI for bare at køre hjemmesiden lokalt med `ng serve`.

---

# Krav før projektet kan køres

Før projektet kan køres lokalt, skal disse programmer være installeret på computeren:

## 1. Node.js

Node.js skal være installeret, fordi Angular, npm og projektets pakker bruger Node.js.

Projektet bruger Angular 21.2.9.

Brug en Node.js version som passer til Angular 21.

Brug en af disse Node.js versioner:

```text
Node.js 20.19.0 eller nyere i Node 20-serien
Node.js 22.12.0 eller nyere i Node 22-serien
Node.js 24.0.0 eller nyere
```

Det anbefales at bruge Node.js 22 LTS.

Når Node.js installeres, bliver npm normalt installeret sammen med Node.js.

Tjek Node.js med denne kommando:

```powershell
node -v
```

Tjek npm med denne kommando:

```powershell
npm -v
```

Projektets package.json bruger:

```text
npm 11.9.0
```

Hvis npm ikke findes, er Node.js ikke installeret korrekt.

---

## 2. npm

npm bruges til at installere alle projektets pakker fra package.json.

npm kommer normalt sammen med Node.js.

Tjek npm med denne kommando:

```powershell
npm -v
```

Projektet bruger:

```text
npm 11.9.0
```

Hvis npm skal opdateres, kan denne kommando bruges:

```powershell
npm install -g npm@11.9.0
```

---

## 3. Git

Git skal være installeret, fordi projektet skal klones fra GitHub.

Tjek Git med denne kommando:

```powershell
git --version
```

Hvis Git ikke findes, skal Git installeres først.

---

## 4. Angular CLI

Angular CLI skal være installeret globalt, så kommandoen `ng serve` virker.

Installer Angular CLI globalt med denne kommando:

```powershell
npm install -g @angular/cli
```

Tjek at Angular CLI virker:

```powershell
ng version
```

Projektet bruger Angular CLI:

```text
@angular/cli 21.2.9
```

Når projektets pakker installeres med `npm install`, bliver den lokale Angular CLI version også installeret fra package.json.

Den globale Angular CLI bruges til at kunne skrive `ng` i terminalen.

---

# Pakker projektet bruger

Projektets pakker installeres automatisk med:

```powershell
npm install
```

Du skal normalt ikke installere disse pakker én efter én.

De står i package.json, og `npm install` installerer dem automatisk.

---

## Dependencies

Disse pakker bruges af selve projektet:

```text
@angular/common 21.2.9
@angular/compiler 21.2.9
@angular/core 21.2.9
@angular/forms 21.2.9
@angular/platform-browser 21.2.9
@angular/platform-server 21.2.9
@angular/router 21.2.9
@angular/ssr 21.2.9
@types/dotenv ^6.1.1
cloudinary ^2.10.0
dotenv ^17.4.2
express ^5.1.0
firebase ^12.12.0
firebase-functions ^7.2.5
rxjs ~7.8.0
tslib ^2.3.0
```

---

## DevDependencies

Disse pakker bruges til udvikling, build, TypeScript, test og Angular tooling:

```text
@angular/build 21.2.9
@angular/cli 21.2.9
@angular/compiler-cli 21.2.9
@types/express ^5.0.1
@types/node ^20.19.40
jsdom ^27.1.0
typescript ^5.9.3
vitest ^4.0.8
```

---

# Klon projektet

Kør denne kommando i terminalen:

```powershell
git clone https://github.com/musGames/musGames.github.io.git
```

---

# Gå ind i projektmappen

Når terminalen åbnes, står man én mappe udenfor `musgames`.

Derfor skal man altid først skrive:

```powershell
cd musgames
```

---

# Installer projektets pakker

Kør denne kommando fra `musgames` mappen:

```powershell
npm install
```

Denne kommando installerer alle pakker fra projektets package.json.

Det inkluderer Angular, Firebase, Cloudinary, Express, TypeScript, RxJS og alle andre dependencies og devDependencies.

---

# Installer Angular CLI globalt

Kør denne kommando:

```powershell
npm install -g @angular/cli
```

Tjek derefter at Angular CLI virker:

```powershell
ng version
```

Hvis der bliver vist versionsinformation i terminalen, virker `ng`.

---

# Start Angular-projektet

Åbn en terminal.

Når terminalen åbnes, står man én mappe udenfor `musgames`.

Skriv derfor først:

```powershell
cd musgames
```

Start derefter Angular-projektet:

```powershell
ng serve
```

Åbn siden i browseren:

```text
http://localhost:4200
```

---

# Firebase login på hjemmesiden i localhost

Man behøver ikke være logget ind med Firebase CLI for at logge ind på hjemmesiden i localhost.

Hjemmesiden bruger Firebase config i Angular-projektet.

Firebase config indeholder typisk værdier som:

```text
apiKey
authDomain
databaseURL
projectId
storageBucket
messagingSenderId
appId
```

Det betyder, at login på hjemmesiden virker gennem Firebase-pakken i Angular-projektet.

Derfor er dette ikke nødvendigt for almindelig lokal kørsel:

```powershell
firebase login
```

Og dette er heller ikke nødvendigt for almindelig lokal kørsel:

```powershell
npm install -g firebase-tools
```

Du skal kun bruge Firebase CLI, hvis du senere vil deploye, styre Firebase-projektet fra terminalen eller køre Firebase emulatorer.

---

# Kort version

## Første gang projektet sættes op

Kør disse kommandoer:

```powershell
git clone https://github.com/musGames/musGames.github.io.git
cd musgames
node -v
npm -v
git --version
npm install
npm install -g @angular/cli
ng version
```

---

## Hver gang projektet skal startes

Kør disse kommandoer:

```powershell
cd musgames
ng serve
```

Åbn derefter:

```text
http://localhost:4200
```

---

# Hvad der skal være installeret samlet

For at kunne køre projektet lokalt med `ng serve`, skal dette være installeret:

```text
Node.js
npm
Git
Angular CLI
Projektets npm pakker
```

Projektets npm pakker installeres med:

```powershell
npm install
```

---

# Tjek installationen

Kør disse kommandoer for at tjekke at alt virker:

```powershell
node -v
npm -v
git --version
ng version
```

Hvis alle kommandoer viser versionsinformation, er de nødvendige programmer installeret.

---

# Fejlfinding

## Hvis `node` ikke virker

Node.js er ikke installeret korrekt.

Installer Node.js igen.

Luk terminalen helt og åbn den igen.

Kør derefter:

```powershell
node -v
npm -v
```

---

## Hvis `npm` ikke virker

npm er ikke installeret korrekt.

npm kommer normalt sammen med Node.js.

Installer Node.js igen.

Luk terminalen helt og åbn den igen.

Kør derefter:

```powershell
npm -v
```

---

## Hvis `git` ikke virker

Git er ikke installeret korrekt.

Installer Git igen.

Luk terminalen helt og åbn den igen.

Kør derefter:

```powershell
git --version
```

---

## Hvis `ng` ikke virker

Kør denne kommando:

```powershell
npm install -g @angular/cli
```

Luk terminalen helt og åbn den igen.

Kør derefter:

```powershell
cd musgames
ng version
```

---

## Hvis PowerShell blokerer kommandoer

Hvis PowerShell blokerer `ng` eller andre npm-kommandoer, kan denne kommando bruges:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Vælg derefter:

```text
Y
```

Luk terminalen og åbn den igen.

---

## Hvis `npm install` fejler

Slet `node_modules` og `package-lock.json`.

Kør derefter `npm install` igen.

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Hvis `package-lock.json` skal beholdes, skal den ikke slettes.

---

## Hvis Angular siger at TypeScript versionen er forkert

Projektet bruger:

```text
typescript ^5.9.3
```

Kør denne kommando:

```powershell
npm install
```

Hvis fejlen stadig sker, kan TypeScript installeres igen med:

```powershell
npm install typescript@5.9.3 --save-dev
```

---

## Hvis projektet stadig ikke virker

Tjek først at du står i den rigtige mappe.

Du skal stå i:

```text
musgames
```

Kør derefter:

```powershell
dir
```

Du skal kunne se filer som:

```text
package.json
angular.json
src
```

Hvis du ikke kan se dem, står du i den forkerte mappe.

---

# Normal opstart efter installation

Når projektet allerede er installeret, skal man kun starte Angular.

```powershell
cd musgames
ng serve
```

Åbn derefter:

```text
http://localhost:4200
```

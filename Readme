# MusGames / Arcade.IO

Dette er guiden til at klone projektet ned, installere de nødvendige pakker og starte projektet lokalt med Angular og Firebase Functions emulator.

## Krav

Før projektet kan køres, skal følgende være installeret på computeren:

- Node.js
- npm
- Git

## Klon projektet

Skriv denne kommando i terminalen:

```powershell
git clone https://github.com/musGames/musGames.github.io.git
```

## Gå ind i projektmappen

Når terminalen åbnes, står man én mappe udenfor `musgames`.

Derfor skal man altid først skrive:

```powershell
cd musgames
```

## Installer projektets pakker

Kør denne kommando:

```powershell
npm install
```

Denne kommando installerer alle pakker fra projektets `package.json`.

## Installer Angular CLI

Kør denne kommando:

```powershell
npm install -g @angular/cli
```

## Tjek at Angular virker

Kør denne kommando:

```powershell
ng version
```

Hvis der bliver vist versionsinformation i terminalen, virker `ng`.

## Installer Firebase CLI

Kør denne kommando:

```powershell
npm install -g firebase-tools
```

## Tjek at Firebase virker

Kør denne kommando:

```powershell
firebase --version
```

Hvis der bliver vist et versionsnummer i terminalen, virker `firebase`.

## Log ind på Firebase

Kør denne kommando:

```powershell
firebase login
```

Log ind med den Firebase-konto, der har adgang til projektet.

Firebase login-oplysninger skal ikke skrives i README-filen.

## Vælg Firebase-projektet

Kør denne kommando:

```powershell
firebase use my-game-portal-10af3
```

Hvis projektet ikke er tilføjet lokalt endnu, kan denne kommando bruges:

```powershell
firebase use --add
```

Vælg derefter Firebase-projektet:

```text
my-game-portal-10af3
```

## Installer pakker til Firebase Functions

Hvis projektet har en `functions` mappe, skal pakkerne til Firebase Functions også installeres.

Kør disse kommandoer:

```powershell
cd functions
npm install
cd ..
```

## Start Firebase Functions emulator

Denne kommando skal køres fra `musgames` mappen.

```powershell
firebase emulators:start --only functions
```

Firebase emulatoren skal blive kørende i sin egen terminal.

## Start Angular-projektet

Åbn en ny terminal.

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

# Kort version

## Første gang projektet sættes op

```powershell
git clone https://github.com/musGames/musGames.github.io.git
cd musgames
npm install
npm install -g @angular/cli
npm install -g firebase-tools
ng version
firebase --version
firebase login
firebase use my-game-portal-10af3
cd functions
npm install
cd ..
```

## Hver gang projektet skal startes

Terminal 1:

```powershell
cd musgames
firebase emulators:start --only functions
```

Terminal 2:

```powershell
cd musgames
ng serve
```

Åbn derefter:

```text
http://localhost:4200
```

# Fejlfinding

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

## Hvis `firebase` ikke virker

Kør denne kommando:

```powershell
npm install -g firebase-tools
```

Luk terminalen helt og åbn den igen.

Kør derefter:

```powershell
cd musgames
firebase --version
```

## Hvis PowerShell blokerer kommandoer

Åbn PowerShell som administrator og kør:

```powershell
Set-ExecutionPolicy RemoteSigned
```

Vælg derefter:

```text
Y
```

Luk terminalen og åbn den igen.

# Normal opstart efter installation

Når projektet allerede er installeret, skal man kun starte Firebase emulatoren og Angular.

## Terminal 1

```powershell
cd musgames
firebase emulators:start --only functions
```

## Terminal 2

```powershell
cd musgames
ng serve
```

Åbn derefter:

```text
http://localhost:4200
```
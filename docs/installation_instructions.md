# Asennusdokumentaatio

### Ulkoinen dokumentaatio
React nativen käyttöönoton viralliset ohjeet: [React Native](https://reactnative.dev/docs/0.60/getting-started)

Expo:n virallinen dokumentaatio: [Expo](https://docs.expo.io/)

### Asennus ja sovelluksen käynnistys
1. Asenna Node 10 LTS tai uudempi.
2. Asenna Expo CLI (Expon komentorivityökalut) seuraavalla komennolla: `npm install -g expo-cli`
3. Kloonaa maastokartoitus-app-repositorio koneellesi ja aja repositorion juurikansiossa komento `npm install`, joka asentaa projektin tarvitsemat kirjastot.
4. Tässä vaiheessa on suositeltavaa luoda Expo-tunnus sivulla [https://expo.io/](https://expo.io/) ja kirjautua sitten Expon komentorivillä sisään komennolla `expo login`
5. Tämän jälkeen voi metro-palvelimen käynnistää komennolla `expo start` tai vaihtoehtoisesti komennolla `npm start`.
6. Expo yrittää oletusarvoisesti käyttää lähiverkkoa client-appin ja metro-palvelimen välillä, mikä ei esimerkiksi eduroamissa toimi. Jos palvelimen käynnistää komennolla `expo start --tunnel`, yhteys muodostetaan tunneliin, jolloin clientin ja palvelimen ei tarvitse olla samassa lähiverkossa.
7. Asenna Google Play:stä Expo -mobiilisovellus, jolla voi ajaa sovellusta kännykässä.
8. Avaa sovellus, vaihtoehtoina on:
   1. Jos käytössä on Expo-tunnus, kirjaudu Expo Clientissa sisään. Tämä jälkeen käynnissä oleva Metro-palvelin näkyy kohdassa `Projects`.
   2. Mikäli tunnusta ei ole, voi Metro-palvelimen antaman QR-koodin lukea Expo-sovelluksen `Scan QR Code`-painikkeella, tai mikäli sovellus on jo avattu, eikä sen koodi ole muuttunut, sen voi avata `Recently Opened`-listasta painamalla.
9. Buildaus käynnistetään komennolla `expo build:android`. Buildaus suoritetaan Expon palvelimella ja sen edistymistä voi seurata osoitteessa [expo.io](https://expo.io/).

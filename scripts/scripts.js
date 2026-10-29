// ===== DEEL 1: categorieën-uitklapmenu =====
// Openen en sluiten doet <details> zelf, daar is geen JavaScript voor nodig.
// Dit stukje sluit het menu alleen weer als je op een categorie klikt.
const categorieMenu = document.querySelector(".categorie-menu details");

// Alleen doen als het menu bestaat (dit script laadt op alle pagina's)
if (categorieMenu) {
  categorieMenu.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      categorieMenu.open = false;
    }
  });
}


// ===== DEEL 2: variant kiezen =====
// Bij elke variant hoort een mapnaam in Iconenset-master/Svg/
const variantMappen = {
  line: "Line",
  fill: "Fill",
  regular: "Regular",
  diapositive: "Regular diapositive"
};

// Alleen de radio's van de pagina, niet die in de download-popup
const variantRadios = document.querySelectorAll('input[name="variant"]');
const rasterIconen = document.querySelectorAll(".icon-grid img, .iconen-grid img");

variantRadios.forEach(function (radio) {
  radio.addEventListener("change", function () {
    const map = variantMappen[radio.value];

    rasterIconen.forEach(function (plaatje) {
      // "Iconenset-master/Svg/Line/Afval.svg": het laatste stuk is "Afval.svg"
      const bestandsnaam = plaatje.getAttribute("src").split("/").pop();
      plaatje.setAttribute("src", "Iconenset-master/Svg/" + map + "/" + bestandsnaam);
    });
  });
});


// ===== DEEL 3: icoon-popup =====
// Hier staat per icoon de informatie. De sleutel (bijv. HoogWater) is de
// bestandsnaam van het icoon, en komt overeen met data-icoon in de HTML.
// Vul "betekenis" en "synoniemen" aan zodra je opdrachtgever de teksten heeft.
const iconenInfo = {
  Aanmelden: { naam: "Aanmelden" },
  Afval: {
    naam: "Afval",
    betekenis: "Dit icoon wordt gebruikt om alles rondom afval, afvalinzameling en -verwerking aan te duiden, bijvoorbeeld bij formulieren, meldingen en informatiepagina's over afval.",
    synoniemen: ["Vuilnis", "Huisvuil", "Afvalinzameling"]
  },
  Afvalcontainer: { naam: "Afvalcontainer" },
  Begraafplaats: { naam: "Begraafplaats" },
  BladerenOpruimen: { naam: "Bladeren opruimen" },
  Burgemeester: { naam: "Burgemeester" },
  Erfgoed: { naam: "Erfgoed" },
  Geboorte: { naam: "Geboorte" },
  Gezicht: { naam: "Gezicht" },
  HoogWater: { naam: "Hoog water" },
  Inkomen: { naam: "Inkomen" },
  MeldingStraatverlichting: { naam: "Melding straatverlichting" },
  Ondernemen: { naam: "Ondernemen" },
  Paspoort: { naam: "Paspoort" },
  Rolstoel: { naam: "Rolstoel" }
};

const icoonDialoog = document.querySelector("#icoon-dialoog");
const downloadDialoog = document.querySelector("#download-dialoog");

// Alleen doen als de popup op deze pagina bestaat
if (icoonDialoog) {
  const icoonKnoppen = document.querySelectorAll(".icoon-knop");
  const sluitKnop = document.querySelector("#sluit-icoon-dialoog");
  const adviesTekst = document.querySelector("#toegankelijkheid-advies");
  const embedVeld = document.querySelector("#embed-code");
  const kopieerKnop = document.querySelector("#kopieer-embed");
  const downloadKnop = document.querySelector("#open-download-dialoog");

  let huidigeNaam = "";   // onthoudt welk icoon nu open staat
  let huidigeSleutel = "";  //de bestandnaam, bijv. HoogWater

  // Advies bij de toegankelijkheidschecker
  function toonAdvies() {
    const gebruik = document.querySelector('input[name="gebruik"]:checked').value;

    if (gebruik === "decoratief") {
      adviesTekst.textContent = 'Gebruik een lege alt-tekst: alt="". Schermlezers slaan het icoon dan over, want de tekst ernaast zegt al genoeg.';
    } else {
      adviesTekst.textContent = 'Geef het icoon een beschrijvende alt-tekst, bijvoorbeeld alt="' + huidigeNaam + '". Zonder tekst erbij is het icoon het enige dat de betekenis vertelt.';
    }
  }

  // Vul de popup met het icoon dat is aangeklikt
  function vulPopup(sleutel) {
    const info = iconenInfo[sleutel];
    huidigeNaam = info.naam;
    huidigeSleutel = sleutel;

    // Titel
    document.querySelector("#icoon-titel").textContent = info.naam;

    // Betekenis
    document.querySelector("#icoon-betekenis").textContent =
      info.betekenis || "De betekenis van dit icoon volgt nog.";

    // Synoniemen: lijst leegmaken, dan per synoniem een <li> maken
    const lijst = document.querySelector("#icoon-synoniemen");
    lijst.innerHTML = "";
    const synoniemen = info.synoniemen || ["Nog niet beschreven"];
    synoniemen.forEach(function (woord) {
      const li = document.createElement("li");
      li.textContent = woord;
      lijst.appendChild(li);
    });

    // De vier varianten naast elkaar (zelfde volgorde als in de HTML)
    const mappen = ["Line", "Fill", "Regular", "Regular diapositive"];
    const plaatjes = icoonDialoog.querySelectorAll(".varianten-vergelijk img");
    plaatjes.forEach(function (plaatje, nummer) {
      plaatje.setAttribute("src", "Iconenset-master/Svg/" + mappen[nummer] + "/" + sleutel + ".svg");
    });

    // Embedcode met de variant die op de pagina gekozen is
    const gekozen = document.querySelector('input[name="variant"]:checked').value;
    embedVeld.value = '<img src="Iconenset-master/Svg/' + variantMappen[gekozen] + "/" + sleutel +
      '.svg" alt="' + info.naam + '" width="48" height="48">';

    // Checker terugzetten op "decoratief"
    document.querySelector('input[name="gebruik"][value="decoratief"]').checked = true;
    toonAdvies();

    kopieerKnop.textContent = "Kopieer";
  }

  // Klik op een icoon: popup vullen en openen
  icoonKnoppen.forEach(function (knop) {
    knop.addEventListener("click", function () {
      vulPopup(knop.getAttribute("data-icoon"));
      icoonDialoog.showModal();
    });
  });

  // Popup sluiten met de knop "Sluiten" (Esc werkt vanzelf)
  sluitKnop.addEventListener("click", function () {
    icoonDialoog.close();
  });

  // Checker: advies aanpassen als je een andere keuze maakt
  document.querySelectorAll('input[name="gebruik"]').forEach(function (radio) {
    radio.addEventListener("change", toonAdvies);
  });

  // Download-popup openen bovenop de icoon-popup
  downloadKnop.addEventListener("click", function () {
    document.querySelector("#dl-naam").textContent = huidigeNaam;
    downloadDialoog.showModal();
  });

    // Klik op "Download" in de download-popup
  const downloadBevestig = document.querySelector("#download-bevestig");

   downloadBevestig.addEventListener("click", async function () {
    // Eerst de popup sluiten. Dan gaat hij altijd dicht, ook als het ophalen hieronder misgaat.
    downloadDialoog.close();

    // Haal de keuzes op
    const variant = document.querySelector('input[name="dl-variant"]:checked').value;
    const formaat = document.querySelector("#dl-formaat").value;
    const kleur = document.querySelector("#dl-kleur").value;

    // Bouw het adres van het bestand: bijv. Iconenset-master/Svg/Fill/HoogWater.svg
    const map = variantMappen[variant];
    const adres = "Iconenset-master/Svg/" + map + "/" + huidigeSleutel + ".svg";

    // Haal het bestand op en wacht tot het binnen is
    const antwoord = await fetch(adres);

    // Ging er iets mis? Stop dan en zeg wat er mis was
    if (!antwoord.ok) {
      console.log("Bestand niet gevonden:", adres);
      return;
    }

    // Lees de inhoud van het bestand als tekst
    const svgTekst = await antwoord.text();
    console.log(svgTekst);
  });

  // Download-popup sluiten met "Sluiten" of "Annuleer"
  document.querySelector("#sluit-download-dialoog").addEventListener("click", function () {
    downloadDialoog.close();
  });
  document.querySelector("#download-annuleer").addEventListener("click", function () {
    downloadDialoog.close();
  });

  // Embedcode kopiëren
  kopieerKnop.addEventListener("click", function () {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(embedVeld.value);
      kopieerKnop.textContent = "Gekopieerd!";
    } else {
      embedVeld.select();   // oudere browser: tekst selecteren, dan kan je zelf kopiëren
    }
  });
}
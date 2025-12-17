# Input für Tech Stack Seite

Hier kannst du deine Gedanken, Notizen und Stichpunkte reinschreiben.
Der Agent wird diese Datei lesen und den Content in tech-stack.mdx aufbereiten.

---

Ich arbeite seit 2013 hauptberuflich als Softwareentwickler und mache dabei alles und arbeite gerne über den Stack. Angefangen habe ich mit Meteor, was sehr lustig war, weil man nie wusste,
wo man gerade arbeitet. Deployment habe ich zunächst mit PM2 gemacht, dann aber schnell mit docker und damals tutum, was dann später von docker gekauft wurde und zu docker cloud wurde. Zu dieser Zeit
habe ich vor allem im Crypto-Bereich gearbeitet und dort komplexe Frontend-Applikationen (React, Redux, web3, crypto wallets) sowie extensions für Wordpress und Browser extensions gebaut. Über die Jahre habe ich danach viel mit React gearbeitet, dabei auch React Native Projekte gemacht und auch komplexe State-Management Lösungen mit Redux-Saga gebaut.

Gleichzeitig war ich immer auch damit betraut, die gesamte Infrastruktur zu entwerfen, zu implementieren, Developer einzustellen und aufzubauen. Die Kund:innen waren dabei Startups mit weniger als 10 Leuten im Normalfall.

Ich habe dann auch immer mehr mit TypeScript gearbeitet und Freude an funktionalem Code entwickelt, den ich als Mathematiker besonders schätze. ramda, sanctuary und fp-ts und inzwischen vor allem effect-ts sind Tools, die ich gerne benutze. Auch Railway oriented programming ist hier ein wichtiges Stichwort.

In einem Projekt habe ich dann auch noch einmal NoSQL in Form von Firebase eingesetzt, nachdem ich nach den ersten Meteor / Mongo-Experimenten eine Weile auf SQL gesetzt hatte (auch wegen der funktionalen Schreibweise von SQL statements). Firebase fand ich aber mega gut und ich habe es hier auch geschafft, den lokalen simulator so einzubinden, dass man jest tests laufen lassen konnte, was sehr ungewöhnlich ist. Inzwischen nutze ich für meine Projekte pocketbase, was wirklich super und einfach ist.

ORM nutze ich nie, weil ich glaube, dass sie eine Komplexität zu verschleiern versuchen, die nicht ignoriert werden kann. Spätestens bei der ersten Migration sind diese Tools alle überfordert oder funktionieren nicht mehr richtig. Deshalb arbeite ich ausschließlich mit migrations und einfachen sql queries.

Für das Deployment habe ich früher tutum, dann docker cloud genutzt, inzwischen nutze ich entweder lambda functions bzw. cloudworker (firebase) oder docker container in coolify auf meinem eigenen server. Ich habe auch aws lambda functions implementiert und deployed, sowie vercel und netlify genutzt. google cloud functions habe ich auch schon genutzt.

Für Webseiten nutze ich heute vor allem astro. Früher auch meteor, next.js, pure react, gatsby. Den Code schreibe ich ausschließlich mit TypeScript. CSS mache ich am liebsten mit tailwindcss und ich nutze dabei daisyui, weil es eine geile komponenten library ist, die keine library wie react oder ähnliches braucht, sondern pure mit html funktioniert. Custom component libraries halte ich für die meisten projekte für total übertrieben: Mit ein bisschen theming kann man daisyui jeden look geben, den man will.

Figma mag ich nicht so gerne, weil es keine Versionskontrolle hat und man ständig über total unwichtige (aus Sicht business case) Details spricht (sollen das wirklich 8 Pixel sein? Warum nicht 12 pixel wie hier?) und sich ständig die requirements verändern, ohne, dass dies dokumentiert ist. Viel einfacher sind wireframes, die man mit wireframe sketcher erstellt. Die Arbeitsdateien davon kann man sogar committen.

Für dokumentation nutze ich am liebsten docusaurus, wenn es schnell gehen muss. Ansonsten vielleicht auch shipyard, wenn es komplexer werden soll. Ich bin ein großer Freund von Dokumentation und Tests. Tests schreib ich am liebsten mit vitest, habe aber auch mocha und vite viel genutzt. Ich bin sehr kreativ in Sachen Tests schreiben und in der Lage, auch "untestbaren Code" testbar zu machen.

ich nutze linux und mac os zum arbeiten. mac os auch wegen ios development mit react native, obwohl ich mich inzwischen sehr daran gewöhnt habe. ich lehne alles ab, was mit windows zu tun hat. (dies sollte klar, aber nicht zu hart formuliert werden). darunter fällt auch azure, microsoft teams, bitbucket, office, word, etc. Jira finde ich auch ganz schlimm. Ich arbeite gerne lean und dann mit github issues. gitlab ist auch okay, obwohl es oft github unterlegen ist.

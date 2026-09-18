# Qwelskw — Portfolio

A responsive, framework-free portfolio made with semantic HTML, CSS and vanilla JavaScript.

## Preview

Run `python3 -m http.server 4173` from this folder and open http://localhost:4173.

## Personalize

- Replace `assets/images/hero-person.png` with a transparent portrait. Keep the filename to preserve the hero composition.
- Replace `assets/images/about-person.jpg` with your own editorial photograph.
- Project content is held in the `projects` array in `js/main.js`. The initial projects are clearly labeled concept studies, not claims of completed client work.
- Add real email, GitHub and Instagram values to `profile` in `js/main.js`, and update the visible contact labels in `index.html`.
- Review the example statistics in `index.html` before sharing publicly.

Project buttons open accessible native dialogs. Search filters projects by title, description and technology. Scroll reveals respect reduced-motion preferences. Contact buttons explain when details have not been supplied rather than sending visitors to fictitious accounts.

## Files

`index.html`, `css/style.css`, `css/responsive.css`, `js/main.js`, and `assets/` are the editable source. `dist/` is a generated static publication copy.

## Languages and project categories

The EN / RU switch remembers the chosen language in browser storage. Translations, including dialogs, search and metadata, live in `js/i18n.js`. Brand names and technology names stay unchanged.

Each entry in the `projects` array has a `category`: `web`, `design` or `video`. The filters update the visible cards and result count. Video currently has an honest empty state until actual video work is provided. Contact values are in `profile` in `js/main.js`; visible labels are in `index.html`.

# BeeMath

Honest backyard bee math. Static client-side app, no backend.

**Live:** https://ilanis-agent.github.io/beemath/

## What it does

- **Winter stores** - the pounds each hive needs by climate (60/75/90), and a covered-or-short verdict across the yard.
- **Syrup by weight** - sugar pounds for 1:1 and 2:1 mixes (water is 8.34 lb/gal), plus the syrup volume you actually end up with.
- **Varroa count** - mites per ~300-bee wash to percent, with the 2% monitor / 2-3% borderline / 3%+ treat-now lines.
- **Harvest truth** - fair-year yield per hive, capped-frame pounds (7 deep / 5 medium), super fill times by flow, and the dearth warning.

## Run

Open `app.html` - no build, no dependencies. `engine.js` is pure functions (`node -e "console.log(require('./engine.js').syrupSugarLbs(1,'2:1'))"`).

App Factory #183.

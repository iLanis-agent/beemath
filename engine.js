/* BeeMath engine - honest backyard beekeeping math. Pure functions, no DOM. */
var BeeEngine = (function () {
  var WATER_LB_PER_GAL = 8.34;
  var SURPLUS_PER_HIVE = 60;   /* lb of harvestable honey per decent hive-year */
  var VARROA_SAMPLE_BEES = 300;

  function r1(x) { return Math.round(x * 10) / 10; }

  /* syrup by WEIGHT - the classic mistake is measuring sugar in cups */
  function syrupSugarLbs(galWater, ratio) {
    var w = galWater * WATER_LB_PER_GAL;
    if (ratio === '1:1') return r1(w);
    if (ratio === '2:1') return r1(2 * w);
    throw new Error('ratio must be 1:1 or 2:1');
  }

  function syrupTotalGal(galWater, ratio) {
    /* sugar dissolves into about 0.6 of its weight-equivalent volume; honest answer: ~1.25x water volume for 1:1, ~1.35x for 2:1 */
    var f = ratio === '1:1' ? 1.25 : ratio === '2:1' ? 1.35 : null;
    if (!f) throw new Error('ratio must be 1:1 or 2:1');
    return r1(galWater * f);
  }

  /* winter stores a full colony needs, in lb of honey */
  function winterStoresLbs(climate) {
    if (climate === 'mild') return 60;
    if (climate === 'moderate') return 75;
    if (climate === 'cold') return 90;
    throw new Error('climate must be mild, moderate or cold');
  }

  function storesVerdict(lbsOnHive, climate) {
    var need = winterStoresLbs(climate);
    if (lbsOnHive >= need) return 'covered - ' + lbsOnHive + ' lb against a ' + need + ' lb winter, leave the honey supers off';
    var short = need - lbsOnHive;
    return 'short by ' + r1(short) + ' lb (' + lbsOnHive + ' of ' + need + ') - feed 2:1 syrup hard before the cluster forms, or insulate and pray';
  }

  /* harvest expectations */
  function honeyForHives(hives) { return hives * SURPLUS_PER_HIVE; }
  function hivesForHoney(targetLb) { return Math.ceil(targetLb / SURPLUS_PER_HIVE); }

  /* a frame of capped honey, by frame size */
  function frameHoneyLb(size) {
    if (size === 'deep') return 7;
    if (size === 'medium') return 5;
    throw new Error('frame size must be deep or medium');
  }

  /* varroa mite wash: mites per 300 bees -> percent, and the treatment line at 2-3% */
  function varroaPct(mites, bees) {
    var b = bees || VARROA_SAMPLE_BEES;
    return r1(mites / b * 100);
  }
  function varroaVerdict(mites, bees) {
    var pct = varroaPct(mites, bees);
    if (pct < 2) return pct + '% - below the line; retest in a month, not a season';
    if (pct < 3) return pct + '% - borderline; late summer this means treat, spring this means watch weekly';
    return pct + '% - treat now; every week you wait the mites double down on you';
  }

  /* steady-state adult population from lay rate and lifespan */
  function population(layPerDay, lifespanDays) {
    return layPerDay * lifespanDays;
  }

  /* how long a frame of drawn comb takes to fill: workers cap ~... honest version: a strong hive draws+fills a super in 2-4 weeks of flow */
  function superWeeks(flowStrength) {
    if (flowStrength === 'strong') return { min: 2, max: 3 };
    if (flowStrength === 'moderate') return { min: 3, max: 5 };
    if (flowStrength === 'dearth') return { min: 8, max: 12, note: 'in a dearth they eat what you add - check before adding more' };
    throw new Error('flow must be strong, moderate or dearth');
  }

  return {
    WATER_LB_PER_GAL: WATER_LB_PER_GAL, SURPLUS_PER_HIVE: SURPLUS_PER_HIVE,
    syrupSugarLbs: syrupSugarLbs, syrupTotalGal: syrupTotalGal,
    winterStoresLbs: winterStoresLbs, storesVerdict: storesVerdict,
    honeyForHives: honeyForHives, hivesForHoney: hivesForHoney,
    frameHoneyLb: frameHoneyLb, varroaPct: varroaPct, varroaVerdict: varroaVerdict,
    population: population, superWeeks: superWeeks
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BeeEngine;

/**
 * One-off patcher: adds `about` and `effect` to ECOSYSTEM.PLANTS in articles/tank-builder.html
 * Run: node scripts/enrich-tank-builder-plants.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(import.meta.dirname, '..');
const HTML = path.join(ROOT, 'articles', 'tank-builder.html');

const ABOUT = {
  'java-fern':
    'Java fern is a slow-growing rhizome plant that tolerates low light and beginner mistakes. Leave the rhizome above the substrate and tie it to wood or rock so the roots can anchor without rotting.',
  anubias:
    'Anubias species are among the most forgiving aquarium plants, with thick leaves that resist nibbling fish. Keep the rhizome exposed; burying it causes slow decline as the rhizome suffocates.',
  'java-moss':
    'Java moss forms dense, fine mats that shelter fry and shrimp and softens hardscape edges. It accepts cool to warm water and tolerates irregular lighting, though dense growth benefits from occasional thinning.',
  'christmas-moss':
    'Christmas moss branches in a fir-tree pattern, giving structured texture on wood and mesh. It prefers stable flow and clean water; debris trapped in the fronds should be gently rinsed during maintenance.',
  'flame-moss':
    'Flame moss grows more upright than java moss, creating vertical flame-shaped clumps on hardscape. Moderate light and gentle flow keep growth compact; trim with scissors to maintain shape.',
  cryptocoryne:
    'Cryptocoryne are classic rosette plants for community and biotope tanks, often melting after relocation then regrowing. Stable parameters and root tabs under inert gravel support long-term recovery and colour.',
  bucephalandra:
    'Bucephalandra are small, slow rhizome plants prized for textured leaves and deep tones under good light. Treat like anubias: attach the rhizome to hardscape and avoid burying it in fine substrate.',
  vallisneria:
    'Vallisneria sends long ribbon leaves toward the surface, excellent for background cover and nitrate uptake. It spreads by runners; thin crowded patches so lower leaves still receive some light.',
  'amazon-sword':
    'Amazon swords are heavy root feeders that form a bold rosette centerpiece when given space and nutrients. Root tabs or enriched substrate greatly improve leaf colour compared with water-column dosing alone.',
  hygrophila:
    'Hygrophila species are fast stem plants useful for new tanks to absorb excess nutrients. Regular trimming encourages bushier growth; some species are restricted in certain countries, so check local regulations.',
  rotala:
    'Rotala species are stem plants that shift colour with light intensity and nitrate levels. Frequent trimming replants the tops and keeps the stand dense; CO₂ improves form but is not mandatory for every species.',
  ludwigia:
    'Ludwigia stems show the clearest red tones under strong light and good iron availability. Tops grow more coloured than shaded lower sections, so replant cut tops and remove bare stems to keep the group tidy.',
  'monte-carlo':
    'Micranthemum “Monte Carlo” carpets slowly across foreground under medium to high light. Press small clumps into substrate without burying leaves; CO₂ and consistent light reduce upward stretching.',
  'dwarf-hairgrass':
    'Eleocharis “dwarf hairgrass” forms a fine lawn when runners spread across open substrate. High light and CO₂ produce the tightest carpet; in low-tech tanks it often grows taller but still usable as texture.',
  glossostigma:
    'Glossostigma elatinoides is a classic high-demand carpet that stays low only with strong light and CO₂. Plant small portions deeply and trim runners that climb decor so the mat stays on the substrate.',
  'pogostemon-helferi':
    'Downoi is a distinctive crinkled stem plant for midground accents. Stable CO₂ and moderate hardness support compact growth; sudden parameter swings can cause melt similar to other stem plants.',
  'blyxa-japonica':
    'Blyxa japonica forms a grassy rosette with olive to reddish tones under good light. It appreciates root feeding and clean, gently moving water; avoid shading it completely with faster floating plants.',
  hornwort:
    'Hornwort is a free-floating or weighted stem that grows rapidly and absorbs ammonia and nitrates. Shedding fine needles is normal after moves; give it room so it does not smother slower plants below.',
  duckweed:
    'Duckweed multiplies quickly on the surface, diffusing light and reducing algae by consuming excess nutrients. Skim excess weekly so gas exchange and light reach plants and fish below.',
  frogbit:
    'Amazon frogbit develops long roots that shrimp use as grazing surfaces while the leaves shade the surface. Thin dense mats so submerged plants and gas exchange are not fully blocked.',
  'water-wisteria':
    'Hygrophila difformis adapts as a stem or planted bush with finely divided leaves under strong light. It grows quickly; trim often and replant tops to keep a bushy shape and prevent lower die-off.',
  pennywort:
    'Hydrocotyle species creep horizontally with round leaves, useful for wabi-kusa edges or shallow tanks. Bright light keeps leaves small and flat; low light produces longer stems reaching upward.',
  pearlweed:
    'Hemianthus micranthemoides pearls form a bright green bush or loose carpet depending on trimming. Without CO₂ it tends to grow leggy; frequent trimming encourages lateral branching and density.',
  'limnophila-aquatica':
    'Limnophila stems add feathery texture and rapid nutrient uptake in stem plant layouts. Emersed-grown stems may shed submerged leaves at first; new growth adapts if parameters remain stable.',
  'bacopa-caroliniana':
    'Bacopa caroliniana is a sturdy stem with thick leaves, forgiving in community tanks. Lower leaves drop in very low light; moderate light and occasional iron keep the stack green to the base.',
  'hydrocotyle-leucocephala':
    'Brazilian pennywort climbs toward light with lily-pad-like leaves, working as a floating or rooted stem. It grows quickly; remove excess so filters and surface skimmers are not clogged.',
  'staurogyne-repens':
    'Staurogyne repens is a low creeping stem plant used as a short carpet or foreground bush. Press stems shallowly into substrate and trim horizontally to encourage side shoots and a tight lawn.',
  'rotala-wallichii':
    'Rotala wallichii is a delicate stem with pink-orange tips under intense light and good CO₂. Soft water and stable nitrate help; it is less forgiving than common rotala species, so avoid large parameter swings.',
  'bolbitis-heudelotii':
    'African water fern is a large rhizome fern for broad driftwood pieces and tall tanks. Slow growth means patience; clean gently to avoid tearing fronds and keep flow mild around the rhizome.',
  'microsorum-narrow':
    'Narrow-leaf java fern suits vertical wood placements where standard java fern looks too wide. Rhizome rules match java fern: tie or glue, never bury, and expect plantlets on older leaves.',
  'hydrocotyle-tripartita':
    'Tripartite hydrocotyle carpets in low clumps with three-lobed leaves, popular for detail in aquascapes. Medium light and occasional trimming keep it spreading horizontally instead of climbing tall.',
  'marsilea-hirsuta':
    'Marsilea hirsuta mimics a four-leaf clover carpet when conditions suit it. CO₂ and medium light produce the most clover-like leaves; in low-tech setups leaves may stay more elongated but still attractive.',
  'eleocharis-parvulus':
    'Dwarf spikerush forms a fine grassy carpet similar to hairgrass but often easier in moderate light. Plant in small tufts across the foreground and trim tall outliers to encourage runners.',
  'sagittaria-subulata':
    'Dwarf sagittaria spreads with runners, sending grass-like leaves upward from the foreground. It tolerates cooler water; thin thick patches so inner leaves still receive light and flow.',
  'aponogeton-crispus':
    'Aponogeton crispus grows from a bulb, producing long wavy leaves and sometimes a rest period where leaves die back. Do not bury the bulb completely; half-exposed bulbs rot less often in new setups.'
};

const DEFAULT_EFFECT = { ph: 'neutral', hardness: 'none' };

const lines = fs.readFileSync(HTML, 'utf8').split('\n');
const idx = 1454;
const line = lines[idx];
const prefix = 'var ECOSYSTEM=';
if (!line.startsWith(prefix)) throw new Error('Unexpected ECOSYSTEM line');
const jsonish = line.slice(prefix.length, -1);
const eco = Function('return ' + jsonish)();

for (const [id, p] of Object.entries(eco.PLANTS)) {
  if (!ABOUT[id]) throw new Error('Missing ABOUT for ' + id);
  p.about = ABOUT[id];
  p.effect = p.effect || { ...DEFAULT_EFFECT };
}

const out = prefix + JSON.stringify(eco) + ';';
lines[idx] = out;
fs.writeFileSync(HTML, lines.join('\n'), 'utf8');
console.log('Updated', Object.keys(eco.PLANTS).length, 'plants. New line length', out.length);

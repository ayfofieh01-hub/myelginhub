import type { ChecklistStep, HistorySection, TownScope } from '@/lib/types';

const SHARED_STEPS: ChecklistStep[] = [
  {
    id: 'health-card',
    title: 'Sort your health card and family doctor',
    detail:
      'Book a ServiceOntario appointment for your OHIP card, then join a local family health team waitlist the same week — spots move faster than people expect.',
    emoji: '🩺',
  },
  {
    id: 'utilities',
    title: 'Set up hydro, water and waste',
    detail:
      'Open your electricity and water accounts before move-in day, then grab the curbside collection calendar so you know your garbage, recycling and yard waste days.',
    emoji: '💡',
  },
  {
    id: 'schools',
    title: 'Register children for school or child care',
    detail:
      'Bring proof of address, immunisation records and birth certificates. Licensed child care has waitlists, so register even if your start date is months out.',
    emoji: '🎓',
  },
  {
    id: 'drivers-licence',
    title: 'Update your licence, plates and insurance',
    detail:
      'Change your address within six days of moving, transfer out-of-province licences, and get local insurance quotes — rural postal codes often price differently.',
    emoji: '🚗',
  },
  {
    id: 'banking',
    title: 'Open local banking',
    detail:
      'A branch or credit union in town makes mortgage, small business and farm lending conversations far easier than a call centre.',
    emoji: '🏦',
  },
  {
    id: 'library',
    title: 'Get a library card',
    detail:
      'Free wifi, meeting rooms, newcomer language circles and museum passes. It is the cheapest way to meet people in your first month.',
    emoji: '📚',
  },
  {
    id: 'work',
    title: 'Line up work or introduce your trade',
    detail:
      'Check the Jobs & Employment board, then list your service in the Marketplace so neighbours can find you directly.',
    emoji: '🧰',
  },
  {
    id: 'connect',
    title: 'Meet your community',
    detail:
      'Pick one recurring thing — market Saturday, a league night, a volunteer shift — and go three times. That is usually what turns a new address into home.',
    emoji: '🤝',
  },
];

const TOWN_STEPS: Record<TownScope, ChecklistStep[]> = {
  'st-thomas': [
    {
      id: 'st-transit',
      title: 'Learn the transit routes and the trestle',
      detail:
        'Four city routes cover the hospital, mall and industrial park, and the On Track trestle links the north and south sides on foot in about fifteen minutes.',
      emoji: '🚌',
    },
    {
      id: 'st-rec',
      title: 'Claim your rec pass at the Timken Centre',
      detail:
        'Residents get discounted fitness, skating and pool access, plus a free first drop-in class.',
      emoji: '⛸️',
    },
  ],
  'port-stanley': [
    {
      id: 'ps-parking',
      title: 'Get your village parking and beach pass',
      detail:
        'Residents can buy a season parking pass that covers the beach lots — worth it before the first long weekend.',
      emoji: '🅿️',
    },
    {
      id: 'ps-bridge',
      title: 'Know the lift bridge rhythm',
      detail:
        'The King George VI bridge lifts on marine request. Learn the Carlow Road detour so a raised bridge never makes you late.',
      emoji: '🌉',
    },
  ],
  aylmer: [
    {
      id: 'ay-market',
      title: 'Make Saturday market your anchor',
      detail:
        'The farmers market is the town’s social centre. Arrive before 9:00 for produce, stay for coffee and you will meet half your street.',
      emoji: '🧺',
    },
    {
      id: 'ay-settlement',
      title: 'Visit the settlement and ESL office',
      detail:
        'Old Town Hall Learning runs free adult upgrading, ESL and document help — including credential translation guidance.',
      emoji: '🗂️',
    },
  ],
  all: [
    {
      id: 'all-pick-town',
      title: 'Pick the town you will actually live in',
      detail:
        'St. Thomas for city services and jobs, Port Stanley for the lakeshore, Aylmer for farm country and trades. Switch your town in the top-right selector any time.',
      emoji: '🗺️',
    },
    {
      id: 'all-county',
      title: 'Register with Elgin County services',
      detail:
        'County-wide library, rideshare and settlement programs work across all three communities.',
      emoji: '🏛️',
    },
  ],
};

export function newcomerSteps(scope: TownScope): ChecklistStep[] {
  return [...TOWN_STEPS[scope], ...SHARED_STEPS];
}

export const TOWN_HISTORY: Record<TownScope, HistorySection[]> = {
  'st-thomas': [
    {
      year: '1810',
      title: 'A settlement on the Talbot trail',
      body: 'Named for Colonel Thomas Talbot, the settlement grew along the Talbot Road survey that opened southwestern Ontario to farming. Early mills on Kettle Creek gave the village its first industry.',
    },
    {
      year: '1856',
      title: 'The rails arrive',
      body: 'The Great Western Railway reached St. Thomas, and within thirty years the city sat at the crossing of several major lines. At its peak more than a hundred trains a day passed through, and one in four working residents drew a railway paycheque.',
    },
    {
      year: '1885',
      title: 'Jumbo',
      body: 'Jumbo, the most famous circus elephant in the world, was struck and killed by a locomotive here on 15 September. The city commemorated the centennial with a life-size monument on Talbot Street that remains its best known landmark.',
    },
    {
      year: '1913',
      title: 'The Michigan Central shops',
      body: 'The Michigan Central Railroad built its locomotive repair shops on Wellington Street — a building so large it could hold dozens of engines. It now houses the Elgin County Railway Museum.',
    },
    {
      year: '1970s',
      title: 'From rail to manufacturing',
      body: 'As rail traffic declined, automotive and industrial manufacturing took over as the city’s economic base, anchored by stamping and assembly plants on the eastern edge of town.',
    },
    {
      year: 'Today',
      title: 'The Railway City reinvents itself',
      body: 'The elevated On Track trail, a restored downtown and new residential growth have reframed the rail heritage as a draw rather than a relic, while the industrial east end continues to expand.',
    },
  ],
  'port-stanley': [
    {
      year: '1804',
      title: 'A harbour at Kettle Creek',
      body: 'Colonel Talbot chose the mouth of Kettle Creek as a landing point, and the harbour quickly became the shipping outlet for Elgin County grain, lumber and later coal.',
    },
    {
      year: '1856',
      title: 'The London & Port Stanley Railway',
      body: 'The L&PS railway connected the harbour to London, hauling freight north and, in summer, thousands of day trippers south to the beach.',
    },
    {
      year: '1920s',
      title: 'The Stork Club era',
      body: 'The Stork Club dance pavilion drew big bands and crowds from across southwestern Ontario and Michigan, cementing Port Stanley’s reputation as a summer destination.',
    },
    {
      year: '1939',
      title: 'The King George VI lift bridge',
      body: 'The bascule lift bridge over Kettle Creek opened, allowing fishing tugs and pleasure craft into the inner harbour while carrying Bridge Street traffic above.',
    },
    {
      year: '1980s',
      title: 'A working fishery',
      body: 'Even as tourism grew, Port Stanley remained one of the largest freshwater fishing ports on the Great Lakes, with perch and pickerel landed at the dock daily.',
    },
    {
      year: 'Today',
      title: 'Village and destination',
      body: 'Blue Flag beaches, a heritage excursion railway and a year-round village population share the same few streets — busy in July, quiet and close-knit in February.',
    },
  ],
  aylmer: [
    {
      year: '1817',
      title: 'Hodgkinson’s Corners',
      body: 'The first settlers cleared land at the crossing of Talbot Road and the road north, and a tavern and mill formed the nucleus of the future town.',
    },
    {
      year: '1835',
      title: 'Named for Lord Aylmer',
      body: 'The community was renamed for Lord Aylmer, Governor General of British North America, as it grew into the commercial centre for East Elgin farms.',
    },
    {
      year: '1875',
      title: 'Old Town Hall',
      body: 'The brick town hall with its clock tower opened as council chamber, market and performance space. Restored in the modern era, it still hosts concerts and markets.',
    },
    {
      year: '1900s',
      title: 'Canning and market gardens',
      body: 'Rich soil and rail access made Aylmer a canning and market garden centre, shipping vegetables, tobacco and preserves across Canada.',
    },
    {
      year: '1950s',
      title: 'New neighbours',
      body: 'Waves of Dutch, German and Low German-speaking Mennonite families settled in East Elgin, shaping the town’s bakeries, farms, trades and churches.',
    },
    {
      year: 'Today',
      title: 'Heartland heritage',
      body: 'Greenhouses, food processing and skilled trades anchor the local economy, while the Saturday market and wildlife area keep drawing visitors from across the county.',
    },
  ],
  all: [
    {
      year: '1803',
      title: 'The Talbot Settlement',
      body: 'Colonel Thomas Talbot received a land grant on the north shore of Lake Erie and began surveying the road that still carries his name through St. Thomas, Aylmer and beyond.',
    },
    {
      year: '1852',
      title: 'Elgin County is formed',
      body: 'Named for the Earl of Elgin, the county separated from Middlesex with St. Thomas as its administrative centre and Port Stanley as its harbour.',
    },
    {
      year: '1870s',
      title: 'Rails, harbour and farms',
      body: 'Three economies developed side by side: railway work in St. Thomas, shipping and fishing at Port Stanley, and mixed farming and canning around Aylmer.',
    },
    {
      year: '1900s',
      title: 'A century of arrivals',
      body: 'Railway workers, Dutch and German farm families, Low German-speaking Mennonite communities and seasonal agricultural workers all reshaped the county’s towns.',
    },
    {
      year: 'Today',
      title: 'Three communities, one county',
      body: 'Roughly ninety thousand people live across Elgin County. The towns keep distinct characters while sharing hospitals, schools, trails and a labour market.',
    },
  ],
};

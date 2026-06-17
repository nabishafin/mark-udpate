export type Organ = {
  id: string;
  name: string;
  x: number;
  y: number;
  tagline: string;
  bodySystem: string;
  sidePanelCopy: string[];
  supportIntro?: string;
  supportBullets?: string[];
  riskIntro?: string;
  riskBullets?: string[];
  closingCopy?: string[];
  microCta?: string;
  metrics: { label: string; value: string; unit?: string }[];
  image?: { src: string; alt: string; position?: string };
  color: 'blue' | 'gold' | 'green';
};

export const ORGANS: Organ[] = [
  {
    id: 'brain',
    name: 'Brain & Nervous System',
    bodySystem: 'CNS / Neural Network',
    x: 50,
    y: 10,
    tagline: 'Your Brain Runs on Hydration and Energy',
    sidePanelCopy: [
      'The brain is nearly 75% water and uses enormous amounts of energy every second. From memory and focus to mood and recovery, healthy hydration plays a critical role in how the brain communicates and performs.',
    ],
    supportIntro: 'Modern research explores how hydration may support:',
    supportBullets: [
      'Mental clarity and focus',
      'Cellular energy production',
      'Healthy circulation',
      'Waste removal during sleep',
      'Healthy neurotransmitter function',
      'Oxidative balance',
    ],
    riskIntro: 'Dehydration may increase:',
    riskBullets: ['Brain fog', 'Fatigue', 'Mental stress', 'Reduced concentration', 'Cognitive strain'],
    closingCopy: [
      'Mdrn-Life DDW is designed to support hydration at the cellular level while supporting mitochondrial efficiency and oxidative balance.',
    ],
    microCta: 'Support Cognitive Performance From Within',
    metrics: [
      { label: 'Water', value: '75', unit: '%' },
      { label: 'Focus', value: 'Support' },
      { label: 'Balance', value: 'Oxidative' },
    ],
    image: {
      src: '/organ-panels/brain-neural.jpg',
      alt: 'Neuron and mitochondria educational diagram',
      position: 'center',
    },
    color: 'blue',
  },
  {
    id: 'eyes',
    name: 'Eyes & Visual System',
    bodySystem: 'Sensory / Optic',
    x: 50,
    y: 13,
    tagline: 'Hydration Helps Support Visual Performance',
    sidePanelCopy: [
      'The eyes depend on healthy hydration and circulation to function properly. Cellular stress and dehydration may contribute to fatigue and strain throughout the visual system.',
    ],
    supportIntro: 'Healthy hydration may support:',
    supportBullets: [
      'Eye moisture balance',
      'Nutrient delivery',
      'Circulation to delicate tissues',
      'Reduced oxidative stress',
      'Visual comfort during screen exposure',
    ],
    microCta: 'Hydrate the System Behind Vision',
    metrics: [
      { label: 'Moisture', value: 'Balance' },
      { label: 'Comfort', value: 'Visual' },
      { label: 'Stress', value: 'Reduced' },
    ],
    image: {
      src: '/organ-panels/eyes-moisture.jpg',
      alt: 'Eye anatomy educational diagram',
      position: 'center',
    },
    color: 'gold',
  },
  {
    id: 'mouth',
    name: 'Mouth, Throat & Cellular Absorption',
    bodySystem: 'Absorption / Hydration',
    x: 50,
    y: 17,
    tagline: 'Hydration Begins Here',
    sidePanelCopy: ['Water absorption starts immediately throughout the mouth and digestive tract.'],
    supportIntro: 'Proper hydration supports:',
    supportBullets: [
      'Nutrient transport',
      'Saliva production',
      'Digestive preparation',
      'Cellular communication',
      'Metabolic balance',
    ],
    closingCopy: [
      "Hydration is one of the body's most essential biological functions, influencing nearly every system in the body.",
    ],
    metrics: [
      { label: 'Absorption', value: 'Immediate' },
      { label: 'Transport', value: 'Nutrients' },
      { label: 'Balance', value: 'Metabolic' },
    ],
    color: 'green',
  },
  {
    id: 'heart',
    name: 'Heart & Circulation',
    bodySystem: 'Cardiovascular',
    x: 50.5,
    y: 28,
    tagline: 'Every Cell Depends on Circulation',
    sidePanelCopy: [
      'The cardiovascular system delivers oxygen, nutrients, and hydration throughout the body. Proper hydration supports healthy blood flow and helps transport metabolic waste away from cells.',
    ],
    supportIntro: 'Healthy circulation supports:',
    supportBullets: [
      'Oxygen transport',
      'Physical endurance',
      'Energy production',
      'Recovery after activity',
      'Nutrient delivery',
    ],
    closingCopy: ['Dehydration may place added stress on circulation and energy systems.'],
    microCta: 'Fuel the Flow of Life',
    metrics: [
      { label: 'Oxygen', value: 'Transport' },
      { label: 'Endurance', value: 'Support' },
      { label: 'Flow', value: 'Healthy' },
    ],
    image: {
      src: '/organ-panels/heart-circulation.jpg',
      alt: 'Blood flow and cardiovascular circulation educational diagram',
      position: 'center',
    },
    color: 'blue',
  },
  {
    id: 'lungs',
    name: 'Lungs & Oxygen Delivery',
    bodySystem: 'Respiratory',
    x: 52.5,
    y: 28,
    tagline: 'Energy Begins With Oxygen',
    sidePanelCopy: [
      'The lungs work closely with circulation and hydration systems to support oxygen delivery throughout the body.',
    ],
    supportIntro: 'Healthy hydration may support:',
    supportBullets: [
      'Efficient circulation',
      'Cellular oxygen transport',
      'Athletic endurance',
      'Recovery from physical stress',
    ],
    closingCopy: ['Every breath supports the mitochondria — the tiny energy factories inside your cells.'],
    metrics: [
      { label: 'Oxygen', value: 'Delivery' },
      { label: 'Endurance', value: 'Athletic' },
      { label: 'Recovery', value: 'Physical' },
    ],
    image: {
      src: '/organ-panels/lungs-oxygen.jpg',
      alt: 'Oxygen delivery lung diagram',
      position: 'center',
    },
    color: 'blue',
  },
  {
    id: 'liver',
    name: 'Liver & Detox Support',
    bodySystem: 'Hepatic / Metabolic',
    x: 48.5,
    y: 38,
    tagline: "The Body's Natural Filtration System",
    sidePanelCopy: [
      'The liver helps process metabolic waste products, including ammonia created during protein metabolism.',
    ],
    supportIntro: 'Healthy hydration supports:',
    supportBullets: ['Natural detox pathways', 'Metabolic balance', 'Waste transport', 'Recovery systems'],
    closingCopy: [
      'Researchers study how dehydration and oxidative stress may place additional strain on detoxification systems.',
      'Supporting hydration and mitochondrial function may help maintain healthy cellular efficiency.',
    ],
    microCta: 'Support Natural Detoxification Pathways',
    metrics: [
      { label: 'Detox', value: 'Natural' },
      { label: 'Waste', value: 'Transport' },
      { label: 'Balance', value: 'Metabolic' },
    ],
    image: {
      src: '/organ-panels/liver-detox.jpg',
      alt: 'Liver detoxification educational diagram',
      position: 'center',
    },
    color: 'gold',
  },
  {
    id: 'gut',
    name: 'Gut & Microbiome',
    bodySystem: 'Enteric / Immune',
    x: 50,
    y: 45,
    tagline: 'Where Immunity and Absorption Begin',
    sidePanelCopy: [
      'Nearly 70% of the immune system is connected to the gut. Hydration supports digestion, nutrient absorption, and healthy gut barrier function.',
    ],
    supportIntro: 'Healthy gut balance may support:',
    supportBullets: [
      'Nutrient absorption',
      'Energy production',
      'Digestive comfort',
      'Immune balance',
      'Reduced metabolic stress',
    ],
    closingCopy: [
      'Researchers also study how poor gut balance may contribute to increased ammonia production and inflammatory stress.',
    ],
    microCta: 'Support the Foundation of Wellness',
    metrics: [
      { label: 'Immune', value: '70', unit: '%' },
      { label: 'Absorption', value: 'Nutrients' },
      { label: 'Comfort', value: 'Digestive' },
    ],
    image: {
      src: '/organ-panels/gut-microbiome.jpg',
      alt: 'Gut microbiota educational diagram',
      position: 'center',
    },
    color: 'green',
  },
  {
    id: 'kidneys',
    name: 'Kidneys & Filtration',
    bodySystem: 'Renal',
    x: 52,
    y: 42,
    tagline: "The Body's Fluid Balance System",
    sidePanelCopy: ['The kidneys help regulate fluid balance while filtering waste from the bloodstream.'],
    supportIntro: 'Proper hydration supports:',
    supportBullets: ['Waste removal', 'Electrolyte balance', 'Circulation', 'Recovery', 'Metabolic stability'],
    closingCopy: ['When hydration drops, waste products can become more concentrated inside the body.'],
    microCta: 'Support Healthy Filtration and Flow',
    metrics: [
      { label: 'Fluid', value: 'Balance' },
      { label: 'Waste', value: 'Removal' },
      { label: 'Stability', value: 'Metabolic' },
    ],
    image: {
      src: '/organ-panels/kidneys-filtration.jpg',
      alt: 'Kidney hydration and filtration educational diagram',
      position: 'center',
    },
    color: 'blue',
  },
  {
    id: 'muscles',
    name: 'Muscles & Recovery',
    bodySystem: 'Skeletal Muscle',
    x: 42,
    y: 42,
    tagline: 'Performance Depends on Cellular Energy',
    sidePanelCopy: [
      'During intense activity, muscles generate metabolic waste and oxidative stress. Hydration supports circulation, recovery, and energy production.',
    ],
    supportIntro: 'Athletes and active individuals often focus on:',
    supportBullets: [
      'Recovery support',
      'Reduced fatigue',
      'Endurance',
      'Cellular hydration',
      'Mitochondrial performance',
    ],
    closingCopy: ['Healthy hydration helps the body manage physical stress more efficiently.'],
    microCta: 'Hydrate Recovery at the Cellular Level',
    metrics: [
      { label: 'Recovery', value: 'Support' },
      { label: 'Energy', value: 'Cellular' },
      { label: 'Endurance', value: 'Focus' },
    ],
    image: {
      src: '/organ-panels/muscles-recovery.jpg',
      alt: 'Muscle cell hydration educational diagram',
      position: 'center',
    },
    color: 'blue',
  },
  {
    id: 'joints',
    name: 'Joints & Cartilage',
    bodySystem: 'Musculoskeletal',
    x: 48.5,
    y: 72,
    tagline: 'Movement Depends on Hydration',
    sidePanelCopy: ['Joints rely on hydration for lubrication, mobility, and shock absorption.'],
    supportIntro: 'Healthy hydration may support:',
    supportBullets: ['Joint comfort', 'Flexibility', 'Cartilage function', 'Mobility', 'Recovery after movement'],
    closingCopy: ['Oxidative stress and aging may affect joint performance over time.'],
    microCta: 'Support Mobility From Within',
    metrics: [
      { label: 'Mobility', value: 'Support' },
      { label: 'Cartilage', value: 'Function' },
      { label: 'Comfort', value: 'Joint' },
    ],
    image: {
      src: '/organ-panels/joints-cartilage.jpg',
      alt: 'Joint cartilage anatomy educational image',
      position: 'center',
    },
    color: 'gold',
  },
  {
    id: 'skin',
    name: 'Skin & Healthy Aging',
    bodySystem: 'Dermal / Aging',
    x: 62,
    y: 36,
    tagline: 'Hydration You Can See',
    sidePanelCopy: [
      'The skin reflects internal hydration and cellular balance. Proper hydration supports elasticity, circulation, and healthy skin appearance.',
    ],
    supportIntro: 'Healthy hydration may help support:',
    supportBullets: [
      'Skin moisture balance',
      'Recovery from oxidative stress',
      'Cellular renewal',
      'Healthy aging routines',
    ],
    closingCopy: ['The appearance of healthy skin often begins at the cellular level.'],
    microCta: 'Radiance Starts Within',
    metrics: [
      { label: 'Moisture', value: 'Skin' },
      { label: 'Renewal', value: 'Cellular' },
      { label: 'Aging', value: 'Healthy' },
    ],
    image: {
      src: '/organ-panels/skin-aging.jpg',
      alt: 'Young skin and aged skin educational diagram',
      position: 'center',
    },
    color: 'gold',
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria & Cellular Energy',
    bodySystem: 'Cellular Energy',
    x: 48.5,
    y: 58,
    tagline: 'The Power Source of Human Performance',
    sidePanelCopy: ['Mitochondria produce ATP, the energy currency used by every cell in the body.'],
    supportIntro: 'Researchers studying DDW are exploring its potential role in supporting:',
    supportBullets: [
      'Cellular energy production',
      'Oxidative balance',
      'Metabolic efficiency',
      'Recovery systems',
      'Mitochondrial performance',
    ],
    closingCopy: ['Every heartbeat, thought, movement, and recovery process depends on cellular energy.'],
    microCta: 'Support Energy at the Source',
    metrics: [
      { label: 'Energy', value: 'ATP' },
      { label: 'Efficiency', value: 'Metabolic' },
      { label: 'DDW', value: '5', unit: 'ppm' },
    ],
    image: {
      src: '/organ-panels/mitochondria-atp.jpg',
      alt: 'ATP power of the cell educational diagram',
      position: 'center',
    },
    color: 'green',
  },
];

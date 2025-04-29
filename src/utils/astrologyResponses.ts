
const astrologyResponses = [
  "Based on your birth chart, I see significant planetary alignments suggesting positive changes in your career path in the coming months. Saturn's position indicates a period of growth and stability.",
  
  "The current alignment of Venus in your chart reveals interesting patterns in your love life. This is a favorable time for deepening existing relationships or finding new connections if you're seeking a partner.",
  
  "Your financial stars show promising signs. Jupiter's influence suggests unexpected gains, possibly through investments or professional opportunities. Stay alert for these possibilities in the next few weeks.",
  
  "Mercury's position in your chart indicates a period of enhanced communication and intellectual clarity. This is an excellent time for important conversations or making decisions that require clear thinking.",
  
  "The current lunar phase connects strongly with your birth moon, suggesting this is a time of emotional renewal. Trust your intuition more than usual during this period.",
  
  "According to your astrological profile, your health energy looks stable, though Mars suggests you might benefit from increasing physical activity to balance mental stress.",
  
  "The stars indicate a time of personal transformation approaching. You may find yourself questioning old patterns and embracing new perspectives that better align with your true self.",
  
  "Your chart shows strong creative energy right now. If you've been considering starting a new project or hobby, the celestial alignments are supporting this initiative.",
  
  "The position of Pluto in relation to your sun sign suggests deep internal changes. This might manifest as a desire to transform aspects of your life that no longer serve your higher purpose.",
  
  "I see interesting travel configurations in your chart. The next six months may bring opportunities for journeys that expand your horizons, either physically or metaphorically through new learning.",
  
  "Family matters appear highlighted in your chart currently. Saturn's influence suggests a time for strengthening foundations and perhaps addressing any unresolved issues with loved ones.",
  
  "Your spiritual path shows interesting developments. Neptune's influence increases your intuition and connection to the divine. Pay attention to dreams and synchronicities in this period."
];

export const getRandomAstrologyResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * astrologyResponses.length);
  return astrologyResponses[randomIndex];
};

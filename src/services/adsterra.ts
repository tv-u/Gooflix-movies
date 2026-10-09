/**
 * Adsterra Smart Ads Direct Monetization Engine
 * Real active CPM network links provided for maximum publisher earnings.
 */

export const ADSTERRA_DIRECT_LINKS = [
  'https://www.profitableratecpmnetwork.com/hr65xsh7?key=dc01c1237bd130c5ef9bcfef4f0928ed',
  'https://www.profitableratecpmnetwork.com/sa8mca36sv?key=3711015d24018cf89ccb362976c4a2e0',
  'https://www.profitableratecpmnetwork.com/x0wcj4zk?key=c2b46070b44982014166acafd6074c3d'
] as const;

let adRotationIndex = 0;

/**
 * Returns the next rotating Adsterra smart link
 */
export function getNextAdsterraUrl(): string {
  const url = ADSTERRA_DIRECT_LINKS[adRotationIndex % ADSTERRA_DIRECT_LINKS.length];
  adRotationIndex++;
  return url;
}

/**
 * Returns a specific Adsterra link by index (0, 1, or 2)
 */
export function getAdsterraUrlByIndex(index: number): string {
  return ADSTERRA_DIRECT_LINKS[index % ADSTERRA_DIRECT_LINKS.length];
}

/**
 * Safely triggers an Adsterra smart monetization tab without interrupting playback
 */
export function triggerAdsterraSmartAd(customUrl?: string): void {
  const targetUrl = customUrl || getNextAdsterraUrl();
  try {
    const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (win) {
      win.focus();
    }
  } catch (err) {
    console.warn('Adsterra popup blocked or failed:', err);
  }
}

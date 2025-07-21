// utils/formatKeyLabel.ts

/**
 * Formats a key label according to the following rules:
 * - Omit the word 'major' (implied)
 * - Replace 'minor' with 'm'
 * - Replace 'flat' with the music symbol for flat (♭)
 * - Replace 'sharp' with '♯'
 *
 * Examples:
 *   'A Major' => 'A'
 *   'A Minor' => 'Am'
 *   'B Flat Major' => 'B♭'
 *   'B Flat Minor' => 'B♭m'
 *   'C Sharp Minor' => 'C♯m'
 */
export function formatKeyLabel(label: string): string {
  return label
    .replace(/ major$/i, '')
    .replace(/ minor$/i, 'm')
    .replace(/\s*[Ff]lat/g, '♭')
    .replace(/\s*[Ss]harp/g, '♯')
    .trim();
} 
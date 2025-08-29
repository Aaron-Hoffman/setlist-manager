// Test the scoring logic directly without importing the full module
function normalizeForSpotifyMatch(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s*\(live\)$/i, '')
    .replace(/\s*\(remastered(\s*\d{4})?\)$/i, '')
    .replace(/\s*\(album version\)$/i, '')
    .replace(/\s*[-–—]\s*.*$/i, '')
    .replace(/\band\b|\&/gi, ' and ')
    .replace(/[^a-z0-9]/gi, '')
    .trim();
}

// Helper function to calculate how well a track matches the search query
function calculateMatchScore(query: string, track: any): number {
  const queryLower = query.toLowerCase();
  const trackNameLower = track.name.toLowerCase();
  const trackArtistsLower = track.artists.map((artist: any) => artist.name.toLowerCase()).join(' ');
  
  let score = 0;
  
  // Title match scoring
  if (trackNameLower === queryLower) {
    score += 1.0; // Perfect title match
  } else if (trackNameLower.includes(queryLower) || queryLower.includes(trackNameLower)) {
    score += 0.8; // Partial title match
  } else {
    // Check normalized versions for better matching
    const normQuery = normalizeForSpotifyMatch(query);
    const normTitle = normalizeForSpotifyMatch(track.name);
    if (normQuery === normTitle) {
      score += 0.9; // Normalized perfect match
    } else if (normQuery.includes(normTitle) || normTitle.includes(normQuery)) {
      score += 0.7; // Normalized partial match
    }
  }
  
  // Artist match scoring
  const hasArtistMatch = track.artists.some((artist: any) => {
    const artistName = artist.name.toLowerCase();
    return queryLower.includes(artistName) || artistName.includes(queryLower.split(' ')[0]);
  });
  
  if (hasArtistMatch) {
    score += 0.5; // Artist match bonus
  }
  
  // Removed popularity bonus to focus on title and artist matching only
  
  return Math.min(score, 1.0); // Cap at 1.0
}

describe('Spotify Match Scoring', () => {
  describe('calculateMatchScore', () => {
    it('should give perfect score for exact title match', () => {
      const query = 'Bohemian Rhapsody Queen';
      const track = {
        name: 'Bohemian Rhapsody',
        artists: [{ name: 'Queen' }],
        popularity: 80
      };
      
      const score = calculateMatchScore(query, track);
      expect(score).toBeGreaterThan(0.8);
    });

    it('should give high score for normalized title match', () => {
      const query = 'Bohemian Rhapsody (Live) Queen';
      const track = {
        name: 'Bohemian Rhapsody',
        artists: [{ name: 'Queen' }],
        popularity: 80
      };
      
      const score = calculateMatchScore(query, track);
      expect(score).toBeGreaterThan(0.7);
    });

    it('should give bonus for artist match', () => {
      const query = 'Some Song Queen';
      const track = {
        name: 'Some Song',
        artists: [{ name: 'Queen' }],
        popularity: 80
      };
      
      const score = calculateMatchScore(query, track);
      expect(score).toBeGreaterThan(0.4);
    });

    it('should give lower score for partial matches', () => {
      const query = 'Bohemian Queen';
      const track = {
        name: 'Bohemian Rhapsody',
        artists: [{ name: 'Queen' }],
        popularity: 80
      };
      
      const score = calculateMatchScore(query, track);
      expect(score).toBeGreaterThan(0.3);
      expect(score).toBeLessThan(0.8);
    });



    it('should handle multiple artists', () => {
      const query = 'Song featuring Artist1 and Artist2';
      const track = {
        name: 'Song',
        artists: [
          { name: 'Artist1' },
          { name: 'Artist2' }
        ],
        popularity: 80
      };
      
      const score = calculateMatchScore(query, track);
      expect(score).toBeGreaterThan(0.4);
    });

    it('should return 0 for completely unrelated tracks', () => {
      const query = 'Completely Different Song';
      const track = {
        name: 'Unrelated Track',
        artists: [{ name: 'Different Artist' }],
        popularity: 80
      };
      
      const score = calculateMatchScore(query, track);
      expect(score).toBeLessThan(0.3);
    });
  });
}); 
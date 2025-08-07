import filterSongs from "./filterSongs";

describe('filterSongs', () => {
  const mockSongs = [
    { id: 1, title: 'Song 1', key: "A", tags: ['rock', 'upbeat', 'fun'] },
    { id: 2, title: 'Song 2', key: "G", tags: ['country', 'upbeat', 'fun']},
    { id: 3, title: 'Song 3', key: "A", tags: ['country', 'slow', 'fun'] },
  ];

  const mockFilteredSongs1 = [
    { id: 1, title: 'Song 1', key: "A", tags: ['rock', 'upbeat', 'fun'] },
    { id: 3, title: 'Song 3', key: "A", tags: ['country', 'slow', 'fun'] },
  ]

  const mockFilteredSongs2 = [
    { id: 3, title: 'Song 3', key: "A", tags: ['country', 'slow', 'fun'] },
  ]

  const mockFilters1 = [
    {
        key: 'key',
        value: 'A',
    }
  ]

  const mockFilters2 = [
    {
        key: 'key',
        value: 'A',
    },
    {
        key: 'tags',
        value: ['country', 'fun']
    }
  ]

  it('filters with basic filter applied', () => {
    const filteredSongs = filterSongs(mockSongs as any, mockFilters1 as any);
    expect(filteredSongs).toEqual(mockFilteredSongs1)
  });

  it('handles the tags case', () => {
    const filteredSongs = filterSongs(mockSongs as any, mockFilters2 as any);
    expect(filteredSongs).toEqual(mockFilteredSongs2)
  });

  it('returns all songs if filters is empty', () => {
    const filteredSongs = filterSongs(mockSongs as any, []);
    expect(filteredSongs).toEqual(mockSongs);
  });
}); 
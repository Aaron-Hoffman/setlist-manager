import createSetList from './createSetList';

describe('createSetList', () => {
  const mockSongs = [
    { id: 1, title: 'Song 1' },
    { id: 2, title: 'Song 2' },
    { id: 3, title: 'Song 3' },
  ];

  it('returns the correct number of songs', () => {
    const setList = createSetList(mockSongs as any, 2);
    expect(setList).toHaveLength(2);
  });

  it('returns objects with only id property', () => {
    const setList = createSetList(mockSongs as any, 2);
    setList.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(Object.keys(item)).toEqual(['id']);
    });
  });

  it('returns all songs if numberOfSongs >= repertoire.length', () => {
    const setList = createSetList(mockSongs as any, 10);
    expect(setList).toHaveLength(3);
  });

  it('returns an empty array if repertoire is empty', () => {
    const setList = createSetList([], 2);
    expect(setList).toEqual([]);
  });
}); 
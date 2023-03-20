export const getNews = async (lang: string, tag: string) => {
  return {
    'currentPage': 1,
    'lastPage': 1,
    'pageSize': 10,
    'total': 1,
    'results': [
      {
        'external': false,
        'content': '<p>This is a test. </p>',
        'title': 'Test - Please disregard',
        'author': 'Testi Testinen',
        'posted': '1678959989000',
        'tag': 'mobiilivihko',
        'id': '7457'
      }
    ]
  }
}
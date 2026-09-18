// 검사 대상 라우트. app/_ai-battle 은 밑줄 폴더라 주소가 없어서 뺐다.
// /about 은 색인에서만 빠졌을 뿐 주소는 살아 있어서 넣는다.
export const ROUTES = [
  '/',
  '/projectshop',
  '/workflow',
  '/toolbox',
  '/study',
  '/board',
  '/youtube',
  '/public-data',
  '/about',
] as const

// 백엔드가 떠 있어야 데이터가 오는 화면. 안 떠 있을 때 나는 연결 실패는 화면 결함이 아니라 무시한다
export const BACKEND_HOST = 'localhost:8080'

export const isBackendNoise = (text: string) =>
  text.includes(BACKEND_HOST) ||
  text.includes('ERR_CONNECTION_REFUSED') ||
  text.includes('Failed to fetch')

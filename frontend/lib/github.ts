// ProjectShop 저장소의 실측 숫자와 최근 커밋을 GitHub REST API 로 받아온다.
// 서버에서만 돈다(토큰이 번들에 실리면 안 된다). ISR 15분.

const REPO = 'ejg93/ProjectShop'
const API = 'https://api.github.com'

export type ShopMetrics = {
  commits: number
  adr: number
  migrations: number
  docs: number
  tests: number
  workflows: number
  pushedAt: string
}

export type ShopCommit = {
  sha: string
  date: string
  message: string
  url: string
}

export type ShopStats = {
  metrics: ShopMetrics | null
  recent: ShopCommit[] | null
}

function opt(): RequestInit & { next: { revalidate: number } } {
  const token = process.env.GITHUB_TOKEN
  return {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 900 },
  }
}

async function get(path: string): Promise<Response> {
  const res = await fetch(`${API}${path}`, opt())
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res
}

function ymd(iso: string): string {
  return iso.slice(0, 10)
}

async function fetchMetrics(): Promise<ShopMetrics> {
  const [head, treeRes, wfRes, repoRes] = await Promise.all([
    get(`/repos/${REPO}/commits?per_page=1`),
    get(`/repos/${REPO}/git/trees/main?recursive=1`),
    get(`/repos/${REPO}/actions/workflows`),
    get(`/repos/${REPO}`),
  ])

  // 커밋 수는 Link 헤더의 마지막 페이지 번호다. per_page=1 이라 그 번호가 곧 커밋 수
  const link = head.headers.get('link') ?? ''
  const last = link.match(/[?&]page=(\d+)>;\s*rel="last"/)
  const commits = last ? Number(last[1]) : ((await head.json()) as unknown[]).length

  const tree = (await treeRes.json()) as { truncated: boolean; tree: { type: string; path: string }[] }
  if (tree.truncated) throw new Error('tree truncated')
  const paths = tree.tree.filter(t => t.type === 'blob').map(t => t.path)
  const count = (re: RegExp) => paths.filter(p => re.test(p)).length

  const wf = (await wfRes.json()) as { total_count: number }
  const repo = (await repoRes.json()) as { pushed_at: string }

  return {
    commits,
    adr: count(/^doc\/adr\/.*\.md$/),
    migrations: count(/^backend\/src\/main\/resources\/db\/migration\/V.*\.sql$/),
    docs: count(/^doc\/.*\.md$/),
    tests:
      count(/^backend\/src\/test\/.*Test\.java$/) +
      count(/^frontend\/src\/.*\.test\.tsx?$/) +
      count(/^frontend\/e2e\/.*\.spec\.ts$/),
    workflows: wf.total_count,
    pushedAt: ymd(repo.pushed_at),
  }
}

async function fetchRecent(): Promise<ShopCommit[]> {
  const res = await get(`/repos/${REPO}/commits?per_page=5`)
  const list = (await res.json()) as {
    sha: string
    html_url: string
    commit: { message: string; author: { date: string } }
  }[]
  return list.map(c => {
    const head = c.commit.message.split('\n')[0]
    return {
      sha: c.sha.slice(0, 7),
      date: ymd(c.commit.author.date),
      message: head.length > 60 ? `${head.slice(0, 60)}…` : head,
      url: c.html_url,
    }
  })
}

// 숫자와 최근 커밋은 따로 실패한다. 숫자가 없으면 페이지가 박힌 값으로 떨어지고,
// 최근 커밋이 없으면 「지금 상황」 절을 통째로 숨긴다
export async function getShopStats(): Promise<ShopStats> {
  const [metrics, recent] = await Promise.all([
    fetchMetrics().catch(() => null),
    fetchRecent().catch(() => null),
  ])
  return { metrics, recent }
}

'use client'
import { useCallback, useSyncExternalStore } from 'react'

// 노트 셸(public/study/shell.js)이 localStorage 의 study:<slug>:progress 에 절 id → true 로 남긴 것을
// 목록 카드에서 「n/전체 완료」로 읽는다. 총 절 수는 서버가 HTML 에서 세어 넘긴다.
// 서버 렌더에는 0 을 주고 브라우저에서 실제 값을 읽는다 — useSyncExternalStore 라 첫 렌더 뒤 재렌더가 없다.
// 다른 탭에서 체크한 것도 storage 이벤트로 따라온다.
function subscribe(cb: () => void) {
  window.addEventListener('storage', cb)
  window.addEventListener('focus', cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener('focus', cb)
  }
}

export default function StudyProgress({ slug, total }: { slug: string; total: number }) {
  const read = useCallback(() => {
    try {
      const raw = localStorage.getItem(`study:${slug}:progress`)
      if (!raw) return 0
      const obj = JSON.parse(raw) as Record<string, unknown>
      return Object.keys(obj).filter(k => obj[k]).length
    } catch {
      return 0
    }
  }, [slug])
  const done = useSyncExternalStore(subscribe, read, () => 0)

  return (
    <span className="mono" style={{ fontSize: '10px', letterSpacing: '1px', color: done > 0 ? 'var(--accent)' : 'var(--muted)' }}>
      {done}/{total} 완료
    </span>
  )
}

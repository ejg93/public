'use client'
import Image from 'next/image'
import { useRef } from 'react'
import { S } from '@/components/CaseStudy'

// 배포본 스크린샷. 누르면 native dialog 로 원본 폭에 띄운다 —
// 세로를 화면에 맞추면 폭이 같이 줄어 글씨가 뭉개진다. 긴 화면은 스크롤해서 본다.
// dialog 를 쓰면 ESC 닫기·포커스 가둠·뒷배경 클릭 차단이 브라우저 기본으로 온다.
// w·h 는 실제 파일 크기와 같아야 한다 — 어긋나면 이미지가 뜨기 전 자리가 틀어진다
export default function Shot({ src, alt, w, h, cap }: { src: string; alt: string; w: number; h: number; cap: string }) {
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <figure style={{ margin: 0 }}>
      <button type="button" onClick={() => dialog.current?.showModal()}
        aria-label={`크게 보기 — ${alt}`}
        style={{
          display: 'block', width: '100%', padding: 0, border: 0, background: 'none',
          cursor: 'zoom-in', borderRadius: '8px',
        }}>
        <Image src={src} alt={alt} width={w} height={h} unoptimized
          style={{ width: '100%', height: 'auto', border: '1px solid var(--border)', borderRadius: '8px', display: 'block' }} />
      </button>
      <figcaption style={{ ...S.body, fontSize: '12px', marginTop: '8px' }}>{cap}</figcaption>

      {/* 배경(dialog 자신)을 누르면 닫고, 이미지 위 클릭은 스크롤 중 오작동이라 안 받는다 */}
      <dialog ref={dialog} className="shot-dialog" aria-label={alt}
        onClick={e => { if (e.target === dialog.current) dialog.current?.close() }}>
        <button type="button" className="shot-close" aria-label="닫기"
          onClick={() => dialog.current?.close()}>✕</button>
        <Image src={src} alt={alt} width={w} height={h} unoptimized
          style={{ width: '100%', height: 'auto', display: 'block' }} />
      </dialog>
    </figure>
  )
}

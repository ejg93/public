'use client'
import React from 'react'
import { BadButtonsDemo, GoodButtonsDemo, KakaoDarkPatternDemo, KakaoEmojiDemo, ButtonFeedbackDemo, CapsLockDemo, InstallCheckboxDemo, KioskDemo, InvertedIndexDemo, SearchCompareDemo, AutoCompleteDemo } from './demos'

// demoId → 데모 컴포넌트 매핑. 게시물 본문과 슬라이드 뷰어가 공용으로 사용.
export const DEMOS: Record<string, React.ReactNode> = {
  'bad-buttons':         <BadButtonsDemo />,
  'good-buttons':        <GoodButtonsDemo />,
  'kakao-dark-pattern':  <KakaoDarkPatternDemo />,
  'kakao-emoji':         <KakaoEmojiDemo />,
  'button-feedback':     <ButtonFeedbackDemo />,
  'capslock-demo':       <CapsLockDemo />,
  'install-checkbox':    <InstallCheckboxDemo />,
  'kiosk-demo':          <KioskDemo />,
  'es-inverted-index':   <InvertedIndexDemo />,
  'es-search-compare':   <SearchCompareDemo />,
  'es-autocomplete':     <AutoCompleteDemo />,
}

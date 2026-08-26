import { COLORS, FONT_FAMILY, RADIUS, px, PUBLISHER_HIGHLIGHT } from '@/lib/tokens';
import type { CarouselDraft } from '@/lib/state/useCarouselDraft';
import { Highlighted } from '@/lib/utils/Highlighted';

const PADX = Math.round(1080 * 0.07); // 좌우 7%
const PADY = Math.round(1350 * 0.08); // 상하 8%

export function CtaSlide({ draft }: { draft: CarouselDraft }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: COLORS.ctaBg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
        color: COLORS.textPrimary,
        wordBreak: 'keep-all', // 한국어 어절 단위 줄바꿈 (상속됨)
        padding: `${PADY}px ${PADX}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: px(14),
      }}
    >
      {/* 1. 옐로우 라벨 */}
      <div>
        <span
          style={{
            display: 'inline-block',
            background: COLORS.cardYellow,
            color: COLORS.textPrimary,
            fontSize: px(11),
            fontWeight: 500,
            padding: `${px(5)}px ${px(12)}px`,
            borderRadius: RADIUS.pill,
          }}
        >
          {draft.cta_label}
        </span>
      </div>

      {/* 2. 화이트 질문 카드 */}
      <div
        style={{
          position: 'relative',
          background: COLORS.cardWhite,
          borderRadius: RADIUS.card,
          padding: `${px(20)}px ${px(16)}px ${px(16)}px`,
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: px(2),
            left: px(12),
            fontSize: px(48),
            lineHeight: 1,
            fontFamily: 'Georgia, serif',
            color: COLORS.textPrimary,
            opacity: 0.25,
          }}
        >
          &ldquo;
        </span>
        <div
          style={{
            fontSize: px(20),
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.015em',
            paddingTop: px(6),
          }}
        >
          <Highlighted text={draft.cta_question} highlight={draft.cta_questionHighlight} fontSize={px(20)} color={PUBLISHER_HIGHLIGHT[draft.publisher]} />
        </div>
      </div>

      {/* 3. 캐릭터 + 발행자 자유 멘트 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: px(12) }}>
        <div
          style={{
            width: '32%',
            aspectRatio: '1 / 1',
            borderRadius: RADIUS.card,
            overflow: 'hidden',
            background: COLORS.cardWhite,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {draft.cta_character ? (
            draft.cta_character.type === 'video' ? (
              <video src={draft.cta_character.src} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <img src={draft.cta_character.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )
          ) : (
            <span style={{ fontSize: px(28) }}>🧽</span>
          )}
        </div>
        <div
          style={{
            flex: 1,
            fontSize: px(12),
            fontWeight: 500,
            lineHeight: 1.5,
            color: COLORS.textPrimary,
            whiteSpace: 'pre-line',
          }}
        >
          {draft.cta_message}
        </div>
      </div>

      {/* 4. 다크네이비 팔로우 카드 (메인 + 선택적 보조 카드) */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: px(10) }}>
        {/* 메인: @spongeclub */}
        <div style={followCardStyle}>
          <div
            style={{
              width: px(32),
              height: px(32),
              background: COLORS.cardYellow,
              borderRadius: RADIUS.smallCard,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: px(14),
              flexShrink: 0,
            }}
          >
            📰
          </div>
          <div style={{ flex: 1, fontSize: px(13), fontWeight: 700, color: COLORS.textOnDark }}>
            {draft.accountHandle}
          </div>
          <div style={followBtnStyle}>+ 팔로우</div>
        </div>

        {/* 보조: 발행자 개인 계정 */}
        {draft.cta_subFollow.on && (
          <div style={followCardStyle}>
            <div
              style={{
                width: px(34),
                height: px(34),
                background: COLORS.cardYellow,
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: px(16),
                flexShrink: 0,
              }}
            >
              {draft.cta_subFollow.image ? (
                <img src={draft.cta_subFollow.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                '👤'
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: px(13), fontWeight: 700, color: COLORS.textOnDark, lineHeight: 1.2 }}>
                {draft.cta_subFollow.name}
              </div>
              <div style={{ fontSize: px(10), fontWeight: 500, color: 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}>
                {draft.cta_subFollow.handle}
              </div>
            </div>
            <div style={followBtnStyle}>+ 팔로우</div>
          </div>
        )}
      </div>
    </div>
  );
}

const followCardStyle: React.CSSProperties = {
  background: COLORS.cardDark,
  borderRadius: RADIUS.follow,
  padding: `${px(12)}px ${px(14)}px`,
  display: 'flex',
  alignItems: 'center',
  gap: px(10),
};

const followBtnStyle: React.CSSProperties = {
  background: COLORS.cardYellow,
  color: COLORS.textPrimary,
  fontSize: px(11),
  fontWeight: 700,
  padding: `${px(4)}px ${px(12)}px`,
  borderRadius: RADIUS.pill,
  flexShrink: 0,
};

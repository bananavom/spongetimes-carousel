import { DegulgulSlide } from '@/lib/types/degulgul';

export function generateDegulgulCarousel(slides: DegulgulSlide[]): string {
  const slideElements = slides.map((slide, idx) => {
    const yOffset = getYOffset(idx);
    
    switch (slide.type) {
      case 'hero':
        return renderHeroSlide(slide.content, yOffset);
      case 'team':
        return renderTeamSlide(slide.content, yOffset);
      case 'website':
        return renderWebsiteSlide(slide.content, yOffset);
      case 'concept':
        return renderConceptSlide(slide.content, yOffset);
      case 'timeline':
        return renderTimelineSlide(slide.content, yOffset);
      case 'closing':
        return renderClosingSlide(slide.content, yOffset);
      default:
        return '';
    }
  }).join('');

  const totalHeight = 400 + 410 + 440 + 440 + 480 + 460;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="100%" viewBox="0 0 680 ${totalHeight}" xmlns="http://www.w3.org/2000/svg" role="img">
  <title>스폰지타임즈 데굴데굴 유닛 캐러셀</title>
  <desc>스폰지클럽 1기 데굴데굴 유닛 소개 인스타그램 캐러셀</desc>
  <defs>
    <style>
      .t { font-family: system-ui; font-size: 14px; fill: #333; }
      .ts { font-family: system-ui; font-size: 12px; fill: #999; }
      .th { font-family: system-ui; font-size: 14px; fill: #333; font-weight: 500; }
    </style>
  </defs>
  ${slideElements}
</svg>`;
}

function getYOffset(index: number): number {
  const heights = [400, 410, 440, 440, 480, 460];
  return heights.slice(0, index).reduce((a, b) => a + b, 0);
}

function renderHeroSlide(content: Record<string, unknown>, yOffset: number): string {
  const lines = (content.mainText as string || '').split('\n');
  const subLines = (content.subText as string || '').split('\n');
  
  const lineElements = lines.map((line, i) => 
    `<text x="340" y="${yOffset + 60 + i * 40}" text-anchor="middle" class="th" style="font-size: 28px;">${escapeXml(line)}</text>`
  ).join('');

  const subLineElements = subLines.map((line, i) => 
    `<text x="340" y="${yOffset + 370 + i * 20}" text-anchor="middle" class="ts">${escapeXml(line)}</text>`
  ).join('');
  
  return `
    <g id="slide-1">
      <rect x="0" y="${yOffset}" width="680" height="400" fill="#E6F1FB"/>
      ${lineElements}
      <g transform="translate(340, ${yOffset + 220})">
        <path d="M -50,-40 L 0,-60 L 50,-40 L 60,0 L 50,40 L 0,60 L -50,40 L -60,0 Z" fill="#FFD700" stroke="#F4A500" stroke-width="2"/>
        <rect x="-25" y="-15" width="18" height="18" fill="#87CEEB" stroke="#4A90E2" stroke-width="1.5"/>
        <path d="M -20,60 Q -30,80 -25,100" fill="none" stroke="#90EE90" stroke-width="3"/>
        <path d="M 0,60 Q 0,85 5,100" fill="none" stroke="#90EE90" stroke-width="3"/>
        <path d="M 20,60 Q 30,80 25,100" fill="none" stroke="#90EE90" stroke-width="3"/>
      </g>
      ${subLineElements}
    </g>
  `;
}

function renderTeamSlide(content: Record<string, unknown>, yOffset: number): string {
  const members = (content.members as Array<any> || []);
  const descLines = ((content.description as string) || '').split('\n');
  
  const memberSvg = members.map((m, i) => {
    const x = 68 + i * 100;
    return `
      <g transform="translate(${x}, ${yOffset + 140})">
        <rect x="0" y="20" width="40" height="50" fill="${m.color}" stroke="#333" stroke-width="1"/>
        <rect x="5" y="0" width="30" height="20" fill="#FDBCB4" stroke="#333" stroke-width="1"/>
        <circle cx="12" cy="5" r="2" fill="#333"/>
        <circle cx="24" cy="5" r="2" fill="#333"/>
        <text x="20" y="85" text-anchor="middle" class="ts" style="font-size: 12px; font-weight: 500;">${escapeXml(m.name)}</text>
        <text x="20" y="100" text-anchor="middle" class="ts" style="font-size: 11px;">${escapeXml(m.role)}</text>
      </g>
    `;
  }).join('');

  const descElements = descLines.map((line, i) => 
    `<text x="340" y="${yOffset + 320 + i * 25}" text-anchor="middle" class="t">${escapeXml(line)}</text>`
  ).join('');
  
  return `
    <g id="slide-2">
      <rect x="0" y="${yOffset}" width="680" height="410" fill="white"/>
      <text x="340" y="${yOffset + 50}" text-anchor="middle" class="th" style="font-size: 24px;">${escapeXml(content.title1 as string || '')}</text>
      <text x="340" y="${yOffset + 80}" text-anchor="middle" class="th" style="font-size: 24px;">${escapeXml(content.title2 as string || '')}</text>
      ${memberSvg}
      <line x1="80" y1="${yOffset + 280}" x2="600" y2="${yOffset + 280}" stroke="#ddd" stroke-width="0.5"/>
      ${descElements}
    </g>
  `;
}

function renderWebsiteSlide(content: Record<string, unknown>, yOffset: number): string {
  const subTitle = (content.subTitle as string || '').split('\n')[0];
  
  return `
    <g id="slide-3">
      <rect x="0" y="${yOffset}" width="680" height="440" fill="white"/>
      <text x="340" y="${yOffset + 50}" text-anchor="middle" class="th" style="font-size: 22px;">${escapeXml(content.title1 as string || '')}</text>
      <text x="340" y="${yOffset + 85}" text-anchor="middle" class="th" style="font-size: 22px;">${escapeXml(content.title2 as string || '')}</text>
      <text x="340" y="${yOffset + 120}" text-anchor="middle" class="th" style="font-size: 22px;">${escapeXml(content.title3 as string || '')}</text>
      <rect x="120" y="${yOffset + 150}" width="440" height="220" fill="#f5f5f5" stroke="#ddd" stroke-width="1" rx="8"/>
      <text x="340" y="${yOffset + 400}" text-anchor="middle" class="t" style="font-size: 15px; font-weight: 500;">${escapeXml(subTitle)}</text>
    </g>
  `;
}

function renderConceptSlide(content: Record<string, unknown>, yOffset: number): string {
  return `
    <g id="slide-4">
      <rect x="0" y="${yOffset}" width="680" height="440" fill="white"/>
      <text x="340" y="${yOffset + 60}" text-anchor="middle" class="th" style="font-size: 26px;">${escapeXml(content.title1 as string || '')}</text>
      <text x="340" y="${yOffset + 95}" text-anchor="middle" class="th" style="font-size: 26px;">${escapeXml(content.title2 as string || '')}</text>
      <rect x="160" y="${yOffset + 105}" width="360" height="50" fill="#FFE5E5" stroke="#E24B4A" stroke-width="2" rx="8"/>
      <text x="340" y="${yOffset + 145}" text-anchor="middle" class="th" style="font-size: 32px; color: #A32D2D;">${escapeXml(content.emphasis as string || '')}</text>
      <text x="340" y="${yOffset + 210}" text-anchor="middle" class="t" style="font-size: 15px; font-weight: 500;">${escapeXml(content.body1 as string || '')}</text>
      <text x="340" y="${yOffset + 235}" text-anchor="middle" class="t" style="font-size: 15px; font-weight: 500;">${escapeXml(content.body2 as string || '')}</text>
    </g>
  `;
}

function renderTimelineSlide(content: Record<string, unknown>, yOffset: number): string {
  const weeks = (content.weeks as Array<any> || []);
  const weekElements = weeks.map((w, i) => {
    const y = yOffset + 90 + i * 60;
    const isCurrent = w.week === (content.currentWeek || 2);
    return `
      <circle cx="20" cy="${y}" r="10" fill="${w.color}" stroke="${w.stroke}" stroke-width="2"/>
      <text x="50" y="${y + 5}" class="t" style="font-size: 13px;">Week ${w.week} — ${escapeXml(w.desc)}</text>
      ${isCurrent ? `<text x="50" y="${y + 20}" class="ts" style="font-size: 12px;">← 지금 여기</text>` : ''}
    `;
  }).join('');
  
  return `
    <g id="slide-5">
      <rect x="0" y="${yOffset}" width="680" height="480" fill="white"/>
      <text x="340" y="${yOffset + 50}" text-anchor="middle" class="th" style="font-size: 24px;">${escapeXml(content.title as string || '')}</text>
      <g transform="translate(100, ${yOffset})">
        ${weekElements}
        <line x1="20" y1="120" x2="20" y2="490" stroke="#ddd" stroke-width="1" opacity="0.5"/>
      </g>
    </g>
  `;
}

function renderClosingSlide(content: Record<string, unknown>, yOffset: number): string {
  return `
    <g id="slide-6">
      <rect x="0" y="${yOffset}" width="680" height="460" fill="#FBEAF0"/>
      <text x="340" y="${yOffset + 80}" text-anchor="middle" class="th" style="font-size: 26px; color: #3C3489;">${escapeXml(content.mainText as string || '')}</text>
      <line x1="120" y1="${yOffset + 110}" x2="560" y2="${yOffset + 110}" stroke="#D4537E" stroke-width="1" opacity="0.3"/>
      <text x="340" y="${yOffset + 160}" text-anchor="middle" class="t" style="font-size: 16px; font-weight: 500;">${escapeXml(content.body1 as string || '')}</text>
      <text x="340" y="${yOffset + 190}" text-anchor="middle" class="t" style="font-size: 15px;">${escapeXml(content.body2 as string || '')}</text>
      <rect x="140" y="${yOffset + 220}" width="400" height="100" fill="white" opacity="0.6" rx="8"/>
      <text x="340" y="${yOffset + 265}" text-anchor="middle" class="t" style="font-size: 14px;">${escapeXml(content.body3 as string || '')}</text>
      <text x="340" y="${yOffset + 290}" text-anchor="middle" class="t" style="font-size: 14px;">${escapeXml(content.body4 as string || '')}</text>
      <text x="340" y="${yOffset + 315}" text-anchor="middle" class="t" style="font-size: 14px;">${escapeXml(content.body5 as string || '')}</text>
    </g>
  `;
}

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    const escapeMap: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;'
    };
    return escapeMap[c];
  });
}

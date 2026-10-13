import React from 'react'

interface OpenCodeLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  accentColor?: string
  showText?: boolean
}

/**
 * Official OpenCode NIT Rourkela SVG Logo Component
 * Guaranteed zero network dependencies and immune to broken external avatars.
 */
export default function OpenCodeLogo({
  className = 'w-full h-full',
  accentColor,
  showText = true,
  ...props
}: OpenCodeLogoProps) {
  // If showText is false, render the iconic Code-Brace mark in a focused 560x480 viewBox
  if (!showText) {
    return (
      <svg
        viewBox="340 260 540 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        {/* Curly brace */}
        <path
          fill="#ffffff"
          d="M510 275H475C430 275 400 305 400 350V412C400 440 385 455 360 466V512C385 520 400 535 400 562V625C400 668 430 693 475 693H510V640H485C468 640 460 630 460 615V548C460 520 445 500 425 487C445 475 460 455 460 425V355C460 340 468 330 485 330H510Z"
        />

        {/* Code lines */}
        <g>
          <rect x="530" y="298" width="162" height="54" rx="6" fill={accentColor || 'var(--primary, #1C6DFD)'} />
          <rect x="711" y="298" width="139" height="54" rx="6" fill="#ffffff" />
          <rect x="530" y="377" width="241" height="55" rx="6" fill="#ffffff" />
          <rect x="790" y="377" width="60" height="55" rx="6" fill="#ffffff" />
          <rect x="530" y="457" width="57" height="54" rx="6" fill={accentColor || 'var(--primary, #1C6DFD)'} />
          <rect x="606" y="457" width="244" height="54" rx="6" fill="#ffffff" />
          <rect x="530" y="536" width="320" height="55" rx="6" fill={accentColor || 'var(--primary, #1C6DFD)'} />
          <rect x="530" y="615" width="241" height="55" rx="6" fill="#ffffff" />
          <rect x="790" y="615" width="60" height="55" rx="6" fill="#ffffff" />
        </g>
      </svg>
    )
  }

  // Full official logo with wordmark
  return (
    <svg
      viewBox="0 0 1254 1254"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="1254" height="1254" rx="120" fill="#06090e" />

      {/* Curly brace */}
      <path
        fill="#ffffff"
        d="M510 275H475C430 275 400 305 400 350V412C400 440 385 455 360 466V512C385 520 400 535 400 562V625C400 668 430 693 475 693H510V640H485C468 640 460 630 460 615V548C460 520 445 500 425 487C445 475 460 455 460 425V355C460 340 468 330 485 330H510Z"
      />

      {/* Code lines */}
      <g>
        <rect x="530" y="298" width="162" height="54" rx="8" fill={accentColor || 'var(--primary, #1C6DFD)'} />
        <rect x="711" y="298" width="139" height="54" rx="8" fill="#ffffff" />
        <rect x="530" y="377" width="241" height="55" rx="8" fill="#ffffff" />
        <rect x="790" y="377" width="60" height="55" rx="8" fill="#ffffff" />
        <rect x="530" y="457" width="57" height="54" rx="8" fill={accentColor || 'var(--primary, #1C6DFD)'} />
        <rect x="606" y="457" width="244" height="54" rx="8" fill="#ffffff" />
        <rect x="530" y="536" width="320" height="55" rx="8" fill={accentColor || 'var(--primary, #1C6DFD)'} />
        <rect x="530" y="615" width="241" height="55" rx="8" fill="#ffffff" />
        <rect x="790" y="615" width="60" height="55" rx="8" fill="#ffffff" />
      </g>

      {/* Wordmark: OPENCODE */}
      <g fill="none" stroke="#ffffff" strokeWidth="32">
        <ellipse cx="172" cy="854" rx="51" ry="50" />
        <path d="M290 804H310A32 32 0 0 1 310 868H290" />
        <path d="M705 823A51 51 0 1 0 705 885" />
        <path d="M912 804H940C985 804 1011 825 1011 854C1011 883 985 904 940 904H912" />
      </g>
      <g fill="#ffffff">
        <rect x="258" y="788" width="32" height="132" />
        <rect x="374" y="788" width="30" height="132" />
        <rect x="374" y="788" width="94" height="20" />
        <rect x="374" y="838" width="94" height="20" />
        <rect x="374" y="900" width="94" height="20" />
        <rect x="485" y="788" width="30" height="132" />
        <rect x="567" y="788" width="30" height="132" />
        <polygon points="485,788 515,788 597,920 567,920" />
        <rect x="912" y="788" width="32" height="132" />
        <rect x="1041" y="788" width="30" height="132" />
        <rect x="1041" y="788" width="105" height="20" />
        <rect x="1041" y="838" width="105" height="20" />
        <rect x="1041" y="900" width="105" height="20" />
      </g>

      {/* Blue / Themed O */}
      <circle
        cx="806"
        cy="838"
        r="67.5"
        fill="none"
        stroke={accentColor || 'var(--primary, #1C6DFD)'}
        strokeWidth="45"
      />
    </svg>
  )
}

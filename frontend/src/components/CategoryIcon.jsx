import React from 'react'

// Using realistic icons from CDN - Icons8 or similar
// These are high-quality, realistic category icons

export const MassageIcon = ({ size = 50, color = '#4dabf7' }) => (
  <img 
    src="https://img.icons8.com/color/96/massage.png" 
    alt="Massage"
    style={{ width: size, height: size, objectFit: 'contain' }}
    onError={(e) => {
      e.target.style.display = 'none'
      e.target.nextSibling.style.display = 'block'
    }}
  />
)

export const BeautyIcon = ({ size = 50, color = '#e64980' }) => (
  <img 
    src="https://img.icons8.com/color/96/lipstick.png" 
    alt="Beauty"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
)

export const HotelIcon = ({ size = 50, color = '#7c3aed' }) => (
  <img 
    src="https://img.icons8.com/color/96/hotel.png" 
    alt="Hotel"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
)

export const SpaIcon = ({ size = 50, color = '#12b886' }) => (
  <img 
    src="https://img.icons8.com/color/96/spa.png" 
    alt="Spa"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
)

export const OtherIcon = ({ size = 50, color = '#495057' }) => (
  <img 
    src="https://img.icons8.com/color/96/category.png" 
    alt="Other"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
)

export const HammamIcon = ({ size = 50, color = '#8b4513' }) => (
  <img 
    src="https://img.icons8.com/color/96/bath.png" 
    alt="Hammam"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
)

export const MasseuseIcon = ({ size = 50, color = '#d63384' }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="30" r="18" fill={color} opacity="0.2"/>
    <circle cx="48" cy="30" r="12" fill={color}/>
    <path d="M30 70C30 60 38 52 48 52C58 52 66 60 66 70V80H30V70Z" fill={color}/>
    <path d="M20 80H76" stroke={color} strokeWidth="4" strokeLinecap="round"/>
  </svg>
)

export const MasseurIcon = ({ size = 50, color = '#4dabf7' }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="30" r="18" fill={color} opacity="0.2"/>
    <circle cx="48" cy="30" r="12" fill={color}/>
    <path d="M30 70C30 60 38 52 48 52C58 52 66 60 66 70V80H30V70Z" fill={color}/>
    <path d="M20 80H76" stroke={color} strokeWidth="4" strokeLinecap="round"/>
    <rect x="42" y="20" width="12" height="4" rx="2" fill={color}/>
  </svg>
)

export const MassageCenterIcon = ({ size = 50, color = '#495057' }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="30" width="56" height="40" rx="4" fill={color} opacity="0.2"/>
    <rect x="20" y="30" width="56" height="40" rx="4" stroke={color} strokeWidth="3"/>
    <circle cx="35" cy="50" r="6" fill={color}/>
    <circle cx="48" cy="50" r="6" fill={color}/>
    <circle cx="61" cy="50" r="6" fill={color}/>
    <path d="M30 40L66 40" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M30 60L66 60" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const RencontresIcon = ({ size = 50, color = '#ffc107' }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 20C52 20 55 23 55 27C55 31 52 34 48 34C44 34 41 31 41 27C41 23 44 20 48 20Z" fill={color}/>
    <path d="M48 40C58 40 66 48 66 58V68H30V58C30 48 38 40 48 40Z" fill={color} opacity="0.3"/>
    <path d="M30 20C34 20 37 23 37 27C37 31 34 34 30 34C26 34 23 31 23 27C23 23 26 20 30 20Z" fill={color}/>
    <path d="M30 40C40 40 48 48 48 58V68H12V58C12 48 20 40 30 40Z" fill={color} opacity="0.3"/>
    <path d="M66 20C70 20 73 23 73 27C73 31 70 34 66 34C62 34 59 31 59 27C59 23 62 20 66 20Z" fill={color}/>
    <path d="M66 40C76 40 84 48 84 58V68H48V58C48 48 56 40 66 40Z" fill={color} opacity="0.3"/>
    <path d="M48 30L52 34L48 38L44 34L48 30Z" fill={color}/>
  </svg>
)

export const MassageSchoolIcon = ({ size = 50, color = '#4dabf7' }) => (
  <img 
    src="https://img.icons8.com/color/96/school.png" 
    alt="Massage School"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
)

export const EstheticSchoolIcon = ({ size = 50, color = '#e64980' }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* School building */}
    <rect x="20" y="45" width="56" height="35" rx="2" fill={color} opacity="0.2"/>
    <rect x="20" y="45" width="56" height="35" rx="2" stroke={color} strokeWidth="2"/>
    {/* Roof */}
    <path d="M48 15L20 45L76 45L48 15Z" fill={color} opacity="0.3"/>
    <path d="M48 15L20 45M48 15L76 45" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    {/* Door */}
    <rect x="42" y="55" width="12" height="25" rx="1" fill={color}/>
    {/* Windows */}
    <circle cx="32" cy="60" r="4" fill={color}/>
    <circle cx="64" cy="60" r="4" fill={color}/>
    {/* Beauty symbol - lipstick/mirror on top */}
    <circle cx="48" cy="30" r="8" fill={color} opacity="0.4"/>
    <rect x="46" y="20" width="4" height="12" rx="2" fill={color}/>
    <circle cx="48" cy="30" r="3" fill="none" stroke={color} strokeWidth="1.5"/>
  </svg>
)

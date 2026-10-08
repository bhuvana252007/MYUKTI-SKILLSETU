import React, { useState, useRef, useCallback } from 'react';
import { SellerListing, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../translations';
import { MapPin, CheckCircle } from 'lucide-react';

interface SellerCard3DProps {
  seller: SellerListing;
  language: SupportedLanguage;
  onSelect: (seller: SellerListing) => void;
  categoryIcon: React.ReactNode;
}

export const SellerCard3D: React.FC<SellerCard3DProps> = ({
  seller,
  language,
  onSelect,
  categoryIcon,
}) => {
  const t = TRANSLATIONS[language];
  const cardRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState<{
    rotateX: number;
    rotateY: number;
    translateZ: number;
    translateY: number;
    shadowX: number;
    shadowY: number;
    sheenX: number;
    sheenY: number;
    isHovered: boolean;
  }>({
    rotateX: 0,
    rotateY: 0,
    translateZ: 0,
    translateY: 0,
    shadowX: 0,
    shadowY: 6,
    sheenX: 50,
    sheenY: 50,
    isHovered: false,
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Normalized relative offset (-0.5 to +0.5)
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle 3D tilt angles (max ~8-9 degrees for soft, elegant aesthetic)
    const rotateY = Number((normX * 12).toFixed(2));
    const rotateX = Number((-normY * 12).toFixed(2));

    // Dynamic soft warm shadow offset opposing light source
    const shadowX = Number((-normX * 16).toFixed(1));
    const shadowY = Number((normY * 20 + 16).toFixed(1));

    // Specular highlight center percentage
    const sheenX = Math.round((normX + 0.5) * 100);
    const sheenY = Math.round((normY + 0.5) * 100);

    setTilt({
      rotateX,
      rotateY,
      translateZ: 14,
      translateY: -6,
      shadowX,
      shadowY,
      sheenX,
      sheenY,
      isHovered: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      translateY: 0,
      shadowX: 0,
      shadowY: 6,
      sheenX: 50,
      sheenY: 50,
      isHovered: false,
    });
  }, []);

  // Soft touch support for mobile devices
  const handleTouchStart = useCallback(() => {
    setTilt((prev) => ({
      ...prev,
      translateY: -4,
      translateZ: 8,
      shadowY: 12,
      isHovered: true,
    }));
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      translateY: 0,
      shadowX: 0,
      shadowY: 6,
      sheenX: 50,
      sheenY: 50,
      isHovered: false,
    });
  }, []);

  // Compute transform and shadow strings
  const transformStyle = tilt.isHovered
    ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(${tilt.translateZ}px) translateY(${tilt.translateY}px)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)';

  const boxShadowStyle = tilt.isHovered
    ? `${tilt.shadowX}px ${tilt.shadowY}px 28px -6px rgba(61, 43, 31, 0.18), 0 10px 16px -4px rgba(194, 84, 45, 0.1)`
    : '0 4px 10px -2px rgba(61, 43, 31, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)';

  return (
    <div
      ref={cardRef}
      id={`seller-card-${seller.id}`}
      onClick={() => onSelect(seller)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: transformStyle,
        boxShadow: boxShadowStyle,
        transition: tilt.isHovered
          ? 'transform 120ms ease-out, box-shadow 160ms ease-out'
          : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 380ms ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform, box-shadow',
      }}
      className="group relative bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#EADBCE] hover:border-[#1E4D38] cursor-pointer flex flex-col justify-between select-none"
    >
      {/* Subtle 3D Sheen reflection layer */}
      {tilt.isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Top: Photo, Badge, Category */}
      <div>
        <div
          className="relative h-56 w-full bg-[#EFE4D3] overflow-hidden"
          style={{ transform: 'translateZ(12px)', transformStyle: 'preserve-3d' }}
        >
          <img
            src={seller.photo}
            alt={seller.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Subtle dark gradient at the bottom of photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* SHG Verified Badge with Checkmark icon */}
          {seller.isShgVerified && (
            <div
              className="absolute top-3 left-3 bg-[#EEF6F2] text-[#1E4D38] border border-[#C7E4D3] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
              style={{ transform: 'translateZ(26px)' }}
            >
              <CheckCircle className="w-4 h-4 fill-[#1E4D38] text-white" />
              <span>{t.shgBadge}</span>
            </div>
          )}

          {/* Category Pill */}
          <div
            className="absolute bottom-3 right-3 bg-[#3D2B1F]/90 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            style={{ transform: 'translateZ(24px)' }}
          >
            {categoryIcon}
            <span>{t.categories[seller.category]?.title || seller.category}</span>
          </div>
        </div>

        {/* Card Content with 3D Depth */}
        <div className="p-5" style={{ transform: 'translateZ(16px)' }}>
          {/* Name and Price */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold font-heritage text-[#3D2B1F] group-hover:text-[#1E4D38] transition-colors leading-snug">
              {seller.name}
            </h2>
            <span className="text-base sm:text-lg font-extrabold text-[#C2542D] shrink-0">
              {seller.price}
            </span>
          </div>

          {/* Location with Icon */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6B5749] mb-3 font-medium">
            <MapPin className="w-4 h-4 text-[#C2542D] shrink-0" />
            <span className="truncate">{seller.location}</span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-[#5C4433] line-clamp-3 leading-relaxed mb-4">
            {seller.description}
          </p>
        </div>
      </div>

      {/* Card Footer: View Details & Contact CTA */}
      <div
        className="p-5 pt-0 mt-auto border-t border-[#EADBCE] flex items-center justify-between"
        style={{ transform: 'translateZ(20px)' }}
      >
        <span className="text-xs font-bold text-[#1E4D38] group-hover:underline">
          {t.buyerSearch.viewProfileBtn} &rarr;
        </span>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#FAF5EB] text-[#5C4433] group-hover:bg-[#1E4D38] group-hover:text-white transition-colors border border-[#EADBCE]/60">
          {t.sellerProfile.contactBtn}
        </span>
      </div>
    </div>
  );
};

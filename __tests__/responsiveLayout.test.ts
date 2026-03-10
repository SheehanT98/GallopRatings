import { getResponsiveLayout } from '@/lib/responsive/useResponsiveLayout';

describe('getResponsiveLayout', () => {
  it('returns mobile profile for small widths', () => {
    const result = getResponsiveLayout(390);
    expect(result.isTablet).toBe(false);
    expect(result.isDesktop).toBe(false);
    expect(result.contentMaxWidth).toBe(640);
  });

  it('returns tablet profile for medium widths', () => {
    const result = getResponsiveLayout(900);
    expect(result.isTablet).toBe(true);
    expect(result.isDesktop).toBe(false);
    expect(result.contentMaxWidth).toBe(980);
  });

  it('returns desktop profile for large widths', () => {
    const result = getResponsiveLayout(1280);
    expect(result.isDesktop).toBe(true);
    expect(result.contentMaxWidth).toBe(1280);
  });
});

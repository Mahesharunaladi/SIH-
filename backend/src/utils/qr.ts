import QRCode from 'qrcode';
import { logger } from './logger';

/**
 * Generate QR code for product trace link
 */
export async function generateQRCode(productId: string, baseUrl?: string): Promise<string> {
  try {
    const traceUrl = createTraceLink(productId, baseUrl);
    const qrCodeDataUrl = await QRCode.toDataURL(traceUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
    });
    
    logger.info('QR code generated', { productId });
    return qrCodeDataUrl;
  } catch (error: any) {
    logger.error('Failed to generate QR code', error);
    throw new Error('QR code generation failed');
  }
}

/**
 * Create trace link for a product
 */
export function createTraceLink(productId: string, baseUrl?: string): string {
  const base = baseUrl || 'https://herbtrace.app';
  return `${base}/trace?pid=${productId}`;
}

/**
 * Generate QR code as buffer (for file storage)
 */
export async function generateQRCodeBuffer(productId: string, baseUrl?: string): Promise<Buffer> {
  try {
    const traceUrl = createTraceLink(productId, baseUrl);
    const buffer = await QRCode.toBuffer(traceUrl, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 300,
      margin: 2,
    });
    
    return buffer;
  } catch (error: any) {
    logger.error('Failed to generate QR code buffer', error);
    throw new Error('QR code buffer generation failed');
  }
}

/**
 * Generate SVG QR code
 */
export async function generateQRCodeSVG(productId: string, baseUrl?: string): Promise<string> {
  try {
    const traceUrl = createTraceLink(productId, baseUrl);
    const svg = await QRCode.toString(traceUrl, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2,
    });
    
    return svg;
  } catch (error: any) {
    logger.error('Failed to generate QR code SVG', error);
    throw new Error('QR code SVG generation failed');
  }
}

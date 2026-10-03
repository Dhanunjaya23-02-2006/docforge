import { validatePDF, validateImage, parsePageRanges } from "../pdf-utils";
import { formatFileSize } from "../utils";

describe("pdf-utils", () => {
  describe("validatePDF", () => {
    it("returns true for valid PDF header", () => {
      const pdfBuffer = Buffer.from("%PDF-1.4\n%..."); 
      expect(validatePDF(pdfBuffer)).toBe(true);
    });

    it("returns false for invalid PDF header", () => {
      const buffer = Buffer.from("NOTPDF");
      expect(validatePDF(buffer)).toBe(false);
    });

    it("returns false for empty buffer", () => {
      expect(validatePDF(Buffer.from(""))).toBe(false);
    });

    it("returns false for buffer too short", () => {
      expect(validatePDF(Buffer.from("%P"))).toBe(false);
    });
  });

  describe("validateImage", () => {
    it("returns true for JPEG", () => {
      const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
      expect(validateImage(jpeg)).toBe(true);
    });

    it("returns true for PNG", () => {
      const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
      expect(validateImage(png)).toBe(true);
    });

    it("returns true for WebP", () => {
      const webp = Buffer.from("RIFF....WEBP\x00", "ascii");
      expect(validateImage(webp)).toBe(true);
    });

    it("returns true for GIF", () => {
      const gif = Buffer.from("GIF89a\x00", "ascii");
      expect(validateImage(gif)).toBe(true);
    });

    it("returns false for invalid format", () => {
      const buffer = Buffer.from("INVALID");
      expect(validateImage(buffer)).toBe(false);
    });
  });

  describe("parsePageRanges", () => {
    it("parses single page", () => {
      expect(parsePageRanges("5", 10)).toEqual([5]);
    });

    it("parses page range", () => {
      expect(parsePageRanges("1-3", 10)).toEqual([1, 2, 3]);
    });

    it("parses multiple ranges", () => {
      expect(parsePageRanges("1-3,5,7-10", 10)).toEqual([1, 2, 3, 5, 7, 8, 9, 10]);
    });

    it("handles spaces", () => {
      expect(parsePageRanges("1 - 3 , 5", 10)).toEqual([1, 2, 3, 5]);
    });

    it("ignores invalid page numbers", () => {
      expect(parsePageRanges("0,11,abc", 10)).toEqual([]);
    });

    it("clamps out of range pages", () => {
      expect(parsePageRanges("0-15", 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("removes duplicates", () => {
      expect(parsePageRanges("1,1,2,2", 10)).toEqual([1, 2]);
    });

    it("returns sorted pages", () => {
      expect(parsePageRanges("5,1,3", 10)).toEqual([1, 3, 5]);
    });
  });

  describe("formatFileSize", () => {
    it("formats bytes", () => {
      expect(formatFileSize(500)).toBe("500 B");
    });

    it("formats kilobytes", () => {
      expect(formatFileSize(1024)).toBe("1.0 KB");
      expect(formatFileSize(1536)).toBe("1.5 KB");
    });

    it("formats megabytes", () => {
      expect(formatFileSize(1024 * 1024)).toBe("1.00 MB");
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe("2.50 MB");
    });
  });
});
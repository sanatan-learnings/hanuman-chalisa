---
layout: default
title: "Book Generation Guide"
---

# 📖 Book Generation Guide

Generate a printable book version of the Hanuman Chalisa with customizable layout and content options.

## 🚀 Quick Start

1. Visit the [Book Generation Page]({{ '/book' | relative_url }})
2. Configure your preferences (page size, content, language)
3. Click "Preview" to see how your book will look
4. Click "Print / Save as PDF" to generate your book

## 📏 Page Size Options

Choose from four page sizes to match your printing needs:

### 6" × 4" (Pocket Book) - Default
- Compact and portable
- Perfect for personal devotional use
- Easy to carry during travel
- Fits in most pockets or small bags

### 8" × 6" (Medium Book)
- Larger text for easier reading
- Good balance between portability and readability
- Suitable for home altar or prayer room

### A5 (5.8" × 8.3")
- Standard international paper size
- Easy to print on most home printers
- Professional appearance

### A4 (8.3" × 11.7")
- Standard letter size
- Maximum text size and image quality
- Best for detailed study and reference

## 📝 Content Options

Customize which elements to include in your book:

### Core Content
- **Image**: AI-generated illustration for each verse (recommended)
- **Hindi Text (Devanagari)**: Original text in Devanagari script (essential)
- **Literal Translation**: Word-for-word translation (recommended)
- **Interpretive Meaning**: Deeper spiritual meaning and context (recommended)

### Optional Content
- **Transliteration**: Roman script pronunciation guide
- **Word Meanings**: Individual word definitions
- **Story/Background**: Historical and mythological context

## 🎨 Layout Options

### Headers and Footers
Add custom headers and footers to every page (except title page):

**Show Header** (checked by default)
- Displays text at the top of each page
- Default: "Om Shri Hanumate Namah" (EN) / "ॐ श्री हनुमते नमः" (HI)
- Customizable: Enter your own text in the input field
- Automatically updates based on selected language

**Show Footer** (checked by default)
- Displays text at the bottom of each page
- Default: "Shri Hanuman Chalisa" (EN) / "हनुमान चालीसा" (HI)
- Customizable: Enter your own text in the input field
- Automatically updates based on selected language

**Custom Text**:
- Leave input fields empty to use defaults
- Enter custom text to override defaults
- Custom text appears in all languages (not auto-translated)
- Examples: "My Personal Prayer Book", "॥ जय श्री राम ॥"

### Page Numbers
Add page numbers to the bottom-right corner
- Recommended: **ON** for multi-page books
- Starts from page 2 (title page is page 1)

### One Verse Per Page
Each verse starts on a new page
- Recommended: **ON** for 6×4 and 8×6 sizes
- Optional: **OFF** for A4/A5 sizes to save paper

### Verse Titles
Show descriptive titles for each verse (unchecked by default)
- Examples: "Ocean of Knowledge and Virtues", "Rama's Messenger"
- Recommended: **OFF** for cleaner layout
- Optional: **ON** for study and reference

## 🌐 Language Options

Choose how translations appear in your book:

### English Only
- All translations and meanings in English
- Best for English-speaking practitioners
- Cleaner layout with more space

### हिन्दी Only
- All translations and meanings in Hindi
- Best for Hindi-speaking practitioners
- Traditional approach

### Both / दोनों
- Side-by-side English and Hindi translations
- Best for bilingual households
- Educational for language learners
- **Note**: Requires larger page size (A5 or A4 recommended)

## 🎨 Image Theme Selection

Choose from available artistic themes:
- **Modern Minimalist** (default): Clean, contemporary aesthetic
- Additional themes if configured in `_data/themes.yml`

Images are automatically loaded based on selected theme.

## 💾 Generating Your Book

### Preview First
1. Configure all options
2. Click **"Preview"** button
3. Review the layout and formatting
4. Adjust options if needed

### Print or Save as PDF

#### Printing Directly
1. Click **"Print / Save as PDF"**
2. Select your printer
3. Adjust print settings:
   - Page size should match your configuration
   - Margins: None or Minimum
   - Background graphics: **ON** (to include images)
4. Print

#### Saving as PDF
1. Click **"Print / Save as PDF"**
2. In print dialog, select "Save as PDF"
3. Choose location and filename
4. Click Save

**Recommended PDF Settings:**
- Page size: Match your book configuration
- Margins: None
- Background graphics: Enabled
- Quality: High/Best

## 📋 Recommended Configurations

### Personal Devotional Book (Pocket Size)
```
Page Size: 6" × 4"
Content: Image, Devanagari, Literal Translation
Layout: Header ON, Footer ON, Page numbers ON, One verse per page
Language: Your preferred language
Custom Text: Leave empty for defaults
```

### Study Reference Book
```
Page Size: A4
Content: All options enabled
Layout: Header ON, Footer ON, Verse Titles ON, Page numbers ON
Language: Both
Custom Text: Leave empty for defaults
```

### Gift Book
```
Page Size: 8" × 6"
Content: Image, Devanagari, Literal Translation, Interpretive Meaning
Layout: Header ON, Footer ON, Page numbers ON, One verse per page
Language: Recipient's preferred language
Custom Text: Consider personalizing (e.g., "With Love and Blessings")
```

### Minimalist Chanting Book
```
Page Size: A5
Content: Devanagari only
Layout: Header OFF, Footer OFF, Page numbers OFF
Language: N/A (no translations)
Custom Text: N/A
```

### Custom Personal Book
```
Page Size: 6" × 4"
Content: Image, Devanagari only
Layout: Header ON (custom), Footer ON (custom), Page numbers OFF
Language: Hindi
Custom Header: Your name or "॥ जय श्री राम ॥"
Custom Footer: Date or personal dedication
```

## 🖨️ Printing Tips

### Home Printing
- Use quality paper (24lb or heavier)
- Print in color for best image quality
- Consider double-sided printing to save paper
- Use "fit to page" if sizing issues occur

### Professional Printing
- Export as high-quality PDF first
- Specify "bleed" requirements if binding
- Choose durable paper stock (60-80lb)
- Consider saddle-stitch or perfect binding

### Binding Options
- **Staple binding**: Simple, works for thin books
- **Saddle-stitch**: Professional, for <50 pages
- **Spiral/Coil**: Lays flat, durable
- **Perfect binding**: Book-like, professional appearance

## 🎯 Cost Estimates

Approximate costs for printing all 43 verses:

### Home Printing (6×4)
- Black & white: $2-4 (ink + paper)
- Color: $8-15 (ink + paper)
- Pages: 43-50 depending on layout

### Professional Printing (8×6, color)
- Loose pages: $10-20
- Bound: $25-50 (depending on binding)
- Bulk orders: Significant discounts available

## 🔧 Troubleshooting

### Images Not Showing
- Ensure internet connection is active
- Check if theme is properly configured
- Try different theme from dropdown

### Layout Issues on Print
- Verify page size matches printer settings
- Enable "background graphics" in print settings
- Try "Print Preview" first
- Adjust margins to "None"

### Text Cut Off
- Reduce content options
- Use larger page size
- Enable "One verse per page"

### File Too Large (PDF)
- Disable "Word Meanings" and "Story"
- Use standard quality images
- Split into multiple PDFs (dohas, verses 1-20, verses 21-40)

## 📱 Mobile Usage

The book generation page works on mobile devices but **printing/PDF generation is best done on desktop**:

1. Configure on mobile
2. Email link to yourself with settings
3. Open on desktop
4. Generate PDF or print

## 🙏 Devotional Use Recommendations

### For Daily Recitation
- Include: Devanagari + Transliteration
- Size: 6×4 (portable)
- Binding: Spiral (lays flat)

### For Study and Understanding
- Include: All content options
- Size: A4
- Language: Both
- Keep loose-leaf in binder for notes

### For Teaching Children
- Include: Images + Devanagari + Transliteration
- Size: 8×6 (easier to read)
- Bright, quality printing
- Durable binding

## 📊 Technical Details

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ⚠️ Preview only, print on desktop

### Page Break Logic
- One verse per page: Strict page breaks
- Multiple verses: Intelligent breaks (avoid splitting verses)

### Print CSS
- Optimized for physical printing
- Removes navigation and UI elements
- Adjusts margins and sizing
- Preserves images and formatting

## 🤝 Contributing

Have ideas for book generation improvements? See [CONTRIBUTING.md](../CONTRIBUTING.md).

### Potential Enhancements
- Additional page sizes (5×7, square formats)
- Custom fonts selection
- Color scheme options
- Verse range selection (e.g., only verses 1-10)
- Bookmark/index page generation
- Cover page customization

---

**May your personalized Hanuman Chalisa book bring devotion, understanding, and spiritual growth! 🙏**

[← Back to Documentation]({{ '/docs/guide' | relative_url }})

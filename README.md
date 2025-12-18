# Image Paste & Download

A modern Angular application for quickly pasting, previewing, and downloading images with automatic date-based filename organization.

## Features

- **Multiple Input Methods**: Paste images from clipboard (Ctrl+V) or drag and drop files
- **Live Preview**: See your images in a clean, responsive preview area
- **Date-Based Filenaming**: Automatically organize downloads with DD-MM-YYYY date format
- **Flexible Naming**: Choose between date-only filenames or original filenames
- **File Information**: View image dimensions, file size, and file type
- **Quick Actions**: Copy to clipboard or delete images with one click

## Usage

### Adding Images

1. **Paste from Clipboard**: Use `Ctrl+V` to paste an image directly from your clipboard
2. **Drag and Drop**: Drag an image file and drop it onto the designated area

### Download Options

#### Date-Based Naming (Default)
- When the "Use date as filename (DD-MM-YYYY)" checkbox is checked, images are saved with the current date:
  - Example: `18-12-2025.png`
  - Example: `18-12-2025.jpg`

#### Original Filename
- Uncheck the "Use date as filename" box to use the original filename
- Example: `screenshot.png`
- Example: `my-photo.jpg`

### File Operations

- **Download**: Click the "Download Image" button to save the image
- **Copy**: Click the copy icon to copy the image back to clipboard
- **Delete**: Click the delete icon to remove the current image

### Image Information

The application displays:
- **Dimensions**: Width x Height in pixels
- **Size**: File size in appropriate units (KB, MB, etc.)
- **Type**: Image format (PNG, JPG, etc.)

## Technical Details

### Date Format
- Uses DD-MM-YYYY format (day-month-year)
- Automatically preserves file extensions
- Updates with the current date for each download

### Supported File Types
- PNG
- JPEG/JPG
- GIF
- WebP
- And other common image formats

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200/` or the port shown in your terminal

### Production Build

To create a production build:
```bash
ng build
```

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

**Note**: Clipboard functionality requires modern browsers that support the Clipboard API.

## Privacy

This application runs entirely in your browser:
- No images are uploaded to external servers
- All processing happens locally
- Your images never leave your device

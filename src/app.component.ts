import { Component, ChangeDetectionStrategy, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ImageDetails {
  name: string;
  dimensions: string;
  size: string;
  type: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  host: {
    '(paste)': 'onPaste($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
    '[class.dragging]': 'isDragging()',
    'class': 'h-full'
  },
})
export class AppComponent {
  imageFile = signal<File | null>(null);
  imageUrl = signal<string | null>(null);
  imageDetails = signal<ImageDetails | null>(null);
  isDragging = signal<boolean>(false);
  includeDate = signal<boolean>(true);

  constructor() {
    // Effect to cleanup object URL when image changes
    effect((onCleanup) => {
      const url = this.imageUrl();
      if (url) {
        onCleanup(() => {
          untracked(() => URL.revokeObjectURL(url));
        });
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.processFile(file);
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          this.processFile(file);
        }
        break;
      }
    }
  }

  processFile(file: File): void {
    this.imageFile.set(file);
    const url = URL.createObjectURL(file);
    this.imageUrl.set(url);

    const img = new Image();
    img.onload = () => {
      this.imageDetails.set({
        name: file.name,
        dimensions: `${img.width} x ${img.height}`,
        size: this.formatBytes(file.size),
        type: file.type.split('/')[1].toUpperCase(),
      });
    };
    img.src = url;
  }

  updateFileName(event: Event): void {
    const newName = (event.target as HTMLInputElement).value;
    this.imageDetails.update(details => {
      if (!details) return null;
      return { ...details, name: newName };
    });
  }

  downloadImage(): void {
    const url = this.imageUrl();
    const details = this.imageDetails();
    if (!url || !details) return;

    let fileName = details.name;
    if (this.includeDate()) {
      fileName = this.getDateFileName(fileName);
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getDateFileName(fileName: string): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex > 0) {
      const extension = fileName.substring(lastDotIndex);
      return `${day}-${month}-${year}${extension}`;
    }
    return `${day}-${month}-${year}`;
  }

  async copyImage(): Promise<void> {
    const file = this.imageFile();
    if (!file) return;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [file.type]: file,
        }),
      ]);
      // Optionally, show a success message
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  }

  deleteImage(): void {
    this.imageFile.set(null);
    this.imageUrl.set(null); // This will trigger the effect to revoke the URL
    this.imageDetails.set(null);
  }

  private formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

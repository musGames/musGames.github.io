import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FirebaseService } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './image-uploader.html',
  styleUrls: ['./image-uploader.css']
})
export class ImageUploaderComponent implements OnInit {
  selectedFile: File | null = null;
  uploading = false;
  searchTerm = '';
  uploadedImages: { id: string; name: string; url: string }[] = [];

  constructor(private http: HttpClient, private firebase: FirebaseService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.searchImages();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('Valgt fil:', this.selectedFile);
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', 'ImageUploader'); // ← din unsigned preset

    this.uploading = true;
    this.changeDetectorRef.detectChanges();

    console.log('Sender følgende FormData:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    this.http.post<any>('https://api.cloudinary.com/v1_1/dshaoiftz/image/upload', formData)
      .subscribe({
        next: async (res) => {
          const imageUrl = res.secure_url;
          const imageName = this.selectedFile?.name ?? 'unknown';

          await this.firebase.saveImageMetadata(imageName, imageUrl);

          this.selectedFile = null;
          this.uploading = false;

          await this.searchImages();

          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.uploading = false;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  async deleteImage(image: { id: string }) {
    if (!confirm(`Er du sikker på, at du vil slette billedet "${image.id}" fra systemet?`)) return;

    try {
      await this.firebase.deleteImageMetadata(image.id);
      await this.searchImages();
      this.changeDetectorRef.detectChanges();
    } catch (err) {
      console.error('Kunne ikke slette fra Firebase:', err);
      this.changeDetectorRef.detectChanges();
    }
  }

  async searchImages(): Promise<void> {
    this.uploadedImages = await this.firebase.getImagesByName(this.searchTerm);
    this.changeDetectorRef.detectChanges();
  }
}
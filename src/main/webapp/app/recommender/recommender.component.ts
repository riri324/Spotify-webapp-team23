import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'jhi-recommender',
  templateUrl: './recommender.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export default class RecommendedSongsComponent {
  playlistInput = new FormGroup({
    playlist: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  recommendSongs(): void {
    const playlistValue = this.playlistInput.get('playlist')?.value;
    console.log('Playlist Value:', playlistValue);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserProfileService } from '../user-profile/service/user-profile.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-student-profile',
  standalone: true,
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  imports: [FormsModule],
})
export class StudentProfileComponent implements OnInit {
  profile: any = {
    studentId: '',
    name: '',
    age: 0,
    bio: '',
    user: {
      id: null,
      preference: {
        favoriteGenre: '',
        musicPurpose: '',
        musicMood: '',
        vocalPreference: '',
        listeningTime: '',
        listeningPattern: '',
        songLength: '',
        lyricsImportance: '',
      },
    },
  };

  editingField: string | null = null;

  preferenceKeys = [
    'favoriteGenre',
    'musicPurpose',
    'musicMood',
    'vocalPreference',
    'listeningTime',
    'listeningPattern',
    'songLength',
    'lyricsImportance',
  ];

  keyLabels: Record<string, string> = {
    favoriteGenre: 'Genre',
    musicPurpose: 'Reason for listening',
    musicMood: 'Mood',
    vocalPreference: 'Instrumental/Vocal',
    listeningTime: 'Listening Time',
    listeningPattern: 'Listening Pattern',
    songLength: 'Song Length',
    lyricsImportance: 'Lyrics Importance',
  };

  private http = inject(HttpClient);
  private userProfileService = inject(UserProfileService);
  private applicationConfigService = inject(ApplicationConfigService);

  ngOnInit(): void {
    this.http.get('/api/account').subscribe((account: any) => {
      const userId = account.id;
      this.profile.user.id = userId;

      this.userProfileService.query({ 'userId.equals': userId }).subscribe({
        next: res => {
          const profiles = res.body ?? [];
          if (profiles.length > 0) {
            this.profile = profiles[0];
          }
        },
        error(err) {
          console.error('❌ Failed to fetch user profile:', err);
        },
      });

      this.http.get<any[]>(`/api/user-preferences?userId.equals=${userId}`).subscribe({
        next: prefs => {
          // ✅ 실제 로그인한 유저의 preference만 필터링
          const matched = prefs.find(pref => pref.user?.id === userId);
          if (matched) {
            this.profile.user.preference = matched;
          } else {
            console.warn('❗ No preference found for current user');
          }
        },
        error(err) {
          console.error('❌ Failed to fetch preferences:', err);
        },
      });
    });
  }

  saveProfile(): void {
    const url = this.profile.id ? `/api/user-profiles/${this.profile.id}` : `/api/user-profiles`;
    const method = this.profile.id ? 'put' : 'post';

    this.http.request(method, url, { body: this.profile }).subscribe({
      next: () => alert('✅ Profile saved successfully!'),
      error(err) {
        console.error(err);
        alert('❌ Failed to save profile.');
      },
    });
  }

  editField(field: string): void {
    this.editingField = field;
  }

  submitField(field: string): void {
    const pref = this.profile.user.preference;
    if (!pref.id) {
      alert('❌ Preference ID not loaded.');
      return;
    }
    const updatePayload = { ...pref };
    this.http.put(`/api/user-preferences/${pref.id}`, updatePayload).subscribe({
      next: () => {
        alert(`✅ ${this.keyLabels[field]} updated!`);
        this.editingField = null;
      },
      error: () => alert('❌ Failed to update preference.'),
    });
  }
}

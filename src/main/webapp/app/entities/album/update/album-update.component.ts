import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IArtist } from 'app/entities/artist/artist.model';
import { ArtistService } from 'app/entities/artist/service/artist.service';
import { AlbumService } from '../service/album.service';
import { IAlbum } from '../album.model';
import { AlbumFormGroup, AlbumFormService } from './album-form.service';

@Component({
  standalone: true,
  selector: 'jhi-album-update',
  templateUrl: './album-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AlbumUpdateComponent implements OnInit {
  isSaving = false;
  album: IAlbum | null = null;

  artistsSharedCollection: IArtist[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected albumService = inject(AlbumService);
  protected albumFormService = inject(AlbumFormService);
  protected artistService = inject(ArtistService);
  protected elementRef = inject(ElementRef);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AlbumFormGroup = this.albumFormService.createAlbumFormGroup();

  compareArtist = (o1: IArtist | null, o2: IArtist | null): boolean => this.artistService.compareArtist(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ album }) => {
      this.album = album;
      if (album) {
        this.updateForm(album);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamproject24App.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector(`#${idInput}`)) {
      this.elementRef.nativeElement.querySelector(`#${idInput}`).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const album = this.albumFormService.getAlbum(this.editForm);
    if (album.id !== null) {
      this.subscribeToSaveResponse(this.albumService.update(album));
    } else {
      this.subscribeToSaveResponse(this.albumService.create(album));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlbum>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(album: IAlbum): void {
    this.album = album;
    this.albumFormService.resetForm(this.editForm, album);

    this.artistsSharedCollection = this.artistService.addArtistToCollectionIfMissing<IArtist>(this.artistsSharedCollection, album.artist);
  }

  protected loadRelationshipsOptions(): void {
    this.artistService
      .query()
      .pipe(map((res: HttpResponse<IArtist[]>) => res.body ?? []))
      .pipe(map((artists: IArtist[]) => this.artistService.addArtistToCollectionIfMissing<IArtist>(artists, this.album?.artist)))
      .subscribe((artists: IArtist[]) => (this.artistsSharedCollection = artists));
  }
}

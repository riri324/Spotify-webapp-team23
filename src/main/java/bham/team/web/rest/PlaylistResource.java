package bham.team.web.rest;

import bham.team.domain.Playlist;
import bham.team.domain.Song;
import bham.team.repository.PlaylistRepository;
import bham.team.repository.SongRepository;
import bham.team.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link bham.team.domain.Playlist}.
 */
@RestController
@RequestMapping("/api/playlists")
@Transactional
public class PlaylistResource {

    private static final Logger LOG = LoggerFactory.getLogger(PlaylistResource.class);

    private static final String ENTITY_NAME = "playlist";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;

    public PlaylistResource(PlaylistRepository playlistRepository, SongRepository songRepository) {
        this.playlistRepository = playlistRepository;
        this.songRepository = songRepository;
    }

    /**
     * {@code POST  /playlists} : Create a new playlist.
     *
     * @param playlist the playlist to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new playlist, or with status {@code 400 (Bad Request)} if the playlist has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Playlist> createPlaylist(@Valid @RequestBody Playlist playlist) throws URISyntaxException {
        LOG.debug("REST request to save Playlist : {}", playlist);
        if (playlist.getId() != null) {
            throw new BadRequestAlertException("A new playlist cannot already have an ID", ENTITY_NAME, "idexists");
        }
        playlist = playlistRepository.save(playlist);
        return ResponseEntity.created(new URI("/api/playlists/" + playlist.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, playlist.getId().toString()))
            .body(playlist);
    }

    /**
     * {@code PUT  /playlists/:id} : Updates an existing playlist.
     *
     * @param id the id of the playlist to save.
     * @param playlist the playlist to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated playlist,
     * or with status {@code 400 (Bad Request)} if the playlist is not valid,
     * or with status {@code 500 (Internal Server Error)} if the playlist couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Playlist> updatePlaylist(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Playlist playlist
    ) throws URISyntaxException {
        LOG.debug("REST request to update Playlist : {}, {}", id, playlist);
        if (playlist.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, playlist.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!playlistRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        playlist = playlistRepository.save(playlist);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, playlist.getId().toString()))
            .body(playlist);
    }

    /**
     * {@code PATCH  /playlists/:id} : Partial updates given fields of an existing playlist, field will ignore if it is null
     *
     * @param id the id of the playlist to save.
     * @param playlist the playlist to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated playlist,
     * or with status {@code 400 (Bad Request)} if the playlist is not valid,
     * or with status {@code 404 (Not Found)} if the playlist is not found,
     * or with status {@code 500 (Internal Server Error)} if the playlist couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Playlist> partialUpdatePlaylist(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Playlist playlist
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Playlist partially : {}, {}", id, playlist);
        if (playlist.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, playlist.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!playlistRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Playlist> result = playlistRepository
            .findById(playlist.getId())
            .map(existingPlaylist -> {
                if (playlist.getPlaylistID() != null) {
                    existingPlaylist.setPlaylistID(playlist.getPlaylistID());
                }
                if (playlist.getName() != null) {
                    existingPlaylist.setName(playlist.getName());
                }
                if (playlist.getDescription() != null) {
                    existingPlaylist.setDescription(playlist.getDescription());
                }
                if (playlist.getIsPublic() != null) {
                    existingPlaylist.setIsPublic(playlist.getIsPublic());
                }

                return existingPlaylist;
            })
            .map(playlistRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, playlist.getId().toString())
        );
    }

    /**
     * {@code GET  /playlists} : get all the playlists.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of playlists in body.
     */
    @GetMapping("")
    public List<Playlist> getAllPlaylists(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload,
        @RequestParam(name = "userId", required = false) Long userId
    ) {
        LOG.debug("REST request to get all Playlists");

        if (userId != null) {
            LOG.debug("Filtering by userId: {}", userId);
            if (eagerload) {
                return playlistRepository.findByUserIdWithEagerRelationships(userId);
            } else {
                return playlistRepository.findByUserId(userId);
            }
        } else {
            // No userId provided, return all playlists
            if (eagerload) {
                return playlistRepository.findAllWithEagerRelationships();
            } else {
                return playlistRepository.findAll();
            }
        }
    }

    /**
     * {@code GET  /playlists/:id} : get the "id" playlist.
     *
     * @param id the id of the playlist to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the playlist, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Playlist> getPlaylist(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Playlist : {}", id);
        Optional<Playlist> playlist = playlistRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(playlist);
    }

    /**
     * {@code DELETE  /playlists/:id} : delete the "id" playlist.
     *
     * @param id the id of the playlist to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Playlist : {}", id);
        playlistRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code POST  /playlists/:id/songs/:songId} : Add a song to a playlist.
     *
     * @param id the id of the playlist.
     * @param songId the id of the song to add.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated playlist,
     * or with status {@code 404 (Not Found)} if the playlist or song is not found.
     */
    @PostMapping("/{id}/songs/{songId}")
    public ResponseEntity<Playlist> addSongToPlaylist(
        @PathVariable("id") Long id,
        @PathVariable("songId") Long songId
    ) {
        LOG.debug("REST request to add Song : {} to Playlist : {}", songId, id);

        Optional<Playlist> playlistOptional = playlistRepository.findOneWithEagerRelationships(id);
        Optional<Song> songOptional = songRepository.findById(songId);

        if (playlistOptional.isPresent() && songOptional.isPresent()) {
            Playlist playlist = playlistOptional.get();
            Song song = songOptional.get();

            // Check if the song is already in the playlist to avoid duplicates
            if (!playlist.getSongs().contains(song)) {
                playlist.addSongs(song);
                playlistRepository.save(playlist);
            }

            return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, id.toString()))
                .body(playlist);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

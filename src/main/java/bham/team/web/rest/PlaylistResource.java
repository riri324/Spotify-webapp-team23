package bham.team.web.rest;

import bham.team.domain.Playlist;
import bham.team.domain.Song;
import bham.team.domain.User;
import bham.team.repository.PlaylistRepository;
import bham.team.repository.SongRepository;
import bham.team.repository.UserRepository;
import bham.team.security.SecurityUtils;
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
import org.springframework.http.HttpStatus;
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
    private final UserRepository userRepository;

    public PlaylistResource(PlaylistRepository playlistRepository, SongRepository songRepository, UserRepository userRepository) {
        this.playlistRepository = playlistRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
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

        // Check if the playlist already has an ID (which shouldn't happen when creating a new one)
        if (playlist.getId() != null) {
            throw new BadRequestAlertException("A new playlist cannot already have an ID", ENTITY_NAME, "idexists");
        }

        // Fetch current user ID and check if they are an admin
        String currentUsername = SecurityUtils.getCurrentUserLogin().orElse(null);
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN");

        if (currentUsername == null) {
            throw new BadRequestAlertException("User must be logged in to create a playlist", ENTITY_NAME, "usernotloggedin");
        }

        // If user is admin, allow them to set any user they want (already in the playlist)
        if (isAdmin) {
            // If no user is specified in the playlist, set it to the admin
            if (playlist.getUser() == null) {
                User adminUser = userRepository
                    .findOneByLogin(currentUsername)
                    .orElseThrow(() -> new BadRequestAlertException("Admin user not found", ENTITY_NAME, "usernotfound"));
                playlist.setUser(adminUser);
            }
            // Otherwise, keep the user that's already set in the playlist
        } else {
            // Regular users can only set themselves as the owner
            User regularUser = userRepository
                .findOneByLogin(currentUsername)
                .orElseThrow(() -> new BadRequestAlertException("User not found", ENTITY_NAME, "usernotfound"));
            playlist.setUser(regularUser);
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

        // Fetch current user ID and check if they are an admin
        String currentUsername = SecurityUtils.getCurrentUserLogin().orElse(null);
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN");

        if (currentUsername == null) {
            throw new BadRequestAlertException("User must be logged in to update a playlist", ENTITY_NAME, "usernotloggedin");
        }

        // First fetch the existing playlist to check ownership
        Optional<Playlist> existingPlaylistOpt = playlistRepository.findById(id);
        if (existingPlaylistOpt.isEmpty()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Playlist existingPlaylist = existingPlaylistOpt.get();

        // Check if current user is authorized to update this playlist
        if (!isAdmin && (existingPlaylist.getUser() == null || !currentUsername.equals(existingPlaylist.getUser().getLogin()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .headers(
                    HeaderUtil.createFailureAlert(
                        applicationName,
                        false,
                        ENTITY_NAME,
                        "notauthorized",
                        "You are not authorized to update this playlist"
                    )
                )
                .build();
        }

        // If user is admin, allow them to update the playlist with any user
        if (isAdmin) {
            // Maintain the user from the request if provided, otherwise keep the existing user
            if (playlist.getUser() == null) {
                playlist.setUser(existingPlaylist.getUser());
            }
        } else {
            // Regular users must maintain the original owner (themselves)
            playlist.setUser(existingPlaylist.getUser());
        }

        // Save the updated playlist
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

        // Fetch current user ID and check if they are an admin
        String currentUsername = SecurityUtils.getCurrentUserLogin().orElse(null);
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN");

        if (currentUsername == null) {
            throw new BadRequestAlertException("User must be logged in to update a playlist", ENTITY_NAME, "usernotloggedin");
        }

        // First fetch the existing playlist to check ownership
        Optional<Playlist> existingPlaylistOpt = playlistRepository.findById(id);
        if (existingPlaylistOpt.isEmpty()) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Playlist existingPlaylist = existingPlaylistOpt.get();

        // Check if current user is authorized to update this playlist
        if (!isAdmin && (existingPlaylist.getUser() == null || !currentUsername.equals(existingPlaylist.getUser().getLogin()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .headers(
                    HeaderUtil.createFailureAlert(
                        applicationName,
                        false,
                        ENTITY_NAME,
                        "notauthorized",
                        "You are not authorized to update this playlist"
                    )
                )
                .build();
        }

        // Process the partial update
        Optional<Playlist> result = playlistRepository
            .findById(playlist.getId())
            .map(existingPlaylistToUpdate -> {
                if (playlist.getPlaylistID() != null) {
                    existingPlaylistToUpdate.setPlaylistID(playlist.getPlaylistID());
                }
                if (playlist.getName() != null) {
                    existingPlaylistToUpdate.setName(playlist.getName());
                }
                if (playlist.getDescription() != null) {
                    existingPlaylistToUpdate.setDescription(playlist.getDescription());
                }
                if (playlist.getIsPublic() != null) {
                    existingPlaylistToUpdate.setIsPublic(playlist.getIsPublic());
                }

                // For user ownership - only allow admins to change it
                if (playlist.getUser() != null) {
                    if (isAdmin) {
                        existingPlaylistToUpdate.setUser(playlist.getUser());
                    } else {}
                }

                return existingPlaylistToUpdate;
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
    public List<Playlist> getAllPlaylists(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        LOG.debug("REST request to get all Playlists");

        // Fetch current user ID and check if they are an admin
        String currentUsername = SecurityUtils.getCurrentUserLogin().orElse(null);
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN");

        if (isAdmin) {
            // Admin sees all playlists
            if (eagerload) {
                return playlistRepository.findAllWithEagerRelationships();
            } else {
                return playlistRepository.findAll();
            }
        } else if (currentUsername != null) {
            // Authenticated user sees public playlists and their own
            if (eagerload) {
                return playlistRepository.findPublicOrUserWithEagerRelationships(currentUsername);
            } else {
                return playlistRepository.findPublicOrUser(currentUsername);
            }
        } else {
            // Unauthenticated user sees only public playlists
            if (eagerload) {
                return playlistRepository.findPublicWithEagerRelationships();
            } else {
                return playlistRepository.findPublic();
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

        // Fetch current user ID and check if they are an admin
        String currentUsername = SecurityUtils.getCurrentUserLogin().orElse(null);
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN");

        Optional<Playlist> playlistOpt = playlistRepository.findOneWithEagerRelationships(id);

        if (playlistOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Playlist playlist = playlistOpt.get();

        if (isAdmin) {
            // Admin can view any playlist
            return ResponseEntity.ok(playlist);
        } else if (
            currentUsername != null &&
            (playlist.getIsPublic() || (playlist.getUser() != null && currentUsername.equals(playlist.getUser().getLogin())))
        ) {
            // Authenticated user can view public playlists or their own
            return ResponseEntity.ok(playlist);
        } else if (playlist.getIsPublic()) {
            // Unauthenticated user can only view public playlists
            return ResponseEntity.ok(playlist);
        } else {
            // Access denied
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .headers(
                    HeaderUtil.createFailureAlert(
                        applicationName,
                        false,
                        ENTITY_NAME,
                        "accessdenied",
                        "You do not have permission to view this playlist"
                    )
                )
                .build();
        }
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

        // Fetch current user ID and check if they are an admin
        String currentUsername = SecurityUtils.getCurrentUserLogin().orElse(null);
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN");

        if (currentUsername == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .headers(
                    HeaderUtil.createFailureAlert(
                        applicationName,
                        false,
                        ENTITY_NAME,
                        "unauthorized",
                        "You must be logged in to delete a playlist"
                    )
                )
                .build();
        }

        Optional<Playlist> playlistOpt = playlistRepository.findById(id);
        if (playlistOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Playlist playlist = playlistOpt.get();

        if (isAdmin || (playlist.getUser() != null && currentUsername.equals(playlist.getUser().getLogin()))) {
            playlistRepository.deleteById(id);
            return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
                .build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .headers(
                    HeaderUtil.createFailureAlert(
                        applicationName,
                        false,
                        ENTITY_NAME,
                        "notauthorized",
                        "You are not authorized to delete this playlist"
                    )
                )
                .build();
        }
    }

    /**
     * {@code GET  /playlists/user} : get all playlists for a given username.
     *
     * @param eagerload flag to eager load entities from relationships.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of playlists in body.
     */
    @GetMapping("/user")
    @Transactional(readOnly = true)
    public List<Playlist> getAllPlaylistsByUserId(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        String currentUsername = SecurityUtils.getCurrentUserLogin().orElse(null);
        User user = userRepository.findOneByLogin(currentUsername).orElseThrow(() -> new RuntimeException("User not found for login"));
        Long userId = user.getId();

        LOG.debug("REST request to get all Playlists for user: {}", currentUsername);
        if (eagerload) {
            return playlistRepository.findAllByUserIdWithEagerRelationships(userId);
        } else {
            return playlistRepository.findAllByUserId(userId);
        }
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
    public ResponseEntity<Playlist> addSongToPlaylist(@PathVariable("id") Long id, @PathVariable("songId") Long songId) {
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

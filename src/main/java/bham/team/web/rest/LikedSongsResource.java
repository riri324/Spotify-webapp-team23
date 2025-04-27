package bham.team.web.rest;

import bham.team.domain.LikedSongs;
import bham.team.repository.LikedSongsRepository;
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
 * REST controller for managing {@link bham.team.domain.LikedSongs}.
 */
@RestController
@RequestMapping("/api/liked-songs")
@Transactional
public class LikedSongsResource {

    private static final Logger LOG = LoggerFactory.getLogger(LikedSongsResource.class);

    private static final String ENTITY_NAME = "likedSongs";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LikedSongsRepository likedSongsRepository;

    public LikedSongsResource(LikedSongsRepository likedSongsRepository) {
        this.likedSongsRepository = likedSongsRepository;
    }

    /**
     * {@code POST  /liked-songs} : Create a new likedSongs.
     *
     * @param likedSongs the likedSongs to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new likedSongs, or with status {@code 400 (Bad Request)} if the likedSongs has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<LikedSongs> createLikedSongs(@Valid @RequestBody LikedSongs likedSongs) throws URISyntaxException {
        LOG.debug("REST request to save LikedSongs : {}", likedSongs);
        if (likedSongs.getId() != null) {
            throw new BadRequestAlertException("A new likedSongs cannot already have an ID", ENTITY_NAME, "idexists");
        }
        likedSongs = likedSongsRepository.save(likedSongs);
        return ResponseEntity.created(new URI("/api/liked-songs/" + likedSongs.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, likedSongs.getId().toString()))
            .body(likedSongs);
    }

    /**
     * {@code PUT  /liked-songs/:id} : Updates an existing likedSongs.
     *
     * @param id the id of the likedSongs to save.
     * @param likedSongs the likedSongs to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated likedSongs,
     * or with status {@code 400 (Bad Request)} if the likedSongs is not valid,
     * or with status {@code 500 (Internal Server Error)} if the likedSongs couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<LikedSongs> updateLikedSongs(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LikedSongs likedSongs
    ) throws URISyntaxException {
        LOG.debug("REST request to update LikedSongs : {}, {}", id, likedSongs);
        if (likedSongs.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, likedSongs.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!likedSongsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        likedSongs = likedSongsRepository.save(likedSongs);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, likedSongs.getId().toString()))
            .body(likedSongs);
    }

    /**
     * {@code PATCH  /liked-songs/:id} : Partial updates given fields of an existing likedSongs, field will ignore if it is null
     *
     * @param id the id of the likedSongs to save.
     * @param likedSongs the likedSongs to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated likedSongs,
     * or with status {@code 400 (Bad Request)} if the likedSongs is not valid,
     * or with status {@code 404 (Not Found)} if the likedSongs is not found,
     * or with status {@code 500 (Internal Server Error)} if the likedSongs couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LikedSongs> partialUpdateLikedSongs(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LikedSongs likedSongs
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update LikedSongs partially : {}, {}", id, likedSongs);
        if (likedSongs.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, likedSongs.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!likedSongsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LikedSongs> result = likedSongsRepository
            .findById(likedSongs.getId())
            .map(existingLikedSongs -> {
                if (likedSongs.getLikeID() != null) {
                    existingLikedSongs.setLikeID(likedSongs.getLikeID());
                }

                return existingLikedSongs;
            })
            .map(likedSongsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, likedSongs.getId().toString())
        );
    }

    /**
     * {@code GET  /liked-songs} : get all the likedSongs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of likedSongs in body.
     */
    @GetMapping("")
    public List<LikedSongs> getAllLikedSongs() {
        LOG.debug("REST request to get all LikedSongs");
        return likedSongsRepository.findAll();
    }

    /**
     * {@code GET  /liked-songs/:id} : get the "id" likedSongs.
     *
     * @param id the id of the likedSongs to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the likedSongs, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LikedSongs> getLikedSongs(@PathVariable("id") Long id) {
        LOG.debug("REST request to get LikedSongs : {}", id);
        Optional<LikedSongs> likedSongs = likedSongsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(likedSongs);
    }

    /**
     * {@code DELETE  /liked-songs/:id} : delete the "id" likedSongs.
     *
     * @param id the id of the likedSongs to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLikedSongs(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete LikedSongs : {}", id);
        likedSongsRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

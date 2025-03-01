package bham.team.web.rest;

import bham.team.domain.GlobalTopsongs;
import bham.team.repository.GlobalTopsongsRepository;
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
 * REST controller for managing {@link bham.team.domain.GlobalTopsongs}.
 */
@RestController
@RequestMapping("/api/global-topsongs")
@Transactional
public class GlobalTopsongsResource {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalTopsongsResource.class);

    private static final String ENTITY_NAME = "globalTopsongs";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GlobalTopsongsRepository globalTopsongsRepository;

    public GlobalTopsongsResource(GlobalTopsongsRepository globalTopsongsRepository) {
        this.globalTopsongsRepository = globalTopsongsRepository;
    }

    /**
     * {@code POST  /global-topsongs} : Create a new globalTopsongs.
     *
     * @param globalTopsongs the globalTopsongs to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new globalTopsongs, or with status {@code 400 (Bad Request)} if the globalTopsongs has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<GlobalTopsongs> createGlobalTopsongs(@Valid @RequestBody GlobalTopsongs globalTopsongs)
        throws URISyntaxException {
        LOG.debug("REST request to save GlobalTopsongs : {}", globalTopsongs);
        if (globalTopsongs.getId() != null) {
            throw new BadRequestAlertException("A new globalTopsongs cannot already have an ID", ENTITY_NAME, "idexists");
        }
        globalTopsongs = globalTopsongsRepository.save(globalTopsongs);
        return ResponseEntity.created(new URI("/api/global-topsongs/" + globalTopsongs.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, globalTopsongs.getId().toString()))
            .body(globalTopsongs);
    }

    /**
     * {@code PUT  /global-topsongs/:id} : Updates an existing globalTopsongs.
     *
     * @param id the id of the globalTopsongs to save.
     * @param globalTopsongs the globalTopsongs to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated globalTopsongs,
     * or with status {@code 400 (Bad Request)} if the globalTopsongs is not valid,
     * or with status {@code 500 (Internal Server Error)} if the globalTopsongs couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<GlobalTopsongs> updateGlobalTopsongs(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GlobalTopsongs globalTopsongs
    ) throws URISyntaxException {
        LOG.debug("REST request to update GlobalTopsongs : {}, {}", id, globalTopsongs);
        if (globalTopsongs.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, globalTopsongs.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!globalTopsongsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        globalTopsongs = globalTopsongsRepository.save(globalTopsongs);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, globalTopsongs.getId().toString()))
            .body(globalTopsongs);
    }

    /**
     * {@code PATCH  /global-topsongs/:id} : Partial updates given fields of an existing globalTopsongs, field will ignore if it is null
     *
     * @param id the id of the globalTopsongs to save.
     * @param globalTopsongs the globalTopsongs to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated globalTopsongs,
     * or with status {@code 400 (Bad Request)} if the globalTopsongs is not valid,
     * or with status {@code 404 (Not Found)} if the globalTopsongs is not found,
     * or with status {@code 500 (Internal Server Error)} if the globalTopsongs couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GlobalTopsongs> partialUpdateGlobalTopsongs(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GlobalTopsongs globalTopsongs
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update GlobalTopsongs partially : {}, {}", id, globalTopsongs);
        if (globalTopsongs.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, globalTopsongs.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!globalTopsongsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GlobalTopsongs> result = globalTopsongsRepository
            .findById(globalTopsongs.getId())
            .map(existingGlobalTopsongs -> {
                if (globalTopsongs.getSongTitle() != null) {
                    existingGlobalTopsongs.setSongTitle(globalTopsongs.getSongTitle());
                }
                if (globalTopsongs.getArtistName() != null) {
                    existingGlobalTopsongs.setArtistName(globalTopsongs.getArtistName());
                }
                if (globalTopsongs.getPlayCount() != null) {
                    existingGlobalTopsongs.setPlayCount(globalTopsongs.getPlayCount());
                }
                if (globalTopsongs.getMonthYear() != null) {
                    existingGlobalTopsongs.setMonthYear(globalTopsongs.getMonthYear());
                }
                if (globalTopsongs.getYear() != null) {
                    existingGlobalTopsongs.setYear(globalTopsongs.getYear());
                }

                return existingGlobalTopsongs;
            })
            .map(globalTopsongsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, globalTopsongs.getId().toString())
        );
    }

    /**
     * {@code GET  /global-topsongs} : get all the globalTopsongs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of globalTopsongs in body.
     */
    @GetMapping("")
    public List<GlobalTopsongs> getAllGlobalTopsongs() {
        LOG.debug("REST request to get all GlobalTopsongs");
        return globalTopsongsRepository.findAll();
    }

    /**
     * {@code GET  /global-topsongs/:id} : get the "id" globalTopsongs.
     *
     * @param id the id of the globalTopsongs to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the globalTopsongs, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GlobalTopsongs> getGlobalTopsongs(@PathVariable("id") Long id) {
        LOG.debug("REST request to get GlobalTopsongs : {}", id);
        Optional<GlobalTopsongs> globalTopsongs = globalTopsongsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(globalTopsongs);
    }

    /**
     * {@code DELETE  /global-topsongs/:id} : delete the "id" globalTopsongs.
     *
     * @param id the id of the globalTopsongs to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGlobalTopsongs(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete GlobalTopsongs : {}", id);
        globalTopsongsRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

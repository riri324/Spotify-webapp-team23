package bham.team.web.rest;

import bham.team.domain.ListeningHistory;
import bham.team.repository.ListeningHistoryRepository;
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
 * REST controller for managing {@link bham.team.domain.ListeningHistory}.
 */
@RestController
@RequestMapping("/api/listening-histories")
@Transactional
public class ListeningHistoryResource {

    private static final Logger LOG = LoggerFactory.getLogger(ListeningHistoryResource.class);

    private static final String ENTITY_NAME = "listeningHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ListeningHistoryRepository listeningHistoryRepository;

    public ListeningHistoryResource(ListeningHistoryRepository listeningHistoryRepository) {
        this.listeningHistoryRepository = listeningHistoryRepository;
    }

    /**
     * {@code POST  /listening-histories} : Create a new listeningHistory.
     *
     * @param listeningHistory the listeningHistory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new listeningHistory, or with status {@code 400 (Bad Request)} if the listeningHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ListeningHistory> createListeningHistory(@Valid @RequestBody ListeningHistory listeningHistory)
        throws URISyntaxException {
        LOG.debug("REST request to save ListeningHistory : {}", listeningHistory);
        if (listeningHistory.getId() != null) {
            throw new BadRequestAlertException("A new listeningHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        listeningHistory = listeningHistoryRepository.save(listeningHistory);
        return ResponseEntity.created(new URI("/api/listening-histories/" + listeningHistory.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, listeningHistory.getId().toString()))
            .body(listeningHistory);
    }

    /**
     * {@code PUT  /listening-histories/:id} : Updates an existing listeningHistory.
     *
     * @param id the id of the listeningHistory to save.
     * @param listeningHistory the listeningHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listeningHistory,
     * or with status {@code 400 (Bad Request)} if the listeningHistory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the listeningHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ListeningHistory> updateListeningHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ListeningHistory listeningHistory
    ) throws URISyntaxException {
        LOG.debug("REST request to update ListeningHistory : {}, {}", id, listeningHistory);
        if (listeningHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listeningHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listeningHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        listeningHistory = listeningHistoryRepository.save(listeningHistory);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, listeningHistory.getId().toString()))
            .body(listeningHistory);
    }

    /**
     * {@code PATCH  /listening-histories/:id} : Partial updates given fields of an existing listeningHistory, field will ignore if it is null
     *
     * @param id the id of the listeningHistory to save.
     * @param listeningHistory the listeningHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listeningHistory,
     * or with status {@code 400 (Bad Request)} if the listeningHistory is not valid,
     * or with status {@code 404 (Not Found)} if the listeningHistory is not found,
     * or with status {@code 500 (Internal Server Error)} if the listeningHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ListeningHistory> partialUpdateListeningHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ListeningHistory listeningHistory
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ListeningHistory partially : {}, {}", id, listeningHistory);
        if (listeningHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listeningHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listeningHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ListeningHistory> result = listeningHistoryRepository
            .findById(listeningHistory.getId())
            .map(existingListeningHistory -> {
                if (listeningHistory.getHistoryID() != null) {
                    existingListeningHistory.setHistoryID(listeningHistory.getHistoryID());
                }
                if (listeningHistory.getTimestamp() != null) {
                    existingListeningHistory.setTimestamp(listeningHistory.getTimestamp());
                }

                return existingListeningHistory;
            })
            .map(listeningHistoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, listeningHistory.getId().toString())
        );
    }

    /**
     * {@code GET  /listening-histories} : get all the listeningHistories.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of listeningHistories in body.
     */
    @GetMapping("")
    public List<ListeningHistory> getAllListeningHistories(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all ListeningHistories");
        if (eagerload) {
            return listeningHistoryRepository.findAllWithEagerRelationships();
        } else {
            return listeningHistoryRepository.findAll();
        }
    }

    /**
     * {@code GET  /listening-histories/:id} : get the "id" listeningHistory.
     *
     * @param id the id of the listeningHistory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the listeningHistory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ListeningHistory> getListeningHistory(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ListeningHistory : {}", id);
        Optional<ListeningHistory> listeningHistory = listeningHistoryRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(listeningHistory);
    }

    /**
     * {@code DELETE  /listening-histories/:id} : delete the "id" listeningHistory.
     *
     * @param id the id of the listeningHistory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListeningHistory(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ListeningHistory : {}", id);
        listeningHistoryRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

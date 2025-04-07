package bham.team.web.rest;

import bham.team.domain.UserPreference;
import bham.team.repository.UserPreferenceRepository;
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
 * REST controller for managing {@link bham.team.domain.UserPreference}.
 */
@RestController
@RequestMapping("/api/user-preferences")
@Transactional
public class UserPreferenceResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserPreferenceResource.class);

    private static final String ENTITY_NAME = "userPreference";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserPreferenceRepository userPreferenceRepository;

    public UserPreferenceResource(UserPreferenceRepository userPreferenceRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
    }

    /**
     * {@code POST  /user-preferences} : Create a new userPreference.
     *
     * @param userPreference the userPreference to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userPreference, or with status {@code 400 (Bad Request)} if the userPreference has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<UserPreference> createUserPreference(@Valid @RequestBody UserPreference userPreference)
        throws URISyntaxException {
        LOG.debug("REST request to save UserPreference : {}", userPreference);
        if (userPreference.getId() != null) {
            throw new BadRequestAlertException("A new userPreference cannot already have an ID", ENTITY_NAME, "idexists");
        }
        userPreference = userPreferenceRepository.save(userPreference);
        return ResponseEntity.created(new URI("/api/user-preferences/" + userPreference.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, userPreference.getId().toString()))
            .body(userPreference);
    }

    /**
     * {@code PUT  /user-preferences/:id} : Updates an existing userPreference.
     *
     * @param id the id of the userPreference to save.
     * @param userPreference the userPreference to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPreference,
     * or with status {@code 400 (Bad Request)} if the userPreference is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userPreference couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserPreference> updateUserPreference(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserPreference userPreference
    ) throws URISyntaxException {
        LOG.debug("REST request to update UserPreference : {}, {}", id, userPreference);
        if (userPreference.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPreference.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPreferenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        userPreference = userPreferenceRepository.save(userPreference);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userPreference.getId().toString()))
            .body(userPreference);
    }

    /**
     * {@code PATCH  /user-preferences/:id} : Partial updates given fields of an existing userPreference, field will ignore if it is null
     *
     * @param id the id of the userPreference to save.
     * @param userPreference the userPreference to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPreference,
     * or with status {@code 400 (Bad Request)} if the userPreference is not valid,
     * or with status {@code 404 (Not Found)} if the userPreference is not found,
     * or with status {@code 500 (Internal Server Error)} if the userPreference couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserPreference> partialUpdateUserPreference(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserPreference userPreference
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update UserPreference partially : {}, {}", id, userPreference);
        if (userPreference.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPreference.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPreferenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserPreference> result = userPreferenceRepository
            .findById(userPreference.getId())
            .map(existingUserPreference -> {
                if (userPreference.getFavoriteGenre() != null) {
                    existingUserPreference.setFavoriteGenre(userPreference.getFavoriteGenre());
                }
                if (userPreference.getMusicPurpose() != null) {
                    existingUserPreference.setMusicPurpose(userPreference.getMusicPurpose());
                }
                if (userPreference.getMusicMood() != null) {
                    existingUserPreference.setMusicMood(userPreference.getMusicMood());
                }
                if (userPreference.getVocalPreference() != null) {
                    existingUserPreference.setVocalPreference(userPreference.getVocalPreference());
                }
                if (userPreference.getListeningTime() != null) {
                    existingUserPreference.setListeningTime(userPreference.getListeningTime());
                }
                if (userPreference.getListeningPattern() != null) {
                    existingUserPreference.setListeningPattern(userPreference.getListeningPattern());
                }
                if (userPreference.getSongLength() != null) {
                    existingUserPreference.setSongLength(userPreference.getSongLength());
                }
                if (userPreference.getLyricsImportance() != null) {
                    existingUserPreference.setLyricsImportance(userPreference.getLyricsImportance());
                }

                return existingUserPreference;
            })
            .map(userPreferenceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userPreference.getId().toString())
        );
    }

    /**
     * {@code GET  /user-preferences} : get all the userPreferences.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userPreferences in body.
     */
    @GetMapping("")
    public List<UserPreference> getAllUserPreferences(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all UserPreferences");
        if (eagerload) {
            return userPreferenceRepository.findAllWithEagerRelationships();
        } else {
            return userPreferenceRepository.findAll();
        }
    }

    /**
     * {@code GET  /user-preferences/:id} : get the "id" userPreference.
     *
     * @param id the id of the userPreference to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userPreference, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserPreference> getUserPreference(@PathVariable("id") Long id) {
        LOG.debug("REST request to get UserPreference : {}", id);
        Optional<UserPreference> userPreference = userPreferenceRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(userPreference);
    }

    /**
     * {@code DELETE  /user-preferences/:id} : delete the "id" userPreference.
     *
     * @param id the id of the userPreference to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserPreference(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete UserPreference : {}", id);
        userPreferenceRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

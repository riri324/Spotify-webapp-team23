package bham.team.web.rest;

import bham.team.repository.ConcertRepository;
import bham.team.service.ConcertQueryService;
import bham.team.service.ConcertService;
import bham.team.service.criteria.ConcertCriteria;
import bham.team.service.dto.ConcertDTO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link bham.team.domain.Concert}.
 */
@RestController
@RequestMapping("/api/concerts")
public class ConcertResource {

    private static final Logger LOG = LoggerFactory.getLogger(ConcertResource.class);

    private static final String ENTITY_NAME = "concert";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConcertService concertService;

    private final ConcertRepository concertRepository;

    private final ConcertQueryService concertQueryService;

    public ConcertResource(ConcertService concertService, ConcertRepository concertRepository, ConcertQueryService concertQueryService) {
        this.concertService = concertService;
        this.concertRepository = concertRepository;
        this.concertQueryService = concertQueryService;
    }

    /**
     * {@code POST  /concerts} : Create a new concert.
     *
     * @param concertDTO the concertDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new concertDTO, or with status {@code 400 (Bad Request)} if the concert has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ConcertDTO> createConcert(@Valid @RequestBody ConcertDTO concertDTO) throws URISyntaxException {
        LOG.debug("REST request to save Concert : {}", concertDTO);
        if (concertDTO.getId() != null) {
            throw new BadRequestAlertException("A new concert cannot already have an ID", ENTITY_NAME, "idexists");
        }
        concertDTO = concertService.save(concertDTO);
        return ResponseEntity.created(new URI("/api/concerts/" + concertDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, concertDTO.getId().toString()))
            .body(concertDTO);
    }

    /**
     * {@code PUT  /concerts/:id} : Updates an existing concert.
     *
     * @param id the id of the concertDTO to save.
     * @param concertDTO the concertDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated concertDTO,
     * or with status {@code 400 (Bad Request)} if the concertDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the concertDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ConcertDTO> updateConcert(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ConcertDTO concertDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Concert : {}, {}", id, concertDTO);
        if (concertDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, concertDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!concertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        concertDTO = concertService.update(concertDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, concertDTO.getId().toString()))
            .body(concertDTO);
    }

    /**
     * {@code PATCH  /concerts/:id} : Partial updates given fields of an existing concert, field will ignore if it is null
     *
     * @param id the id of the concertDTO to save.
     * @param concertDTO the concertDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated concertDTO,
     * or with status {@code 400 (Bad Request)} if the concertDTO is not valid,
     * or with status {@code 404 (Not Found)} if the concertDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the concertDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ConcertDTO> partialUpdateConcert(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ConcertDTO concertDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Concert partially : {}, {}", id, concertDTO);
        if (concertDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, concertDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!concertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ConcertDTO> result = concertService.partialUpdate(concertDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, concertDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /concerts} : get all the concerts.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of concerts in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ConcertDTO>> getAllConcerts(
        ConcertCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get Concerts by criteria: {}", criteria);

        Page<ConcertDTO> page = concertQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /concerts/count} : count all the concerts.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countConcerts(ConcertCriteria criteria) {
        LOG.debug("REST request to count Concerts by criteria: {}", criteria);
        return ResponseEntity.ok().body(concertQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /concerts/:id} : get the "id" concert.
     *
     * @param id the id of the concertDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the concertDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ConcertDTO> getConcert(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Concert : {}", id);
        Optional<ConcertDTO> concertDTO = concertService.findOne(id);
        return ResponseUtil.wrapOrNotFound(concertDTO);
    }

    /**
     * {@code DELETE  /concerts/:id} : delete the "id" concert.
     *
     * @param id the id of the concertDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConcert(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Concert : {}", id);
        concertService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

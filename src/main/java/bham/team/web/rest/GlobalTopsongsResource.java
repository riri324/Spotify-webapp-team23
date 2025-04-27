package bham.team.web.rest;

import bham.team.repository.GlobalTopsongsRepository;
import bham.team.service.GlobalTopsongsService;
import bham.team.service.dto.GlobalTopsongsDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link bham.team.domain.GlobalTopsongs}.
 */
@RestController
@RequestMapping("/api/global-topsongs")
public class GlobalTopsongsResource {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalTopsongsResource.class);

    private static final String ENTITY_NAME = "globalTopsongs";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GlobalTopsongsService globalTopsongsService;

    private final GlobalTopsongsRepository globalTopsongsRepository;

    public GlobalTopsongsResource(GlobalTopsongsService globalTopsongsService, GlobalTopsongsRepository globalTopsongsRepository) {
        this.globalTopsongsService = globalTopsongsService;
        this.globalTopsongsRepository = globalTopsongsRepository;
    }

    /**
     * {@code POST  /global-topsongs} : Create a new globalTopsongs.
     *
     * @param globalTopsongsDTO the globalTopsongsDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new globalTopsongsDTO, or with status {@code 400 (Bad Request)} if the globalTopsongs has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<GlobalTopsongsDTO> createGlobalTopsongs(@Valid @RequestBody GlobalTopsongsDTO globalTopsongsDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save GlobalTopsongs : {}", globalTopsongsDTO);
        if (globalTopsongsDTO.getId() != null) {
            throw new BadRequestAlertException("A new globalTopsongs cannot already have an ID", ENTITY_NAME, "idexists");
        }
        globalTopsongsDTO = globalTopsongsService.save(globalTopsongsDTO);
        return ResponseEntity.created(new URI("/api/global-topsongs/" + globalTopsongsDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, globalTopsongsDTO.getId().toString()))
            .body(globalTopsongsDTO);
    }

    /**
     * {@code PUT  /global-topsongs/:id} : Updates an existing globalTopsongs.
     *
     * @param id the id of the globalTopsongsDTO to save.
     * @param globalTopsongsDTO the globalTopsongsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated globalTopsongsDTO,
     * or with status {@code 400 (Bad Request)} if the globalTopsongsDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the globalTopsongsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<GlobalTopsongsDTO> updateGlobalTopsongs(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GlobalTopsongsDTO globalTopsongsDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update GlobalTopsongs : {}, {}", id, globalTopsongsDTO);
        if (globalTopsongsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, globalTopsongsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!globalTopsongsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        globalTopsongsDTO = globalTopsongsService.update(globalTopsongsDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, globalTopsongsDTO.getId().toString()))
            .body(globalTopsongsDTO);
    }

    /**
     * {@code PATCH  /global-topsongs/:id} : Partial updates given fields of an existing globalTopsongs, field will ignore if it is null
     *
     * @param id the id of the globalTopsongsDTO to save.
     * @param globalTopsongsDTO the globalTopsongsDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated globalTopsongsDTO,
     * or with status {@code 400 (Bad Request)} if the globalTopsongsDTO is not valid,
     * or with status {@code 404 (Not Found)} if the globalTopsongsDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the globalTopsongsDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GlobalTopsongsDTO> partialUpdateGlobalTopsongs(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GlobalTopsongsDTO globalTopsongsDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update GlobalTopsongs partially : {}, {}", id, globalTopsongsDTO);
        if (globalTopsongsDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, globalTopsongsDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!globalTopsongsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GlobalTopsongsDTO> result = globalTopsongsService.partialUpdate(globalTopsongsDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, globalTopsongsDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /global-topsongs} : get all the globalTopsongs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of globalTopsongs in body.
     */
    @GetMapping("")
    public ResponseEntity<List<GlobalTopsongsDTO>> getAllGlobalTopsongs(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of GlobalTopsongs");
        Page<GlobalTopsongsDTO> page = globalTopsongsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /global-topsongs/:id} : get the "id" globalTopsongs.
     *
     * @param id the id of the globalTopsongsDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the globalTopsongsDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<GlobalTopsongsDTO> getGlobalTopsongs(@PathVariable("id") Long id) {
        LOG.debug("REST request to get GlobalTopsongs : {}", id);
        Optional<GlobalTopsongsDTO> globalTopsongsDTO = globalTopsongsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(globalTopsongsDTO);
    }

    /**
     * {@code DELETE  /global-topsongs/:id} : delete the "id" globalTopsongs.
     *
     * @param id the id of the globalTopsongsDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGlobalTopsongs(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete GlobalTopsongs : {}", id);
        globalTopsongsService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

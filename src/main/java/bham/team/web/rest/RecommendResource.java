package bham.team.web.rest;

import bham.team.domain.Recommend;
import bham.team.repository.RecommendRepository;
import bham.team.security.SecurityUtils;
import bham.team.service.RecommendService;
import bham.team.service.dto.RecommendDTO;
import bham.team.service.dto.RecommendedSongDTO;
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

@RestController
@RequestMapping("/api/recommends")
public class RecommendResource {

    private static final Logger LOG = LoggerFactory.getLogger(RecommendResource.class);
    private static final String ENTITY_NAME = "recommend";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RecommendService recommendService;
    private final RecommendRepository recommendRepository;

    public RecommendResource(RecommendService recommendService, RecommendRepository recommendRepository) {
        this.recommendService = recommendService;
        this.recommendRepository = recommendRepository;
    }

    @PostMapping("")
    public ResponseEntity<RecommendDTO> createRecommend(@Valid @RequestBody RecommendDTO recommendDTO) throws URISyntaxException {
        LOG.debug("REST request to save Recommend : {}", recommendDTO);
        if (recommendDTO.getId() != null) {
            throw new BadRequestAlertException("A new recommend cannot already have an ID", ENTITY_NAME, "idexists");
        }
        recommendDTO = recommendService.save(recommendDTO);
        return ResponseEntity.created(new URI("/api/recommends/" + recommendDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, recommendDTO.getId().toString()))
            .body(recommendDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecommendDTO> updateRecommend(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RecommendDTO recommendDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Recommend : {}, {}", id, recommendDTO);
        if (recommendDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, recommendDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!recommendRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        recommendDTO = recommendService.update(recommendDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, recommendDTO.getId().toString()))
            .body(recommendDTO);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RecommendDTO> partialUpdateRecommend(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RecommendDTO recommendDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Recommend partially : {}, {}", id, recommendDTO);
        if (recommendDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, recommendDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!recommendRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RecommendDTO> result = recommendService.partialUpdate(recommendDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, recommendDTO.getId().toString())
        );
    }

    @GetMapping("")
    public ResponseEntity<List<RecommendDTO>> getAllRecommends(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Recommends");
        Page<RecommendDTO> page = recommendService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecommendDTO> getRecommend(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Recommend : {}", id);
        Optional<RecommendDTO> recommendDTO = recommendService.findOne(id);
        return ResponseUtil.wrapOrNotFound(recommendDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecommend(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Recommend : {}", id);
        recommendService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Void> generateRecommendationsForCurrentUser() {
        String currentUserId = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));

        LOG.debug("REST request to generate recommendations for user: {}", currentUserId);

        recommendService.generateRecommendationsForUser(currentUserId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<RecommendDTO>> getRecommendationsForCurrentUser() {
        String currentUserId = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("User not found"));

        LOG.debug("REST request to get recommendations for user: {}", currentUserId);

        List<RecommendDTO> recommendations = recommendService.findAllDTOByUserId(currentUserId);

        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/songs")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<RecommendedSongDTO>> getSongRecommendationsForCurrentUser() {
        LOG.debug("REST request to get song recommendations for current user");

        List<RecommendedSongDTO> songRecommendations = recommendService.getRecommendedSongsForCurrentUser();

        return ResponseEntity.ok(songRecommendations);
    }
}

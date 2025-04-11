package bham.team.service;

import bham.team.domain.*; // for static metamodels
import bham.team.domain.Concert;
import bham.team.repository.ConcertRepository;
import bham.team.service.criteria.ConcertCriteria;
import bham.team.service.dto.ConcertDTO;
import bham.team.service.mapper.ConcertMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Concert} entities in the database.
 * The main input is a {@link ConcertCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link ConcertDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ConcertQueryService extends QueryService<Concert> {

    private static final Logger LOG = LoggerFactory.getLogger(ConcertQueryService.class);

    private final ConcertRepository concertRepository;

    private final ConcertMapper concertMapper;

    public ConcertQueryService(ConcertRepository concertRepository, ConcertMapper concertMapper) {
        this.concertRepository = concertRepository;
        this.concertMapper = concertMapper;
    }

    /**
     * Return a {@link Page} of {@link ConcertDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ConcertDTO> findByCriteria(ConcertCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Concert> specification = createSpecification(criteria);
        return concertRepository.findAll(specification, page).map(concertMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ConcertCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Concert> specification = createSpecification(criteria);
        return concertRepository.count(specification);
    }

    /**
     * Function to convert {@link ConcertCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Concert> createSpecification(ConcertCriteria criteria) {
        Specification<Concert> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Concert_.id));
            }
            if (criteria.getArtistName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getArtistName(), Concert_.artistName));
            }
            if (criteria.getVenueName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getVenueName(), Concert_.venueName));
            }
            if (criteria.getCountry() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCountry(), Concert_.country));
            }
            if (criteria.getRegion() != null) {
                specification = specification.and(buildStringSpecification(criteria.getRegion(), Concert_.region));
            }
            if (criteria.getEventDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getEventDate(), Concert_.eventDate));
            }
            if (criteria.getTicketmasterEventId() != null) {
                specification = specification.and(
                    buildStringSpecification(criteria.getTicketmasterEventId(), Concert_.ticketmasterEventId)
                );
            }
            if (criteria.getImageUrl() != null) {
                specification = specification.and(buildStringSpecification(criteria.getImageUrl(), Concert_.imageUrl));
            }
            if (criteria.getExternalUrl() != null) {
                specification = specification.and(buildStringSpecification(criteria.getExternalUrl(), Concert_.externalUrl));
            }
        }
        return specification;
    }
}

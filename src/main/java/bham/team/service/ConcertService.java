package bham.team.service;

import bham.team.domain.Concert;
import bham.team.repository.ConcertRepository;
import bham.team.service.dto.ConcertDTO;
import bham.team.service.mapper.ConcertMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link bham.team.domain.Concert}.
 */
@Service
@Transactional
public class ConcertService {

    private static final Logger LOG = LoggerFactory.getLogger(ConcertService.class);

    private final ConcertRepository concertRepository;

    private final ConcertMapper concertMapper;

    public ConcertService(ConcertRepository concertRepository, ConcertMapper concertMapper) {
        this.concertRepository = concertRepository;
        this.concertMapper = concertMapper;
    }

    /**
     * Save a concert.
     *
     * @param concertDTO the entity to save.
     * @return the persisted entity.
     */
    public ConcertDTO save(ConcertDTO concertDTO) {
        LOG.debug("Request to save Concert : {}", concertDTO);
        Concert concert = concertMapper.toEntity(concertDTO);
        concert = concertRepository.save(concert);
        return concertMapper.toDto(concert);
    }

    /**
     * Update a concert.
     *
     * @param concertDTO the entity to save.
     * @return the persisted entity.
     */
    public ConcertDTO update(ConcertDTO concertDTO) {
        LOG.debug("Request to update Concert : {}", concertDTO);
        Concert concert = concertMapper.toEntity(concertDTO);
        concert = concertRepository.save(concert);
        return concertMapper.toDto(concert);
    }

    /**
     * Partially update a concert.
     *
     * @param concertDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ConcertDTO> partialUpdate(ConcertDTO concertDTO) {
        LOG.debug("Request to partially update Concert : {}", concertDTO);

        return concertRepository
            .findById(concertDTO.getId())
            .map(existingConcert -> {
                concertMapper.partialUpdate(existingConcert, concertDTO);

                return existingConcert;
            })
            .map(concertRepository::save)
            .map(concertMapper::toDto);
    }

    /**
     * Get one concert by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ConcertDTO> findOne(Long id) {
        LOG.debug("Request to get Concert : {}", id);
        return concertRepository.findById(id).map(concertMapper::toDto);
    }

    /**
     * Delete the concert by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Concert : {}", id);
        concertRepository.deleteById(id);
    }
}

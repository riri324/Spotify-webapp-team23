package bham.team.service;

import bham.team.domain.GlobalTopsongs;
import bham.team.repository.GlobalTopsongsRepository;
import bham.team.service.dto.GlobalTopsongsDTO;
import bham.team.service.mapper.GlobalTopsongsMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link bham.team.domain.GlobalTopsongs}.
 */
@Service
@Transactional
public class GlobalTopsongsService {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalTopsongsService.class);

    private final GlobalTopsongsRepository globalTopsongsRepository;

    private final GlobalTopsongsMapper globalTopsongsMapper;

    public GlobalTopsongsService(GlobalTopsongsRepository globalTopsongsRepository, GlobalTopsongsMapper globalTopsongsMapper) {
        this.globalTopsongsRepository = globalTopsongsRepository;
        this.globalTopsongsMapper = globalTopsongsMapper;
    }

    /**
     * Save a globalTopsongs.
     *
     * @param globalTopsongsDTO the entity to save.
     * @return the persisted entity.
     */
    public GlobalTopsongsDTO save(GlobalTopsongsDTO globalTopsongsDTO) {
        LOG.debug("Request to save GlobalTopsongs : {}", globalTopsongsDTO);
        GlobalTopsongs globalTopsongs = globalTopsongsMapper.toEntity(globalTopsongsDTO);
        globalTopsongs = globalTopsongsRepository.save(globalTopsongs);
        return globalTopsongsMapper.toDto(globalTopsongs);
    }

    /**
     * Update a globalTopsongs.
     *
     * @param globalTopsongsDTO the entity to save.
     * @return the persisted entity.
     */
    public GlobalTopsongsDTO update(GlobalTopsongsDTO globalTopsongsDTO) {
        LOG.debug("Request to update GlobalTopsongs : {}", globalTopsongsDTO);
        GlobalTopsongs globalTopsongs = globalTopsongsMapper.toEntity(globalTopsongsDTO);
        globalTopsongs = globalTopsongsRepository.save(globalTopsongs);
        return globalTopsongsMapper.toDto(globalTopsongs);
    }

    /**
     * Partially update a globalTopsongs.
     *
     * @param globalTopsongsDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<GlobalTopsongsDTO> partialUpdate(GlobalTopsongsDTO globalTopsongsDTO) {
        LOG.debug("Request to partially update GlobalTopsongs : {}", globalTopsongsDTO);

        return globalTopsongsRepository
            .findById(globalTopsongsDTO.getId())
            .map(existingGlobalTopsongs -> {
                globalTopsongsMapper.partialUpdate(existingGlobalTopsongs, globalTopsongsDTO);

                return existingGlobalTopsongs;
            })
            .map(globalTopsongsRepository::save)
            .map(globalTopsongsMapper::toDto);
    }

    /**
     * Get all the globalTopsongs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<GlobalTopsongsDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all GlobalTopsongs");
        return globalTopsongsRepository.findAll(pageable).map(globalTopsongsMapper::toDto);
    }

    /**
     * Get one globalTopsongs by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<GlobalTopsongsDTO> findOne(Long id) {
        LOG.debug("Request to get GlobalTopsongs : {}", id);
        return globalTopsongsRepository.findById(id).map(globalTopsongsMapper::toDto);
    }

    /**
     * Delete the globalTopsongs by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete GlobalTopsongs : {}", id);
        globalTopsongsRepository.deleteById(id);
    }
}
